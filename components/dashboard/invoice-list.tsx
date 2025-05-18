"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
  subtotal: number;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  clientName: string;
  lineItems: LineItem[];
  currency: string;
  total: number;
  notes?: string;
}

interface InvoiceListProps {
  invoices: Invoice[];
  isPro: boolean;
  monthlyCount: number;
}

export function InvoiceList({
  invoices,
  isPro,
  monthlyCount,
}: InvoiceListProps) {
  const canCreateInvoice = isPro || invoices.length < 5;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Invoices</h2>
        {canCreateInvoice ? (
          <Link href="/invoice">
            <Button>Create New Invoice</Button>
          </Link>
        ) : (
          <Button disabled>Upgrade to Pro to Create More Invoices</Button>
        )}
      </div>

      {!isPro && invoices.length >= 5 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
          You have reached the free plan limit (5 invoices). Upgrade to Pro to
          create unlimited invoices.
        </div>
      )}

      {!isPro && invoices.length < 5 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
          Free plan: {5 - invoices.length} invoice
          {5 - invoices.length !== 1 ? "s" : ""} remaining. Upgrade to Pro for
          unlimited invoices.
        </div>
      )}

      {isPro && monthlyCount >= 100 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
          You have reached your monthly invoice limit (100). Previous invoices
          will still be accessible.
        </div>
      )}

      {invoices.length > 0 ? (
        <div className="border rounded-lg">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="p-4 text-left">Invoice Number</th>
                <th className="p-4 text-left">Client</th>
                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-left">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="border-b">
                  <td className="p-4">{invoice.invoiceNumber}</td>
                  <td className="p-4">{invoice.clientName}</td>
                  <td className="p-4">{invoice.date}</td>
                  <td className="p-4">
                    {invoice.currency} {(invoice.total || 0).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          No invoices found.
        </div>
      )}
    </div>
  );
}
