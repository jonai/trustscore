import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

// Vercel Cron job - runs daily at 00:00 UTC
// Add to vercel.json: { "crons": [{ "path": "/api/cron/audit", "schedule": "0 0 * * *" }] }

interface WebsiteRecord {
  id: string;
  domain: string;
  url: string;
}

export async function GET(request: NextRequest) {
  // Verify cron secret (for security)
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServerClient();

  try {
    // Get all active certified websites
    const { data: websites, error: fetchError } = await supabase
      .from("certified_websites")
      .select("id, domain, url")
      .eq("is_active", true)
      .returns<WebsiteRecord[]>();

    if (fetchError || !websites) {
      console.error("Error fetching websites:", fetchError);
      return NextResponse.json(
        { error: "Failed to fetch websites" },
        { status: 500 }
      );
    }

    console.log(`Starting audit for ${websites.length} websites`);

    const results: { domain: string; success: boolean; score?: number }[] = [];

    // Process each website
    for (const website of websites) {
      try {
        // Call PageSpeed API
        const apiKey = process.env.GOOGLE_PAGESPEED_API_KEY;
        const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(
          website.url
        )}&category=performance&category=seo&category=accessibility&category=best-practices&strategy=mobile${
          apiKey ? `&key=${apiKey}` : ""
        }`;

        const response = await fetch(apiUrl, {
          next: { revalidate: 0 },
        });

        if (!response.ok) {
          console.error(`PageSpeed API error for ${website.domain}`);
          results.push({ domain: website.domain, success: false });
          continue;
        }

        const data = await response.json();
        const categories = data.lighthouseResult?.categories || {};

        const scores = {
          performance: Math.round((categories.performance?.score || 0) * 100),
          seo: Math.round((categories.seo?.score || 0) * 100),
          accessibility: Math.round(
            (categories.accessibility?.score || 0) * 100
          ),
          bestPractices: Math.round(
            (categories["best-practices"]?.score || 0) * 100
          ),
        };

        const avgScore = Math.round(
          (scores.performance +
            scores.seo +
            scores.accessibility +
            scores.bestPractices) /
            4
        );

        // Insert into audit_history
        await supabase.from("audit_history").insert({
          website_id: website.id,
          score: avgScore,
          performance_score: scores.performance,
          seo_score: scores.seo,
          accessibility_score: scores.accessibility,
          best_practices_score: scores.bestPractices,
        });

        // Update certified_websites with latest scores
        await supabase
          .from("certified_websites")
          .update({
            current_score: avgScore,
            performance_score: scores.performance,
            seo_score: scores.seo,
            accessibility_score: scores.accessibility,
            best_practices_score: scores.bestPractices,
            last_audit_date: new Date().toISOString(),
          })
          .eq("id", website.id);

        results.push({
          domain: website.domain,
          success: true,
          score: avgScore,
        });
        console.log(`Audited ${website.domain}: ${avgScore}`);

        // Rate limiting: wait 1 second between requests
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Error auditing ${website.domain}:`, error);
        results.push({ domain: website.domain, success: false });
      }
    }

    return NextResponse.json({
      success: true,
      audited: results.filter((r) => r.success).length,
      failed: results.filter((r) => !r.success).length,
      results,
    });
  } catch (error) {
    console.error("Cron job error:", error);
    return NextResponse.json({ error: "Cron job failed" }, { status: 500 });
  }
}
