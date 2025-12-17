import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, ExternalLink, Shield, Globe } from "lucide-react";
import { getCertifiedWebsites } from "@/app/actions/certifications";

function getScoreColor(score: number) {
  if (score >= 90)
    return "text-emerald-400 bg-emerald-500/20 border-emerald-500/30";
  if (score >= 70) return "text-amber-400 bg-amber-500/20 border-amber-500/30";
  if (score >= 50)
    return "text-orange-400 bg-orange-500/20 border-orange-500/30";
  return "text-red-400 bg-red-500/20 border-red-500/30";
}

export default async function CertifiedWebsitesPage() {
  const certifiedWebsites = await getCertifiedWebsites();

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
            href="/"
            className="text-sm text-white/60 hover:text-white transition-colors"
          >
            ← Back to Analyzer
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16">
        {/* Page Title */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/20 to-emerald-600/10 border border-emerald-500/30 mb-6">
            <Award className="h-4 w-4 text-emerald-400" />
            <span className="text-emerald-400 text-sm font-medium">
              Verified Directory
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            Certified Websites
          </h1>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            These websites have been verified by TrustScore for quality,
            security, and trustworthiness. Each website receives a dofollow
            backlink as part of their verification.
          </p>
        </div>

        {/* Directory Grid */}
        <div className="max-w-4xl mx-auto">
          {certifiedWebsites.length === 0 ? (
            <Card className="p-12 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-xl border-white/10 text-center">
              <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                No certified websites yet
              </h3>
              <p className="text-muted-foreground mb-6">
                Be the first to get your website certified!
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all"
              >
                <Award className="h-4 w-4" />
                Analyze & Get Verified
              </Link>
            </Card>
          ) : (
            <Card className="overflow-hidden bg-gradient-to-br from-white/5 to-transparent backdrop-blur-xl border-white/10">
              <div className="p-4 border-b border-white/10 bg-white/5">
                <div className="grid grid-cols-12 gap-4 text-sm font-medium text-white/60">
                  <div className="col-span-6 md:col-span-7">Website</div>
                  <div className="col-span-3 md:col-span-3 text-center">
                    Score
                  </div>
                  <div className="col-span-3 md:col-span-2 text-right">
                    Verified
                  </div>
                </div>
              </div>

              <div className="divide-y divide-white/5">
                {certifiedWebsites.map((site) => (
                  <Link
                    key={site.domain}
                    href={`/certified/${site.domain}`}
                    className="grid grid-cols-12 gap-4 p-4 hover:bg-white/5 transition-colors items-center group"
                  >
                    {/* Domain with favicon */}
                    <div className="col-span-6 md:col-span-7 flex items-center gap-3">
                      <img
                        src={site.favicon}
                        alt={`${site.domain} favicon`}
                        className="w-8 h-8 rounded-lg bg-white/10"
                      />
                      <div>
                        <span className="text-white font-medium group-hover:text-emerald-400 transition-colors flex items-center gap-1">
                          {site.domain}
                          <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-50 transition-opacity" />
                        </span>
                        <div className="flex items-center gap-1 text-xs text-emerald-400">
                          <Shield className="h-3 w-3" />
                          Verified
                        </div>
                      </div>
                    </div>

                    {/* Score Badge */}
                    <div className="col-span-3 md:col-span-3 flex justify-center">
                      <Badge
                        className={`text-lg font-bold px-3 py-1 ${getScoreColor(
                          site.current_score
                        )}`}
                      >
                        {site.current_score}
                      </Badge>
                    </div>

                    {/* Verified Date */}
                    <div className="col-span-3 md:col-span-2 text-right text-sm text-white/40">
                      {new Date(site.certified_date).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </Card>
          )}

          {/* Info Box */}
          <div className="mt-8 p-6 rounded-xl bg-gradient-to-r from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 text-center">
            <Globe className="h-8 w-8 text-emerald-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">
              Get Your Website Listed
            </h3>
            <p className="text-sm text-white/60 mb-4">
              Analyze your website and purchase a Trust Badge to be featured in
              this directory with a dofollow backlink.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all"
            >
              <Award className="h-4 w-4" />
              Analyze & Get Verified
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
