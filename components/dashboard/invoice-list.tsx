"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { InvoiceFilters } from "./invoice-filters";
import { InvoiceDetailsModal } from "./invoice-details-modal";

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
  const [filters, setFilters] = useState({
    search: "",
    startDate: "",
    endDate: "",
    minAmount: "",
    maxAmount: "",
  });

  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredInvoices = useMemo(() => {
    return invoices.filter((invoice) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          invoice.invoiceNumber.toLowerCase().includes(searchLower) ||
          invoice.clientName.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Date range filter
      if (filters.startDate && filters.endDate) {
        const invoiceDate = new Date(invoice.date);
        const startDate = new Date(filters.startDate);
        const endDate = new Date(filters.endDate);
        endDate.setHours(23, 59, 59); // Include the entire end date

        if (invoiceDate < startDate || invoiceDate > endDate) return false;
      }

      // Amount range filter
      if (filters.minAmount || filters.maxAmount) {
        const minAmount = filters.minAmount ? parseFloat(filters.minAmount) : 0;
        const maxAmount = filters.maxAmount
          ? parseFloat(filters.maxAmount)
          : Infinity;
        if (invoice.total < minAmount || invoice.total > maxAmount)
          return false;
      }

      return true;
    });
  }, [invoices, filters]);

  const canCreateInvoice = isPro || invoices.length < 5;

  const handleInvoiceClick = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsModalOpen(true);
  };

  // Helper function to get combined description from line items
  const getCombinedDescription = (lineItems: LineItem[]) => {
    return lineItems.map((item) => item.description).join(", ");
  };

  return (
    <div className="space-y-4 overflow-x-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-xl font-semibold">Your History</h2>
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

      <InvoiceFilters onFilterChange={setFilters} />

      {filteredInvoices.length > 0 ? (
        <div className="border rounded-lg overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="p-4 text-left whitespace-nowrap">
                  Invoice Number
                </th>
                <th className="p-4 text-left whitespace-nowrap">Client</th>
                <th className="p-4 text-left whitespace-nowrap">Date</th>
                <th className="p-4 text-left whitespace-nowrap">Amount</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="border-b hover:bg-muted/30 cursor-pointer transition-colors"
                  onClick={() => handleInvoiceClick(invoice)}
                >
                  <td className="p-4 whitespace-nowrap">
                    {invoice.invoiceNumber}
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    {invoice.clientName}
                  </td>
                  <td className="p-4 whitespace-nowrap">{invoice.date}</td>
                  <td className="p-4 whitespace-nowrap">
                    {invoice.currency} {(invoice.total || 0).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          {invoices.length > 0
            ? "No matching invoices found."
            : "No invoices found."}
        </div>
      )}

      <InvoiceDetailsModal
        invoice={selectedInvoice}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </div>
  );
}
