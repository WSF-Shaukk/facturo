import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/header";
import { InvoiceList } from "@/components/dashboard/invoice-list";
import { SubscriptionStatus } from "@/components/dashboard/subscription-status";

export default async function DashboardPage() {
  const supabase = createServerComponentClient({
    cookies: () => cookies(),
  });

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  // Get user data including subscription status
  const { data: userData } = await supabase
    .from("users")
    .select("*")
    .eq("email", user.email)
    .single();

  // Ensure we have default values if userData is null
  const userWithDefaults = {
    ...userData,
    is_pro: userData?.is_pro || false,
    monthly_invoice_count: userData?.monthly_invoice_count || 0,
    stripe_customer_id: userData?.stripe_customer_id || null,
  };

  // Get user's invoices
  const { data: rawInvoices, count: totalInvoices } = await supabase
    .from("invoices")
    .select("*", { count: "exact" })
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(userWithDefaults.is_pro ? 100 : 5);

  // Transform invoice data to match the form structure
  const invoices = (rawInvoices || []).map((invoice) => ({
    id: invoice.id,
    invoiceNumber: invoice.invoice_number,
    date: invoice.date,
    clientName: invoice.client_name,
    businessName: invoice.business_name,
    businessAddress: invoice.business_address,
    businessPhone: invoice.business_phone,
    businessEmail: invoice.business_email,
    businessTin: invoice.business_tin,
    businessRcNumber: invoice.business_rc_number,
    vatRate: invoice.vat_rate,
    pricesIncludeVat: invoice.prices_include_vat,
    paymentTerms: invoice.payment_terms,
    paymentTermsCustom: invoice.payment_terms_custom,
    lineItems: invoice.items || [],
    currency: invoice.currency || "FCFA",
    total: invoice.total || 0,
    notes: invoice.notes,
    logo_url: invoice.logo_url,
  }));

  return (
    <div className="container mx-auto py-10">
      <DashboardHeader user={user} />
      <div className="grid gap-8">
        <SubscriptionStatus user={userWithDefaults} />
        <InvoiceList
          invoices={invoices}
          isPro={userWithDefaults.is_pro}
          monthlyCount={
            userWithDefaults.is_pro
              ? userWithDefaults.monthly_invoice_count
              : totalInvoices || 0
          }
        />
      </div>
    </div>
  );
}
