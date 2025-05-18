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
        };
        Insert: {
          id?: string;
          email: string;
          created_at?: string;
          is_pro?: boolean;
          stripe_customer_id?: string | null;
          monthly_invoice_count?: number;
        };
        Update: {
          id?: string;
          email?: string;
          created_at?: string;
          is_pro?: boolean;
          stripe_customer_id?: string | null;
          monthly_invoice_count?: number;
        };
      };
      invoices: {
        Row: {
          id: string;
          user_id: string;
          created_at: string;
          pdf_url: string;
          logo_url: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          created_at?: string;
          pdf_url: string;
          logo_url?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          created_at?: string;
          pdf_url?: string;
          logo_url?: string | null;
        };
      };
    };
  };
}
