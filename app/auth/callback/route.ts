import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // Exchange the code for a session
    const {
      data: { user },
      error: sessionError,
    } = await supabase.auth.exchangeCodeForSession(code);

    if (sessionError) {
      console.error("Session error:", sessionError);
      return NextResponse.redirect(new URL("/login?error=auth", request.url));
    }

    if (user) {
      // Check if user exists in our users table
      const { data: existingUser } = await supabase
        .from("users")
        .select("id")
        .eq("id", user.id)
        .single();

      if (!existingUser) {
        // Create new user record
        const { error: createError } = await supabase.from("users").insert([
          {
            id: user.id,
            email: user.email,
            is_pro: false,
            monthly_invoice_count: 0,
            stripe_customer_id: null,
          },
        ]);

        if (createError) {
          console.error("Error creating user:", createError);
          return NextResponse.redirect(
            new URL("/login?error=database", request.url)
          );
        }
      }
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(new URL("/dashboard", request.url));
}
