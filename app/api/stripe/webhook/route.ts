import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createServerClient } from "@/lib/supabase";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("Stripe-Signature") as string;

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error("STRIPE_WEBHOOK_SECRET is not set");
    return new NextResponse("Webhook secret not configured", { status: 500 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error: any) {
    console.error("Webhook signature verification failed:", error.message);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const supabase = createServerClient();

  console.log("Received Stripe webhook event:", event.type);

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log("Processing completed checkout session:", {
          customerEmail: session.customer_email,
          customerId: session.customer,
        });

        if (!session.customer_email) {
          throw new Error("No customer email in session");
        }

        // Update user record with Stripe customer ID and pro status
        const { error: updateError } = await supabase
          .from("users")
          .update({
            stripe_customer_id: session.customer as string,
            is_pro: true,
          })
          .eq("email", session.customer_email);

        if (updateError) {
          throw new Error(`Failed to update user: ${updateError.message}`);
        }

        console.log("Successfully updated user to pro status");
        break;
      }

      case "customer.subscription.deleted":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        console.log("Processing subscription update:", {
          status: subscription.status,
          customerId: subscription.customer,
        });

        if (subscription.status === "active") {
          console.log("Subscription is active, maintaining pro status");
          break;
        }

        // Remove pro status when subscription is cancelled or unpaid
        const { error: updateError } = await supabase
          .from("users")
          .update({
            is_pro: false,
          })
          .eq("stripe_customer_id", subscription.customer as string);

        if (updateError) {
          throw new Error(
            `Failed to remove pro status: ${updateError.message}`
          );
        }

        console.log("Successfully removed pro status");
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        console.log(`Payment failed for invoice ${invoice.id}`);
        break;
      }
    }

    return new NextResponse(null, { status: 200 });
  } catch (error: any) {
    console.error("Error processing webhook:", error.message);
    return new NextResponse(error.message, { status: 500 });
  }
}
