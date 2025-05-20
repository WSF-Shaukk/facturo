"use client";

import type { InvoiceData } from "@/lib/types";
import { useLanguage } from "@/lib/i18n/language-context";
import Image from "next/image";

interface InvoicePDFProps {
  data: InvoiceData;
}

export function InvoicePDF({ data }: InvoicePDFProps) {
  const { t } = useLanguage();
  const subtotal = data.lineItems.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );
  const taxAmount = data.lineItems.reduce((sum, item) => sum + item.tax, 0);
  const total = data.total;
  const showVat = data.vatRate > 0;
  const paymentTerms =
    data.paymentTerms === "custom"
      ? data.paymentTermsCustom
      : data.paymentTerms;

  return (
    <div className="p-8 bg-[#18191A] shadow-lg max-w-4xl mx-auto text-white font-sans">
      {/* Header: Business & Client Info */}
      <div className="flex flex-col md:flex-row justify-between gap-8  pb-6 mb-1">
        {/* Business Info */}
        <div className="space-y-2 text-sm">
          <div className="text-xl font-bold mb-1">{data.businessName}</div>
          <div>Professional Invoices</div>
          {data.businessRcNumber && (
            <div>
              <span className="font-medium">RC Number:</span>{" "}
              <span className="">{data.businessRcNumber}</span>
            </div>
          )}
          {data.businessTin && (
            <div>
              <span className="font-medium">TIN</span>: <span className="">{data.businessTin}</span>
            </div>
          )}
          {data.businessAddress && <div><span className="font-medium">Address:</span> {data.businessAddress}</div>}
          {data.businessPhone && (
            <div>
              <span className="font-medium">Phone:</span> <span className="">{data.businessPhone}</span>
            </div>
          )}
          {data.businessEmail && (
            <div>
              <span className="font-medium">Email:</span>{" "}
              <span className="">{data.businessEmail}</span>
            </div>
          )}
        </div>
        {/* Client Info */}
        <div className="space-y-2 text-sm md:text-left">
          <div className="font-bold text-base mb-1">Bill To:</div>
          <div>{data.clientName}</div>
          {data.clientAddress && <div>{data.clientAddress}</div>}
          {data.clientTin && (
            <div>
              <span className="font-medium">TIN:</span> <span >{data.clientTin}</span>
            </div>
          )}
        </div>
      </div>

      {/* Invoice Info */}
      <div className="mb-6">
        <div className="font-bold text-lg">INVOICE</div>
        <div className="flex flex-col gap-2 mt-1 text-sm">
          <div>
            Invoice Number:{" "}
            <span className="font-medium">{data.invoiceNumber}</span>
          </div>
          <div>
            Date: <span className="font-medium">{data.date}</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto mb-6 mt-10">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left py-2 font-semibold">Description</th>
              <th className="text-center py-2 font-semibold">Quantity</th>
              <th className="text-center py-2 font-semibold">Unit Price</th>
              <th className="text-right py-2 font-semibold">Amount</th>
            </tr>
          </thead>
          <tbody>
            {data.lineItems.map((item, idx) => (
              <tr key={idx} className="border-b border-gray-800">
                <td className="py-2">{item.description}</td>
                <td className="py-2 text-center">{item.quantity}</td>
                <td className="py-2 text-center">
                  {data.currency} {item.price.toFixed(2)}
                </td>
                <td className="py-2 text-right">
                  {data.currency} {(item.quantity * item.price).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="mb-6 text-sm space-y-1">
        <div className="flex justify-end">
          <div className="w-full max-w-xs space-y-1">
            <div className="flex justify-between">
              <span>Subtotal (HT):</span>
              <span>
                {data.currency} {subtotal.toFixed(2)}
              </span>
            </div>
            {showVat && (
              <div className="flex justify-between">
                <span>VAT ({data.vatRate}%):</span>
                <span>
                  {data.currency} {taxAmount.toFixed(2)}
                </span>
              </div>
            )}
            <div className="flex justify-between font-bold mt-2">
              <span>Total (TTC):</span>
              <span>
                {data.currency} {total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* VAT & Payment Terms Info */}
      <div className="mb-8 space-y-2">
        <div className="flex items-center gap-2">
          <span className="inline-block text-lg">
            {data.pricesIncludeVat ? "ⓘ" : ""}
          </span>
          <span>
            Prices are VAT {data.pricesIncludeVat ? "inclusive" : "exclusive"} (
            {data.vatRate}%)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block text-lg">☑</span>
          <span>Payment Terms: {paymentTerms}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-gray-300 text-sm mt-12 space-y-1">
        <div className="font-semibold">Thank you for your business!</div>
        <div>Generated with Facturo.africa</div>
      </div>
    </div>
  );
}
