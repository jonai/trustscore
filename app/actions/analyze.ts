"use server";

export interface Audit {
  id: string;
  title: string;
  description: string;
  score: number | null; // 0-1, null means not applicable
  displayValue?: string;
  scoreDisplayMode: string;
}

export interface PageSpeedResult {
  url: string;
  performanceScore: number;
  seoScore: number;
  accessibilityScore: number;
  bestPracticesScore: number;
  metrics: {
    firstContentfulPaint: string;
    largestContentfulPaint: string;
    totalBlockingTime: string;
    cumulativeLayoutShift: string;
    speedIndex: string;
  };
  screenshot?: string;
  passedAudits: Audit[];
  failedAudits: Audit[];
  opportunities: Audit[];
}

export interface AnalyzeResponse {
  success: boolean;
  data?: PageSpeedResult;
  error?: string;
}

function normalizeUrl(input: string): string {
  let url = input.trim().toLowerCase();

  // Remove trailing slashes
  url = url.replace(/\/+$/, "");

  // Add https:// if no protocol
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "https://" + url;
  }

  return url;
}

export async function analyzeWebsite(url: string): Promise<AnalyzeResponse> {
  try {
    if (!url || url.trim() === "") {
      return { success: false, error: "Please enter a website URL" };
    }

    const normalizedUrl = normalizeUrl(url);

    // Validate URL format
    try {
      new URL(normalizedUrl);
    } catch {
      return { success: false, error: "Invalid URL format" };
    }

    // Call Google PageSpeed Insights API
    const apiKey = process.env.GOOGLE_PAGESPEED_API_KEY;
    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(
      normalizedUrl
    )}&category=performance&category=seo&category=accessibility&category=best-practices&strategy=mobile${
      apiKey ? `&key=${apiKey}` : ""
    }`;

    const response = await fetch(apiUrl, {
      next: { revalidate: 0 }, // Don't cache
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("PageSpeed API Error:", errorData);
      return {
        success: false,
        error:
          errorData?.error?.message ||
          "Failed to analyze website. Please try again.",
      };
    }

    const data = await response.json();

    // Extract scores (they come as decimals 0-1, we convert to 0-100)
    const lighthouse = data.lighthouseResult;
    const categories = lighthouse?.categories || {};
    const audits = lighthouse?.audits || {};

    // Extract audits
    const passedAudits: Audit[] = [];
    const failedAudits: Audit[] = [];
    const opportunities: Audit[] = [];

    // Key audits we want to show
    const interestingAudits = [
      "meta-description",
      "document-title",
      "html-has-lang",
      "meta-viewport",
      "image-alt",
      "link-text",
      "robots-txt",
      "canonical",
      "font-display",
      "uses-https",
      "viewport",
      "color-contrast",
      "button-name",
      "link-name",
      "tap-targets",
      "render-blocking-resources",
      "uses-optimized-images",
      "uses-webp-images",
      "uses-text-compression",
      "uses-responsive-images",
      "efficient-animated-content",
      "server-response-time",
      "redirects",
      "uses-rel-preconnect",
      "uses-rel-preload",
      "critical-request-chains",
    ];

    for (const auditId of interestingAudits) {
      const audit = audits[auditId];
      if (!audit) continue;

      const auditData: Audit = {
        id: auditId,
        title: audit.title || auditId,
        description: audit.description || "",
        score: audit.score,
        displayValue: audit.displayValue,
        scoreDisplayMode: audit.scoreDisplayMode || "binary",
      };

      if (
        audit.scoreDisplayMode === "opportunity" &&
        audit.score !== null &&
        audit.score < 1
      ) {
        opportunities.push(auditData);
      } else if (audit.score === 1) {
        passedAudits.push(auditData);
      } else if (audit.score !== null && audit.score < 1) {
        failedAudits.push(auditData);
      }
    }

    const result: PageSpeedResult = {
      url: normalizedUrl,
      performanceScore: Math.round((categories.performance?.score || 0) * 100),
      seoScore: Math.round((categories.seo?.score || 0) * 100),
      accessibilityScore: Math.round(
        (categories.accessibility?.score || 0) * 100
      ),
      bestPracticesScore: Math.round(
        (categories["best-practices"]?.score || 0) * 100
      ),
      metrics: {
        firstContentfulPaint:
          lighthouse?.audits?.["first-contentful-paint"]?.displayValue || "N/A",
        largestContentfulPaint:
          lighthouse?.audits?.["largest-contentful-paint"]?.displayValue ||
          "N/A",
        totalBlockingTime:
          lighthouse?.audits?.["total-blocking-time"]?.displayValue || "N/A",
        cumulativeLayoutShift:
          lighthouse?.audits?.["cumulative-layout-shift"]?.displayValue ||
          "N/A",
        speedIndex: lighthouse?.audits?.["speed-index"]?.displayValue || "N/A",
      },
      screenshot: lighthouse?.audits?.["final-screenshot"]?.details?.data,
      passedAudits: passedAudits.slice(0, 10), // Limit to 10
      failedAudits: failedAudits.slice(0, 10),
      opportunities: opportunities.slice(0, 5),
    };

    return { success: true, data: result };
  } catch (error) {
    console.error("Analyze error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}
