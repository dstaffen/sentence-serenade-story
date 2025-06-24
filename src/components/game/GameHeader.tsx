
import { Link } from "react-router-dom";
import { ArrowLeft, BookOpen } from "lucide-react";

export const GameHeader = () => {
  return (
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
  );
};
