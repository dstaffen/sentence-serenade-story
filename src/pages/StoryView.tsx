
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, ArrowLeft, Share, Download, Users } from "lucide-react";

const StoryView = () => {
  const { gameId } = useParams();
  
  // Mock data - in a real app, this would come from a database
  const storyData = {
    title: "The Mysterious Adventure",
    sentences: [
      { author: "Alice", text: "The old lighthouse keeper found a strange bottle washed up on the shore, glowing with an ethereal blue light." },
      { author: "Bob", text: "As he uncorked it, a wisp of silver smoke spiraled out and formed the shape of a tiny dragon." },
      { author: "Carol", text: "The dragon spoke in a voice like tinkling bells, asking him to make a wish that would change everything." },
      { author: "David", text: "Without hesitation, he wished to see the world as it truly was, beyond the veil of ordinary perception." }
    ],
    completedAt: "2024-01-15",
    participants: ["Alice", "Bob", "Carol", "David"]
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: storyData.title,
        text: storyData.sentences.map(s => s.text).join(' '),
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // In a real app, show a toast notification here
    }
  };

  const handleDownload = () => {
    const storyText = `${storyData.title}\n\nA collaborative story created with Exquisite Corpse\n\n${storyData.sentences.map(s => s.text).join(' ')}\n\nWritten by: ${storyData.participants.join(', ')}\nCompleted on: ${storyData.completedAt}`;
    
    const blob = new Blob([storyText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${storyData.title.replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
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
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">{storyData.title}</h2>
            <div className="flex items-center justify-center space-x-4 text-slate-600">
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>{storyData.participants.length} writers</span>
              </div>
              <span>•</span>
              <span>Completed {storyData.completedAt}</span>
            </div>
          </div>

          {/* Story Content */}
          <Card className="shadow-lg mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-6 w-6 text-blue-600" />
                <span>The Complete Story</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-lg max-w-none">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
                  <p className="text-slate-800 leading-relaxed text-lg">
                    {storyData.sentences.map((sentence, index) => (
                      <span key={index}>
                        <span 
                          className="hover:bg-yellow-100 transition-colors duration-200 rounded px-1"
                          title={`Written by ${sentence.author}`}
                        >
                          {sentence.text}
                        </span>
                        {index < storyData.sentences.length - 1 && " "}
                      </span>
                    ))}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contributors */}
          <Card className="shadow-lg mb-8">
            <CardHeader>
              <CardTitle>Contributors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {storyData.sentences.map((sentence, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {sentence.author[0]}
                      </div>
                      <span className="font-semibold text-slate-800">{sentence.author}</span>
                      <span className="text-slate-500 text-sm">Sentence {index + 1}</span>
                    </div>
                    <p className="text-slate-700 italic">"{sentence.text}"</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={handleShare}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 transition-all duration-200 hover:scale-105"
            >
              <Share className="mr-2 h-5 w-5" />
              Share Story
            </Button>
            <Button 
              onClick={handleDownload}
              variant="outline"
              className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 transition-all duration-200"
            >
              <Download className="mr-2 h-5 w-5" />
              Download as Text
            </Button>
            <Link to="/create">
              <Button 
                variant="outline"
                className="border-2 border-green-600 text-green-600 hover:bg-green-50 px-6 py-3 transition-all duration-200"
              >
                Create New Story
              </Button>
            </Link>
          </div>

          {/* Fun Stats */}
          <Card className="shadow-lg mt-8">
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Story Statistics</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{storyData.sentences.length}</div>
                    <div className="text-sm text-slate-600">Sentences</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {storyData.sentences.map(s => s.text.split(' ').length).reduce((a, b) => a + b, 0)}
                    </div>
                    <div className="text-sm text-slate-600">Words</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">{storyData.participants.length}</div>
                    <div className="text-sm text-slate-600">Writers</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StoryView;
