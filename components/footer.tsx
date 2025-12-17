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
              className="flex items-center gap-2 text-lg font-bold mb-4"
            >
              <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600">
                <Shield className="h-4 w-4 text-white" />
              </div>
              <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                TrustScore
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
            © {new Date().getFullYear()} TrustScore. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Twitter
            </a>
            <a
              href="https://github.com/jonai/trustscore"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
