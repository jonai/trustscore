"use client";

import Link from "next/link";

interface SiteLogoProps {
  size?: "sm" | "md" | "lg";
  showName?: boolean;
  linkToHome?: boolean;
}

export function SiteLogo({
  size = "md",
  showName = true,
  linkToHome = true,
}: SiteLogoProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
  };

  const textClasses = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-xl",
  };

  const logo = (
    <div className="flex items-center gap-2 group cursor-pointer">
      {/* Logo: 92% ring with lightning bolt and glow */}
      <div className="relative">
        <div className="absolute inset-0 bg-emerald-500/30 rounded-full blur-md group-hover:bg-emerald-500/40 transition-colors" />
        <svg className={`relative ${sizeClasses[size]}`} viewBox="0 0 32 32">
          {/* Background ring */}
          <circle
            cx="16"
            cy="16"
            r="13"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            className="text-white/10"
          />
          {/* Progress ring at 92% */}
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
          {/* Lightning bolt */}
          <path
            d="M17 7L12 16h4l-1 9 5-10h-4l1-8z"
            fill="white"
            className="drop-shadow-sm"
          />
        </svg>
      </div>
      {showName && (
        <span className={`font-semibold text-white ${textClasses[size]}`}>
          VerifiedTrustScore
        </span>
      )}
    </div>
  );

  if (linkToHome) {
    return <Link href="/">{logo}</Link>;
  }

  return logo;
}
