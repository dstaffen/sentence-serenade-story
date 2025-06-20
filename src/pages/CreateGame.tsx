
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, ArrowLeft, Users, Clock } from "lucide-react";

const CreateGame = () => {
  const [gameTitle, setGameTitle] = useState("");
  const [firstSentence, setFirstSentence] = useState("");
  const [maxPlayers, setMaxPlayers] = useState(4);
  const [creatorName, setCreatorName] = useState("");
  const navigate = useNavigate();

  const handleCreateGame = () => {
    // In a real app, this would create the game in a database
    const gameId = Math.random().toString(36).substring(2, 15);
    const participantId = Math.random().toString(36).substring(2, 15);
    
    console.log("Creating game:", {
      gameId,
      gameTitle,
      firstSentence,
      maxPlayers,
      creatorName,
      participantId
    });
    
    // Navigate to the game
    navigate(`/game/${gameId}/${participantId}`);
  };

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
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Create a New Story</h2>
            <p className="text-slate-600">Set up your collaborative storytelling game and invite others to join the creative journey.</p>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-6 w-6 text-blue-600" />
                <span>Game Setup</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="creator-name">Your Name</Label>
                <Input
                  id="creator-name"
                  placeholder="Enter your name"
                  value={creatorName}
                  onChange={(e) => setCreatorName(e.target.value)}
                  className="text-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="game-title">Story Title (Optional)</Label>
                <Input
                  id="game-title"
                  placeholder="Give your story a title..."
                  value={gameTitle}
                  onChange={(e) => setGameTitle(e.target.value)}
                  className="text-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="first-sentence">Opening Sentence</Label>
                <Textarea
                  id="first-sentence"
                  placeholder="Start your story with an intriguing first sentence..."
                  value={firstSentence}
                  onChange={(e) => setFirstSentence(e.target.value)}
                  rows={3}
                  className="text-lg resize-none"
                />
                <p className="text-sm text-slate-500">This will be the first sentence of your collaborative story.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="max-players">Maximum Players</Label>
                <div className="flex items-center space-x-4">
                  <Input
                    id="max-players"
                    type="number"
                    min="2"
                    max="10"
                    value={maxPlayers}
                    onChange={(e) => setMaxPlayers(parseInt(e.target.value))}
                    className="w-24 text-lg"
                  />
                  <div className="flex items-center space-x-2 text-slate-600">
                    <Users className="h-4 w-4" />
                    <span className="text-sm">2-10 players recommended</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-800 mb-1">How it works:</h4>
                    <p className="text-blue-700 text-sm leading-relaxed">
                      After creating the game, you'll get a shareable link. Each player will see only the previous sentence 
                      when it's their turn to write. Once everyone has contributed, the complete story will be revealed!
                    </p>
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleCreateGame}
                disabled={!creatorName.trim() || !firstSentence.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold transition-all duration-200 hover:scale-105"
              >
                Create Game & Start Writing
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateGame;
