
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface GameData {
  id: string;
  title: string;
  max_participants: number;
  current_turn: number;
  status: string;
  host_email: string;
}

interface ParticipantData {
  id: string;
  email: string;
  turn_order: number;
  has_completed: boolean;
}

export const useGameData = (gameId: string | undefined, participantId: string | undefined) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [participantData, setParticipantData] = useState<ParticipantData | null>(null);
  const [previousSentence, setPreviousSentence] = useState<string>("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [submittedSentence, setSubmittedSentence] = useState("");

  const fetchGameData = async () => {
    try {
      console.log("Fetching game data for:", { gameId, participantId });
      
      // Fetch game data
      const { data: game, error: gameError } = await supabase
        .from('games')
        .select('*')
        .eq('id', gameId)
        .single();

      if (gameError || !game) {
        console.error("Game fetch error:", gameError);
        throw new Error("Game not found");
      }

      // Fetch participant data
      const { data: participant, error: participantError } = await supabase
        .from('participants')
        .select('*')
        .eq('id', participantId)
        .eq('game_id', gameId)
        .single();

      if (participantError || !participant) {
        console.error("Participant fetch error:", participantError);
        throw new Error("Participant not found for this game");
      }

      console.log("Game data:", game);
      console.log("Participant data:", participant);

      setGameData(game);
      setParticipantData(participant);

      // Check if game is already completed
      if (game.status === 'completed') {
        setError("This game has already been completed.");
        return;
      }

      // Check if it's this participant's turn
      const isMyTurn = game.current_turn === participant.turn_order;
      
      console.log("Is my turn?", isMyTurn, "Game current turn:", game.current_turn, "Participant turn order:", participant.turn_order);

      // Check if there's already a sentence for the CURRENT GAME TURN from this participant
      const { data: existingSentences, error: existingSentenceError } = await supabase
        .from('sentences')
        .select('*')
        .eq('game_id', gameId)
        .eq('turn_number', game.current_turn)
        .eq('participant_email', participant.email);

      if (existingSentenceError) {
        console.error("Error checking existing sentences:", existingSentenceError);
      }

      console.log("Existing sentences for current turn from this participant:", existingSentences);

      if (existingSentences && existingSentences.length > 0) {
        // Participant has already submitted for the current turn
        setSubmittedSentence(existingSentences[0].sentence_text);
        setHasSubmitted(true);
        return;
      }

      // If it's not their turn, show waiting message
      if (!isMyTurn) {
        setError(`It's not your turn yet. Currently waiting for participant ${game.current_turn}.`);
        return;
      }

      // If we reach here, it's the participant's turn and they haven't submitted yet
      // Fetch the previous sentence (most recent one before current turn)
      const { data: sentences, error: sentenceError } = await supabase
        .from('sentences')
        .select('*')
        .eq('game_id', gameId)
        .lt('turn_number', game.current_turn)
        .order('turn_number', { ascending: false })
        .limit(1);

      if (sentenceError) {
        console.error("Sentence fetch error:", sentenceError);
        throw new Error("Failed to load previous sentence");
      }

      if (sentences && sentences.length > 0) {
        setPreviousSentence(sentences[0].sentence_text);
      } else {
        // This might be the first turn, check if there's an opening sentence
        const { data: openingSentences, error: openingError } = await supabase
          .from('sentences')
          .select('*')
          .eq('game_id', gameId)
          .eq('turn_number', 0)
          .limit(1);

        if (!openingError && openingSentences && openingSentences.length > 0) {
          setPreviousSentence(openingSentences[0].sentence_text);
        } else {
          setPreviousSentence("Start your story here...");
        }
      }

    } catch (error) {
      console.error("Error fetching game data:", error);
      setError(error instanceof Error ? error.message : "Failed to load game data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (gameId && participantId) {
      fetchGameData();
    }
  }, [gameId, participantId]);

  return {
    isLoading,
    error,
    gameData,
    participantData,
    previousSentence,
    hasSubmitted,
    submittedSentence,
    setHasSubmitted,
    setSubmittedSentence
  };
};
