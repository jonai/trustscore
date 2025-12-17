import Link from "next/link";
import { Shield, Trophy, Wrench, Award, ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/50 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-bold mb-4 group"
            >
              {/* Logo: 92% ring with lightning bolt and glow */}
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-500/30 rounded-full blur-md group-hover:bg-emerald-500/40 transition-colors" />
                <svg className="relative w-8 h-8" viewBox="0 0 32 32">
                  <circle
                    cx="16"
                    cy="16"
                    r="13"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                    className="text-white/10"
                  />
                  <circle
                    cx="16"
                    cy="16"
                    r="13"
                    stroke="#10b981"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 13 * 0.92}
                    strokeDashoffset={0}
                    className="-rotate-90 origin-center"
                    style={{ transformOrigin: "center" }}
                  />
                  <path
                    d="M17 7L12 16h4l-1 9 5-10h-4l1-8z"
                    fill="white"
                    className="drop-shadow-sm"
                  />
                </svg>
              </div>
              <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                VerifiedTrustScore
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Analyze your website and build trust with visitors. Get a verified
              badge and dofollow backlink.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-semibold text-white mb-4">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/certified-websites"
                  className="text-muted-foreground hover:text-white transition-colors flex items-center gap-2"
                >
                  <Award className="h-4 w-4" />
                  Certified Websites
                </Link>
              </li>
              <li>
                <Link
                  href="/leaderboard"
                  className="text-muted-foreground hover:text-white transition-colors flex items-center gap-2"
                >
                  <Trophy className="h-4 w-4" />
                  Leaderboard
                </Link>
              </li>
              <li>
                <Link
                  href="/tools"
                  className="text-muted-foreground hover:text-white transition-colors flex items-center gap-2"
                >
                  <Wrench className="h-4 w-4" />
                  Free Tools
                </Link>
              </li>
            </ul>
          </div>

          {/* Free Tools */}
          <div>
            <h4 className="font-semibold text-white mb-4">Free Tools</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/tools/og-preview"
                  className="text-muted-foreground hover:text-white transition-colors"
                >
                  Open Graph Preview
                </Link>
              </li>
              <li>
                <Link
                  href="/tools/security-headers"
                  className="text-muted-foreground hover:text-white transition-colors"
                >
                  Security Headers
                </Link>
              </li>
              <li>
                <Link
                  href="/tools/meta-checker"
                  className="text-muted-foreground hover:text-white transition-colors"
                >
                  Meta Tag Checker
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/privacy"
                  className="text-muted-foreground hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-muted-foreground hover:text-white transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-muted-foreground hover:text-white transition-colors"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} VerifiedTrustScore. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
