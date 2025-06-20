
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { BookOpen, Users, Eye, Sparkles } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-slate-800">Exquisite Corpse</h1>
          </div>
          <nav className="hidden md:flex space-x-6">
            <a href="#how-it-works" className="text-slate-600 hover:text-blue-600 transition-colors">
              How it Works
            </a>
            <a href="#features" className="text-slate-600 hover:text-blue-600 transition-colors">
              Features
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold text-slate-800 mb-6 leading-tight">
            Create Stories
            <span className="block text-blue-600">Together</span>
          </h2>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Exquisite Corpse is a collaborative writing game where each person adds one sentence to a story, 
            seeing only the previous sentence. The complete story is revealed at the end to all participants.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/create">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold transition-all duration-200 hover:scale-105">
                Start New Game
                <Sparkles className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="lg" 
              className="px-8 py-4 text-lg font-semibold border-2 border-blue-600 text-blue-600 hover:bg-blue-50 transition-all duration-200"
              onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-slate-800 mb-12">
            How It Works
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <h4 className="text-xl font-semibold text-slate-800 mb-3">1. Gather Players</h4>
                <p className="text-slate-600 leading-relaxed">
                  Create a game and invite friends to join. Each player will contribute one sentence to build the story together.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-8 w-8 text-green-600" />
                </div>
                <h4 className="text-xl font-semibold text-slate-800 mb-3">2. Write Together</h4>
                <p className="text-slate-600 leading-relaxed">
                  Each player sees only the previous sentence and adds their own, creating an unpredictable narrative chain.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Eye className="h-8 w-8 text-purple-600" />
                </div>
                <h4 className="text-xl font-semibold text-slate-800 mb-3">3. Reveal & Enjoy</h4>
                <p className="text-slate-600 leading-relaxed">
                  Once everyone has contributed, the complete story is revealed. Prepare to be surprised by your creation!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-3xl font-bold text-slate-800 mb-8">
              Perfect for Creative Collaboration
            </h3>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="flex items-start space-x-3 text-left">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex-shrink-0 mt-1"></div>
                <div>
                  <h4 className="font-semibold text-slate-800 mb-1">Real-time Collaboration</h4>
                  <p className="text-slate-600">Write together in real-time with friends around the world</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 text-left">
                <div className="w-6 h-6 bg-green-600 rounded-full flex-shrink-0 mt-1"></div>
                <div>
                  <h4 className="font-semibold text-slate-800 mb-1">Creative Surprises</h4>
                  <p className="text-slate-600">Each story becomes a unique, unexpected adventure</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 text-left">
                <div className="w-6 h-6 bg-purple-600 rounded-full flex-shrink-0 mt-1"></div>
                <div>
                  <h4 className="font-semibold text-slate-800 mb-1">Easy to Share</h4>
                  <p className="text-slate-600">Share your completed stories with the world</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 text-left">
                <div className="w-6 h-6 bg-orange-600 rounded-full flex-shrink-0 mt-1"></div>
                <div>
                  <h4 className="font-semibold text-slate-800 mb-1">No Registration</h4>
                  <p className="text-slate-600">Jump right in and start creating stories immediately</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to Create Something Amazing?
          </h3>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Start your first collaborative story today and discover the magic of creative collaboration.
          </p>
          <Link to="/create">
            <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-4 text-lg font-semibold transition-all duration-200 hover:scale-105">
              Start Writing Now
              <Sparkles className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <BookOpen className="h-6 w-6" />
            <span className="text-lg font-semibold">Exquisite Corpse</span>
          </div>
          <p className="text-slate-400">
            Bringing creative minds together, one sentence at a time.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
