import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "URL required" }, { status: 400 });
    }

    // Normalize URL
    let normalizedUrl = url;
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      normalizedUrl = `https://${url}`;
    }

    // Fetch the page headers
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(normalizedUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; TrustScoreBot/1.0)",
      },
    });

    clearTimeout(timeoutId);

    const responseHeaders = response.headers;
    const isHttps = normalizedUrl.startsWith("https://");

    // Analyze headers
    const headers = [
      {
        name: "HTTPS",
        value: isHttps ? "Enabled" : "Not enabled",
        status: isHttps ? "pass" : "fail",
        description: isHttps
          ? "Connection is encrypted with HTTPS"
          : "Website is not using HTTPS. All traffic is unencrypted.",
      },
      {
        name: "Strict-Transport-Security (HSTS)",
        value: responseHeaders.get("strict-transport-security"),
        status: responseHeaders.has("strict-transport-security")
          ? "pass"
          : "fail",
        description: responseHeaders.has("strict-transport-security")
          ? "Browser will only connect via HTTPS"
          : "Missing HSTS header. Browser may connect via insecure HTTP.",
      },
      {
        name: "Content-Security-Policy",
        value: responseHeaders.get("content-security-policy")
          ? "Present"
          : null,
        status: responseHeaders.has("content-security-policy")
          ? "pass"
          : "warning",
        description: responseHeaders.has("content-security-policy")
          ? "CSP restricts which resources can be loaded"
          : "Missing CSP. May be vulnerable to XSS attacks.",
      },
      {
        name: "X-Frame-Options",
        value: responseHeaders.get("x-frame-options"),
        status: responseHeaders.has("x-frame-options") ? "pass" : "warning",
        description: responseHeaders.has("x-frame-options")
          ? "Page cannot be embedded in iframes (clickjacking protection)"
          : "Missing X-Frame-Options. Page may be vulnerable to clickjacking.",
      },
      {
        name: "X-Content-Type-Options",
        value: responseHeaders.get("x-content-type-options"),
        status:
          responseHeaders.get("x-content-type-options") === "nosniff"
            ? "pass"
            : "warning",
        description:
          responseHeaders.get("x-content-type-options") === "nosniff"
            ? "Browser respects declared content types"
            : "Missing nosniff directive. Browser may MIME-sniff content.",
      },
      {
        name: "Referrer-Policy",
        value: responseHeaders.get("referrer-policy"),
        status: responseHeaders.has("referrer-policy") ? "pass" : "warning",
        description: responseHeaders.has("referrer-policy")
          ? "Referrer information is controlled"
          : "Missing Referrer-Policy. Full URL may be leaked to third parties.",
      },
      {
        name: "Permissions-Policy",
        value: responseHeaders.get("permissions-policy") ? "Present" : null,
        status: responseHeaders.has("permissions-policy") ? "pass" : "warning",
        description: responseHeaders.has("permissions-policy")
          ? "Browser features are restricted"
          : "Missing Permissions-Policy. All browser features are enabled.",
      },
    ];

    // Calculate score
    let score = 0;
    const passWeight = 100 / headers.length;
    const warningWeight = passWeight * 0.5;

    headers.forEach((h) => {
      if (h.status === "pass") score += passWeight;
      else if (h.status === "warning") score += warningWeight;
    });

    return NextResponse.json({
      url: normalizedUrl,
      https: isHttps,
      headers,
      score: Math.round(score),
    });
  } catch (error) {
    console.error("Security headers error:", error);
    return NextResponse.json(
      { error: "Failed to analyze URL" },
      { status: 500 }
    );
  }
}
