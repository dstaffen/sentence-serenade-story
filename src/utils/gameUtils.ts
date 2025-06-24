
import { supabase } from "@/integrations/supabase/client";

export const sendTurnNotification = async (gameData: any, participantData: any, previousSentence: string) => {
  try {
    const { error } = await supabase.functions.invoke('send-turn-notification', {
      body: {
        gameId: gameData.id,
        participantEmail: participantData.email,
        participantId: participantData.id, // This should be the NEXT participant's ID
        gameTitle: gameData.title,
        previousSentence: previousSentence,
        turnNumber: participantData.turn_order,
        maxParticipants: gameData.max_participants
      }
    });

    if (error) {
      console.error('Failed to send turn notification email:', error);
      // Don't throw error, just log it so the game continues
    }
  } catch (error) {
    console.error('Error sending turn notification:', error);
    // Don't throw error, just log it so the game continues
  }
};

export const sendCompleteStoryEmails = async (gameId: string, gameTitle: string) => {
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
      // Don't throw error, just log it so the game continues
    }
  } catch (error) {
    console.error('Error sending complete story emails:', error);
    // Don't throw error, just log it so the game continues
  }
};
