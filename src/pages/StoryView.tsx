import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, ArrowLeft, Share, Download, Users, Calendar, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import SEOHead from "@/components/SEOHead";

interface GameData {
  id: string;
  title: string;
  created_at: string;
  status: string;
  max_participants: number;
}

interface SentenceData {
  id: string;
  sentence_text: string;
  turn_number: number;
  participant_email: string;
  created_at: string;
}

interface ParticipantData {
  email: string;
  turn_order: number;
}

const StoryView = () => {
  const { gameId } = useParams();
  const { toast } = useToast();
  
  const { data: gameData, isLoading: gameLoading } = useQuery({
    queryKey: ['game', gameId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .eq('id', gameId)
        .eq('status', 'completed')
        .single();
      
      if (error) throw error;
      return data as GameData;
    },
    enabled: !!gameId
  });

  const { data: sentences, isLoading: sentencesLoading } = useQuery({
    queryKey: ['sentences', gameId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sentences')
        .select('*')
        .eq('game_id', gameId)
        .order('turn_number');
      
      if (error) throw error;
      return data as SentenceData[];
    },
    enabled: !!gameId
  });

  const { data: participants } = useQuery({
    queryKey: ['participants', gameId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('participants')
        .select('email, turn_order')
        .eq('game_id', gameId)
        .order('turn_order');
      
      if (error) throw error;
      return data as ParticipantData[];
    },
    enabled: !!gameId
  });

  const isLoading = gameLoading || sentencesLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your collaborative story...</p>
        </div>
      </div>
    );
  }

  if (!gameData || !sentences) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-16 w-16 text-slate-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Story Not Found</h2>
          <p className="text-slate-600 mb-6">This story may not exist or hasn't been completed yet.</p>
          <Link to="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const getAuthorName = (email: string) => {
    // Privacy-friendly: show only first name or initials
    const name = email.split('@')[0];
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: gameData.title,
          text: `Check out this collaborative story: "${gameData.title}"`,
          url: window.location.href
        });
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied!",
          description: "Story link has been copied to your clipboard.",
        });
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Story link has been copied to your clipboard.",
      });
    }
  };

  const handleDownload = () => {
    const storyText = `${gameData.title}\n\nA collaborative story created with Exquisite Corpse\n\n${sentences.map(s => s.sentence_text).join(' ')}\n\nWritten by: ${participants?.map(p => getAuthorName(p.email)).join(', ')}\nCompleted on: ${formatDate(gameData.created_at)}`;
    
    const blob = new Blob([storyText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${gameData.title.replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalWords = sentences.reduce((total, sentence) => {
    return total + sentence.sentence_text.split(' ').length;
  }, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 print:bg-white">
      <SEOHead 
        title={`${gameData?.title} - Collaborative Story`}
        description={`Read this amazing collaborative story: "${gameData?.title}" created with ${participants?.length || gameData?.max_participants} writers.`}
        type="article"
      />
      
      {/* Header */}
      <header className="container mx-auto px-4 py-6 print:hidden">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 text-slate-600 hover:text-blue-600 transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center space-x-2">
            <Sparkles className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-slate-800">Exquisite Corpse</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 print:py-4">
        <div className="max-w-4xl mx-auto">
          {/* Title and Meta */}
          <div className="text-center mb-12 print:mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-6 print:hidden">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6 print:text-3xl print:mb-4">
              {gameData.title}
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-6 text-slate-600 print:gap-4 print:text-sm">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 print:h-4 print:w-4" />
                <span>{participants?.length || gameData.max_participants} writers</span>
              </div>
              <span className="hidden sm:inline">•</span>
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 print:h-4 print:w-4" />
                <span>Completed {formatDate(gameData.created_at)}</span>
              </div>
            </div>
          </div>

          {/* Story Content */}
          <Card className="shadow-xl mb-12 print:shadow-none print:border-2 print:mb-8">
            <CardHeader className="text-center print:pb-4">
              <CardTitle className="flex items-center justify-center space-x-2 text-2xl print:text-xl">
                <BookOpen className="h-6 w-6 text-blue-600 print:h-5 print:w-5" />
                <span>The Complete Story</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="print:px-4">
              <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 p-8 rounded-xl print:bg-white print:p-4">
                <div className="prose prose-lg max-w-none">
                  <p className="text-slate-800 leading-relaxed text-lg print:text-base print:leading-relaxed">
                    {sentences.map((sentence, index) => (
                      <span key={sentence.id}>
                        <span 
                          className="hover:bg-yellow-100 transition-colors duration-200 rounded px-1 cursor-help print:hover:bg-transparent"
                          title={`Sentence ${sentence.turn_number} by ${getAuthorName(sentence.participant_email)}`}
                        >
                          {sentence.sentence_text}
                        </span>
                        {index < sentences.length - 1 && " "}
                      </span>
                    ))}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contributors Section */}
          <Card className="shadow-lg mb-12 print:hidden">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-6 w-6 text-blue-600" />
                <span>Story Contributors</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sentences.map((sentence, index) => (
                  <div key={sentence.id} className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-400">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {getAuthorName(sentence.participant_email)[0]}
                      </div>
                      <div>
                        <span className="font-semibold text-slate-800">
                          {getAuthorName(sentence.participant_email)}
                        </span>
                        <div className="text-slate-500 text-sm">Sentence {sentence.turn_number}</div>
                      </div>
                    </div>
                    <p className="text-slate-700 italic leading-relaxed">
                      "{sentence.sentence_text}"
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 print:hidden">
            <Button 
              onClick={handleShare}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg transition-all duration-200 hover:scale-105 shadow-lg"
            >
              <Share className="mr-2 h-5 w-5" />
              Share Story
            </Button>
            <Button 
              onClick={handleDownload}
              variant="outline"
              className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg transition-all duration-200 shadow-lg"
            >
              <Download className="mr-2 h-5 w-5" />
              Download as Text
            </Button>
          </div>

          {/* Call to Action */}
          <div className="text-center bg-gradient-to-r from-green-50 to-blue-50 p-8 rounded-xl print:hidden">
            <h3 className="text-2xl font-bold text-slate-800 mb-4">
              Inspired to Create Your Own Story?
            </h3>
            <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
              Join the collaborative storytelling experience and create something magical with friends, family, or colleagues.
            </p>
            <Link to="/create">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-3 text-lg transition-all duration-200 hover:scale-105 shadow-lg"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Start New Story
              </Button>
            </Link>
          </div>

          {/* Story Statistics */}
          <Card className="shadow-lg mt-8 print:mt-4">
            <CardContent className="pt-6 print:pt-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 print:text-base print:mb-2">
                  Story Statistics
                </h3>
                <div className="grid grid-cols-3 gap-4 print:gap-2">
                  <div>
                    <div className="text-3xl font-bold text-blue-600 print:text-xl">
                      {sentences.length}
                    </div>
                    <div className="text-sm text-slate-600 print:text-xs">Sentences</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-green-600 print:text-xl">
                      {totalWords}
                    </div>
                    <div className="text-sm text-slate-600 print:text-xs">Words</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-purple-600 print:text-xl">
                      {participants?.length || gameData.max_participants}
                    </div>
                    <div className="text-sm text-slate-600 print:text-xs">Writers</div>
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
