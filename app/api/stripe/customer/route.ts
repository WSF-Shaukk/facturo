import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createServerClient } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    // Create a new customer in Stripe
    const customer = await stripe.customers.create({
      email,
    });

    // Update user with Stripe customer ID
    const supabase = createServerClient();
    await supabase
      .from("users")
      .update({ stripe_customer_id: customer.id })
      .eq("email", email);

    return NextResponse.json({ data: customer });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
