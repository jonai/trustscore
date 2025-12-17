"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SiteLogo } from "./site-logo";

interface SiteHeaderProps {
  showBackLink?: boolean;
  backLinkText?: string;
  backLinkHref?: string;
}

export function SiteHeader({
  showBackLink = true,
  backLinkText = "Back to Home",
  backLinkHref = "/",
}: SiteHeaderProps) {
  return (
    <header className="border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <SiteLogo size="lg" />
        {showBackLink && (
          <Link
            href={backLinkHref}
            className="text-sm text-white/60 hover:text-white transition-colors flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            {backLinkText}
          </Link>
        )}
      </div>
    </header>
  );
}
