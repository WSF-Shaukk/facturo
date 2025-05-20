export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          created_at: string;
          is_pro: boolean;
          stripe_customer_id: string | null;
          monthly_invoice_count: number;
          company_name: string | null;
          client_number: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          created_at?: string;
          is_pro?: boolean;
          stripe_customer_id?: string | null;
          monthly_invoice_count?: number;
          company_name?: string | null;
          client_number?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          created_at?: string;
          is_pro?: boolean;
          stripe_customer_id?: string | null;
          monthly_invoice_count?: number;
          company_name?: string | null;
          client_number?: string | null;
          updated_at?: string;
        };
      };
      invoices: {
        Row: {
          id: string;
          user_id: string;
          created_at: string;
          invoice_number: string;
          date: string;
          client_name: string;
          business_name: string;
          business_address: string;
          business_phone: string | null;
          business_email: string | null;
          business_tin: string | null;
          business_rc_number: string | null;
          vat_rate: number;
          prices_include_vat: boolean;
          payment_terms: string;
          payment_terms_custom: string | null;
          items: any[];
          currency: string;
          total: number;
          notes: string | null;
          pdf_url: string | null;
          logo_url: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          created_at?: string;
          invoice_number: string;
          date: string;
          client_name: string;
          business_name: string;
          business_address: string;
          business_phone?: string | null;
          business_email?: string | null;
          business_tin?: string | null;
          business_rc_number?: string | null;
          vat_rate: number;
          prices_include_vat: boolean;
          payment_terms: string;
          payment_terms_custom?: string | null;
          items: any[];
          currency: string;
          total: number;
          notes?: string | null;
          pdf_url?: string | null;
          logo_url?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          created_at?: string;
          invoice_number?: string;
          date?: string;
          client_name?: string;
          business_name?: string;
          business_address?: string;
          business_phone?: string | null;
          business_email?: string | null;
          business_tin?: string | null;
          business_rc_number?: string | null;
          vat_rate?: number;
          prices_include_vat?: boolean;
          payment_terms?: string;
          payment_terms_custom?: string | null;
          items?: any[];
          currency?: string;
          total?: number;
          notes?: string | null;
          pdf_url?: string | null;
          logo_url?: string | null;
        };
      };
    };
  };
}
