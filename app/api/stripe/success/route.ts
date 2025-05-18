import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createServerClient } from "@/lib/supabase";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("session_id");
    const email = searchParams.get("email");

    if (!sessionId || !email) {
      return new NextResponse("Missing session ID or email", { status: 400 });
    }

    // Retrieve the session to confirm it's valid and paid
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      const supabase = createServerClient();

      // Update user record with Stripe customer ID and pro status
      const { error: updateError } = await supabase
        .from("users")
        .update({
          stripe_customer_id: session.customer as string,
          is_pro: true,
        })
        .eq("email", email);

      if (updateError) {
        console.error("Error updating user status:", updateError);
        return redirect("/dashboard?error=update_failed");
      }

      return redirect("/dashboard?success=true");
    }

    return redirect("/dashboard?error=payment_incomplete");
  } catch (error: any) {
    console.error("Error processing success callback:", error);
    return redirect("/dashboard?error=unknown");
  }
}
