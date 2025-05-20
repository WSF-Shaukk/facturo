export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
  subtotal: number;
  tax: number;
}

export interface InvoiceData {
  invoiceNumber: string;
  date: string;
  clientName: string;
  clientTin?: string;
  businessName: string;
  businessAddress: string;
  businessPhone?: string;
  businessEmail?: string;
  businessTin?: string;
  businessRcNumber?: string;
  vatRate: number;
  pricesIncludeVat: boolean;
  paymentTerms: string;
  paymentTermsCustom?: string;
  lineItems: LineItem[];
  currency: string;
  total: number;
  notes: string;
  logo_url?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  is_pro: boolean;
  monthly_invoice_count: number;
  created_at: string;
  updated_at: string;
  business_name?: string;
  business_address?: string;
  business_tin?: string;
  business_rc_number?: string;
  vat_registered: boolean;
  vat_rate: number;
  prices_include_vat: boolean;
  default_payment_terms: string;
}
