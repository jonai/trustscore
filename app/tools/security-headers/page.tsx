"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Lock,
  Loader2,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  AlertTriangle,
  Info,
} from "lucide-react";

interface HeaderResult {
  name: string;
  value: string | null;
  status: "pass" | "fail" | "warning";
  description: string;
}

interface SecurityResult {
  url: string;
  https: boolean;
  headers: HeaderResult[];
  score: number;
}

export default function SecurityHeadersTool() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SecurityResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyze = async () => {
    if (!url) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/tools/security-headers", {
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pass":
        return <CheckCircle2 className="h-5 w-5 text-emerald-400" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-400" />;
      default:
        return <XCircle className="h-5 w-5 text-red-400" />;
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case "pass":
        return "bg-emerald-500/10 border-emerald-500/30";
      case "warning":
        return "bg-amber-500/10 border-amber-500/30";
      default:
        return "bg-red-500/10 border-red-500/30";
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
              TrustScore
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-500/30 mb-6">
            <Lock className="h-4 w-4 text-emerald-400" />
            <span className="text-emerald-400 text-sm font-medium">
              Security Headers
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            Security Headers Checker
          </h1>

          <p className="text-muted-foreground max-w-xl mx-auto">
            Check HTTPS, HSTS, CSP, X-Frame-Options, and other security headers.
            Catch missing headers before they become vulnerabilities.
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
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Check"}
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
            {/* Score */}
            <Card className="p-6 bg-white/5 border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">
                    Security Score
                  </h3>
                  <p className="text-sm text-muted-foreground">{result.url}</p>
                </div>
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold ${
                    result.score >= 80
                      ? "bg-emerald-500/20 text-emerald-400"
                      : result.score >= 50
                      ? "bg-amber-500/20 text-amber-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {result.score}
                </div>
              </div>
            </Card>

            {/* Headers List */}
            <Card className="p-6 bg-white/5 border-white/10">
              <h3 className="text-sm font-semibold text-white mb-4">
                Headers Analysis
              </h3>
              <div className="space-y-3">
                {result.headers.map((header) => (
                  <div
                    key={header.name}
                    className={`p-4 rounded-xl border ${getStatusBg(
                      header.status
                    )}`}
                  >
                    <div className="flex items-start gap-3">
                      {getStatusIcon(header.status)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-white">
                            {header.name}
                          </span>
                          {header.value && (
                            <Badge
                              variant="secondary"
                              className="bg-white/10 text-xs font-mono truncate max-w-[200px]"
                            >
                              {header.value}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {header.description}
                        </p>
                      </div>
                    </div>
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
          © {new Date().getFullYear()} TrustScore. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
