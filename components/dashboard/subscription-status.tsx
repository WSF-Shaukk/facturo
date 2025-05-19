"use client";

import { useState } from "react";
import { createBrowserClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/lib/i18n/language-context";

interface User {
  id: string;
  email: string;
  is_pro: boolean;
  stripe_customer_id: string | null;
}

interface SubscriptionStatusProps {
  user: User | null;
}

export function SubscriptionStatus({ user }: SubscriptionStatusProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();

  // If no user data, show loading state
  if (!user) {
    return (
      <div className="rounded-lg border p-6">
        <h2 className="text-xl font-semibold">
          {t.dashboard.subscription.title}
        </h2>
        <div className="mt-4">
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  async function handleUpgrade() {
    if (!process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID) {
      setError("Stripe price ID not configured");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Get or create Stripe customer
      let customerId = user.stripe_customer_id;

      if (!customerId) {
        const response = await fetch("/api/stripe/customer", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: user.email,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to create customer");
        }

        const { data: customer } = await response.json();
        customerId = customer.id;
      }

      // Create Stripe checkout session
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerId,
          priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
          userEmail: user.email,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create checkout session");
      }

      const { data: session } = await response.json();

      if (!session?.url) {
        throw new Error("Invalid checkout session");
      }

      // Redirect to checkout
      window.location.href = session.url;
    } catch (error) {
      console.error("Upgrade error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to start checkout process"
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="rounded-lg border p-6">
      <h2 className="text-xl font-semibold">
        {t.dashboard.subscription.title}
      </h2>
      <div className="mt-4">
        <p className="text-sm text-muted-foreground">
          {t.dashboard.subscription.currentPlan}{" "}
          <span className="font-medium">
            {user.is_pro
              ? t.dashboard.subscription.pro
              : t.dashboard.subscription.free}
          </span>
        </p>
        {!user.is_pro && (
          <>
            <Button
              onClick={handleUpgrade}
              className="mt-4"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t.dashboard.subscription.upgradeToPro}
            </Button>
            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
          </>
        )}
      </div>
    </div>
  );
}
