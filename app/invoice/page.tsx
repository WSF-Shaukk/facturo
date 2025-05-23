"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { InvoiceForm } from "@/components/invoice-form";
import type { InvoiceData } from "@/lib/types";
import { useLanguage } from "@/lib/i18n/language-context";
import { createBrowserClient } from "@/lib/supabase";
import { Lock } from "lucide-react";

export default function InvoicePage() {
  const router = useRouter();
  const { t, dir } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isPro, setIsPro] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkProStatus = async () => {
      const supabase = createBrowserClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: userData } = await supabase
          .from("users")
          .select("is_pro")
          .eq("id", user.id)
          .single();

        setIsPro(userData?.is_pro || false);
      }
      setIsLoading(false);
    };

    checkProStatus();
  }, []);

  // Function to generate a unique invoice number
  const generateUniqueInvoiceNumber = async (userId: string) => {
    const supabase = createBrowserClient();

    // Get user data to check pro status and client number
    const { data: userData } = await supabase
      .from("users")
      .select("is_pro, client_number, company_name")
      .eq("id", userId)
      .single();

    // Get the latest invoice number for this user
    const { data: latestInvoice } = await supabase
      .from("invoices")
      .select("invoice_number")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1);

    let newNumber = 1;
    if (latestInvoice && latestInvoice.length > 0) {
      if (userData?.is_pro) {
        // For pro users, extract the last number after the last hyphen
        const match = latestInvoice[0].invoice_number.match(/-(\d+)$/);
        if (match && match[1]) {
          newNumber = parseInt(match[1], 10) + 1;
        }
      } else {
        // For free users, keep the existing logic
        const match = latestInvoice[0].invoice_number.match(/FACT-(\d+)/);
        if (match && match[1]) {
          newNumber = parseInt(match[1], 10) + 1;
        }
      }
    }

    if (userData?.is_pro) {
      // Format: USERNAME-DATE-CLIENTNUMBER-INVOICENUMBER
      const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
      const clientNumber = userData.client_number || "1";
      const companyName = userData.company_name?.toUpperCase() || "COMPANY";
      return `${companyName}-${today}-${clientNumber}-${newNumber}`;
    } else {
      // Free user format remains the same
      return `FACT-${String(newNumber).padStart(3, "0")}`;
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isPro) return;

    try {
      setUploadingLogo(true);
      const file = e.target.files?.[0];
      if (!file) return;

      const supabase = createBrowserClient();

      // Upload to Supabase storage
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("invoice-logos")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get the public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("invoice-logos").getPublicUrl(fileName);

      setLogoUrl(publicUrl);
    } catch (error) {
      console.error("Error uploading logo:", error);
      alert("Failed to upload logo. Please try again.");
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSubmit = async (data: InvoiceData) => {
    setIsSubmitting(true);

    try {
      const supabase = createBrowserClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // Add logo URL to invoice data
      const invoiceDataWithLogo = {
        ...data,
        logo_url: logoUrl,
      };

      let uniqueInvoiceNumber: string;

      // If user is logged in, save to their account
      if (user) {
        // Get user data to check pro status
        const { data: userData } = await supabase
          .from("users")
          .select("is_pro, company_name, client_number")
          .eq("id", user.id)
          .single();

        // Get current invoice count
        const { count: invoiceCount } = await supabase
          .from("invoices")
          .select("*", { count: "exact" })
          .eq("user_id", user.id);

        // Check if user can create more invoices
        const isPro = userData?.is_pro ?? false;
        if (!isPro && (invoiceCount ?? 0) >= 5) {
          throw new Error(
            "Free plan limit reached (5 invoices). Please upgrade to Pro to create more invoices."
          );
        }

        // Generate a unique invoice number for logged-in user
        uniqueInvoiceNumber = await generateUniqueInvoiceNumber(user.id);

        // Map form data to database schema
        const invoiceData = {
          user_id: user.id,
          invoice_number: uniqueInvoiceNumber,
          date: data.date,
          client_name: data.clientName,
          business_name: data.businessName,
          business_address: data.businessAddress,
          business_phone: data.businessPhone,
          business_email: data.businessEmail,
          business_tin: data.businessTin,
          business_rc_number: data.businessRcNumber,
          vat_rate: data.vatRate,
          prices_include_vat: data.pricesIncludeVat,
          payment_terms: data.paymentTerms,
          payment_terms_custom: data.paymentTermsCustom,
          items: data.lineItems,
          currency: data.currency,
          total: data.total,
          notes: data.notes,
          logo_url: logoUrl,
        };

        console.log("Attempting to save invoice data:", invoiceData);

        const { error: saveError } = await supabase
          .from("invoices")
          .insert([invoiceData]);

        if (saveError) {
          console.error("Supabase save error:", saveError);
          throw saveError;
        }
      } else {
        // For guest users, generate a temporary invoice number
        const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
        const randomNum = Math.floor(Math.random() * 1000)
          .toString()
          .padStart(3, "0");
        uniqueInvoiceNumber = `GUEST-${today}-${randomNum}`;
      }

      // Update the invoice data with the new invoice number for preview
      invoiceDataWithLogo.invoiceNumber = uniqueInvoiceNumber;

      // Store the invoice data in localStorage for preview
      localStorage.setItem("invoiceData", JSON.stringify(invoiceDataWithLogo));
      localStorage.setItem(
        "lastInvoiceNumber",
        invoiceDataWithLogo.invoiceNumber
      );

      // Navigate to the preview page
      router.push("/invoice/preview");
    } catch (error) {
      console.error("Error saving invoice:", error);
      if (error && typeof error === "object" && "message" in error) {
        alert(`Failed to save invoice: ${error.message}`);
      } else {
        alert("Failed to save invoice. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8" dir={dir}>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">{t.invoice.create}</h1>

        {/* Logo Upload Section */}
        <div className="mb-6 p-4 border rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Invoice Logo</h3>
            {!isPro && (
              <div className="flex items-center text-sm text-gray-500">
                <Lock className="w-4 h-4 mr-1" />
                Pro Feature
              </div>
            )}
          </div>

          {logoUrl && isPro && (
            <div className="mb-4">
              <img
                src={logoUrl}
                alt="Invoice Logo"
                className="max-w-[200px] max-h-[100px] object-contain"
              />
            </div>
          )}

          <div className="flex items-center gap-4">
            <label
              className={`cursor-pointer px-4 py-2 rounded ${
                isPro
                  ? "bg-blue-500 hover:bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
            >
              <span>{uploadingLogo ? "Uploading..." : "Upload Logo"}</span>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleLogoUpload}
                disabled={uploadingLogo || !isPro}
              />
            </label>
            {isPro ? (
              <p className="text-sm text-gray-500">
                Recommended size: 200x100px. Max size: 2MB
              </p>
            ) : (
              <p className="text-sm text-gray-500">
                Upgrade to Pro to add your company logo to invoices
              </p>
            )}
          </div>
        </div>

        <InvoiceForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
          Note: Sign in to save your invoices and access them later. Guest
          invoices are only available for preview and download.
        </div>
      </div>
    </div>
  );
}
