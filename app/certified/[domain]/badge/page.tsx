"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Code, Copy, Check, ExternalLink, Award } from "lucide-react";

interface BadgePageProps {
  params: Promise<{ domain: string }>;
}

export default function BadgePage({ params }: BadgePageProps) {
  const [copied, setCopied] = useState<string | null>(null);
  const [domain, setDomain] = useState<string>("");

  // Unwrap params
  params.then((p) => setDomain(decodeURIComponent(p.domain)));

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

  const embedCodes = {
    html: `<a href="${baseUrl}/certified/${domain}" target="_blank" rel="noopener">
  <img src="${baseUrl}/api/badge?domain=${domain}" alt="TrustScore Badge" />
</a>`,
    markdown: `[![TrustScore Badge](${baseUrl}/api/badge?domain=${domain})](${baseUrl}/certified/${domain})`,
  };

  const copyToClipboard = (code: string, type: string) => {
    navigator.clipboard.writeText(code);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  if (!domain) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black flex items-center justify-center">
        <div className="animate-pulse text-white">Loading...</div>
      </main>
    );
  }

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
            href={`/certified/${domain}`}
            className="text-sm text-white/60 hover:text-white transition-colors flex items-center gap-1"
          >
            View Certificate
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-3xl">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/20 to-emerald-600/10 border border-emerald-500/30 mb-6">
            <Code className="h-4 w-4 text-emerald-400" />
            <span className="text-emerald-400 text-sm font-medium">
              Embed Badge
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            Your Trust Badge for {domain}
          </h1>

          <p className="text-muted-foreground max-w-xl mx-auto">
            Add this badge to your website to display your verified trust score.
            It updates automatically when your score changes.
          </p>
        </div>

        {/* Badge Preview */}
        <Card className="p-8 bg-white/5 border-white/10 mb-8 text-center">
          <h3 className="text-sm font-semibold text-muted-foreground mb-4">
            Badge Preview
          </h3>
          <div className="inline-block bg-black p-4 rounded-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/api/badge?domain=${domain}`}
              alt="TrustScore Badge"
              className="max-w-[200px]"
            />
          </div>
        </Card>

        {/* Embed Codes */}
        <div className="space-y-6">
          {/* HTML */}
          <Card className="p-6 bg-white/5 border-white/10">
            <div className="flex items-center justify-between mb-3">
              <Badge
                variant="secondary"
                className="bg-amber-500/20 text-amber-400 border-amber-500/30"
              >
                HTML
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(embedCodes.html, "html")}
                className="text-white/60 hover:text-white"
              >
                {copied === "html" ? (
                  <>
                    <Check className="h-4 w-4 mr-1" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <pre className="bg-black/50 rounded-lg p-4 overflow-x-auto text-sm text-white/80 font-mono">
              {embedCodes.html}
            </pre>
          </Card>

          {/* Markdown */}
          <Card className="p-6 bg-white/5 border-white/10">
            <div className="flex items-center justify-between mb-3">
              <Badge
                variant="secondary"
                className="bg-blue-500/20 text-blue-400 border-blue-500/30"
              >
                Markdown
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(embedCodes.markdown, "markdown")}
                className="text-white/60 hover:text-white"
              >
                {copied === "markdown" ? (
                  <>
                    <Check className="h-4 w-4 mr-1" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <pre className="bg-black/50 rounded-lg p-4 overflow-x-auto text-sm text-white/80 font-mono">
              {embedCodes.markdown}
            </pre>
          </Card>
        </div>

        {/* Benefits */}
        <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Award className="h-5 w-5 text-emerald-400" />
            Badge Benefits
          </h3>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-emerald-400 mt-1 flex-shrink-0" />
              <span>Builds trust with your visitors instantly</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-emerald-400 mt-1 flex-shrink-0" />
              <span>Automatic updates when your score changes</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-emerald-400 mt-1 flex-shrink-0" />
              <span>Links to your verified certificate page</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-emerald-400 mt-1 flex-shrink-0" />
              <span>Lightweight SVG, loads instantly</span>
            </li>
          </ul>
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
