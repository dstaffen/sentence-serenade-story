import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { BookOpen, ArrowLeft, Send, CheckCircle, Mail, AlertCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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

interface SentenceData {
  sentence_text: string;
  turn_number: number;
  participant_email: string;
}

const GamePlay = () => {
  const { gameId, participantId } = useParams();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [participantData, setParticipantData] = useState<ParticipantData | null>(null);
  const [previousSentence, setPreviousSentence] = useState<string>("");
  const [currentSentence, setCurrentSentence] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const maxCharacters = 200;
  const charactersLeft = maxCharacters - currentSentence.length;

  useEffect(() => {
    if (gameId && participantId) {
      fetchGameData();
    }
  }, [gameId, participantId]);

  const sendTurnNotification = async (gameData: GameData, participantData: ParticipantData, previousSentence: string) => {
    try {
      const { error } = await supabase.functions.invoke('send-turn-notification', {
        body: {
          gameId: gameData.id,
          participantEmail: participantData.email,
          participantId: participantData.id,
          gameTitle: gameData.title,
          previousSentence: previousSentence,
          turnNumber: participantData.turn_order,
          maxParticipants: gameData.max_participants
        }
      });

      if (error) {
        console.error('Failed to send turn notification email:', error);
      }
    } catch (error) {
      console.error('Error sending turn notification:', error);
    }
  };

  const sendCompleteStoryEmails = async (gameId: string, gameTitle: string) => {
    try {
      // Fetch all sentences for the game
      const { data: sentences, error: sentencesError } = await supabase
        .from('sentences')
        .select('*')
        .eq('game_id', gameId)
        .order('turn_number', { ascending: true });

      if (sentencesError || !sentences) {
        console.error('Error fetching sentences:', sentencesError);
        return;
      }

      // Fetch all participant emails
      const { data: participants, error: participantsError } = await supabase
        .from('participants')
        .select('email')
        .eq('game_id', gameId);

      if (participantsError || !participants) {
        console.error('Error fetching participants:', participantsError);
        return;
      }

      const participantEmails = participants.map(p => p.email);

      const { error } = await supabase.functions.invoke('send-complete-story', {
        body: {
          gameId,
          gameTitle,
          sentences,
          participantEmails
        }
      });

      if (error) {
        console.error('Failed to send complete story emails:', error);
      }
    } catch (error) {
      console.error('Error sending complete story emails:', error);
    }
  };

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

      // Check if participant has already completed their turn
      if (participant.has_completed) {
        setHasSubmitted(true);
        return;
      }

      // Check if it's this participant's turn
      if (game.current_turn !== participant.turn_order) {
        setError(`It's not your turn yet. Currently waiting for participant ${game.current_turn}.`);
        return;
      }

      // Fetch the previous sentence (most recent one)
      const { data: sentences, error: sentenceError } = await supabase
        .from('sentences')
        .select('*')
        .eq('game_id', gameId)
        .order('turn_number', { ascending: false })
        .limit(1);

      if (sentenceError) {
        console.error("Sentence fetch error:", sentenceError);
        throw new Error("Failed to load previous sentence");
      }

      if (sentences && sentences.length > 0) {
        setPreviousSentence(sentences[0].sentence_text);
      }

    } catch (error) {
      console.error("Error fetching game data:", error);
      setError(error instanceof Error ? error.message : "Failed to load game data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitClick = () => {
    if (!currentSentence.trim()) {
      toast({
        title: "Please write a sentence",
        description: "Your sentence cannot be empty.",
        variant: "destructive",
      });
      return;
    }
    setShowConfirmation(true);
  };

  const handleConfirmSubmit = async () => {
    if (!gameData || !participantData) return;
    
    setIsSubmitting(true);
    setShowConfirmation(false);

    try {
      console.log("Submitting sentence:", currentSentence);

      // Save sentence to database
      const { error: sentenceError } = await supabase
        .from('sentences')
        .insert({
          game_id: gameId,
          turn_number: gameData.current_turn,
          sentence_text: currentSentence.trim(),
          participant_email: participantData.email
        });

      if (sentenceError) {
        console.error("Error saving sentence:", sentenceError);
        throw new Error("Failed to save your sentence");
      }

      // Update participant's completion status
      const { error: participantError } = await supabase
        .from('participants')
        .update({ has_completed: true })
        .eq('id', participantId);

      if (participantError) {
        console.error("Error updating participant:", participantError);
        throw new Error("Failed to update participant status");
      }

      // Check if this is the final turn
      const isLastTurn = gameData.current_turn === gameData.max_participants;
      
      // Update game status
      const gameUpdate: any = {
        current_turn: isLastTurn ? gameData.current_turn : gameData.current_turn + 1
      };
      
      if (isLastTurn) {
        gameUpdate.status = 'completed';
      }

      const { error: gameError } = await supabase
        .from('games')
        .update(gameUpdate)
        .eq('id', gameId);

      if (gameError) {
        console.error("Error updating game:", gameError);
        throw new Error("Failed to update game status");
      }

      // If not the last turn, send email to next participant
      if (!isLastTurn) {
        const { data: nextParticipant, error: nextParticipantError } = await supabase
          .from('participants')
          .select('*')
          .eq('game_id', gameId)
          .eq('turn_order', gameData.current_turn + 1)
          .single();

        if (!nextParticipantError && nextParticipant) {
          await sendTurnNotification(
            { ...gameData, current_turn: gameData.current_turn + 1 },
            nextParticipant,
            currentSentence.trim()
          );
        }
      } else {
        // Game is complete, send final story to all participants
        await sendCompleteStoryEmails(gameData.id, gameData.title);
      }

      setHasSubmitted(true);
      toast({
        title: "Sentence submitted!",
        description: isLastTurn 
          ? "Your contribution has been added to the story. All participants will receive the complete story via email!"
          : "Your contribution has been added to the story. The next participant has been notified.",
      });

    } catch (error) {
      console.error("Error submitting sentence:", error);
      toast({
        title: "Error submitting sentence",
        description: error instanceof Error ? error.message : "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelSubmit = () => {
    setShowConfirmation(false);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <Card className="shadow-lg max-w-md w-full mx-4">
          <CardContent className="pt-12 pb-12 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-800 mb-2">Loading game...</h2>
            <p className="text-slate-600">Please wait while we fetch your game data.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <header className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2 text-slate-600 hover:text-blue-600 transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Home</span>
            </Link>
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-slate-800">Exquisite Corpse</h1>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <Card className="shadow-lg">
              <CardContent className="pt-12 pb-12">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">Unable to Load Game</h2>
                <p className="text-slate-600 mb-6">{error}</p>
                <Link to="/">
                  <Button>Return to Home</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Submitted state
  if (hasSubmitted) {
    const isGameComplete = gameData?.status === 'completed' || gameData?.current_turn === gameData?.max_participants;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <header className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2 text-slate-600 hover:text-blue-600 transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Home</span>
            </Link>
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-slate-800">Exquisite Corpse</h1>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <Card className="shadow-lg">
              <CardContent className="pt-12 pb-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                
                {isGameComplete ? (
                  <>
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">Game Completed! 🎉</h2>
                    <p className="text-slate-600 mb-6">
                      Congratulations! The story is now complete. All participants will receive the full story via email.
                    </p>
                    <div className="bg-blue-50 p-4 rounded-lg mb-6">
                      <div className="flex items-center justify-center mb-2">
                        <Mail className="h-5 w-5 text-blue-600 mr-2" />
                        <p className="text-blue-800 font-medium">Your final sentence:</p>
                      </div>
                      <p className="text-blue-700 italic">"{currentSentence}"</p>
                    </div>
                    <p className="text-sm text-slate-500 mb-6">
                      Check your email inbox for the complete collaborative story!
                    </p>
                  </>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">Sentence Submitted!</h2>
                    <p className="text-slate-600 mb-6">
                      Your contribution has been added to the story. Waiting for other participants to complete their turns...
                    </p>
                    <div className="bg-blue-50 p-4 rounded-lg mb-6">
                      <p className="text-blue-800 font-medium">Your sentence:</p>
                      <p className="text-blue-700 italic mt-2">"{currentSentence}"</p>
                    </div>
                    <p className="text-sm text-slate-500 mb-6">
                      You'll be notified when it's your turn again or when the story is complete!
                    </p>
                  </>
                )}

                <div className="flex gap-4 justify-center">
                  <Link to={`/story/${gameId}`}>
                    <Button variant="outline">
                      View Story Progress
                    </Button>
                  </Link>
                  <Link to="/">
                    <Button>
                      Create New Game
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Main game interface
  if (!gameData || !participantData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 text-slate-600 hover:text-blue-600 transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-slate-800">Exquisite Corpse</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Game Title and Progress */}
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">{gameData.title}</h2>
            <div className="mb-4">
              <p className="text-lg text-slate-600 mb-2">
                Turn {gameData.current_turn} of {gameData.max_participants}
              </p>
              <Progress 
                value={(gameData.current_turn / gameData.max_participants) * 100} 
                className="w-full h-3"
              />
            </div>
            <p className="text-slate-500">Your turn!</p>
          </div>

          {/* Previous Sentence */}
          <Card className="shadow-lg mb-6">
            <CardHeader>
              <CardTitle className="text-xl text-slate-800">Previous sentence:</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                <p className="text-lg text-slate-700 italic leading-relaxed">
                  "{previousSentence}"
                </p>
              </div>
              <p className="text-sm text-slate-500 mt-3">
                Continue the story from where the previous participant left off.
              </p>
            </CardContent>
          </Card>

          {/* Writing Interface */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-slate-800">Write your sentence</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Textarea
                  placeholder="Add the next sentence to continue the story..."
                  value={currentSentence}
                  onChange={(e) => {
                    if (e.target.value.length <= maxCharacters) {
                      setCurrentSentence(e.target.value);
                    }
                  }}
                  rows={4}
                  className="text-lg resize-none focus:ring-2 focus:ring-blue-500"
                  disabled={isSubmitting}
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-sm text-slate-500">
                    Write one compelling sentence to move the story forward.
                  </p>
                  <p className={`text-sm font-medium ${
                    charactersLeft < 20 ? 'text-orange-600' : 
                    charactersLeft < 0 ? 'text-red-600' : 'text-slate-500'
                  }`}>
                    {charactersLeft} characters left
                  </p>
                </div>
              </div>

              {/* Writing Tips */}
              <Alert>
                <AlertDescription>
                  <strong>💡 Writing Tips:</strong> Keep it to one clear sentence • Build naturally on the previous sentence • Add intrigue or surprise • Leave room for the next writer
                </AlertDescription>
              </Alert>

              {/* Confirmation Dialog */}
              {showConfirmation && (
                <Alert className="border-blue-200 bg-blue-50">
                  <AlertDescription>
                    <div className="space-y-3">
                      <p className="font-medium text-blue-800">Ready to submit your sentence?</p>
                      <div className="bg-white p-3 rounded border border-blue-200">
                        <p className="text-blue-700 italic">"{currentSentence}"</p>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleConfirmSubmit} size="sm" disabled={isSubmitting}>
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            "Yes, Submit"
                          )}
                        </Button>
                        <Button onClick={handleCancelSubmit} variant="outline" size="sm" disabled={isSubmitting}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {/* Submit Button */}
              {!showConfirmation && (
                <Button 
                  onClick={handleSubmitClick}
                  disabled={!currentSentence.trim() || charactersLeft < 0 || isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold transition-all duration-200"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Sentence
                      <Send className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GamePlay;
