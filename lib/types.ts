export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface InvoiceData {
  invoiceNumber: string;
  date: string;
  clientName: string;
  lineItems: LineItem[];
  currency: string;
  total: number;
  notes: string;
  logo_url?: string;
}
