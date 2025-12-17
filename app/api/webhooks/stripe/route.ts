import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { createServerClient } from "@/lib/supabase";

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
      // 1. Create or get user
      let userId: string;

      const { data: existingUser } = await supabase
        .from("users")
        .select("id")
        .eq("email", metadata.email)
        .single();

      if (existingUser) {
        userId = existingUser.id;
        // Update stripe_customer_id if needed
        await supabase
          .from("users")
          .update({ stripe_customer_id: session.customer as string })
          .eq("id", userId);
      } else {
        // Create new user
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

      // 3. Create certification
      const { data: certification, error: certError } = await supabase
        .from("certified_websites")
        .insert({
          user_id: userId,
          domain: metadata.domain,
          url: metadata.url,
          current_score: parseInt(metadata.current_score || "0"),
          performance_score: parseInt(metadata.performance_score || "0"),
          seo_score: parseInt(metadata.seo_score || "0"),
          accessibility_score: parseInt(metadata.accessibility_score || "0"),
          best_practices_score: parseInt(metadata.best_practices_score || "0"),
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
