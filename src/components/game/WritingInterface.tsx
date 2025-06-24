import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Send, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { sendTurnNotification, sendCompleteStoryEmails } from "@/utils/gameUtils";

interface WritingInterfaceProps {
  gameData: any;
  participantData: any;
  gameId: string;
  participantId: string;
  previousSentence: string;
  onSubmissionComplete: (sentence: string) => void;
}

export const WritingInterface = ({ 
  gameData, 
  participantData, 
  gameId, 
  participantId, 
  previousSentence, 
  onSubmissionComplete 
}: WritingInterfaceProps) => {
  const { toast } = useToast();
  const [currentSentence, setCurrentSentence] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const maxCharacters = 200;
  const charactersLeft = maxCharacters - currentSentence.length;

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

      // Check once more if there's already a sentence for this turn and participant
      const { data: existingCheck, error: existingCheckError } = await supabase
        .from('sentences')
        .select('*')
        .eq('game_id', gameId)
        .eq('turn_number', gameData.current_turn)
        .eq('participant_email', participantData.email);

      if (existingCheckError) {
        console.error("Error checking existing sentences before insert:", existingCheckError);
        throw new Error("Failed to verify sentence status");
      }

      if (existingCheck && existingCheck.length > 0) {
        console.log("Sentence already exists for this turn and participant");
        onSubmissionComplete(existingCheck[0].sentence_text);
        toast({
          title: "Already submitted",
          description: "You have already submitted your sentence for this turn.",
        });
        return;
      }

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
        if (sentenceError.code === '23505') {
          // Duplicate key error - the sentence was already submitted
          console.log("Duplicate sentence detected, marking as submitted");
          onSubmissionComplete(currentSentence.trim());
          toast({
            title: "Already submitted",
            description: "You have already submitted your sentence for this turn.",
          });
          return;
        }
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

      // FIXED: Check if this is the final turn by comparing current_turn with max_participants
      // Since current_turn starts at 1 and goes up to max_participants
      const isLastTurn = gameData.current_turn >= gameData.max_participants;
      
      console.log("Turn logic:", {
        currentTurn: gameData.current_turn,
        maxParticipants: gameData.max_participants,
        isLastTurn: isLastTurn
      });

      // Update game status
      const gameUpdate: any = {};
      
      if (isLastTurn) {
        // Don't increment turn if it's the last turn, just mark as completed
        gameUpdate.status = 'completed';
        console.log("Game completed - not incrementing turn");
      } else {
        // Only increment turn if it's not the last turn
        gameUpdate.current_turn = gameData.current_turn + 1;
        console.log("Incrementing turn to:", gameData.current_turn + 1);
      }

      const { error: gameError } = await supabase
        .from('games')
        .update(gameUpdate)
        .eq('id', gameId);

      if (gameError) {
        console.error("Error updating game:", gameError);
        throw new Error("Failed to update game status");
      }

      // If not the last turn, send email to next participant with THEIR participant ID
      if (!isLastTurn) {
        const nextTurnNumber = gameData.current_turn + 1;
        const { data: nextParticipant, error: nextParticipantError } = await supabase
          .from('participants')
          .select('*')
          .eq('game_id', gameId)
          .eq('turn_order', nextTurnNumber)
          .single();

        if (!nextParticipantError && nextParticipant) {
          console.log("Sending notification to next participant:", nextParticipant);
          // Send notification with the NEXT participant's data and ID
          await sendTurnNotification(
            { ...gameData, current_turn: nextTurnNumber },
            nextParticipant, // Using nextParticipant ensures the email has the correct participant ID
            currentSentence.trim()
          );
        } else {
          console.error("Could not find next participant for turn:", nextTurnNumber, nextParticipantError);
        }
      } else {
        // Game is complete, send final story to all participants
        console.log("Game complete, sending final story emails");
        await sendCompleteStoryEmails(gameData.id, gameData.title);
      }

      onSubmissionComplete(currentSentence.trim());
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

  return (
    <>
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
    </>
  );
};
