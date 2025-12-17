"use server";

export interface Audit {
  id: string;
  title: string;
  description: string;
  score: number | null; // 0-1, null means not applicable
  displayValue?: string;
  scoreDisplayMode: string;
}

export interface WebsiteQuality {
  wordCount: number;
  hasFavicon: boolean;
  hasOpenGraph: boolean;
  ogTags: { property: string; content: string }[];
  hasTwitterCards: boolean;
  twitterTags: { name: string; content: string }[];
  hasSitemap: boolean;
  schemaCount: number;
  hasCanonical: boolean;
  canonicalUrl: string | null;
  hasHreflang: boolean;
  score: number;
}

export interface TrustSecurity {
  hasHttps: boolean;
  hasHSTS: boolean;
  hstsMaxAge: number | null;
  hasCSP: boolean;
  hasXFrameOptions: boolean;
  hasXContentTypeOptions: boolean;
  hasReferrerPolicy: boolean;
  score: number;
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
  // New extended analysis
  websiteQuality: WebsiteQuality;
  trustSecurity: TrustSecurity;
  overallScore: number;
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

/**
 * Scrape HTML and extract Website Quality metrics
 */
async function analyzeHtml(url: string): Promise<{
  websiteQuality: WebsiteQuality;
  trustSecurity: TrustSecurity;
}> {
  const defaultWebsiteQuality: WebsiteQuality = {
    wordCount: 0,
    hasFavicon: false,
    hasOpenGraph: false,
    ogTags: [],
    hasTwitterCards: false,
    twitterTags: [],
    hasSitemap: false,
    schemaCount: 0,
    hasCanonical: false,
    canonicalUrl: null,
    hasHreflang: false,
    score: 0,
  };

  const defaultTrustSecurity: TrustSecurity = {
    hasHttps: url.startsWith("https"),
    hasHSTS: false,
    hstsMaxAge: null,
    hasCSP: false,
    hasXFrameOptions: false,
    hasXContentTypeOptions: false,
    hasReferrerPolicy: false,
    score: 0,
  };

  try {
    // Fetch the page with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; TrustScoreBot/1.0; +https://trustscore.com)",
        Accept: "text/html,application/xhtml+xml",
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return {
        websiteQuality: { ...defaultWebsiteQuality, score: 0 },
        trustSecurity: {
          ...defaultTrustSecurity,
          score: defaultTrustSecurity.hasHttps ? 20 : 0,
        },
      };
    }

    const html = await response.text();
    const headers = response.headers;

    // === TRUST & SECURITY (from headers) ===
    const trustSecurity: TrustSecurity = {
      hasHttps: url.startsWith("https"),
      hasHSTS: headers.has("strict-transport-security"),
      hstsMaxAge: null,
      hasCSP:
        headers.has("content-security-policy") ||
        headers.has("content-security-policy-report-only"),
      hasXFrameOptions: headers.has("x-frame-options"),
      hasXContentTypeOptions: headers.has("x-content-type-options"),
      hasReferrerPolicy: headers.has("referrer-policy"),
      score: 0,
    };

    // Parse HSTS max-age
    const hstsHeader = headers.get("strict-transport-security");
    if (hstsHeader) {
      const match = hstsHeader.match(/max-age=(\d+)/);
      if (match) {
        trustSecurity.hstsMaxAge = parseInt(match[1], 10);
      }
    }

    // Calculate Trust & Security score
    let trustScore = 0;
    if (trustSecurity.hasHttps) trustScore += 30;
    if (trustSecurity.hasHSTS) trustScore += 20;
    if (trustSecurity.hasCSP) trustScore += 20;
    if (trustSecurity.hasXFrameOptions) trustScore += 10;
    if (trustSecurity.hasXContentTypeOptions) trustScore += 10;
    if (trustSecurity.hasReferrerPolicy) trustScore += 10;
    trustSecurity.score = trustScore;

    // === WEBSITE QUALITY (from HTML) ===
    const websiteQuality: WebsiteQuality = {
      wordCount: 0,
      hasFavicon: false,
      hasOpenGraph: false,
      ogTags: [],
      hasTwitterCards: false,
      twitterTags: [],
      hasSitemap: false,
      schemaCount: 0,
      hasCanonical: false,
      canonicalUrl: null,
      hasHreflang: false,
      score: 0,
    };

    // Word count (strip HTML tags, count words)
    const textContent = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    websiteQuality.wordCount = textContent
      .split(/\s+/)
      .filter((w) => w.length > 0).length;

    // Favicon
    websiteQuality.hasFavicon =
      /<link[^>]*rel=["'](?:icon|shortcut icon|apple-touch-icon)["'][^>]*>/i.test(
        html
      );

    // Open Graph tags
    const ogMatches = html.matchAll(
      /<meta[^>]*property=["'](og:[^"']+)["'][^>]*content=["']([^"']*)["'][^>]*>/gi
    );
    for (const match of ogMatches) {
      websiteQuality.ogTags.push({ property: match[1], content: match[2] });
    }
    // Also check reverse order (content before property)
    const ogMatchesReverse = html.matchAll(
      /<meta[^>]*content=["']([^"']*)["'][^>]*property=["'](og:[^"']+)["'][^>]*>/gi
    );
    for (const match of ogMatchesReverse) {
      websiteQuality.ogTags.push({ property: match[2], content: match[1] });
    }
    websiteQuality.hasOpenGraph = websiteQuality.ogTags.length > 0;

    // Twitter Cards
    const twitterMatches = html.matchAll(
      /<meta[^>]*name=["'](twitter:[^"']+)["'][^>]*content=["']([^"']*)["'][^>]*>/gi
    );
    for (const match of twitterMatches) {
      websiteQuality.twitterTags.push({ name: match[1], content: match[2] });
    }
    const twitterMatchesReverse = html.matchAll(
      /<meta[^>]*content=["']([^"']*)["'][^>]*name=["'](twitter:[^"']+)["'][^>]*>/gi
    );
    for (const match of twitterMatchesReverse) {
      websiteQuality.twitterTags.push({ name: match[2], content: match[1] });
    }
    websiteQuality.hasTwitterCards = websiteQuality.twitterTags.length > 0;

    // Schema.org (JSON-LD)
    const schemaMatches = html.match(
      /<script[^>]*type=["']application\/ld\+json["'][^>]*>/gi
    );
    websiteQuality.schemaCount = schemaMatches ? schemaMatches.length : 0;

    // Canonical URL
    const canonicalMatch = html.match(
      /<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i
    );
    if (canonicalMatch) {
      websiteQuality.hasCanonical = true;
      websiteQuality.canonicalUrl = canonicalMatch[1];
    }

    // Hreflang
    websiteQuality.hasHreflang =
      /<link[^>]*hreflang=["'][^"']+["'][^>]*>/i.test(html);

    // Check sitemap
    try {
      const sitemapUrl = new URL("/sitemap.xml", url).href;
      const sitemapResponse = await fetch(sitemapUrl, {
        method: "HEAD",
        signal: AbortSignal.timeout(5000),
      });
      websiteQuality.hasSitemap = sitemapResponse.ok;
    } catch {
      websiteQuality.hasSitemap = false;
    }

    // Calculate Website Quality score
    let qualityScore = 0;
    if (websiteQuality.wordCount >= 300) qualityScore += 15;
    else if (websiteQuality.wordCount >= 100) qualityScore += 10;
    else if (websiteQuality.wordCount > 0) qualityScore += 5;
    if (websiteQuality.hasFavicon) qualityScore += 10;
    if (websiteQuality.hasOpenGraph) qualityScore += 15;
    if (websiteQuality.hasTwitterCards) qualityScore += 10;
    if (websiteQuality.hasSitemap) qualityScore += 15;
    if (websiteQuality.schemaCount > 0) qualityScore += 15;
    if (websiteQuality.hasCanonical) qualityScore += 10;
    if (websiteQuality.hasHreflang) qualityScore += 10;
    websiteQuality.score = Math.min(qualityScore, 100);

    return { websiteQuality, trustSecurity };
  } catch (error) {
    console.error("HTML analysis error:", error);
    return {
      websiteQuality: { ...defaultWebsiteQuality, score: 0 },
      trustSecurity: {
        ...defaultTrustSecurity,
        score: defaultTrustSecurity.hasHttps ? 20 : 0,
      },
    };
  }
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

    // Run PageSpeed and HTML analysis in parallel
    const apiKey = process.env.GOOGLE_PAGESPEED_API_KEY;
    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(
      normalizedUrl
    )}&category=performance&category=seo&category=accessibility&category=best-practices&strategy=mobile${
      apiKey ? `&key=${apiKey}` : ""
    }`;

    const [pageSpeedResponse, htmlAnalysis] = await Promise.all([
      fetch(apiUrl, { next: { revalidate: 0 } }),
      analyzeHtml(normalizedUrl),
    ]);

    if (!pageSpeedResponse.ok) {
      const errorData = await pageSpeedResponse.json().catch(() => ({}));
      console.error("PageSpeed API Error:", errorData);
      return {
        success: false,
        error:
          errorData?.error?.message ||
          "Failed to analyze website. Please try again.",
      };
    }

    const data = await pageSpeedResponse.json();

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

    const performanceScore = Math.round(
      (categories.performance?.score || 0) * 100
    );
    const seoScore = Math.round((categories.seo?.score || 0) * 100);
    const accessibilityScore = Math.round(
      (categories.accessibility?.score || 0) * 100
    );
    const bestPracticesScore = Math.round(
      (categories["best-practices"]?.score || 0) * 100
    );

    // Calculate overall score (simple average of 4 Lighthouse categories)
    // This matches what is saved to Supabase and displayed on certified page
    const overallScore = Math.round(
      (performanceScore + seoScore + accessibilityScore + bestPracticesScore) /
        4
    );

    const result: PageSpeedResult = {
      url: normalizedUrl,
      performanceScore,
      seoScore,
      accessibilityScore,
      bestPracticesScore,
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
      passedAudits: passedAudits.slice(0, 10),
      failedAudits: failedAudits.slice(0, 10),
      opportunities: opportunities.slice(0, 5),
      websiteQuality: htmlAnalysis.websiteQuality,
      trustSecurity: htmlAnalysis.trustSecurity,
      overallScore,
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
