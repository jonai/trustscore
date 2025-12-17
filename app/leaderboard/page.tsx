import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Trophy, TrendingUp, Award, ExternalLink } from "lucide-react";
import { createServerClient } from "@/lib/supabase";

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

function getScoreBg(score: number) {
  if (score >= 90) return "bg-emerald-500";
  if (score >= 70) return "bg-amber-500";
  if (score >= 50) return "bg-orange-500";
  return "bg-red-500";
}

function getRankBadge(rank: number) {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return `#${rank}`;
}

export default async function LeaderboardPage() {
  const supabase = createServerClient();

  const { data: websites } = await supabase
    .from("certified_websites")
    .select(
      "id, domain, current_score, performance_score, seo_score, accessibility_score, best_practices_score, certified_date"
    )
    .eq("is_active", true)
    .order("current_score", { ascending: false })
    .limit(50)
    .returns<CertifiedWebsite[]>();

  const certifiedWebsites = websites || [];

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
            className="text-sm text-white/60 hover:text-white transition-colors"
          >
            All Certified Websites
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/20 to-amber-600/10 border border-amber-500/30 mb-6">
            <Trophy className="h-4 w-4 text-amber-400" />
            <span className="text-amber-400 text-sm font-medium">
              Website Leaderboard
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            Top Performing Websites
          </h1>

          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover the highest scoring certified websites. Rankings are based
            on overall trust score combining performance, SEO, accessibility,
            and best practices.
          </p>
        </div>

        {/* Leaderboard */}
        <div className="max-w-4xl mx-auto">
          {certifiedWebsites.length === 0 ? (
            <Card className="p-12 text-center bg-white/5 border-white/10">
              <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                No certified websites yet
              </h3>
              <p className="text-muted-foreground mb-6">
                Be the first to get your website certified and appear on the
                leaderboard!
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all"
              >
                Analyze Your Website
              </Link>
            </Card>
          ) : (
            <div className="space-y-3">
              {certifiedWebsites.map((site, index) => (
                <Link
                  key={site.id}
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
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="max-w-4xl mx-auto mt-12 p-8 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 text-center">
          <TrendingUp className="h-10 w-10 text-emerald-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">
            Want to rank on the leaderboard?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Get your website certified and compete for the top spot. Higher
            scores = better visibility.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-lg shadow-emerald-500/25"
          >
            <Award className="h-4 w-4" />
            Get Certified Now
          </Link>
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
