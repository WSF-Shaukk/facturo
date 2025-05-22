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
    <div className="p-5 bg-[#18191A] shadow-lg max-w-4xl  mx-auto text-white font-sans">
      {/* Header: Business & Client Info */}
      <div className="flex flex-col md:flex-row justify-between gap-8  pb-6 mb-1">
        {/* Business Info */}
        <div className="space-y-2 text-sm w-1/2">
          <div className="text-lg font-bold mb-1 truncate">
            {data.businessName}
          </div>
          <div>Professional Invoices</div>
          {data.businessRcNumber && (
            <div className="truncate">
              <span className="font-medium">RC Number:</span>{" "}
              <span className="truncate">{data.businessRcNumber}</span>
            </div>
          )}
          {data.businessTin && (
            <div className="truncate">
              <span className="font-medium">TIN:</span>{" "}
              <span className="truncate">{data.businessTin}</span>
            </div>
          )}
          {data.businessAddress && (
            <div className="truncate">
              <span className="font-medium">Address:</span>{" "}
              <span className="truncate">{data.businessAddress}</span>
            </div>
          )}
          {data.businessPhone && (
            <div className="truncate">
              <span className="font-medium">Phone:</span>{" "}
              <span className="truncate">{data.businessPhone}</span>
            </div>
          )}
          {data.businessEmail && (
            <div className="truncate">
              <span className="font-medium">Email:</span>{" "}
              <span className="truncate">{data.businessEmail}</span>
            </div>
          )}
        </div>

        {/* Client Info */}
        <div className="space-y-2 text-sm md:text-left w-1/2">
          <div className="font-bold text-base mb-1">Bill To:</div>
          <div className="truncate max-w-full">{data.clientName}</div>
          {data.clientAddress && (
            <div className="truncate max-w-full">{data.clientAddress}</div>
          )}
          {data.clientTin && (
            <div className="truncate max-w-full">
              <span className="font-medium">TIN:</span>{" "}
              <span>{data.clientTin}</span>
            </div>
          )}
        </div>
      </div>

      {/* Invoice Info */}
      <div className="mb-6">
        <div className="font-bold text-sm">INVOICE</div>
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
      <div className="overflow-x-auto mb-6 mt-14">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left py-2 font-semibold">Description</th>
              <th className="text-center py-2 font-semibold">Quantity</th>
              <th className="text-center py-2 font-semibold">Unit Price</th>
              <th className="text-center py-2 font-semibold">Tax/Unit</th>
              <th className="text-right py-2 font-semibold">Amount</th>
            </tr>
          </thead>
          <tbody>
            {data.lineItems.map((item, idx) => (
              <tr key={idx} className="border-b border-gray-800">
                <td className="py-2 truncate whitespace-nowrap overflow-hidden max-w-[10px]">
                  {item.description}
                </td>
                <td className="py-2 text-center">{item.quantity}</td>
                <td className="py-2 text-center">
                  {data.currency} {item.price.toFixed(2)}
                </td>
                <td className="py-2 text-center">
                  {data.currency} {((item.price * item.tax) / 100).toFixed(2)}
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
      <div className="mb-6 text-sm space-y-1 mt-16">
        <div className="flex justify-end">
          <div className="w-full max-w-xs space-y-1">
            <div className="flex justify-between">
              <span className="font-semibold">Subtotal (HT):</span>
              <span>
                {data.currency} {subtotal.toFixed(2)}
              </span>
            </div>
            {showVat && (
              <div className="flex justify-between">
                <span className="font-semibold  ">VAT ({data.vatRate}%):</span>
                <span>
                  {data.currency} {taxAmount.toFixed(2)}
                </span>
              </div>
            )}
            <div className="flex justify-between font-bold mt-2">
              <span className="font-semibold">Total (TTC):</span>
              <span>
                {data.currency} {total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* VAT & Payment Terms Info */}
      <div className="mb-8 space-y-2 mt-14 text-[14px]">
        <div className="flex items-center gap-2">
          <span className="inline-block ">
            {data.pricesIncludeVat ? "ⓘ" : ""}
          </span>
          <span>
            Prices are VAT {data.pricesIncludeVat ? "inclusive" : "exclusive"} (
            {data.vatRate}%)
          </span>
        </div>
        <div className="flex items-center gap-2 ">
          <span className="inline-block size-5 ">
            <svg
              viewBox="0 0 24 24"
              fill="#6a8aec"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M3.4 4h17.2A2.4 2.4 0 0 1 23 6.4v11.2a2.4 2.4 0 0 1-2.4 2.4H3.4A2.4 2.4 0 0 1 1 17.6V6.4A2.4 2.4 0 0 1 3.4 4ZM22 8H2v3h20V8Zm-6 6a1 1 0 0 1 1-1h3a1 1 0 1 1 0 2h-3a1 1 0 0 1-1-1Z"
                  fill="#6a8aec"
                ></path>
              </g>
            </svg>
          </span>
          <span>Payment Terms: {paymentTerms}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-gray-300 text-sm mt-20 space-y-1">
        <div className="font-semibold">Thank you for your business!</div>
        <div>Generated with Facturo.africa</div>
      </div>
    </div>
  );
}
