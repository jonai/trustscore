export function getScoreColor(score: number): string {
  if (score >= 90) return "text-emerald-400";
  if (score >= 50) return "text-amber-400";
  return "text-red-400";
}

export function getScoreGradient(score: number): string {
  if (score >= 90) return "from-emerald-400 to-emerald-600";
  if (score >= 50) return "from-amber-400 to-amber-600";
  return "from-red-400 to-red-600";
}

export function getScoreGlow(score: number): string {
  if (score >= 90) return "shadow-emerald-500/50";
  if (score >= 50) return "shadow-amber-500/50";
  return "shadow-red-500/50";
}

export function getScoreLabel(score: number): string {
  if (score >= 90) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 50) return "Needs Work";
  return "Poor";
}
