import { NextRequest, NextResponse } from "next/server";
import { stripe, CERTIFICATION_PRICE } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, domain, url, scores, metrics } = body;

    if (!email || !domain || !url || !scores) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Clean the domain
    const cleanDomain = domain
      .toLowerCase()
      .replace(/^https?:\/\//, "")
      .replace(/^www\./, "")
      .replace(/\/$/, "");

    // Get or create customer
    const customers = await stripe.customers.list({ email, limit: 1 });
    let customer = customers.data[0];

    if (!customer) {
      customer = await stripe.customers.create({ email });
    }

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "VerifiedTrustScore Lifetime Certification",
              description: `Verified badge & dofollow backlink for ${cleanDomain}`,
            },
            unit_amount: CERTIFICATION_PRICE,
          },
          quantity: 1,
        },
      ],
      metadata: {
        email,
        domain: cleanDomain,
        url,
        current_score: String(scores.average),
        performance_score: String(scores.performance),
        seo_score: String(scores.seo),
        accessibility_score: String(scores.accessibility),
        best_practices_score: String(scores.bestPractices),
        metrics: JSON.stringify(metrics || {}),
      },
      success_url: `${request.headers.get(
        "origin"
      )}/certified/${cleanDomain}?success=true`,
      cancel_url: `${request.headers.get("origin")}/?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
