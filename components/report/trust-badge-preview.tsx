"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Award,
  Shield,
  Copy,
  ClipboardCheck,
  CheckCircle2,
  LockKeyhole,
  Sparkles,
} from "lucide-react";

export function TrustBadgePreview({
  score,
  domain,
  isPremium = false,
}: {
  score: number;
  domain: string;
  isPremium?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const badgeColor =
    score >= 90
      ? "#10b981"
      : score >= 70
      ? "#f59e0b"
      : score >= 50
      ? "#f97316"
      : "#ef4444";
  const badgeLabel =
    score >= 90
      ? "EXCELLENT"
      : score >= 70
      ? "GOOD"
      : score >= 50
      ? "FAIR"
      : "NEEDS WORK";

  const cleanDomain = domain.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const embedCode = `<a href="https://trustscore.com/certified/${cleanDomain}" target="_blank"><img src="https://trustscore.com/api/badge/${score}" alt="TrustScore Verified" /></a>`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card
      className={`p-6 md:p-8 backdrop-blur-xl mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 relative overflow-hidden ${
        isPremium
          ? "bg-gradient-to-br from-emerald-500/10 via-white/5 to-emerald-600/5 border-2 border-emerald-500/40"
          : "bg-gradient-to-br from-amber-500/10 via-white/5 to-amber-600/5 border-2 border-amber-500/40"
      }`}
      style={{ animationDelay: "500ms" }}
    >
      {/* Premium shine effect */}
      <div
        className={`absolute inset-0 animate-shimmer ${
          isPremium
            ? "bg-gradient-to-r from-transparent via-emerald-400/5 to-transparent"
            : "bg-gradient-to-r from-transparent via-amber-400/5 to-transparent"
        }`}
      />

      <div className="flex items-center gap-3 mb-6 relative">
        <div
          className={`p-2 rounded-lg border ${
            isPremium
              ? "bg-gradient-to-br from-emerald-500/30 to-emerald-600/20 border-emerald-500/30"
              : "bg-gradient-to-br from-amber-500/30 to-amber-600/20 border-amber-500/30"
          }`}
        >
          <Award
            className={`h-5 w-5 ${
              isPremium ? "text-emerald-400" : "text-amber-400"
            }`}
          />
        </div>
        <h3
          className={`text-xl font-semibold bg-gradient-to-r bg-clip-text text-transparent ${
            isPremium
              ? "from-emerald-200 to-emerald-400"
              : "from-amber-200 to-amber-400"
          }`}
        >
          {isPremium
            ? "🎉 Certified! Here is your embed code:"
            : "Your Official Trust Badge"}
        </h3>
        <Badge
          className={`${
            isPremium
              ? "bg-gradient-to-r from-emerald-500/30 to-emerald-600/20 text-emerald-300 border-emerald-500/50"
              : "bg-gradient-to-r from-amber-500/30 to-amber-600/20 text-amber-300 border-amber-500/50"
          }`}
        >
          {isPremium ? "✅ Verified" : "✨ Premium"}
        </Badge>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-center relative">
        {/* Badge Preview */}
        <div className="flex flex-col items-center">
          <div className="relative group">
            {/* Glow effect */}
            <div
              className="absolute inset-0 blur-2xl opacity-40 rounded-full"
              style={{ backgroundColor: badgeColor }}
            />

            {/* The Badge */}
            <div
              className="relative w-44 h-44 rounded-2xl flex flex-col items-center justify-center p-4 shadow-2xl"
              style={{
                background: `linear-gradient(135deg, ${badgeColor}25 0%, ${badgeColor}10 100%)`,
                border: `3px solid ${badgeColor}60`,
                boxShadow: `0 0 40px ${badgeColor}20`,
              }}
            >
              <Award className="h-10 w-10 mb-2" style={{ color: badgeColor }} />
              <div className="text-5xl font-bold" style={{ color: badgeColor }}>
                {score}
              </div>
              <div className="text-[11px] uppercase tracking-widest text-white/70 mt-1 font-medium">
                {badgeLabel}
              </div>
              <div className="text-[9px] text-white/50 mt-2 flex items-center gap-1">
                <Shield className="h-3 w-3" />
                {isPremium
                  ? "Certified by TrustScore"
                  : "Verified by TrustScore"}
              </div>
            </div>
          </div>

          <p
            className={`text-sm mt-4 text-center font-medium ${
              isPremium ? "text-emerald-300/70" : "text-amber-300/70"
            }`}
          >
            Display this badge on {cleanDomain}
          </p>
        </div>

        {/* Embed Code Section */}
        <div className="space-y-4">
          <div>
            <p
              className={`text-sm font-medium mb-2 ${
                isPremium ? "text-emerald-200" : "text-amber-200"
              }`}
            >
              Embed Code
            </p>

            {isPremium ? (
              // UNLOCKED - Show copyable code
              <div className="relative">
                <div className="bg-black/60 rounded-lg p-4 font-mono text-xs text-emerald-400 border border-emerald-500/30">
                  <code className="break-all">{embedCode}</code>
                </div>
                <Button
                  size="sm"
                  onClick={handleCopy}
                  className={`absolute top-2 right-2 ${
                    copied
                      ? "bg-emerald-500 hover:bg-emerald-600"
                      : "bg-white/10 hover:bg-white/20"
                  }`}
                >
                  {copied ? (
                    <>
                      <ClipboardCheck className="h-4 w-4 mr-1" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-1" /> Copy
                    </>
                  )}
                </Button>
              </div>
            ) : (
              // LOCKED - Show blurred code
              <div className="relative">
                <div className="bg-black/40 rounded-lg p-4 font-mono text-xs text-emerald-400/80 blur-sm select-none border border-white/5">
                  {embedCode}
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="p-3 rounded-full bg-amber-500/20 backdrop-blur-sm mb-2 mx-auto w-fit border border-amber-500/30">
                      <LockKeyhole className="h-5 w-5 text-amber-400" />
                    </div>
                    <p className="text-sm text-amber-300/70">Unlock to copy</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-sm text-white/70">
              <CheckCircle2
                className={`h-4 w-4 ${
                  isPremium ? "text-emerald-400" : "text-emerald-400"
                }`}
              />
              <span>Embed verified badge on your website</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/70">
              <CheckCircle2
                className={`h-4 w-4 ${
                  isPremium ? "text-emerald-400" : "text-emerald-400"
                }`}
              />
              <span>Dofollow backlink included (SEO boost)</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/70">
              <CheckCircle2
                className={`h-4 w-4 ${
                  isPremium ? "text-emerald-400" : "text-emerald-400"
                }`}
              />
              <span>Lifetime verification & updates</span>
            </div>
          </div>

          {!isPremium && (
            <Button
              size="lg"
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transition-all duration-300 hover:scale-[1.02] text-base py-6"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Claim Verified Badge & Backlink — $35
            </Button>
          )}

          {isPremium && (
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-center">
              <p className="text-sm text-emerald-300">
                ✅ Your website is listed in our{" "}
                <a
                  href="/certified-websites"
                  className="underline hover:text-emerald-200"
                >
                  Certified Directory
                </a>
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
