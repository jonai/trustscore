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
} from "lucide-react";
import { analyzeWebsite, type PageSpeedResult } from "./actions/analyze";
import { ResultsSection } from "@/components/report/results-section";
import { Footer } from "@/components/footer";

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
      domain: "stripe.com",
      score: 98,
      time: "2m ago",
      color: "bg-emerald-500",
    },
    {
      domain: "vercel.com",
      score: 96,
      time: "5m ago",
      color: "bg-emerald-500",
    },
    {
      domain: "linear.app",
      score: 94,
      time: "8m ago",
      color: "bg-emerald-500",
    },
    {
      domain: "github.com",
      score: 91,
      time: "12m ago",
      color: "bg-emerald-500",
    },
    { domain: "notion.so", score: 87, time: "15m ago", color: "bg-yellow-500" },
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

  const pricingFeatures = [
    "Unlimited website analyses",
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
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div
              className="flex items-center gap-2 cursor-pointer group"
              onClick={handleReset}
            >
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 group-hover:from-emerald-500/30 group-hover:to-emerald-600/20 transition-colors">
                <Award className="h-5 w-5 text-emerald-500" />
              </div>
              <span className="text-lg font-semibold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                TrustScore
              </span>
            </div>
            <nav className="hidden md:flex items-center gap-4 text-sm">
              <a
                href="#pricing"
                className="text-muted-foreground hover:text-white transition-colors flex items-center gap-1"
              >
                <Sparkles className="h-4 w-4" />
                Pricing
              </a>
              <a
                href="#leaderboard"
                className="text-muted-foreground hover:text-white transition-colors flex items-center gap-1"
              >
                <Trophy className="h-4 w-4" />
                Leaderboard
              </a>
              <a
                href="#faq"
                className="text-muted-foreground hover:text-white transition-colors flex items-center gap-1"
              >
                <HelpCircle className="h-4 w-4" />
                FAQ
              </a>
              <Link
                href="/tools"
                className="text-muted-foreground hover:text-white transition-colors flex items-center gap-1"
              >
                <Wrench className="h-4 w-4" />
                Tools
              </Link>
            </nav>
          </div>
          <Button variant="ghost" size="sm" className="hover:bg-white/5">
            Sign In
          </Button>
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
                <span className="text-emerald-400 animate-pulse">●</span>
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
                    className="h-14 px-8 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300"
                    onClick={handleAnalyze}
                    disabled={isPending || !website.trim()}
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        Analyze
                        <ArrowRight className="ml-2 h-5 w-5" />
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

              {/* Loading State */}
              {isPending && (
                <div className="max-w-2xl mx-auto mb-8 p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 animate-in fade-in slide-in-from-bottom-4">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full border-2 border-emerald-500/30 border-t-emerald-500 animate-spin" />
                      <Search className="absolute inset-0 m-auto h-5 w-5 text-emerald-400" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-white">
                        Analyzing {website}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Running PageSpeed & SEO checks...
                      </p>
                    </div>
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
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Avatar
                        key={i}
                        className="border-2 border-background ring-2 ring-emerald-500/20"
                      >
                        <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-emerald-600 text-white text-xs font-medium">
                          {String.fromCharCode(64 + i)}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Trusted by{" "}
                    <span className="text-foreground font-semibold">
                      500+ founders
                    </span>
                  </p>
                </div>
              )}
            </section>

            {/* Features Grid */}
            <section className="py-20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                {features.map((feature, index) => (
                  <Card
                    key={index}
                    className="group p-6 bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/5"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 group-hover:from-emerald-500/30 group-hover:to-emerald-600/20 transition-colors">
                        <feature.icon className="h-6 w-6 text-emerald-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2 text-white">
                          {feature.title}
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>

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
                                  className={`h-2.5 w-2.5 rounded-full ${
                                    analysis.color
                                  } shadow-lg ${
                                    analysis.score >= 90
                                      ? "shadow-emerald-500/50"
                                      : "shadow-yellow-500/50"
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
            <section id="pricing" className="py-20 pb-32 scroll-mt-20">
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
            <section id="leaderboard" className="py-20 relative scroll-mt-20">
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

              <div className="max-w-2xl mx-auto space-y-3">
                {recentAnalyses.slice(0, 5).map((site, index) => (
                  <Link
                    key={site.domain}
                    href={`/certified/${site.domain}`}
                    className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group"
                  >
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${
                        index === 0
                          ? "bg-gradient-to-br from-amber-400 to-amber-600 text-black"
                          : index === 1
                          ? "bg-gradient-to-br from-gray-300 to-gray-400 text-black"
                          : index === 2
                          ? "bg-gradient-to-br from-amber-600 to-amber-800 text-white"
                          : "bg-white/10 text-white/60"
                      }`}
                    >
                      {index < 3 ? ["🥇", "🥈", "🥉"][index] : `#${index + 1}`}
                    </div>
                    <img
                      src={`https://www.google.com/s2/favicons?domain=${site.domain}&sz=32`}
                      alt=""
                      className="w-8 h-8 rounded bg-white/10"
                    />
                    <span className="flex-1 font-medium text-white group-hover:text-emerald-400 transition-colors">
                      {site.domain}
                    </span>
                    <span
                      className={`font-bold ${
                        site.score >= 90
                          ? "text-emerald-400"
                          : site.score >= 70
                          ? "text-amber-400"
                          : "text-red-400"
                      }`}
                    >
                      {site.score}
                    </span>
                  </Link>
                ))}
              </div>
            </section>

            {/* FAQ Section */}
            <section id="faq" className="py-20 scroll-mt-20">
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
                  Everything you need to know about TrustScore.
                </p>
              </div>

              <div className="max-w-2xl mx-auto">
                <Accordion type="single" collapsible className="space-y-3">
                  {[
                    {
                      q: "What is TrustScore?",
                      a: "TrustScore analyzes your website's performance, SEO, accessibility, and security. Get a detailed report and claim your verified badge with a dofollow backlink.",
                    },
                    {
                      q: "What do I get with the $35 certification?",
                      a: "You get a lifetime verified badge, a public certification page with a dofollow backlink, daily automated monitoring, and a listing in our certified directory.",
                    },
                    {
                      q: "Is the backlink really dofollow?",
                      a: "Yes! Unlike most directories that use nofollow, your certification page includes a genuine dofollow link to boost your domain authority.",
                    },
                    {
                      q: "How often is my score updated?",
                      a: "Certified websites are automatically re-audited daily. Your public page always shows your current score.",
                    },
                    {
                      q: "Do you offer refunds?",
                      a: "Yes! We offer a 30-day money-back guarantee. Not satisfied? Contact us for a full refund.",
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
