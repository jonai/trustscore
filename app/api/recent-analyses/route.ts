import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

interface CertificationRecord {
  domain: string;
  current_score: number;
  certified_date: string;
}

export async function GET() {
  try {
    const supabase = createServerClient();

    const { data: certifications, error } = await supabase
      .from("certified_websites")
      .select("domain, current_score, certified_date")
      .eq("is_active", true)
      .order("certified_date", { ascending: false })
      .limit(5)
      .returns<CertificationRecord[]>();

    if (error) {
      console.error("Error fetching recent analyses:", error);
      return NextResponse.json({ analyses: [] });
    }

    // Format the data for the frontend
    const analyses = (certifications || []).map((cert) => {
      const certDate = new Date(cert.certified_date);
      const now = new Date();
      const diffMs = now.getTime() - certDate.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      let time: string;
      if (diffMins < 1) {
        time = "just now";
      } else if (diffMins < 60) {
        time = `${diffMins}m ago`;
      } else if (diffHours < 24) {
        time = `${diffHours}h ago`;
      } else if (diffDays < 7) {
        time = `${diffDays}d ago`;
      } else {
        time = certDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
      }

      return {
        domain: cert.domain,
        score: cert.current_score,
        time,
        color:
          cert.current_score >= 90
            ? "bg-emerald-500"
            : cert.current_score >= 70
            ? "bg-yellow-500"
            : "bg-red-500",
      };
    });

    return NextResponse.json({ analyses });
  } catch (error) {
    console.error("Error in recent analyses API:", error);
    return NextResponse.json({ analyses: [] });
  }
}
