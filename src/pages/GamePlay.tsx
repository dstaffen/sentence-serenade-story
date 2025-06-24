
import { useParams } from "react-router-dom";
import { useGameData } from "@/hooks/useGameData";
import { LoadingState } from "@/components/game/LoadingState";
import { ErrorState } from "@/components/game/ErrorState";
import { SubmittedState } from "@/components/game/SubmittedState";
import { GameHeader } from "@/components/game/GameHeader";
import { GameProgress } from "@/components/game/GameProgress";
import { WritingInterface } from "@/components/game/WritingInterface";

const GamePlay = () => {
  const { gameId, participantId } = useParams();
  
  const {
    isLoading,
    error,
    gameData,
    participantData,
    previousSentence,
    hasSubmitted,
    submittedSentence,
    setHasSubmitted,
    setSubmittedSentence
  } = useGameData(gameId, participantId);

  const handleSubmissionComplete = (sentence: string) => {
    setSubmittedSentence(sentence);
    setHasSubmitted(true);
  };

  // Loading state
  if (isLoading) {
    return <LoadingState />;
  }

  // Error state
  if (error) {
    return <ErrorState error={error} />;
  }

  // Submitted state
  if (hasSubmitted) {
    return <SubmittedState gameData={gameData} submittedSentence={submittedSentence} />;
  }

  // Main game interface
  if (!gameData || !participantData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <GameHeader />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <GameProgress gameData={gameData} />
          
          <WritingInterface
            gameData={gameData}
            participantData={participantData}
            gameId={gameId!}
            participantId={participantId!}
            previousSentence={previousSentence}
            onSubmissionComplete={handleSubmissionComplete}
          />
        </div>
      </div>
    </div>
  );
};

export default GamePlay;
