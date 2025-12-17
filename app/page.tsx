"use client";

import { useState, useTransition, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Gauge,
  Search,
  Award,
  Link2,
  ArrowRight,
  Check,
  Loader2,
  AlertCircle,
  Sparkles,
  Trophy,
  Wrench,
  HelpCircle,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";
import { analyzeWebsite, type PageSpeedResult } from "./actions/analyze";
import { ResultsSection } from "@/components/report/results-section";
import { Footer } from "@/components/footer";
import { FeaturesSection } from "@/components/features-section";

interface CertifiedWebsite {
  id: string;
  domain: string;
  current_score: number;
  performance_score: number;
  seo_score: number;
  accessibility_score: number;
  best_practices_score: number;
  certified_date: string;
}

function getScoreColor(score: number) {
  if (score >= 90) return "text-emerald-400";
  if (score >= 70) return "text-amber-400";
  if (score >= 50) return "text-orange-400";
  return "text-red-400";
}

function getRankBadge(rank: number) {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return `#${rank}`;
}

export default function TrustScorePage() {
  const [website, setWebsite] = useState("");
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<PageSpeedResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Animate loading progress
  useEffect(() => {
    if (isPending) {
      setLoadingProgress(0);
      const interval = setInterval(() => {
        setLoadingProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 15;
        });
      }, 500);
      return () => clearInterval(interval);
    } else {
      setLoadingProgress(100);
    }
  }, [isPending]);

  const handleAnalyze = () => {
    setError(null);
    startTransition(async () => {
      const response = await analyzeWebsite(website);
      if (response.success && response.data) {
        setResult(response.data);
      } else {
        setError(response.error || "Failed to analyze");
      }
    });
  };

  const handleReset = () => {
    setResult(null);
    setWebsite("");
    setError(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isPending) {
      handleAnalyze();
    }
  };

  const features = [
    {
      icon: Gauge,
      title: "PageSpeed Analysis",
      description: "Get detailed performance metrics and optimization tips",
    },
    {
      icon: Search,
      title: "SEO Check",
      description: "Comprehensive SEO audit with actionable recommendations",
    },
    {
      icon: Award,
      title: "Trust Badge",
      description: "Display your trust score with a verified badge",
    },
    {
      icon: Link2,
      title: "Dofollow Backlink",
      description: "Boost your SEO with a quality dofollow link",
    },
  ];

  // Fallback data while loading or if no real data
  const fallbackAnalyses = [
    {
      domain: "google.com",
      score: 99,
      time: "2m ago",
      color: "bg-emerald-500",
    },
    {
      domain: "apple.com",
      score: 98,
      time: "5m ago",
      color: "bg-emerald-500",
    },
    {
      domain: "vercel.com",
      score: 97,
      time: "12m ago",
      color: "bg-emerald-500",
    },
    {
      domain: "stripe.com",
      score: 96,
      time: "18m ago",
      color: "bg-emerald-500",
    },
    {
      domain: "linear.app",
      score: 95,
      time: "25m ago",
      color: "bg-emerald-500",
    },
  ];

  const [recentAnalyses, setRecentAnalyses] = useState(fallbackAnalyses);

  // Fetch real recent analyses on mount
  useEffect(() => {
    async function fetchRecentAnalyses() {
      try {
        const response = await fetch("/api/recent-analyses");
        const data = await response.json();
        if (data.analyses && data.analyses.length > 0) {
          setRecentAnalyses(data.analyses);
        }
      } catch (error) {
        console.error("Failed to fetch recent analyses:", error);
      }
    }
    fetchRecentAnalyses();
  }, []);

  const [leaderboard, setLeaderboard] = useState<CertifiedWebsite[]>([]);

  // Fetch leaderboard on mount
  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const response = await fetch("/api/home-leaderboard");
        const data = await response.json();
        if (data.websites && data.websites.length > 0) {
          setLeaderboard(data.websites);
        }
      } catch (error) {
        console.error("Failed to fetch leaderboard:", error);
      }
    }
    fetchLeaderboard();
  }, []);

  const pricingFeatures = [
    "Unlimited Re-scans for 1 Domain",
    "PageSpeed & SEO reports",
    "Trust badge for your site",
    "Dofollow backlink included",
    "Priority support",
    "Lifetime updates",
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-xl bg-background/80 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-6 flex items-center justify-center relative">
          <div
            className="flex items-center gap-2 cursor-pointer group absolute left-4"
            onClick={handleReset}
          >
            {/* New Logo: 92% ring with lightning bolt and glow */}
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500/30 rounded-full blur-md group-hover:bg-emerald-500/40 transition-colors" />
              <svg className="relative w-10 h-10" viewBox="0 0 32 32">
                {/* Background ring */}
                <circle
                  cx="16"
                  cy="16"
                  r="13"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  className="text-white/10"
                />
                {/* Progress ring at 92% */}
                <circle
                  cx="16"
                  cy="16"
                  r="13"
                  stroke="#10b981"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 13 * 0.92}
                  strokeDashoffset={0}
                  className="-rotate-90 origin-center"
                  style={{ transformOrigin: "center" }}
                />
                {/* Lightning bolt */}
                <path
                  d="M17 7L12 16h4l-1 9 5-10h-4l1-8z"
                  fill="white"
                  className="drop-shadow-sm"
                />
              </svg>
            </div>
            <span className="text-xl font-semibold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              VerifiedTrustScore
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm">
            <a
              href="#features"
              className="text-muted-foreground hover:text-white transition-colors"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-muted-foreground hover:text-white transition-colors"
            >
              Pricing
            </a>
            <a
              href="#faq"
              className="text-muted-foreground hover:text-white transition-colors"
            >
              FAQ
            </a>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4">
        {/* Show Results if we have them */}
        {result ? (
          <ResultsSection result={result} onReset={handleReset} />
        ) : (
          <>
            {/* Hero Section */}
            <section className="py-20 md:py-32 text-center relative">
              {/* Background decoration */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

              {/* Badge Preview */}
              <div className="mb-10 flex justify-center">
                <div className="inline-flex items-center gap-4 px-6 py-4 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-xl shadow-2xl">
                  {/* Score Circle */}
                  <div className="relative">
                    <svg className="w-16 h-16 transform -rotate-90">
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

              <Badge
                variant="secondary"
                className="mb-6 bg-white/5 border-white/10 backdrop-blur-sm"
              >
                <span className="text-white/60">✓</span>
                <span className="ml-2">Get your badge + dofollow backlink</span>
              </Badge>

              <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
                Make your website trustworthy
              </h1>

              <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto text-pretty">
                Get instant insights into your website's performance, SEO, and
                trustworthiness. Build credibility with your visitors.
              </p>

              {/* Input Section */}
              <div className="max-w-2xl mx-auto mb-4">
                <div className="flex flex-col md:flex-row gap-3 p-2 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
                  <Input
                    type="text"
                    placeholder="website.com"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isPending}
                    className="h-14 text-lg bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-white/30"
                  />
                  <Button
                    size="lg"
                    className="h-14 px-8 bg-white hover:bg-gray-100 text-gray-900 font-bold shadow-lg shadow-white/20 hover:shadow-white/30 transition-all duration-300 relative overflow-hidden cursor-pointer"
                    onClick={() => {
                      if (!website.trim()) {
                        const input = document.querySelector(
                          'input[type="text"]'
                        ) as HTMLInputElement;
                        input?.focus();
                        return;
                      }
                      handleAnalyze();
                    }}
                    disabled={isPending}
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <span className="relative z-10 flex items-center">
                          Analyze Website
                          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] animate-shimmer" />
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3 text-red-400 animate-in fade-in slide-in-from-top-2">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Loading State with Animated Steps */}
              {isPending && (
                <div className="max-w-2xl mx-auto mb-8 p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 animate-in fade-in slide-in-from-bottom-4">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-full border-2 border-emerald-500/30 border-t-emerald-500 animate-spin" />
                      <Search className="absolute inset-0 m-auto h-6 w-6 text-emerald-400" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-white text-lg">
                        Analyzing {website}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Full scan in progress...
                      </p>
                    </div>
                  </div>

                  {/* Animated Steps */}
                  <div className="space-y-2 mb-6">
                    {[
                      { label: "Checking Performance", delay: 0 },
                      { label: "Analyzing SEO", delay: 4000 },
                      { label: "Scanning Security", delay: 8000 },
                      { label: "Testing Accessibility", delay: 12000 },
                      { label: "Measuring Speed", delay: 16000 },
                    ].map((step, index) => {
                      const isActive = loadingProgress >= index * 20;
                      const isComplete = loadingProgress >= (index + 1) * 20;
                      return (
                        <div
                          key={index}
                          className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-500 ${
                            isComplete
                              ? "bg-emerald-500/10"
                              : isActive
                              ? "bg-white/5 border border-white/10"
                              : "opacity-30"
                          }`}
                        >
                          {isComplete ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                          ) : isActive ? (
                            <Loader2 className="h-5 w-5 text-white/60 animate-spin" />
                          ) : (
                            <div className="h-5 w-5 rounded-full border-2 border-white/20" />
                          )}
                          <span
                            className={`text-sm ${
                              isComplete
                                ? "text-emerald-400 font-medium"
                                : isActive
                                ? "text-white font-medium"
                                : "text-white/40"
                            }`}
                          >
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <Progress value={loadingProgress} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-3 text-center">
                    This typically takes 10-30 seconds
                  </p>
                </div>
              )}

              {/* Social Proof */}
              {!isPending && (
                <div className="flex items-center justify-center gap-3 animate-in fade-in duration-1000">
                  <div className="flex -space-x-2">
                    {[
                      { letter: "A", colors: "from-blue-400 to-blue-600" },
                      { letter: "B", colors: "from-purple-400 to-purple-600" },
                      { letter: "C", colors: "from-orange-400 to-orange-600" },
                      { letter: "D", colors: "from-pink-400 to-pink-600" },
                      { letter: "E", colors: "from-cyan-400 to-cyan-600" },
                    ].map((user, i) => (
                      <Avatar key={i} className="border-2 border-background">
                        <AvatarFallback
                          className={`bg-gradient-to-br ${user.colors} text-white text-xs font-medium`}
                        >
                          {user.letter}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Join the Beta Program & Get Verified
                  </p>
                </div>
              )}
            </section>

            {/* Features Section */}
            <FeaturesSection />

            {/* Live Demo Table */}
            <section className="py-20">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                  Recent Analyses
                </h2>
                <Card className="overflow-hidden bg-white/5 backdrop-blur-sm border-white/10">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                            Domain
                          </th>
                          <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                            Score
                          </th>
                          <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                            Time
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentAnalyses.map((analysis, index) => (
                          <tr
                            key={index}
                            className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors"
                          >
                            <td className="py-4 px-6 font-medium text-white">
                              {analysis.domain}
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`h-2.5 w-2.5 rounded-full shadow-lg ${
                                    analysis.score >= 90
                                      ? "bg-emerald-500 shadow-emerald-500/50"
                                      : analysis.score >= 70
                                      ? "bg-yellow-500 shadow-yellow-500/50"
                                      : "bg-red-500 shadow-red-500/50"
                                  }`}
                                />
                                <span className="font-semibold text-white">
                                  {analysis.score}
                                </span>
                                <span className="text-muted-foreground text-sm">
                                  /100
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-6 text-muted-foreground text-sm">
                              {analysis.time}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-20 pb-32 scroll-mt-8">
              <div className="text-center mb-12">
                <Badge
                  variant="secondary"
                  className="mb-4 bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                >
                  <Sparkles className="h-3 w-3 mr-1" />
                  Pricing
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                  Get Your Website Certified
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto">
                  One-time payment, lifetime benefits. Build trust with your
                  visitors.
                </p>
              </div>

              <div className="max-w-md mx-auto">
                <Card className="p-8 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border-white/10 relative overflow-hidden group">
                  {/* Animated border glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/10 to-emerald-500/0 animate-shimmer" />

                  <div className="absolute top-0 right-0 p-3">
                    <Badge className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-0 shadow-lg shadow-emerald-500/25">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Limited Time
                    </Badge>
                  </div>

                  <div className="mb-6 relative">
                    <h3 className="text-2xl font-bold mb-2 text-white">
                      Lifetime Deal
                    </h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                        $35
                      </span>
                      <span className="text-muted-foreground">one-time</span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-8 relative">
                    {pricingFeatures.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 group/item"
                      >
                        <div className="p-1 rounded-full bg-emerald-500/20 group-hover/item:bg-emerald-500/30 transition-colors">
                          <Check className="h-4 w-4 text-emerald-400" />
                        </div>
                        <span className="text-sm text-white/80">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    size="lg"
                    className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300 relative"
                  >
                    Get Lifetime Access
                  </Button>

                  <p className="text-xs text-muted-foreground text-center mt-4">
                    🔒 30-day money-back guarantee
                  </p>
                </Card>
              </div>
            </section>

            {/* Leaderboard Section */}
            <section id="leaderboard" className="py-20 relative scroll-mt-16">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent pointer-events-none" />

              <div className="text-center mb-12">
                <Badge
                  variant="secondary"
                  className="mb-4 bg-amber-500/10 border-amber-500/30 text-amber-400"
                >
                  <Trophy className="h-3 w-3 mr-1" />
                  Leaderboard
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                  Top Performing Websites
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto">
                  See who's leading the website race. Get certified to appear on
                  the leaderboard.
                </p>
              </div>

              <div className="max-w-4xl mx-auto space-y-3">
                {(leaderboard.length > 0
                  ? leaderboard
                  : recentAnalyses.slice(0, 5).map((s, i) => ({
                      id: String(i),
                      domain: s.domain,
                      current_score: s.score,
                      performance_score: s.score,
                      seo_score: s.score,
                      accessibility_score: s.score,
                      best_practices_score: s.score,
                      certified_date: new Date().toISOString(),
                    }))
                ).map((site, index) => (
                  <Link
                    key={site.id || site.domain}
                    href={`/certified/${site.domain}`}
                    className="block group"
                  >
                    <Card
                      className={`p-4 bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 transition-all ${
                        index < 3 ? "ring-1 ring-amber-500/30" : ""
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        {/* Rank */}
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold ${
                            index === 0
                              ? "bg-gradient-to-br from-amber-400 to-amber-600 text-black"
                              : index === 1
                              ? "bg-gradient-to-br from-gray-300 to-gray-400 text-black"
                              : index === 2
                              ? "bg-gradient-to-br from-amber-600 to-amber-800 text-white"
                              : "bg-white/10 text-white/60"
                          }`}
                        >
                          {getRankBadge(index + 1)}
                        </div>

                        {/* Favicon + Domain */}
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <img
                            src={`https://www.google.com/s2/favicons?domain=${site.domain}&sz=32`}
                            alt=""
                            className="w-8 h-8 rounded-lg bg-white/10"
                          />
                          <div className="min-w-0">
                            <div className="font-semibold text-white truncate group-hover:text-emerald-400 transition-colors">
                              {site.domain}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Certified{" "}
                              {new Date(site.certified_date).toLocaleDateString(
                                "en-US",
                                { month: "short", day: "numeric" }
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Category Scores */}
                        <div className="hidden md:flex items-center gap-4 text-xs">
                          <div className="text-center">
                            <div
                              className={`font-bold ${getScoreColor(
                                site.performance_score
                              )}`}
                            >
                              {site.performance_score}
                            </div>
                            <div className="text-muted-foreground">Perf</div>
                          </div>
                          <div className="text-center">
                            <div
                              className={`font-bold ${getScoreColor(
                                site.seo_score
                              )}`}
                            >
                              {site.seo_score}
                            </div>
                            <div className="text-muted-foreground">SEO</div>
                          </div>
                          <div className="text-center">
                            <div
                              className={`font-bold ${getScoreColor(
                                site.accessibility_score
                              )}`}
                            >
                              {site.accessibility_score}
                            </div>
                            <div className="text-muted-foreground">A11y</div>
                          </div>
                          <div className="text-center">
                            <div
                              className={`font-bold ${getScoreColor(
                                site.best_practices_score
                              )}`}
                            >
                              {site.best_practices_score}
                            </div>
                            <div className="text-muted-foreground">BP</div>
                          </div>
                        </div>

                        {/* Overall Score */}
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${
                              site.current_score >= 90
                                ? "bg-emerald-500/20 text-emerald-400"
                                : site.current_score >= 70
                                ? "bg-amber-500/20 text-amber-400"
                                : "bg-red-500/20 text-red-400"
                            }`}
                          >
                            {site.current_score}
                          </div>
                          <ExternalLink className="h-4 w-4 text-white/30 group-hover:text-white/60 transition-colors" />
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}

                <div className="text-center mt-6">
                  <Link
                    href="/leaderboard"
                    className="text-sm text-muted-foreground hover:text-white transition-colors inline-flex items-center gap-1"
                  >
                    View Full Leaderboard
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </section>

            {/* FAQ Section */}
            <section id="faq" className="py-20 scroll-mt-8">
              <div className="text-center mb-12">
                <Badge
                  variant="secondary"
                  className="mb-4 bg-purple-500/10 border-purple-500/30 text-purple-400"
                >
                  <HelpCircle className="h-3 w-3 mr-1" />
                  FAQ
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                  Frequently Asked Questions
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto">
                  Everything you need to know about VerifiedTrustScore.
                </p>
              </div>

              <div className="max-w-2xl mx-auto">
                <Accordion type="single" collapsible className="space-y-3">
                  {[
                    {
                      q: "What is VerifiedTrustScore?",
                      a: "VerifiedTrustScore is a website analysis tool that evaluates your site's performance, SEO, accessibility, security, and overall quality. We provide detailed reports and offer lifetime certification with a dofollow backlink.",
                    },
                    {
                      q: "How is the score calculated?",
                      a: "Your overall score is the average of four key metrics: Performance, SEO, Accessibility, and Best Practices. Each category is scored from 0-100 using Google's PageSpeed Insights API combined with our own HTML and security analysis.",
                    },
                    {
                      q: "What do I get with certification?",
                      a: "With the $35 lifetime certification, you get: a verified trust badge for your website, a public certification page with a dofollow backlink, daily automated monitoring, and a listing in our certified websites directory.",
                    },
                    {
                      q: "Is the backlink really dofollow?",
                      a: "Yes! Unlike many directories that use nofollow links, your certification page includes a dofollow link to your website, which can help improve your domain authority and SEO.",
                    },
                    {
                      q: "How often is my score updated?",
                      a: "Certified websites are automatically re-audited daily. Your public certification page always shows your current score and historical trends.",
                    },
                    {
                      q: "Can I analyze any website?",
                      a: "You can analyze any publicly accessible website for free. However, certification is only available for websites you own or have permission to certify.",
                    },
                    {
                      q: "What payment methods do you accept?",
                      a: "We accept all major credit cards, debit cards, and Apple Pay through our secure payment processor, Stripe.",
                    },
                    {
                      q: "Do you offer refunds?",
                      a: "Yes, we offer a 30-day money-back guarantee. If you're not satisfied with your certification, contact us for a full refund.",
                    },
                    {
                      q: "Are the free tools really free?",
                      a: "Yes! Our Open Graph Preview, Security Headers Checker, and Meta Tag Checker tools are 100% free to use with no login required.",
                    },
                    {
                      q: "How do I embed the badge on my website?",
                      a: "After certification, visit your badge page at /certified/[your-domain]/badge to get HTML and Markdown snippets you can copy and paste into your website.",
                    },
                  ].map((faq, index) => (
                    <AccordionItem
                      key={index}
                      value={`faq-${index}`}
                      className="bg-white/5 border border-white/10 rounded-xl px-6 data-[state=open]:bg-white/10"
                    >
                      <AccordionTrigger className="text-left text-white hover:no-underline py-4">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground pb-4">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </section>
          </>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
