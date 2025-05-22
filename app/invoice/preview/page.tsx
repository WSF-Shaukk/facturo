"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { InvoicePDF } from "@/components/invoice-pdf"
import type { InvoiceData } from "@/lib/types"
import { generatePDF } from "@/lib/pdf-generator"
import { useLanguage } from "@/lib/i18n/language-context"

export default function PreviewPage() {
  const router = useRouter()
  const { t, dir } = useLanguage()
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const pdfRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Get the invoice data from localStorage
    const data = localStorage.getItem("invoiceData")
    if (data) {
      setInvoiceData(JSON.parse(data))
    }
    setIsLoading(false)
  }, [])

  const handleDownload = async () => {
    if (!invoiceData) return

    const pdf = await generatePDF(pdfRef.current, invoiceData)
    const blob = pdf.output("blob")
    const url = URL.createObjectURL(blob)

    const link = document.createElement("a")
    link.href = url
    link.download = `Invoice-${invoiceData.invoiceNumber}.pdf`
    link.click()
  }

  const handleShare = async () => {
    if (!invoiceData) return

    const pdf = await generatePDF(pdfRef.current, invoiceData)
    const blob = pdf.output("blob")

    // Create a file from the blob
    const file = new File([blob], `Invoice-${invoiceData.invoiceNumber}.pdf`, { type: "application/pdf" })

    // Check if Web Share API is supported
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Invoice ${invoiceData.invoiceNumber}`,
          text: "Here is your invoice",
          files: [file],
        })
      } catch (error) {
        console.error("Error sharing:", error)
        // Fallback to WhatsApp share
        shareViaWhatsApp()
      }
    } else {
      // Fallback to WhatsApp share
      shareViaWhatsApp()
    }
  }

  const shareViaWhatsApp = () => {
    if (!invoiceData) return

    // Create a message for WhatsApp
    const message = encodeURIComponent(`Invoice ${invoiceData.invoiceNumber} for ${invoiceData.clientName}`)

    // Open WhatsApp with the message
    window.open(`https://wa.me/?text=${message}`, "_blank")
  }

  const handleNewInvoice = () => {
    router.push("/invoice")
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Loading invoice...</p>
      </div>
    )
  }

  if (!invoiceData) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="mb-4">No invoice data found.</p>
        <Button onClick={handleNewInvoice}>{t.invoice.preview.new}</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8" dir={dir}>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">{t.invoice.preview.title}</h1>

        <div className="mb-6 bg-white p-6 border rounded-lg shadow-sm" ref={pdfRef}>
          <InvoicePDF data={invoiceData} />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={handleDownload} className="flex-1">
            {t.invoice.preview.download}
          </Button>
          <Button onClick={handleShare} className="flex-1">
            {t.invoice.preview.share}
          </Button>
          <Button onClick={handleNewInvoice} variant="outline" className="flex-1">
            {t.invoice.preview.new}
          </Button>
        </div>
      </div>
    </div>
  )
}
