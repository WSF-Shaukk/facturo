"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createBrowserClient } from "@/lib/supabase";

interface InvoiceFormProps {
  userId: string;
}

export function InvoiceForm({ userId }: InvoiceFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createBrowserClient();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const invoiceData = {
      user_id: userId,
      invoice_number: formData.get("invoice_number") as string,
      client_name: formData.get("client_name") as string,
      client_email: formData.get("client_email") as string,
      amount: parseFloat(formData.get("amount") as string),
      description: formData.get("description") as string,
      status: "pending",
      created_at: new Date().toISOString(),
    };

    try {
      const { error: createError } = await supabase
        .from("invoices")
        .insert([invoiceData]);

      if (createError) throw createError;

      router.push("/dashboard?success=invoice_created");
    } catch (err) {
      console.error("Error creating invoice:", err);
      setError("Failed to create invoice. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="space-y-4">
        <div>
          <label
            htmlFor="invoice_number"
            className="block text-sm font-medium mb-1"
          >
            Invoice Number
          </label>
          <Input
            id="invoice_number"
            name="invoice_number"
            required
            placeholder="INV-001"
          />
        </div>

        <div>
          <label
            htmlFor="client_name"
            className="block text-sm font-medium mb-1"
          >
            Client Name
          </label>
          <Input
            id="client_name"
            name="client_name"
            required
            placeholder="Client Name"
          />
        </div>

        <div>
          <label
            htmlFor="client_email"
            className="block text-sm font-medium mb-1"
          >
            Client Email
          </label>
          <Input
            id="client_email"
            name="client_email"
            type="email"
            required
            placeholder="client@example.com"
          />
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium mb-1">
            Amount ($)
          </label>
          <Input
            id="amount"
            name="amount"
            type="number"
            step="0.01"
            required
            placeholder="0.00"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium mb-1"
          >
            Description
          </label>
          <Textarea
            id="description"
            name="description"
            required
            placeholder="Invoice description..."
            rows={4}
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-800">
          {error}
        </div>
      )}

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Creating..." : "Create Invoice"}
      </Button>
    </form>
  );
}
