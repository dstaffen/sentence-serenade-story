interface GameProgressProps {
  gameData: any;
}

export const GameProgress = ({ gameData }: GameProgressProps) => {
  return (
    <div className="text-center mb-6">
      <h2 className="text-3xl font-bold text-slate-800 mb-4">{gameData.title}</h2>
      <p className="text-lg text-slate-600 mb-4">Your turn to write!</p>
    </div>
  );
};
