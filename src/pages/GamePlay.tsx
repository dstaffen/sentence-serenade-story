
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, ArrowLeft, Users, Clock, Send } from "lucide-react";

const GamePlay = () => {
  const { gameId, participantId } = useParams();
  const [currentSentence, setCurrentSentence] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  
  // Mock data - in a real app, this would come from a database
  const gameData = {
    title: "The Mysterious Adventure",
    previousSentence: "The old lighthouse keeper found a strange bottle washed up on the shore, glowing with an ethereal blue light.",
    currentPlayer: "Alice",
    totalPlayers: 4,
    currentRound: 2,
    maxRounds: 4
  };

  const handleSubmitSentence = () => {
    console.log("Submitting sentence:", currentSentence);
    setHasSubmitted(true);
    // In a real app, this would save to database and notify next player
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
                  <Send className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">Sentence Submitted!</h2>
                <p className="text-slate-600 mb-6">
                  Your contribution has been added to the story. Waiting for other players to complete their turns...
                </p>
                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <p className="text-blue-800 font-medium">Your sentence:</p>
                  <p className="text-blue-700 italic mt-2">"{currentSentence}"</p>
                </div>
                <p className="text-sm text-slate-500 mb-6">
                  You'll be notified when the story is complete and ready to view!
                </p>
                <Link to={`/story/${gameId}`}>
                  <Button variant="outline" className="mr-4">
                    View Story (Preview)
                  </Button>
                </Link>
                <Link to="/">
                  <Button>
                    Create New Game
                  </Button>
                </Link>
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
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">{gameData.title}</h2>
            <div className="flex items-center justify-center space-x-6 text-sm text-slate-600">
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>Round {gameData.currentRound} of {gameData.maxRounds}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>Your Turn</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(gameData.currentRound / gameData.maxRounds) * 100}%` }}
              ></div>
            </div>
          </div>

          <Card className="shadow-lg mb-6">
            <CardHeader>
              <CardTitle>Previous Sentence</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-lg italic text-slate-700">
                  "{gameData.previousSentence}"
                </p>
              </div>
              <p className="text-sm text-slate-500 mt-3">
                Continue the story from where the previous player left off.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Your Turn</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Textarea
                  placeholder="Add the next sentence to continue the story..."
                  value={currentSentence}
                  onChange={(e) => setCurrentSentence(e.target.value)}
                  rows={4}
                  className="text-lg resize-none"
                />
                <p className="text-sm text-slate-500 mt-2">
                  Write one compelling sentence to move the story forward.
                </p>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2">💡 Writing Tips:</h4>
                <ul className="text-yellow-700 text-sm space-y-1">
                  <li>• Keep it to one clear sentence</li>
                  <li>• Build on the previous sentence naturally</li>
                  <li>• Add intrigue, conflict, or surprise</li>
                  <li>• Leave room for the next writer to continue</li>
                </ul>
              </div>

              <Button 
                onClick={handleSubmitSentence}
                disabled={!currentSentence.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold transition-all duration-200 hover:scale-105"
              >
                Submit Sentence
                <Send className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GamePlay;
