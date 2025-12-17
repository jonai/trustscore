import { notFound } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Award,
  ExternalLink,
  Shield,
  ArrowLeft,
  Calendar,
  TrendingUp,
} from "lucide-react";
import {
  getCertificationByDomain,
  getAuditHistory,
} from "@/app/actions/certifications";
import { ScoreChart } from "./score-chart";

interface PageProps {
  params: Promise<{ domain: string }>;
}

function getScoreColor(score: number) {
  if (score >= 90) return "text-emerald-400";
  if (score >= 70) return "text-amber-400";
  if (score >= 50) return "text-orange-400";
  return "text-red-400";
}

function getScoreBg(score: number) {
  if (score >= 90) return "bg-emerald-500";
  if (score >= 70) return "bg-amber-500";
  if (score >= 50) return "bg-orange-500";
  return "bg-red-500";
}

export default async function CertifiedWebsitePage({ params }: PageProps) {
  const { domain } = await params;
  const decodedDomain = decodeURIComponent(domain);

  const certification = await getCertificationByDomain(decodedDomain);

  if (!certification) {
    notFound();
  }

  const auditHistory = await getAuditHistory(certification.id);

  const avgScore = certification.current_score;

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold">
            <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              TrustScore
            </span>
          </Link>
          <Link
            href="/certified-websites"
            className="text-sm text-white/60 hover:text-white transition-colors flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            All Certified Websites
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/20 to-emerald-600/10 border border-emerald-500/30 mb-6">
            <Award className="h-4 w-4 text-emerald-400" />
            <span className="text-emerald-400 text-sm font-medium">
              Certified Website
            </span>
          </div>

          <div className="flex items-center justify-center gap-3 mb-4">
            <img
              src={`https://www.google.com/s2/favicons?domain=${certification.domain}&sz=64`}
              alt={`${certification.domain} favicon`}
              className="w-12 h-12 rounded-xl bg-white/10"
            />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              {certification.domain}
            </h1>
          </div>

          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mb-8">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Certified{" "}
              {new Date(certification.certified_date).toLocaleDateString(
                "en-US",
                { month: "short", day: "numeric", year: "numeric" }
              )}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              Last audit{" "}
              {new Date(certification.last_audit_date).toLocaleDateString(
                "en-US",
                { month: "short", day: "numeric" }
              )}
            </span>
          </div>

          {/* Dofollow Link Button */}
          <a
            href={`https://${certification.domain}`}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-lg shadow-emerald-500/25"
          >
            Visit Website
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>

        {/* Score Section */}
        <div className="max-w-4xl mx-auto">
          {/* Main Score Circle */}
          <div className="flex flex-col items-center gap-4 mb-12">
            <div className="relative p-6">
              {/* Glow effect */}
              <div
                className={`absolute inset-0 rounded-full blur-2xl opacity-30 ${getScoreBg(
                  avgScore
                )}`}
              />

              {/* SVG Circle with Arc */}
              <svg
                className="w-40 h-40 transform -rotate-90 relative"
                style={{ overflow: "visible" }}
              >
                <circle
                  cx="80"
                  cy="80"
                  r="68"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  className="text-white/10"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="68"
                  stroke={
                    avgScore >= 90
                      ? "#10b981"
                      : avgScore >= 70
                      ? "#f59e0b"
                      : avgScore >= 50
                      ? "#f97316"
                      : "#ef4444"
                  }
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={2 * Math.PI * 68}
                  strokeDashoffset={2 * Math.PI * 68 * (1 - avgScore / 100)}
                  strokeLinecap="round"
                />
              </svg>

              {/* Score number in center */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span
                  className={`text-6xl font-bold ${getScoreColor(avgScore)}`}
                >
                  {avgScore}
                </span>
                <span className="text-sm text-muted-foreground uppercase tracking-wider">
                  Overall
                </span>
              </div>
            </div>
          </div>

          {/* Category Breakdown */}
          <Card className="p-6 bg-gradient-to-br from-white/5 to-transparent border-white/10 mb-8">
            <h3 className="text-sm font-semibold mb-6 text-muted-foreground">
              Category Breakdown
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                {
                  label: "Performance",
                  score: certification.performance_score,
                },
                { label: "SEO", score: certification.seo_score },
                {
                  label: "Accessibility",
                  score: certification.accessibility_score,
                },
                {
                  label: "Best Practices",
                  score: certification.best_practices_score,
                },
              ].map((cat) => (
                <div key={cat.label} className="flex flex-col items-center">
                  <div className="relative p-2">
                    <div
                      className={`absolute inset-0 rounded-full blur-xl opacity-25 ${getScoreBg(
                        cat.score
                      )}`}
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
                          cat.score >= 90
                            ? "#10b981"
                            : cat.score >= 50
                            ? "#f59e0b"
                            : "#ef4444"
                        }
                        strokeWidth="6"
                        fill="none"
                        strokeDasharray={2 * Math.PI * 26}
                        strokeDashoffset={
                          2 * Math.PI * 26 * (1 - cat.score / 100)
                        }
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span
                        className={`text-lg font-bold ${getScoreColor(
                          cat.score
                        )}`}
                      >
                        {cat.score}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {cat.label}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          {/* Historical Chart */}
          {auditHistory.length > 1 && (
            <Card className="p-6 bg-gradient-to-br from-white/5 to-transparent border-white/10 mb-8">
              <h3 className="text-sm font-semibold mb-4 text-muted-foreground">
                Score History
              </h3>
              <ScoreChart data={auditHistory} />
            </Card>
          )}

          {/* CTA for others */}
          <div className="mt-12 p-8 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 text-center">
            <Award className="h-10 w-10 text-emerald-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">
              Get Your Website Certified
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Analyze your website and claim your verified badge with a dofollow
              backlink for just $35 (one-time).
            </p>
            <Link href="/">
              <Button
                size="lg"
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold shadow-lg shadow-emerald-500/25"
              >
                Analyze My Website
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} TrustScore. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
