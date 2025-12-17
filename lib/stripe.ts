import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
  typescript: true,
});

// Price for lifetime certification
export const CERTIFICATION_PRICE = 3500; // $35.00 in cents
export const CERTIFICATION_PRICE_DISPLAY = "$35";
