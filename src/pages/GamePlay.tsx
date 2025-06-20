
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { BookOpen, ArrowLeft, Send, CheckCircle, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const GamePlay = () => {
  const { gameId, participantId } = useParams();
  const { toast } = useToast();
  const [currentSentence, setCurrentSentence] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  // Mock data - in a real app, this would come from a database
  const gameData = {
    title: "The Mysterious Adventure",
    previousSentence: "The old lighthouse keeper found a strange bottle washed up on the shore, glowing with an ethereal blue light.",
    currentTurn: 3,
    totalTurns: 8,
    isLastTurn: false, // Set to true to test final turn state
    participantName: "Alice"
  };

  const maxCharacters = 200;
  const charactersLeft = maxCharacters - currentSentence.length;
  const isGameComplete = gameData.currentTurn === gameData.totalTurns;

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

  const handleConfirmSubmit = () => {
    console.log("Submitting sentence:", currentSentence);
    setHasSubmitted(true);
    setShowConfirmation(false);
    toast({
      title: "Sentence submitted!",
      description: "Your contribution has been added to the story.",
    });
  };

  const handleCancelSubmit = () => {
    setShowConfirmation(false);
  };

  if (hasSubmitted) {
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
                Turn {gameData.currentTurn} of {gameData.totalTurns}
              </p>
              <Progress 
                value={(gameData.currentTurn / gameData.totalTurns) * 100} 
                className="w-full h-3"
              />
            </div>
            <p className="text-slate-500">Your turn, {gameData.participantName}!</p>
          </div>

          {/* Previous Sentence */}
          <Card className="shadow-lg mb-6">
            <CardHeader>
              <CardTitle className="text-xl text-slate-800">Previous sentence:</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                <p className="text-lg text-slate-700 italic leading-relaxed">
                  "{gameData.previousSentence}"
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
                        <Button onClick={handleConfirmSubmit} size="sm">
                          Yes, Submit
                        </Button>
                        <Button onClick={handleCancelSubmit} variant="outline" size="sm">
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
                  disabled={!currentSentence.trim() || charactersLeft < 0}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold transition-all duration-200"
                >
                  Submit Sentence
                  <Send className="ml-2 h-5 w-5" />
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
