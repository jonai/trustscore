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

    // Fetch the page
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(normalizedUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; TrustScoreBot/1.0)",
        Accept: "text/html",
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch: ${response.status}` },
        { status: 400 }
      );
    }

    const html = await response.text();

    // Helper to extract meta content
    const getMetaContent = (name: string, isProperty = false) => {
      const attr = isProperty ? "property" : "name";
      const regex1 = new RegExp(
        `<meta[^>]*${attr}=["']${name}["'][^>]*content=["']([^"']*)["']`,
        "i"
      );
      const regex2 = new RegExp(
        `<meta[^>]*content=["']([^"']*)["'][^>]*${attr}=["']${name}["']`,
        "i"
      );
      return html.match(regex1)?.[1] || html.match(regex2)?.[1] || null;
    };

    // Extract tags
    const title =
      html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]?.trim() || null;
    const description = getMetaContent("description");
    const canonical =
      html.match(
        /<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i
      )?.[1] || null;
    const lang = html.match(/<html[^>]*lang=["']([^"']*)["']/i)?.[1] || null;
    const viewport = getMetaContent("viewport");
    const charset =
      html.match(/<meta[^>]*charset=["']([^"']*)["']/i)?.[1] ||
      html.match(/charset=([^"'\s>]+)/i)?.[1] ||
      null;
    const robots = getMetaContent("robots");
    const ogTitle = getMetaContent("og:title", true);
    const ogDescription = getMetaContent("og:description", true);

    // Build tags array
    const tags = [
      {
        name: "Title Tag",
        value: title,
        status:
          title && title.length >= 30 && title.length <= 60
            ? "pass"
            : title
            ? "warning"
            : "fail",
        description: title
          ? title.length >= 30 && title.length <= 60
            ? `Good length (${title.length} chars)`
            : `Length: ${title.length} chars (recommended: 30-60)`
          : "Missing title tag. This is critical for SEO.",
      },
      {
        name: "Meta Description",
        value: description,
        status:
          description && description.length >= 120 && description.length <= 160
            ? "pass"
            : description
            ? "warning"
            : "fail",
        description: description
          ? description.length >= 120 && description.length <= 160
            ? `Good length (${description.length} chars)`
            : `Length: ${description.length} chars (recommended: 120-160)`
          : "Missing meta description. Important for SERP click-through rate.",
      },
      {
        name: "Canonical URL",
        value: canonical,
        status: canonical ? "pass" : "warning",
        description: canonical
          ? "Canonical URL is set, preventing duplicate content issues"
          : "No canonical URL. May cause duplicate content issues.",
      },
      {
        name: "Language Attribute",
        value: lang,
        status: lang ? "pass" : "warning",
        description: lang
          ? `Language set to "${lang}"`
          : "Missing lang attribute on <html> tag. Important for accessibility and SEO.",
      },
      {
        name: "Viewport Meta",
        value: viewport,
        status:
          viewport && viewport.includes("width=device-width")
            ? "pass"
            : viewport
            ? "warning"
            : "fail",
        description:
          viewport && viewport.includes("width=device-width")
            ? "Viewport is properly configured for mobile devices"
            : "Missing or incomplete viewport meta. Site may not be mobile-friendly.",
      },
      {
        name: "Character Encoding",
        value: charset,
        status:
          charset?.toLowerCase() === "utf-8"
            ? "pass"
            : charset
            ? "warning"
            : "fail",
        description:
          charset?.toLowerCase() === "utf-8"
            ? "Using UTF-8 encoding (recommended)"
            : charset
            ? `Using ${charset} encoding. UTF-8 is recommended.`
            : "Missing charset declaration.",
      },
      {
        name: "Robots Meta",
        value: robots,
        status: robots
          ? robots.includes("noindex")
            ? "warning"
            : "pass"
          : "pass",
        description: robots
          ? robots.includes("noindex")
            ? "Page is set to noindex - will not appear in search results"
            : `Robots directive: ${robots}`
          : "No robots meta tag (defaults to index, follow - good)",
      },
      {
        name: "Open Graph Title",
        value: ogTitle,
        status: ogTitle ? "pass" : "warning",
        description: ogTitle
          ? "OG title is set for social sharing"
          : "Missing og:title. Social shares may not display correctly.",
      },
    ];

    // Calculate score
    let score = 0;
    const passWeight = 100 / tags.length;
    const warningWeight = passWeight * 0.5;

    tags.forEach((t) => {
      if (t.status === "pass") score += passWeight;
      else if (t.status === "warning") score += warningWeight;
    });

    return NextResponse.json({
      url: normalizedUrl,
      tags,
      score: Math.round(score),
    });
  } catch (error) {
    console.error("Meta checker error:", error);
    return NextResponse.json(
      { error: "Failed to analyze URL" },
      { status: 500 }
    );
  }
}
