import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { createServerClient } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { customerId, priceId, userEmail } = await req.json();

    if (!priceId) {
      console.error("Missing priceId in request");
      return NextResponse.json(
        { error: "Price ID is required" },
        { status: 400 }
      );
    }

    if (!customerId || !userEmail) {
      console.error("Missing customer info in request");
      return NextResponse.json(
        { error: "Customer ID and email are required" },
        { status: 400 }
      );
    }

    const headersList = await headers();
    const origin = headersList.get("origin");

    console.log("Creating checkout session with:", {
      customerId,
      priceId,
      origin,
    });

    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${origin}/api/stripe/success?session_id={CHECKOUT_SESSION_ID}&email=${encodeURIComponent(
        userEmail
      )}`,
      cancel_url: `${origin}/dashboard?canceled=true`,
      subscription_data: {
        metadata: {
          customerId,
          userEmail,
        },
      },
    });

    console.log("Checkout session created:", {
      sessionId: session.id,
      url: session.url,
    });

    return NextResponse.json({ data: session });
  } catch (error: any) {
    console.error("Stripe checkout error:", {
      error: error.message,
      type: error.type,
      code: error.code,
    });

    return NextResponse.json(
      { error: error.message || "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
