import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

interface CertificationRecord {
  domain: string;
  current_score: number;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const domain = searchParams.get("domain");

  if (!domain) {
    return NextResponse.json({ error: "Domain required" }, { status: 400 });
  }

  const supabase = createServerClient();

  const { data: cert, error } = await supabase
    .from("certified_websites")
    .select("domain, current_score")
    .eq("domain", domain)
    .eq("is_active", true)
    .single()
    .returns<CertificationRecord>();

  if (error || !cert) {
    return NextResponse.json({ error: "Not certified" }, { status: 404 });
  }

  // Return SVG badge
  const score = cert.current_score;
  const scoreColor =
    score >= 90
      ? "#10b981"
      : score >= 70
      ? "#f59e0b"
      : score >= 50
      ? "#f97316"
      : "#ef4444";
  const circumference = 2 * Math.PI * 18;
  const offset = circumference * (1 - score / 100);

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="60" viewBox="0 0 200 60">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1a1a1a"/>
          <stop offset="100%" style="stop-color:#0a0a0a"/>
        </linearGradient>
      </defs>
      <rect width="200" height="60" rx="12" fill="url(#bg)" stroke="#333" stroke-width="1"/>
      <circle cx="35" cy="30" r="22" fill="none" stroke="#333" stroke-width="3"/>
      <circle cx="35" cy="30" r="18" fill="none" stroke="${scoreColor}" stroke-width="4" 
        stroke-dasharray="${circumference}" stroke-dashoffset="${offset}" 
        stroke-linecap="round" transform="rotate(-90 35 30)"/>
      <text x="35" y="35" fill="white" font-size="14" font-weight="bold" text-anchor="middle" font-family="system-ui">${score}</text>
      <text x="72" y="25" fill="#888" font-size="10" font-family="system-ui">${domain}</text>
      <text x="72" y="42" fill="white" font-size="13" font-weight="600" font-family="system-ui">Verified Trust Score</text>
    </svg>
  `;

  return new NextResponse(svg.trim(), {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
