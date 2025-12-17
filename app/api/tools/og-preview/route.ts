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

    // Extract OG tags
    const getMetaContent = (property: string, name?: string) => {
      // Try property first
      const propertyMatch = html.match(
        new RegExp(
          `<meta[^>]*property=["']${property}["'][^>]*content=["']([^"']*)["']`,
          "i"
        )
      );
      if (propertyMatch) return propertyMatch[1];

      // Try content before property
      const propertyMatch2 = html.match(
        new RegExp(
          `<meta[^>]*content=["']([^"']*)["'][^>]*property=["']${property}["']`,
          "i"
        )
      );
      if (propertyMatch2) return propertyMatch2[1];

      // Try name fallback
      if (name) {
        const nameMatch = html.match(
          new RegExp(
            `<meta[^>]*name=["']${name}["'][^>]*content=["']([^"']*)["']`,
            "i"
          )
        );
        if (nameMatch) return nameMatch[1];

        const nameMatch2 = html.match(
          new RegExp(
            `<meta[^>]*content=["']([^"']*)["'][^>]*name=["']${name}["']`,
            "i"
          )
        );
        if (nameMatch2) return nameMatch2[1];
      }

      return null;
    };

    const result = {
      title:
        getMetaContent("og:title") ||
        html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1] ||
        null,
      description: getMetaContent("og:description", "description"),
      image: getMetaContent("og:image"),
      siteName: getMetaContent("og:site_name"),
      url: getMetaContent("og:url"),
      type: getMetaContent("og:type"),
      twitterCard: getMetaContent("twitter:card"),
      twitterTitle: getMetaContent("twitter:title"),
      twitterDescription: getMetaContent("twitter:description"),
      twitterImage: getMetaContent("twitter:image"),
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("OG Preview error:", error);
    return NextResponse.json(
      { error: "Failed to analyze URL" },
      { status: 500 }
    );
  }
}
