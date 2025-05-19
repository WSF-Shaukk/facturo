import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

interface InvoiceDetailsModalProps {
  invoice: Invoice | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InvoiceDetailsModal({
  invoice,
  open,
  onOpenChange,
}: InvoiceDetailsModalProps) {
  if (!invoice) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Invoice Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold">Invoice Number</h3>
              <p>{invoice.invoiceNumber}</p>
            </div>
            <div>
              <h3 className="font-semibold">Date</h3>
              <p>{invoice.date}</p>
            </div>
            <div>
              <h3 className="font-semibold">Client Name</h3>
              <p>{invoice.clientName}</p>
            </div>
            <div>
              <h3 className="font-semibold">Total Amount</h3>
              <p className="text-lg font-medium">
                {invoice.currency} {invoice.total.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Line Items */}
          <div>
            <h3 className="font-semibold mb-2">Line Items</h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="p-2 text-left">Description</th>
                    <th className="p-2 text-right">Quantity</th>
                    <th className="p-2 text-right">Price</th>
                    <th className="p-2 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.lineItems.map((item) => (
                    <tr key={item.id} className="border-t">
                      <td className="p-2">{item.description}</td>
                      <td className="p-2 text-right">{item.quantity}</td>
                      <td className="p-2 text-right">
                        {invoice.currency} {item.price.toFixed(2)}
                      </td>
                      <td className="p-2 text-right">
                        {invoice.currency} {item.subtotal.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                  <tr className="border-t bg-muted/30">
                    <td colSpan={3} className="p-2 text-right font-semibold">
                      Total:
                    </td>
                    <td className="p-2 text-right font-semibold">
                      {invoice.currency} {invoice.total.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div>
              <h3 className="font-semibold mb-2">Notes</h3>
              <p className="text-muted-foreground">{invoice.notes}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
