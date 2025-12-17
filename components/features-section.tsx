"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  CheckCircle2,
  Circle,
  Loader2,
  Shield,
  ArrowRight,
  TrendingUp,
  Link2,
  Award,
  Zap,
  FileText,
} from "lucide-react";

// Analysis Steps Animation
function AnalyzeCard() {
  const steps = [
    { label: "Checking Performance", icon: Zap },
    { label: "Analyzing SEO", icon: TrendingUp },
    { label: "Scanning Security", icon: Shield },
    { label: "Testing Accessibility", icon: CheckCircle2 },
    { label: "Measuring Speed", icon: Loader2 },
  ];

  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (currentStep >= steps.length) return; // Stop when all complete

    const timeout = setTimeout(() => {
      setCurrentStep((prev) => prev + 1);
    }, 3500);
    return () => clearTimeout(timeout);
  }, [currentStep, steps.length]);

  return (
    <Card className="p-6 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border-white/10 h-full">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-emerald-500/20">
          <Zap className="h-5 w-5 text-emerald-400" />
        </div>
        <div>
          <h3 className="font-bold text-white">Instant Analysis</h3>
          <p className="text-xs text-muted-foreground">
            Full scan in 30 seconds
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {steps.map((step, index) => {
          const isComplete = index < currentStep;
          const isCurrent = index === currentStep;
          const StepIcon = step.icon;

          return (
            <div
              key={index}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-500 ${
                isComplete
                  ? "bg-emerald-500/10"
                  : isCurrent
                  ? "bg-white/5 border border-white/10"
                  : "opacity-40"
              }`}
            >
              {isComplete ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              ) : isCurrent ? (
                <Loader2 className="h-5 w-5 text-white/60 animate-spin" />
              ) : (
                <Circle className="h-5 w-5 text-white/30" />
              )}
              <span
                className={`text-sm ${
                  isCurrent
                    ? "text-white/60 font-medium"
                    : isComplete
                    ? "text-emerald-400 font-medium"
                    : "text-white/40"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// Report Preview Card
function ReportCard() {
  const categories = [
    { name: "Performance", score: 92, color: "emerald" },
    { name: "SEO", score: 88, color: "blue" },
    { name: "Accessibility", score: 95, color: "purple" },
    { name: "Security", score: 85, color: "amber" },
  ];

  return (
    <Card className="p-6 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border-white/10 h-full">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-blue-500/20">
          <FileText className="h-5 w-5 text-blue-400" />
        </div>
        <div>
          <h3 className="font-bold text-white">Detailed Reports</h3>
          <p className="text-xs text-muted-foreground">Actionable insights</p>
        </div>
      </div>

      <div className="flex items-center justify-center mb-6">
        <div className="relative w-24 h-24">
          <svg className="w-24 h-24 -rotate-90">
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-white/10"
            />
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="url(#scoreGradient)"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${90 * 2.51} 251`}
              className="transition-all duration-1000"
            />
            <defs>
              <linearGradient
                id="scoreGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#34d399" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-white">90</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {categories.map((cat) => (
          <div key={cat.name} className="p-2 rounded-lg bg-white/5 text-center">
            <div
              className={`text-lg font-bold ${
                cat.color === "emerald"
                  ? "text-emerald-400"
                  : cat.color === "blue"
                  ? "text-blue-400"
                  : cat.color === "purple"
                  ? "text-purple-400"
                  : "text-amber-400"
              }`}
            >
              {cat.score}
            </div>
            <div className="text-xs text-muted-foreground">{cat.name}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// Monitoring Chart Card
function MonitoringCard() {
  const [points, setPoints] = useState([
    65, 70, 68, 75, 78, 82, 85, 88, 90, 92,
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPoints((prev) => {
        const newPoints = [...prev.slice(1)];
        const lastVal = prev[prev.length - 1];
        // Trend upward: 80% chance to go up, 20% chance to stay or slightly down
        const change =
          Math.random() > 0.2 ? Math.floor(Math.random() * 2) + 1 : 0;
        const newVal = Math.min(100, lastVal + change);
        newPoints.push(newVal);
        return newPoints;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const pathD = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * 280 + 10;
      const y = 100 - ((p - 60) / 50) * 80;
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  return (
    <Card className="p-6 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border-white/10 h-full">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-purple-500/20">
          <TrendingUp className="h-5 w-5 text-purple-400" />
        </div>
        <div>
          <h3 className="font-bold text-white">Daily Monitoring</h3>
          <p className="text-xs text-muted-foreground">
            Track your score over time
          </p>
        </div>
      </div>

      <div className="relative h-28 mt-2">
        <svg viewBox="0 0 300 120" className="w-full h-full">
          {/* Grid lines */}
          <line
            x1="10"
            y1="20"
            x2="290"
            y2="20"
            stroke="rgba(255,255,255,0.1)"
            strokeDasharray="4"
          />
          <line
            x1="10"
            y1="60"
            x2="290"
            y2="60"
            stroke="rgba(255,255,255,0.1)"
            strokeDasharray="4"
          />
          <line
            x1="10"
            y1="100"
            x2="290"
            y2="100"
            stroke="rgba(255,255,255,0.1)"
            strokeDasharray="4"
          />

          {/* Area fill */}
          <path
            d={`${pathD} L 290 100 L 10 100 Z`}
            fill="url(#areaGradient)"
            className="transition-all duration-500"
          />

          {/* Line */}
          <path
            d={pathD}
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-all duration-500"
          />

          {/* Current point */}
          <circle
            cx="290"
            cy={100 - ((points[points.length - 1] - 60) / 50) * 80}
            r="6"
            fill="#10b981"
            className="animate-pulse"
          />

          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(16, 185, 129, 0.3)" />
              <stop offset="100%" stopColor="rgba(16, 185, 129, 0)" />
            </linearGradient>
          </defs>
        </svg>

        {/* Labels */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-muted-foreground px-2">
          <span>7 days ago</span>
          <span>Today</span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 mt-4 text-sm">
        <TrendingUp className="h-4 w-4 text-emerald-400" />
        <span className="text-emerald-400 font-medium">+12%</span>
        <span className="text-muted-foreground">this week</span>
      </div>
    </Card>
  );
}

// Badge Preview Card
function BadgeCard() {
  return (
    <Card className="p-6 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border-white/10 h-full">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-amber-500/20">
          <Award className="h-5 w-5 text-amber-400" />
        </div>
        <div>
          <h3 className="font-bold text-white">Trust Badge</h3>
          <p className="text-xs text-muted-foreground">Show your credibility</p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        <p className="text-xs text-muted-foreground text-center">
          Updated daily • Easy to embed
        </p>

        {/* Badge Preview - Matching Hero Badge */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-white/10 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="relative w-16 h-16">
              <svg className="w-16 h-16" viewBox="0 0 64 64">
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  stroke="currentColor"
                  strokeWidth="5"
                  fill="none"
                  className="text-white/10"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  stroke="#10b981"
                  strokeWidth="5"
                  fill="none"
                  strokeDasharray={2 * Math.PI * 26}
                  strokeDashoffset={2 * Math.PI * 26 * 0.08}
                  strokeLinecap="round"
                  className="-rotate-90 origin-center"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-white">92</span>
              </div>
            </div>

            {/* Text */}
            <div className="text-left">
              <div className="text-sm text-white/60">
                verifiedtrustscore.com
              </div>
              <div className="text-lg font-semibold text-white">
                Verified Website Score
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link2 className="h-3 w-3" />
          <span>Includes dofollow backlink</span>
        </div>
      </div>
    </Card>
  );
}

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 relative scroll-mt-16">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent pointer-events-none" />
      <div className="absolute top-1/2 left-1/4 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div
        className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none animate-pulse"
        style={{ animationDelay: "1s" }}
      />

      <div className="text-center mb-16 relative">
        <Badge
          variant="secondary"
          className="mb-6 bg-gradient-to-r from-emerald-500/20 to-purple-500/20 border-emerald-500/30 text-emerald-400"
        >
          <Sparkles className="h-3 w-3 mr-2" />
          Features
        </Badge>
        <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-white to-emerald-200 bg-clip-text text-transparent">
          Everything you need to
          <br />
          <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text">
            optimize your website
          </span>
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          From comprehensive analysis to automated monitoring and trust badges.
        </p>

        <a
          href="#pricing"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300 hover:scale-105"
        >
          Start Free Analysis
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>

      {/* Interactive Feature Cards - 2x2 Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        <AnalyzeCard />
        <ReportCard />
        <MonitoringCard />
        <BadgeCard />
      </div>
    </section>
  );
}
