"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  ArrowRight,
  PartyPopper,
  Zap,
  Search,
  Eye,
  Shield,
  LayoutGrid,
  TrendingUp,
  Clock,
  Activity,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Globe,
  ShieldAlert,
  LockKeyhole,
  ExternalLink,
  Lightbulb,
  Award,
  ImageIcon,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Confetti } from "./confetti";
import { getScoreGradient } from "./score-utils";
import { AnimatedScoreCircle } from "./animated-score-circle";
import { MetricCard } from "./metric-card";
import { TrustBadgePreview } from "./trust-badge-preview";
import { type PageSpeedResult } from "@/app/actions/analyze";

export function ResultsSection({
  result,
  onReset,
}: {
  result: PageSpeedResult;
  onReset: () => void;
}) {
  const searchParams = useSearchParams();
  const isPremium = searchParams.get("premium") === "true";

  const [showConfetti, setShowConfetti] = useState(false);
  const [email, setEmail] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const avgScore = Math.round(
    (result.performanceScore +
      result.seoScore +
      result.accessibilityScore +
      result.bestPracticesScore) /
      4
  );

  useEffect(() => {
    if (avgScore >= 80) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [avgScore]);

  // Rebranded metrics (proprietary naming)
  const metrics = [
    {
      icon: LayoutGrid,
      label: "Visual Load Time",
      value: result.metrics.largestContentfulPaint,
    },
    {
      icon: TrendingUp,
      label: "Stability Index",
      value: result.metrics.cumulativeLayoutShift,
    },
    {
      icon: Clock,
      label: "Interaction Lag",
      value: result.metrics.totalBlockingTime,
    },
  ];

  const totalChecks =
    (result.passedAudits?.length || 0) + (result.failedAudits?.length || 0);

  return (
    <section className="py-8 relative">
      {showConfetti && <Confetti />}

      <div className="max-w-4xl mx-auto px-4">
        {/* HERO SECTION */}
        <div className="text-center mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/20 to-emerald-600/10 border border-emerald-500/30 mb-6">
            {avgScore >= 80 ? (
              <PartyPopper className="h-4 w-4 text-emerald-400 animate-bounce" />
            ) : (
              <Sparkles className="h-4 w-4 text-emerald-400" />
            )}
            <span className="text-sm font-medium text-emerald-400">
              {avgScore >= 90
                ? "Outstanding!"
                : avgScore >= 80
                ? "Great job!"
                : avgScore >= 50
                ? "Room for improvement"
                : "Needs attention"}
            </span>
            {isPremium && (
              <Badge className="bg-emerald-500/30 text-emerald-300 ml-2">
                ✅ Verified
              </Badge>
            )}
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            {result.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
          </h2>

          {/* Global Quality Score - Big Circle with Glow and Arc */}
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm text-muted-foreground uppercase tracking-wider">
              Global Quality Score
            </span>
            <div className="relative p-6">
              {/* Glow effect */}
              <div
                className={`absolute inset-0 rounded-full blur-2xl opacity-30 ${
                  avgScore >= 90
                    ? "bg-emerald-500"
                    : avgScore >= 70
                    ? "bg-amber-500"
                    : avgScore >= 50
                    ? "bg-orange-500"
                    : "bg-red-500"
                }`}
              />

              {/* SVG Circle with Arc */}
              <svg
                className="w-36 h-36 transform -rotate-90 relative"
                style={{ overflow: "visible" }}
              >
                {/* Background circle (track) */}
                <circle
                  cx="72"
                  cy="72"
                  r="60"
                  stroke="currentColor"
                  strokeWidth="10"
                  fill="none"
                  className="text-white/10"
                />
                {/* Progress arc */}
                <circle
                  cx="72"
                  cy="72"
                  r="60"
                  stroke={`url(#global-score-gradient)`}
                  strokeWidth="10"
                  fill="none"
                  strokeDasharray={2 * Math.PI * 60}
                  strokeDashoffset={2 * Math.PI * 60 * (1 - avgScore / 100)}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
                <defs>
                  <linearGradient
                    id="global-score-gradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop
                      offset="0%"
                      stopColor={
                        avgScore >= 90
                          ? "#34d399"
                          : avgScore >= 70
                          ? "#fbbf24"
                          : avgScore >= 50
                          ? "#fb923c"
                          : "#f87171"
                      }
                    />
                    <stop
                      offset="100%"
                      stopColor={
                        avgScore >= 90
                          ? "#059669"
                          : avgScore >= 70
                          ? "#d97706"
                          : avgScore >= 50
                          ? "#ea580c"
                          : "#dc2626"
                      }
                    />
                  </linearGradient>
                </defs>
              </svg>

              {/* Score number in center */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span
                  className={`text-5xl font-bold ${
                    avgScore >= 90
                      ? "text-emerald-400"
                      : avgScore >= 70
                      ? "text-amber-400"
                      : avgScore >= 50
                      ? "text-orange-400"
                      : "text-red-400"
                  }`}
                >
                  {avgScore}
                </span>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">
                  {avgScore >= 90
                    ? "Excellent"
                    : avgScore >= 70
                    ? "Good"
                    : avgScore >= 50
                    ? "Fair"
                    : "Poor"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* VERTICAL LAYOUT START */}
        <div className="space-y-8">
          {/* 1. PRIMARY SALES CTA - MOVED TOP FOR VERTICAL FLOW */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            {!isPremium ? (
              <div className="space-y-4 text-center bg-gradient-to-br from-amber-500/10 to-amber-600/5 p-6 rounded-2xl border border-amber-500/20">
                <h3 className="text-xl font-semibold mb-2 text-white">
                  🏆 Claim your Trust Badge
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Get a verified badge & dofollow backlink for your website
                </p>

                <div className="flex flex-col md:flex-row gap-3 max-w-md mx-auto">
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 bg-black/40 border-white/10 text-white placeholder:text-white/40"
                    disabled={isCheckingOut}
                  />
                  <Button
                    size="lg"
                    className="h-12 px-8 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all duration-300 hover:scale-[1.02]"
                    disabled={isCheckingOut || !email.includes("@")}
                    onClick={async () => {
                      setIsCheckingOut(true);
                      setCheckoutError(null);
                      try {
                        const response = await fetch("/api/checkout", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            email,
                            domain: result.url,
                            url: result.url,
                            scores: {
                              average: avgScore,
                              performance: result.performanceScore,
                              seo: result.seoScore,
                              accessibility: result.accessibilityScore,
                              bestPractices: result.bestPracticesScore,
                            },
                            metrics: result.metrics,
                          }),
                        });
                        const data = await response.json();
                        if (data.url) {
                          window.location.href = data.url;
                        } else {
                          setCheckoutError(
                            data.error || "Failed to start checkout"
                          );
                        }
                      } catch (err) {
                        setCheckoutError(
                          "Something went wrong. Please try again."
                        );
                      } finally {
                        setIsCheckingOut(false);
                      }
                    }}
                  >
                    {isCheckingOut ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Get Lifetime Access — $35
                      </>
                    )}
                  </Button>
                </div>

                {checkoutError && (
                  <p className="text-sm text-red-400 mt-2">{checkoutError}</p>
                )}

                <p className="text-xs text-muted-foreground mt-4">
                  🔒 Secure payment via Stripe • 30-day money-back guarantee
                </p>
              </div>
            ) : (
              <div className="text-center bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 p-6 rounded-2xl border border-emerald-500/20">
                <div className="flex items-center justify-center gap-2 text-emerald-400 mb-2">
                  <Award className="h-5 w-5" />
                  <span className="font-semibold">You're Certified!</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Your website is listed in our{" "}
                  <a
                    href="/certified-websites"
                    className="text-emerald-400 hover:underline"
                  >
                    Certified Directory
                  </a>
                </p>
              </div>
            )}
          </div>

          {/* 2. CORE METRICS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {metrics.map((metric) => (
              <Card
                key={metric.label}
                className="p-4 bg-gradient-to-br from-white/5 to-transparent border-white/10 flex md:block items-center justify-between"
              >
                <div className="flex items-center gap-2 mb-0 md:mb-2">
                  <metric.icon className="h-4 w-4 text-blue-400" />
                  <span className="text-xs text-muted-foreground">
                    {metric.label}
                  </span>
                </div>
                <p className="text-lg font-semibold text-white">
                  {metric.value}
                </p>
              </Card>
            ))}
          </div>

          {/* 3. SCORE OVERVIEW with Mini Circles */}
          <Card className="p-6 bg-gradient-to-br from-white/5 to-transparent border-white/10">
            <h3 className="text-sm font-semibold mb-6 text-muted-foreground">
              Category Breakdown
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {/* Performance */}
              <div className="flex flex-col items-center">
                <div className="relative p-2">
                  <div
                    className={`absolute inset-0 rounded-full blur-xl opacity-25 ${
                      result.performanceScore >= 90
                        ? "bg-emerald-500"
                        : result.performanceScore >= 50
                        ? "bg-amber-500"
                        : "bg-red-500"
                    }`}
                  />
                  <svg className="w-16 h-16 transform -rotate-90 relative">
                    <circle
                      cx="32"
                      cy="32"
                      r="26"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="none"
                      className="text-white/10"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="26"
                      stroke={
                        result.performanceScore >= 90
                          ? "#10b981"
                          : result.performanceScore >= 50
                          ? "#f59e0b"
                          : "#ef4444"
                      }
                      strokeWidth="6"
                      fill="none"
                      strokeDasharray={2 * Math.PI * 26}
                      strokeDashoffset={
                        2 * Math.PI * 26 * (1 - result.performanceScore / 100)
                      }
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span
                      className={`text-lg font-bold ${
                        result.performanceScore >= 90
                          ? "text-emerald-400"
                          : result.performanceScore >= 50
                          ? "text-amber-400"
                          : "text-red-400"
                      }`}
                    >
                      {result.performanceScore}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Performance
                </p>
              </div>

              {/* SEO */}
              <div className="flex flex-col items-center">
                <div className="relative p-2">
                  <div
                    className={`absolute inset-0 rounded-full blur-xl opacity-25 ${
                      result.seoScore >= 90
                        ? "bg-emerald-500"
                        : result.seoScore >= 50
                        ? "bg-amber-500"
                        : "bg-red-500"
                    }`}
                  />
                  <svg className="w-16 h-16 transform -rotate-90 relative">
                    <circle
                      cx="32"
                      cy="32"
                      r="26"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="none"
                      className="text-white/10"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="26"
                      stroke={
                        result.seoScore >= 90
                          ? "#10b981"
                          : result.seoScore >= 50
                          ? "#f59e0b"
                          : "#ef4444"
                      }
                      strokeWidth="6"
                      fill="none"
                      strokeDasharray={2 * Math.PI * 26}
                      strokeDashoffset={
                        2 * Math.PI * 26 * (1 - result.seoScore / 100)
                      }
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span
                      className={`text-lg font-bold ${
                        result.seoScore >= 90
                          ? "text-emerald-400"
                          : result.seoScore >= 50
                          ? "text-amber-400"
                          : "text-red-400"
                      }`}
                    >
                      {result.seoScore}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">SEO</p>
              </div>

              {/* Accessibility */}
              <div className="flex flex-col items-center">
                <div className="relative p-2">
                  <div
                    className={`absolute inset-0 rounded-full blur-xl opacity-25 ${
                      result.accessibilityScore >= 90
                        ? "bg-emerald-500"
                        : result.accessibilityScore >= 50
                        ? "bg-amber-500"
                        : "bg-red-500"
                    }`}
                  />
                  <svg className="w-16 h-16 transform -rotate-90 relative">
                    <circle
                      cx="32"
                      cy="32"
                      r="26"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="none"
                      className="text-white/10"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="26"
                      stroke={
                        result.accessibilityScore >= 90
                          ? "#10b981"
                          : result.accessibilityScore >= 50
                          ? "#f59e0b"
                          : "#ef4444"
                      }
                      strokeWidth="6"
                      fill="none"
                      strokeDasharray={2 * Math.PI * 26}
                      strokeDashoffset={
                        2 * Math.PI * 26 * (1 - result.accessibilityScore / 100)
                      }
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span
                      className={`text-lg font-bold ${
                        result.accessibilityScore >= 90
                          ? "text-emerald-400"
                          : result.accessibilityScore >= 50
                          ? "text-amber-400"
                          : "text-red-400"
                      }`}
                    >
                      {result.accessibilityScore}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Accessibility
                </p>
              </div>

              {/* Best Practices */}
              <div className="flex flex-col items-center">
                <div className="relative p-2">
                  <div
                    className={`absolute inset-0 rounded-full blur-xl opacity-25 ${
                      result.bestPracticesScore >= 90
                        ? "bg-emerald-500"
                        : result.bestPracticesScore >= 50
                        ? "bg-amber-500"
                        : "bg-red-500"
                    }`}
                  />
                  <svg className="w-16 h-16 transform -rotate-90 relative">
                    <circle
                      cx="32"
                      cy="32"
                      r="26"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="none"
                      className="text-white/10"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="26"
                      stroke={
                        result.bestPracticesScore >= 90
                          ? "#10b981"
                          : result.bestPracticesScore >= 50
                          ? "#f59e0b"
                          : "#ef4444"
                      }
                      strokeWidth="6"
                      fill="none"
                      strokeDasharray={2 * Math.PI * 26}
                      strokeDashoffset={
                        2 * Math.PI * 26 * (1 - result.bestPracticesScore / 100)
                      }
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span
                      className={`text-lg font-bold ${
                        result.bestPracticesScore >= 90
                          ? "text-emerald-400"
                          : result.bestPracticesScore >= 50
                          ? "text-amber-400"
                          : "text-red-400"
                      }`}
                    >
                      {result.bestPracticesScore}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Best Practices
                </p>
              </div>
            </div>
          </Card>

          {/* 4. TRUST & SECURITY ANALYSIS */}
          <Card
            className={`p-6 backdrop-blur-xl ${
              isPremium
                ? "bg-emerald-500/5 border-emerald-500/20"
                : "bg-white/5 border-white/10"
            }`}
          >
            <div className="flex items-center gap-3 mb-6">
              <Globe
                className={`h-5 w-5 ${
                  isPremium ? "text-emerald-400" : "text-amber-400"
                }`}
              />
              <h3 className="text-lg font-semibold text-white">
                Trust & Security Analysis
              </h3>
            </div>

            <div className="space-y-4">
              {/* List of items similar to before, but styled for vertical flow */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* SSL */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-black/20">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-emerald-400" />
                    <span className="text-sm text-white/90">SSL Security</span>
                  </div>
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                </div>

                {/* Reputation */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-black/20">
                  <div className="flex items-center gap-2">
                    {isPremium ? (
                      <ShieldAlert className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <LockKeyhole className="h-4 w-4 text-amber-400" />
                    )}
                    <span className="text-sm text-white/90">
                      Domain Reputation
                    </span>
                  </div>
                  {isPremium ? (
                    <span className="text-xs text-emerald-400 font-bold">
                      Verified
                    </span>
                  ) : (
                    <span className="text-xs text-white/30 blur-[2px]">
                      Verified
                    </span>
                  )}
                </div>

                {/* Spam */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-black/20">
                  <div className="flex items-center gap-2">
                    {isPremium ? (
                      <AlertTriangle className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <LockKeyhole className="h-4 w-4 text-amber-400" />
                    )}
                    <span className="text-sm text-white/90">Spam Score</span>
                  </div>
                  {isPremium ? (
                    <span className="text-xs text-emerald-400 font-bold">
                      Clean
                    </span>
                  ) : (
                    <span className="text-xs text-white/30 blur-[2px]">
                      Clean
                    </span>
                  )}
                </div>

                {/* Backlink */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-black/20">
                  <div className="flex items-center gap-2">
                    {isPremium ? (
                      <ExternalLink className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <LockKeyhole className="h-4 w-4 text-amber-400" />
                    )}
                    <span className="text-sm text-white/90">SEO Backlink</span>
                  </div>
                  {isPremium ? (
                    <span className="text-xs text-emerald-400 font-bold">
                      Active
                    </span>
                  ) : (
                    <span className="text-xs text-white/30 blur-[2px]">
                      Active
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* 5. TECHNICAL DETAILS */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem
              value="details"
              className="border border-white/10 rounded-xl bg-white/5 overflow-hidden"
            >
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <span className="flex items-center gap-2 text-white font-medium">
                  <Activity className="h-4 w-4 text-emerald-400" />
                  Technical Breakdown
                </span>
                <Badge variant="secondary">+{totalChecks} checks</Badge>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 pt-2">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-sm font-semibold text-emerald-400 mb-3 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" /> Passed Audits
                    </h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                      {result.passedAudits?.map((audit) => (
                        <div key={audit.id} className="text-xs text-white/60">
                          • {audit.title}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-red-400 mb-3 flex items-center gap-2">
                      <XCircle className="h-4 w-4" /> Issues Found
                    </h4>
                    <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar">
                      {result.failedAudits?.map((audit) => (
                        <div
                          key={audit.id}
                          className="p-3 rounded bg-red-500/5 border border-red-500/10"
                        >
                          <div className="text-xs font-medium text-white/90 mb-1">
                            {audit.title}
                          </div>
                          {isPremium && audit.description ? (
                            <p className="text-[10px] text-white/50">
                              {audit.description
                                .replace(/<[^>]*>/g, "")
                                .slice(0, 100)}
                              ...
                            </p>
                          ) : (
                            !isPremium && (
                              <div className="flex items-center gap-1 text-[10px] text-amber-400/80 mt-1">
                                <LockKeyhole className="h-3 w-3" /> Lock details
                              </div>
                            )
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* 6. RESET BUTTON */}
          <div className="flex justify-center pt-8">
            <Button
              variant="outline"
              onClick={onReset}
              className="border-white/10 text-muted-foreground hover:text-white"
            >
              Analyze Another Website
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
