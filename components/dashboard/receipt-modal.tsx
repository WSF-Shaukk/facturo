import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ReceiptModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: any | null; // We'll use the same Invoice type as invoice-list
}

export function ReceiptModal({
  open,
  onOpenChange,
  invoice,
}: ReceiptModalProps) {
  if (!invoice) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[600px] bg-[#18191A] text-white">
          <div
            className="space-y-4
           p-4"
          >
            {/* Receipt Header */}
            <div className="space-y-2">
              <div className="flex gap-2 text-xs">
                <span>Receipt Number:</span>
                <span>#{invoice.invoiceNumber}</span>
              </div>
              <div className="flex gap-2 text-xs">
                <span>Date of Payment:</span>
                <span>{invoice.date}</span>
              </div>
              <div className="flex gap-2 text-xs">
                <span>Payment Method:</span>
                <span>[e.g. Card, Mobile Money, Bank Transfer]</span>
              </div>
            </div>

            {/* Billing Information */}
            <div className="space-y-2  pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-1">Billed To:</h3>
                  <div className="text-xs">
                    <p>{invoice.clientName}</p>
                    <p>{invoice.clientEmail}</p>
                    <p>{invoice.clientPhone}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Issued By:</h3>
                  <div className="text-xs">
                    <p>Facturo User - [Business Name]</p>
                    <p>business@email.com</p>
                    <p>Phone or Address if available</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className=" pt-4">
              <h3 className="font-semibold mb-2">Payment Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>Description</span>
                  <span>Amount</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span>Invoice {invoice.invoiceNumber}</span>
                  <span>
                    {invoice.currency} {invoice.total.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center bg-green-800/20 p-2 rounded mt-2">
                  <span className="text-green-400">Status</span>
                  <span className="text-green-400">✓ PAID</span>
                </div>
              </div>
            </div>

            {/* Totals */}
            <div className=" pt-4 space-y-1">
              <div className="flex justify-between text-xs">
                <span>Subtotal (HT):</span>
                <span>
                  {invoice.currency} {(invoice.total / 1.075).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span>VAT (7.5%):</span>
                <span>
                  {invoice.currency}{" "}
                  {(invoice.total - invoice.total / 1.075).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total (TTC):</span>
                <span>
                  {invoice.currency} {invoice.total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Thank You Message */}
            <div className="text-center space-y-1 text-xs pt-4">
              <p>Thank you for your payment.</p>
              <p>This receipt confirms that the invoice has been fully paid.</p>
            </div>

            {/* Footer */}
            <div className="text-center text-gray-400 text-xs  pt-4">
              <p>Thank you for your business!</p>
              <p>Generated with Facturo.africa</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
