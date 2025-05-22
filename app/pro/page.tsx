"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckIcon, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { createBrowserClient } from "@/lib/supabase";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Currency conversion rates (you should update these regularly or use an API)
const EXCHANGE_RATES = {
  USD: 1,
  EUR: 0.92,
  KES: 130.5,
  NGN: 1300,
  GHS: 12.5,
  UGX: 3800,
  TZS: 2500,
  RWF: 1300,
  FCFA: 600,
};

// Currency symbols and formatting
const CURRENCY_FORMAT = {
  USD: { symbol: "$", position: "before" },
  EUR: { symbol: "€", position: "before" },
  KES: { symbol: "KSh", position: "before" },
  NGN: { symbol: "₦", position: "before" },
  GHS: { symbol: "GH₵", position: "before" },
  UGX: { symbol: "USh", position: "before" },
  TZS: { symbol: "TSh", position: "before" },
  RWF: { symbol: "RF", position: "before" },
  FCFA: { symbol: "CFA", position: "before" },
};

export default function ProPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [convertedPrice, setConvertedPrice] = useState(3.99);

  // Convert price when currency changes
  useEffect(() => {
    const basePrice = 3.99; // Base price in USD
    const rate =
      EXCHANGE_RATES[selectedCurrency as keyof typeof EXCHANGE_RATES] || 1;
    const converted = basePrice * rate;
    setConvertedPrice(Number(converted.toFixed(2)));
  }, [selectedCurrency]);

  // Format price with currency symbol
  const formatPrice = (price: number, currency: string) => {
    const format = CURRENCY_FORMAT[currency as keyof typeof CURRENCY_FORMAT];
    if (!format) return `${price}`;

    return format.position === "before"
      ? `${format.symbol}${price}`
      : `${price}${format.symbol}`;
  };

  async function handleUpgrade() {
    if (!process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID) {
      setError("Stripe price ID not configured");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const supabase = createBrowserClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user?.email) {
        window.location.href = "/login";
        return;
      }

      // Get or create Stripe customer
      let { data: userData } = await supabase
        .from("users")
        .select("stripe_customer_id")
        .eq("email", user.email)
        .single();

      let customerId = userData?.stripe_customer_id;

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
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">
          Upgrade to Facturo Pro
        </h1>
        <p className="text-xl mb-12 text-muted-foreground">
          Get more features to grow your business
        </p>

        <div className="flex justify-center mb-8">
          <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">$ (USD)</SelectItem>
              <SelectItem value="EUR">€ (EUR)</SelectItem>
              <SelectItem value="KES">KES (Kenyan Shilling)</SelectItem>
              <SelectItem value="NGN">NGN (Nigerian Naira)</SelectItem>
              <SelectItem value="GHS">GHS (Ghanaian Cedi)</SelectItem>
              <SelectItem value="UGX">UGX (Ugandan Shilling)</SelectItem>
              <SelectItem value="TZS">TZS (Tanzanian Shilling)</SelectItem>
              <SelectItem value="RWF">RWF (Rwandan Franc)</SelectItem>
              <SelectItem value="FCFA">FCFA (Franc CFA)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="border rounded-lg p-6 text-left bg-card">
            <h2 className="text-xl font-bold mb-4">Free</h2>
            <p className="text-3xl font-bold mb-6">
              {formatPrice(0, selectedCurrency)}{" "}
              <span className="text-base font-normal text-muted-foreground">
                /month
              </span>
            </p>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <span>Up to 5 invoices per month</span>
              </li>
              <li className="flex items-start">
                <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <span>PDF downloads</span>
              </li>
              <li className="flex items-start">
                <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <span>Multilingual Support</span>
              </li>
            </ul>

            <Link href="/invoice">
              <Button variant="outline" className="w-full">
                Continue with Free
              </Button>
            </Link>
          </div>

          <div className="border rounded-lg p-6 text-left bg-card border-primary">
            <div className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full w-fit mb-2">
              RECOMMENDED
            </div>
            <h2 className="text-xl font-bold mb-4">Pro</h2>
            <p className="text-3xl font-bold mb-6">
              {formatPrice(convertedPrice, selectedCurrency)}{" "}
              <span className="text-base font-normal text-muted-foreground">
                /month
              </span>
            </p>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <span>Unlimited Invoices</span>
              </li>
              <li className="flex items-start">
                <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <span>PDF Download</span>
              </li>
              <li className="flex items-start">
                <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <span>Custom logo Upload</span>
              </li>
              <li className="flex items-start">
                <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <span>Invoice history</span>
              </li>
              <li className="flex items-start">
                <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <span>Multilingual Support</span>
              </li>
            </ul>

            <Button
              className="w-full"
              onClick={handleUpgrade}
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Upgrade to Pro
            </Button>
            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
          </div>
        </div>

        <p className="mt-8 text-muted-foreground">
          Need more features?{" "}
          <Link href="#" className="text-primary hover:underline">
            Contact us
          </Link>{" "}
          for enterprise plans.
        </p>
      </div>
    </div>
  );
}
