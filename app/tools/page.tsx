import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Globe,
  Search,
  FileCode,
  Lock,
  Heading,
  ArrowRight,
  Wrench,
} from "lucide-react";

const tools = [
  {
    id: "og-preview",
    icon: Globe,
    title: "Open Graph Preview",
    description:
      "Test how your links appear on social media. Validate Open Graph tags, Twitter Cards, and meta descriptions.",
    color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    iconColor: "text-blue-400",
  },
  {
    id: "security-headers",
    icon: Lock,
    title: "Security Headers",
    description:
      "Check HTTPS, HSTS, CSP, X-Frame-Options, and other security headers. Catch missing headers before they become vulnerabilities.",
    color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    iconColor: "text-emerald-400",
  },
  {
    id: "meta-checker",
    icon: Search,
    title: "Meta Tag Checker",
    description:
      "Audit titles, meta descriptions, canonical URLs, lang tags, and viewport settings. Perfect your SERP presence.",
    color: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    iconColor: "text-purple-400",
  },
  {
    id: "heading-structure",
    icon: Heading,
    title: "Heading Structure",
    description:
      "Visualize H1-H6 hierarchy, find duplicate headings, and catch level jumps. Essential for accessibility and SEO.",
    color: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    iconColor: "text-amber-400",
  },
];

export default function ToolsPage() {
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
              VerifiedTrustScore
            </span>
          </Link>
          <Link
            href="/"
            className="text-sm text-white/60 hover:text-white transition-colors"
          >
            Full Analysis
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-purple-600/10 border border-purple-500/30 mb-6">
            <Wrench className="h-4 w-4 text-purple-400" />
            <span className="text-purple-400 text-sm font-medium">
              Free SEO Tools
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            Professional SEO Tools
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-emerald-400">
            100% Free
          </h2>

          <p className="text-muted-foreground max-w-2xl mx-auto">
            Test Open Graph tags, security headers, meta tags, and heading
            structure. All tools work instantly—no login required.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {tools.map((tool) => (
            <Link key={tool.id} href={`/tools/${tool.id}`} className="group">
              <Card className="p-6 h-full bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 transition-all">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${tool.color}`}>
                    <tool.icon className={`h-6 w-6 ${tool.iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-emerald-400 transition-colors flex items-center gap-2">
                      {tool.title}
                      <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {tool.description}
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* Full Analysis CTA */}
        <div className="max-w-4xl mx-auto p-8 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 text-center">
          <FileCode className="h-10 w-10 text-emerald-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">
            Check everything at once
          </h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Launch a full analysis in under 30 seconds. Get performance, SEO,
            and trust scores with actionable fixes—all in one dashboard.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-lg shadow-emerald-500/25"
          >
            Start Full Website Analysis
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} VerifiedTrustScore. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
