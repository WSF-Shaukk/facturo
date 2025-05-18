"use client";

import type { InvoiceData } from "@/lib/types";
import { useLanguage } from "@/lib/i18n/language-context";
import Image from "next/image";

interface InvoicePDFProps {
  data: InvoiceData;
}

export function InvoicePDF({ data }: InvoicePDFProps) {
  const { t, dir } = useLanguage();

  return (
    <div className="font-sans text-black" dir={dir}>
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          {data.logo_url ? (
            <div className="mb-2">
              <Image
                src={data.logo_url}
                alt="Invoice Logo"
                width={150}
                height={75}
                className="object-contain"
              />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M7 18H17V16H7V18Z" fill="currentColor" />
                <path d="M17 14H7V12H17V14Z" fill="currentColor" />
                <path d="M7 10H11V8H7V10Z" fill="currentColor" />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6 2C4.34315 2 3 3.34315 3 5V19C3 20.6569 4.34315 22 6 22H18C19.6569 22 21 20.6569 21 19V5C21 3.34315 19.6569 2 18 2H6ZM5 5C5 4.44772 5.44772 4 6 4H18C18.5523 4 19 4.44772 19 5V19C19 19.5523 18.5523 20 18 20H6C5.44772 20 5 19.5523 5 19V5Z"
                  fill="currentColor"
                />
              </svg>
              <h1 className="text-2xl font-bold">Facturo.africa</h1>
            </div>
          )}
          <p className="text-gray-500 mt-1">Professional Invoices</p>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-bold">INVOICE</h2>
          <p className="font-medium">{data.invoiceNumber}</p>
          <p className="text-gray-500 mt-1">
            {t.invoice.form.date}: {data.date}
          </p>
        </div>
      </div>

      {/* Client Info */}
      <div className="mb-8">
        <h3 className="text-gray-500 font-medium mb-2">
          {t.invoice.preview.billTo}
        </h3>
        <p className="font-bold text-lg">{data.clientName}</p>
      </div>

      {/* Invoice Items */}
      <div className="mb-8">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="text-left py-2">{t.invoice.form.description}</th>
              <th className="text-right py-2">{t.invoice.form.quantity}</th>
              <th className="text-right py-2">{t.invoice.form.price}</th>
              <th className="text-right py-2">{t.invoice.form.subtotal}</th>
            </tr>
          </thead>
          <tbody>
            {data.lineItems.map((item) => (
              <tr key={item.id}>
                <td className="py-4">{item.description}</td>
                <td className="text-right py-4">{item.quantity}</td>
                <td className="text-right py-4">
                  {data.currency} {item.price.toFixed(2)}
                </td>
                <td className="text-right py-4 font-medium">
                  {data.currency} {item.subtotal.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Total */}
      <div className="flex justify-end mb-8">
        <div className="w-1/2">
          <div className="flex justify-between py-2 border-b border-gray-300">
            <span>{t.invoice.form.subtotal}:</span>
            <span>
              {data.currency} {data.total.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between py-2 font-bold text-lg">
            <span>{t.invoice.form.total}:</span>
            <span>
              {data.currency} {data.total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {data.notes && (
        <div className="mb-8">
          <h3 className="text-gray-500 font-medium mb-2">
            {t.invoice.form.notes}:
          </h3>
          <p className="text-gray-700">{data.notes}</p>
        </div>
      )}

      {/* Footer */}
      <div className="text-center text-gray-500 text-sm mt-12">
        <p>{t.invoice.preview.thankYou}</p>
        <p>{t.invoice.preview.generatedWith}</p>
      </div>
    </div>
  );
}
