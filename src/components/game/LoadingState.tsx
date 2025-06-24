
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export const LoadingState = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
      <Card className="shadow-lg max-w-md w-full mx-4">
        <CardContent className="pt-12 pb-12 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-800 mb-2">Loading game...</h2>
          <p className="text-slate-600">Please wait while we fetch your game data.</p>
        </CardContent>
      </Card>
    </div>
  );
};
