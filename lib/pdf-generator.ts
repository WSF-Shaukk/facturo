import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import type { InvoiceData } from "./types"

export async function generatePDF(element: HTMLElement | null, data: InvoiceData): Promise<jsPDF> {
  if (!element) {
    throw new Error("Element not found")
  }

  // Create a new PDF document
  const pdf = new jsPDF("p", "mm", "a4")

  // Capture the element as a canvas
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: "#ffffff",
  })

  // Convert the canvas to an image
  const imgData = canvas.toDataURL("image/png")

  // Calculate the width and height to fit the PDF
  const imgWidth = 210 // A4 width in mm
  const pageHeight = 297 // A4 height in mm
  const imgHeight = (canvas.height * imgWidth) / canvas.width

  // Add the image to the PDF
  pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight)

  // If the image is taller than the page, add more pages
  let heightLeft = imgHeight
  let position = 0

  while (heightLeft > pageHeight) {
    position = heightLeft - pageHeight
    pdf.addPage()
    pdf.addImage(imgData, "PNG", 0, -position, imgWidth, imgHeight)
    heightLeft -= pageHeight
  }

  return pdf
}
