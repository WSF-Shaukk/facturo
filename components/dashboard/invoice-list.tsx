"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { InvoiceFilters } from "./invoice-filters";
import { InvoiceDetailsModal } from "./invoice-details-modal";
import { ReceiptModal } from "./receipt-modal";

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
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [selectedReceiptInvoice, setSelectedReceiptInvoice] =
    useState<Invoice | null>(null);

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
        <div className="bg-blue-50 border dark:bg-[#09090b] dark:text-white border-blue-200 dark:border-[#27272a] rounded-lg p-4 text-sm text-blue-800">
          Free plan: {5 - invoices.length} invoice
          {5 - invoices.length !== 1 ? "s" : ""} remaining. Upgrade to Pro for
          unlimited invoices.
        </div>
      )}

      {isPro && monthlyCount >= 100 && (
        <div className="bg-yellow-50 border  border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
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
                <th className="p-4 w-[0.5rem] whitespace-nowrap"></th>
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
                  <td className="p-4 whitespace-nowrap">
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedReceiptInvoice(invoice);
                          setIsReceiptModalOpen(true);
                        }}
                      >
                        Receipt
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          const link = document.createElement("a");
                          link.href = `/invoice/${invoice.id}`;
                          link.download = `Invoice-${invoice.invoiceNumber}.pdf`;
                          link.click();
                        }}
                      >
                        <svg
                          className="dark:fill-white"
                          fill="currentColor"
                          viewBox="0 0 32 32"
                          version="1.1"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                          <g
                            id="SVGRepo_tracerCarrier"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          ></g>
                          <g id="SVGRepo_iconCarrier">
                            {" "}
                            <title>download</title>{" "}
                            <path d="M18.313 13.625h-4.031v-6.594c0-0.563-0.469-1.031-1.031-1.031h-4.031c-0.594 0-1.063 0.469-1.063 1.031v6.594h-4.031c-0.531 0-0.719 0.344-0.313 0.75l6.688 6.656c0.188 0.188 0.438 0.281 0.719 0.281s0.563-0.094 0.75-0.281l6.656-6.656c0.375-0.406 0.25-0.75-0.313-0.75zM0 18.344v7.125c0 0.313 0.156 0.5 0.5 0.5h21.375c0.344 0 0.531-0.188 0.531-0.5v-7.125c0-0.313-0.25-0.531-0.531-0.531h-2.031c-0.281 0-0.531 0.25-0.531 0.531v4.531h-16.25v-4.531c0-0.313-0.219-0.531-0.5-0.531h-2.063c-0.281 0-0.5 0.25-0.5 0.531z"></path>{" "}
                          </g>
                        </svg>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (navigator.share) {
                            navigator.share({
                              title: `Invoice ${invoice.invoiceNumber}`,
                              text: `Invoice for ${invoice.clientName}`,
                              url: `/invoice/${invoice.id}`,
                            });
                          } else {
                            const text = `Invoice ${invoice.invoiceNumber} for ${invoice.clientName}`;
                            const url = `/invoice/${invoice.id}`;
                            window.open(
                              `https://wa.me/?text=${encodeURIComponent(
                                text + " " + url
                              )}`,
                              "_blank"
                            );
                          }
                        }}
                      >
                        <svg
                          className="dark:fill-white"
                          fill="currentColor"
                          viewBox="0 0 1920 1920"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                          <g
                            id="SVGRepo_tracerCarrier"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          ></g>
                          <g id="SVGRepo_iconCarrier">
                            {" "}
                            <path
                              d="M1513.827 1278.28c-96.772 0-182.634 43.765-241.415 111.531l-564.2-325.737c11.807-33.498 19.508-69.049 19.508-106.654 0-34.91-7.06-68.022-17.327-99.595l563.815-325.48c58.782 66.482 143.746 109.35 239.619 109.35 177.243 0 320.86-143.618 320.86-320.86 0-177.244-143.617-320.86-320.86-320.86-177.243 0-320.86 143.616-320.86 320.86 0 35.165 7.059 68.407 17.454 99.98l-563.686 325.48C587.953 679.554 502.86 636.56 406.86 636.56 229.617 636.56 86 780.177 86 957.42c0 177.243 143.617 320.86 320.86 320.86 93.434 0 176.601-40.428 235.254-104.215l567.537 327.662c-9.882 30.803-16.684 63.145-16.684 97.413 0 177.243 143.617 320.86 320.86 320.86 177.243 0 320.86-143.617 320.86-320.86 0-177.243-143.617-320.86-320.86-320.86"
                              fill-rule="evenodd"
                            ></path>{" "}
                          </g>
                        </svg>
                      </Button>
                    </div>
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

      <ReceiptModal
        invoice={selectedReceiptInvoice}
        open={isReceiptModalOpen}
        onOpenChange={setIsReceiptModalOpen}
      />
      
    </div>
  );
}
