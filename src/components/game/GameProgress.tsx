
import { Progress } from "@/components/ui/progress";

interface GameProgressProps {
  gameData: any;
}

export const GameProgress = ({ gameData }: GameProgressProps) => {
  return (
    <div className="text-center mb-6">
      <h2 className="text-3xl font-bold text-slate-800 mb-4">{gameData.title}</h2>
      <div className="mb-4">
        <p className="text-lg text-slate-600 mb-2">
          Turn {gameData.current_turn} of {gameData.max_participants}
        </p>
        <Progress 
          value={(gameData.current_turn / gameData.max_participants) * 100} 
          className="w-full h-3"
        />
      </div>
      <p className="text-slate-500">Your turn!</p>
    </div>
  );
};
