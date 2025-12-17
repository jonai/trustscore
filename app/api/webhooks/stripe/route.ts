import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { createServerClient } from "@/lib/supabase";

/**
 * Analyze HTML and extract Website Quality and Trust & Security metrics
 */
async function analyzeHtmlForWebhook(url: string) {
  const defaultResult = {
    websiteQuality: {
      score: 0,
      wordCount: 0,
      hasFavicon: false,
      hasOpenGraph: false,
      ogTagsCount: 0,
      hasTwitterCards: false,
      twitterTagsCount: 0,
      hasSitemap: false,
      schemaCount: 0,
      hasCanonical: false,
      hasHreflang: false,
    },
    trustSecurity: {
      score: 0,
      hasHttps: url.startsWith("https"),
      hasHsts: false,
      hstsMaxAge: null as number | null,
      hasCsp: false,
      hasXFrameOptions: false,
      hasXContentTypeOptions: false,
      hasReferrerPolicy: false,
    },
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; TrustScoreBot/1.0)",
        Accept: "text/html,application/xhtml+xml",
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return defaultResult;
    }

    const html = await response.text();
    const headers = response.headers;

    // Trust & Security
    const trustSecurity = {
      hasHttps: url.startsWith("https"),
      hasHsts: headers.has("strict-transport-security"),
      hstsMaxAge: null as number | null,
      hasCsp:
        headers.has("content-security-policy") ||
        headers.has("content-security-policy-report-only"),
      hasXFrameOptions: headers.has("x-frame-options"),
      hasXContentTypeOptions: headers.has("x-content-type-options"),
      hasReferrerPolicy: headers.has("referrer-policy"),
      score: 0,
    };

    const hstsHeader = headers.get("strict-transport-security");
    if (hstsHeader) {
      const match = hstsHeader.match(/max-age=(\d+)/);
      if (match) trustSecurity.hstsMaxAge = parseInt(match[1], 10);
    }

    let trustScore = 0;
    if (trustSecurity.hasHttps) trustScore += 30;
    if (trustSecurity.hasHsts) trustScore += 20;
    if (trustSecurity.hasCsp) trustScore += 20;
    if (trustSecurity.hasXFrameOptions) trustScore += 10;
    if (trustSecurity.hasXContentTypeOptions) trustScore += 10;
    if (trustSecurity.hasReferrerPolicy) trustScore += 10;
    trustSecurity.score = trustScore;

    // Website Quality
    const websiteQuality = {
      wordCount: 0,
      hasFavicon: false,
      hasOpenGraph: false,
      ogTagsCount: 0,
      hasTwitterCards: false,
      twitterTagsCount: 0,
      hasSitemap: false,
      schemaCount: 0,
      hasCanonical: false,
      hasHreflang: false,
      score: 0,
    };

    // Word count
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

    // Open Graph
    const ogMatches = [
      ...html.matchAll(/<meta[^>]*property=["'](og:[^"']+)["'][^>]*>/gi),
    ];
    websiteQuality.ogTagsCount = ogMatches.length;
    websiteQuality.hasOpenGraph = ogMatches.length > 0;

    // Twitter Cards
    const twitterMatches = [
      ...html.matchAll(/<meta[^>]*name=["'](twitter:[^"']+)["'][^>]*>/gi),
    ];
    websiteQuality.twitterTagsCount = twitterMatches.length;
    websiteQuality.hasTwitterCards = twitterMatches.length > 0;

    // Schema.org
    const schemaMatches = html.match(
      /<script[^>]*type=["']application\/ld\+json["'][^>]*>/gi
    );
    websiteQuality.schemaCount = schemaMatches ? schemaMatches.length : 0;

    // Canonical
    websiteQuality.hasCanonical = /<link[^>]*rel=["']canonical["'][^>]*>/i.test(
      html
    );

    // Hreflang
    websiteQuality.hasHreflang =
      /<link[^>]*hreflang=["'][^"']+["'][^>]*>/i.test(html);

    // Sitemap check
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
    console.error("HTML analysis error in webhook:", error);
    return defaultResult;
  }
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Handle the checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const metadata = session.metadata;

    if (!metadata?.email || !metadata?.domain) {
      console.error("Missing metadata in session");
      return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
    }

    const supabase = createServerClient();

    try {
      // Run HTML analysis to get extended data
      const fullUrl = metadata.url || `https://${metadata.domain}`;
      const htmlAnalysis = await analyzeHtmlForWebhook(fullUrl);

      // 1. Create or get user
      let userId: string;

      const { data: existingUser } = await supabase
        .from("users")
        .select("id")
        .eq("email", metadata.email)
        .single();

      if (existingUser) {
        userId = existingUser.id;
        await supabase
          .from("users")
          .update({ stripe_customer_id: session.customer as string })
          .eq("id", userId);
      } else {
        const { data: newUser, error: userError } = await supabase
          .from("users")
          .insert({
            email: metadata.email,
            stripe_customer_id: session.customer as string,
          })
          .select("id")
          .single();

        if (userError || !newUser) {
          console.error("Error creating user:", userError);
          return NextResponse.json(
            { error: "Failed to create user" },
            { status: 500 }
          );
        }

        userId = newUser.id;
      }

      // 2. Check if domain already certified
      const { data: existingCert } = await supabase
        .from("certified_websites")
        .select("id")
        .eq("domain", metadata.domain)
        .single();

      if (existingCert) {
        console.log("Domain already certified:", metadata.domain);
        return NextResponse.json({
          received: true,
          status: "already_certified",
        });
      }

      // 3. Create certification with extended data
      const { data: certification, error: certError } = await supabase
        .from("certified_websites")
        .insert({
          user_id: userId,
          domain: metadata.domain,
          url: fullUrl,
          current_score: parseInt(metadata.current_score || "0"),
          performance_score: parseInt(metadata.performance_score || "0"),
          seo_score: parseInt(metadata.seo_score || "0"),
          accessibility_score: parseInt(metadata.accessibility_score || "0"),
          best_practices_score: parseInt(metadata.best_practices_score || "0"),
          // Website Quality fields
          website_quality_score: htmlAnalysis.websiteQuality.score,
          word_count: htmlAnalysis.websiteQuality.wordCount,
          has_favicon: htmlAnalysis.websiteQuality.hasFavicon,
          has_open_graph: htmlAnalysis.websiteQuality.hasOpenGraph,
          og_tags_count: htmlAnalysis.websiteQuality.ogTagsCount,
          has_twitter_cards: htmlAnalysis.websiteQuality.hasTwitterCards,
          twitter_tags_count: htmlAnalysis.websiteQuality.twitterTagsCount,
          has_sitemap: htmlAnalysis.websiteQuality.hasSitemap,
          schema_count: htmlAnalysis.websiteQuality.schemaCount,
          has_canonical: htmlAnalysis.websiteQuality.hasCanonical,
          has_hreflang: htmlAnalysis.websiteQuality.hasHreflang,
          // Trust & Security fields
          trust_security_score: htmlAnalysis.trustSecurity.score,
          has_https: htmlAnalysis.trustSecurity.hasHttps,
          has_hsts: htmlAnalysis.trustSecurity.hasHsts,
          hsts_max_age: htmlAnalysis.trustSecurity.hstsMaxAge,
          has_csp: htmlAnalysis.trustSecurity.hasCsp,
          has_x_frame_options: htmlAnalysis.trustSecurity.hasXFrameOptions,
          has_x_content_type_options:
            htmlAnalysis.trustSecurity.hasXContentTypeOptions,
          has_referrer_policy: htmlAnalysis.trustSecurity.hasReferrerPolicy,
          metrics: metadata.metrics ? JSON.parse(metadata.metrics) : null,
        })
        .select("id")
        .single();

      if (certError || !certification) {
        console.error("Error creating certification:", certError);
        return NextResponse.json(
          { error: "Failed to create certification" },
          { status: 500 }
        );
      }

      // 4. Create first audit history entry
      await supabase.from("audit_history").insert({
        website_id: certification.id,
        score: parseInt(metadata.current_score || "0"),
        performance_score: parseInt(metadata.performance_score || "0"),
        seo_score: parseInt(metadata.seo_score || "0"),
        accessibility_score: parseInt(metadata.accessibility_score || "0"),
        best_practices_score: parseInt(metadata.best_practices_score || "0"),
        website_quality_score: htmlAnalysis.websiteQuality.score,
        trust_security_score: htmlAnalysis.trustSecurity.score,
      });

      console.log("Certification created successfully:", metadata.domain);
    } catch (error) {
      console.error("Error processing webhook:", error);
      return NextResponse.json(
        { error: "Failed to process webhook" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}
