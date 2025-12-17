"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Globe,
  Loader2,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ArrowLeft,
  Image as ImageIcon,
  FileText,
} from "lucide-react";

interface OGData {
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
  url?: string;
  type?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
}

export default function OGPreviewTool() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OGData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyze = async () => {
    if (!url) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/tools/og-preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setResult(data);
      }
    } catch (err) {
      setError("Failed to analyze. Please check the URL and try again.");
    } finally {
      setLoading(false);
    }
  };

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
            href="/tools"
            className="text-sm text-white/60 hover:text-white transition-colors flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            All Tools
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-3xl">
        {/* Hero */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 border border-blue-500/30 mb-6">
            <Globe className="h-4 w-4 text-blue-400" />
            <span className="text-blue-400 text-sm font-medium">
              Open Graph Preview
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            Social Media Preview
          </h1>

          <p className="text-muted-foreground max-w-xl mx-auto">
            See how your links will appear when shared on Facebook, Twitter,
            LinkedIn, and other social platforms.
          </p>
        </div>

        {/* Input */}
        <Card className="p-6 bg-white/5 border-white/10 mb-8">
          <div className="flex gap-3">
            <Input
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && analyze()}
              className="bg-black/50 border-white/10 text-white placeholder:text-white/40"
            />
            <Button
              onClick={analyze}
              disabled={loading || !url}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Analyze"
              )}
            </Button>
          </div>
        </Card>

        {/* Error */}
        {error && (
          <Card className="p-6 bg-red-500/10 border-red-500/30 mb-8">
            <div className="flex items-center gap-3 text-red-400">
              <XCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          </Card>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-6">
            {/* Facebook/OG Preview */}
            <Card className="p-6 bg-white/5 border-white/10">
              <div className="flex items-center gap-2 mb-4">
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                  Facebook / LinkedIn
                </Badge>
              </div>

              <div className="bg-white rounded-lg overflow-hidden max-w-md">
                {result.image && (
                  <div className="aspect-[1.91/1] bg-gray-200 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={result.image}
                      alt="OG Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                )}
                <div className="p-3 bg-gray-100">
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                    {result.siteName || new URL(url).hostname}
                  </div>
                  <div className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">
                    {result.title || "No title found"}
                  </div>
                  <div className="text-xs text-gray-600 line-clamp-2">
                    {result.description || "No description found"}
                  </div>
                </div>
              </div>
            </Card>

            {/* Twitter Preview */}
            <Card className="p-6 bg-white/5 border-white/10">
              <div className="flex items-center gap-2 mb-4">
                <Badge className="bg-sky-500/20 text-sky-400 border-sky-500/30">
                  Twitter / X
                </Badge>
              </div>

              <div className="bg-[#15202B] rounded-2xl overflow-hidden max-w-md border border-gray-700">
                {(result.twitterImage || result.image) && (
                  <div className="aspect-[2/1] bg-gray-800 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={result.twitterImage || result.image}
                      alt="Twitter Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                )}
                <div className="p-3">
                  <div className="font-semibold text-white text-sm mb-1 line-clamp-1">
                    {result.twitterTitle || result.title || "No title"}
                  </div>
                  <div className="text-sm text-gray-400 line-clamp-2 mb-1">
                    {result.twitterDescription ||
                      result.description ||
                      "No description"}
                  </div>
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <ExternalLink className="h-3 w-3" />
                    {new URL(url).hostname}
                  </div>
                </div>
              </div>
            </Card>

            {/* Raw Data */}
            <Card className="p-6 bg-white/5 border-white/10">
              <h3 className="text-sm font-semibold text-white mb-4">
                Detected Tags
              </h3>
              <div className="space-y-2 text-sm">
                {Object.entries(result).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-start gap-3 p-2 rounded bg-black/30"
                  >
                    <span className="text-muted-foreground min-w-[140px]">
                      {key === "title"
                        ? "og:title"
                        : key === "description"
                        ? "og:description"
                        : key === "image"
                        ? "og:image"
                        : key === "siteName"
                        ? "og:site_name"
                        : key === "url"
                        ? "og:url"
                        : key === "type"
                        ? "og:type"
                        : key.startsWith("twitter")
                        ? `twitter:${key.replace("twitter", "").toLowerCase()}`
                        : key}
                    </span>
                    {value ? (
                      <span className="text-emerald-400 font-mono text-xs break-all">
                        {value}
                      </span>
                    ) : (
                      <span className="text-red-400 text-xs">Not found</span>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
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
