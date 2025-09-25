import { cn } from "@/lib/utils";

interface ScoreDisplayProps {
  score: number;
  className?: string;
}

export const ScoreDisplay = ({ score, className }: ScoreDisplayProps) => {
  const getScoreColor = (score: number) => {
    if (score > 50) return "text-safe";
    if (score >= 35) return "text-warning";
    return "text-phishing";
  };

  const getScoreLabel = (score: number) => {
    if (score > 50) return "Safe";
    if (score >= 35) return "Warning";
    return "Phishing";
  };

  const getScoreBg = (score: number) => {
    if (score > 50) return "bg-safe/10 border-safe/20";
    if (score >= 35) return "bg-warning/10 border-warning/20";
    return "bg-phishing/10 border-phishing/20";
  };

  return (
    <div className={cn(
      "flex flex-col items-center justify-center p-6 rounded-lg border-2",
      getScoreBg(score),
      className
    )}>
      <div className={cn("text-4xl font-bold mb-2", getScoreColor(score))}>
        {score}
      </div>
      <div className={cn("text-lg font-semibold", getScoreColor(score))}>
        {getScoreLabel(score)}
      </div>
    </div>
  );
};