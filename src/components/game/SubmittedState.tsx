
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, CheckCircle, Mail } from "lucide-react";

interface SubmittedStateProps {
  gameData: any;
  submittedSentence: string;
}

export const SubmittedState = ({ gameData, submittedSentence }: SubmittedStateProps) => {
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
                    <p className="text-blue-700 italic">"{submittedSentence}"</p>
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
                    <p className="text-blue-700 italic mt-2">"{submittedSentence}"</p>
                  </div>
                  <p className="text-sm text-slate-500 mb-6">
                    You'll be notified when it's your turn again or when the story is complete!
                  </p>
                </>
              )}

              <div className="flex gap-4 justify-center">
                <Link to={`/story/${gameData?.id}`}>
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
};
