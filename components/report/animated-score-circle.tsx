"use client";

import { useState, useEffect } from "react";
import { getScoreGradient, getScoreLabel, getScoreColor } from "./score-utils";

export function AnimatedScoreCircle({
  score,
  label,
  icon: Icon,
  delay = 0,
  id,
}: {
  score: number;
  label: string;
  icon: React.ElementType;
  delay?: number;
  id: string;
}) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const visibilityTimer = setTimeout(() => setIsVisible(true), delay);
    const scoreTimer = setTimeout(() => {
      let current = 0;
      const increment = score / 40;
      const interval = setInterval(() => {
        current += increment;
        if (current >= score) {
          setAnimatedScore(score);
          clearInterval(interval);
        } else {
          setAnimatedScore(Math.round(current));
        }
      }, 25);
      return () => clearInterval(interval);
    }, delay + 200);

    return () => {
      clearTimeout(visibilityTimer);
      clearTimeout(scoreTimer);
    };
  }, [score, delay]);

  const circumference = 2 * Math.PI * 44;
  const strokeDashoffset =
    circumference - (circumference * animatedScore) / 100;

  return (
    <div
      className={`flex flex-col items-center gap-3 transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <div className="relative p-4">
        {/* Glow effect - positioned behind with padding so it doesn't clip */}
        <div
          className={`absolute inset-0 rounded-full blur-xl opacity-20 ${
            score >= 90
              ? "bg-emerald-500"
              : score >= 50
              ? "bg-amber-500"
              : "bg-red-500"
          }`}
        />

        {/* Main circle */}
        <svg
          className="w-28 h-28 transform -rotate-90 relative"
          style={{ overflow: "visible" }}
        >
          {/* Background circle */}
          <circle
            cx="56"
            cy="56"
            r="44"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-white/5"
          />
          {/* Animated progress circle */}
          <circle
            cx="56"
            cy="56"
            r="44"
            stroke={`url(#gradient-${id})`}
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
          <defs>
            <linearGradient
              id={`gradient-${id}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop
                offset="0%"
                stopColor={
                  score >= 90 ? "#34d399" : score >= 50 ? "#fbbf24" : "#f87171"
                }
              />
              <stop
                offset="100%"
                stopColor={
                  score >= 90 ? "#059669" : score >= 50 ? "#d97706" : "#dc2626"
                }
              />
            </linearGradient>
          </defs>
        </svg>

        {/* Score number */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={`text-3xl font-bold bg-gradient-to-br ${getScoreGradient(
              score
            )} bg-clip-text text-transparent`}
          >
            {animatedScore}
          </span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
            {getScoreLabel(score)}
          </span>
        </div>
      </div>

      {/* Label */}
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
        <Icon className={`h-4 w-4 ${getScoreColor(score)}`} />
        <span className="text-sm font-medium text-white/80">{label}</span>
      </div>
    </div>
  );
}
