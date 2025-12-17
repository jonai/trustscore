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
          stripe_customer_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          stripe_customer_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          stripe_customer_id?: string | null;
          created_at?: string;
        };
      };
      certified_websites: {
        Row: {
          id: string;
          user_id: string;
          domain: string;
          url: string;
          current_score: number;
          performance_score: number;
          seo_score: number;
          accessibility_score: number;
          best_practices_score: number;
          metrics: Json | null;
          certified_date: string;
          last_audit_date: string;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          domain: string;
          url: string;
          current_score: number;
          performance_score: number;
          seo_score: number;
          accessibility_score: number;
          best_practices_score: number;
          metrics?: Json | null;
          certified_date?: string;
          last_audit_date?: string;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          domain?: string;
          url?: string;
          current_score?: number;
          performance_score?: number;
          seo_score?: number;
          accessibility_score?: number;
          best_practices_score?: number;
          metrics?: Json | null;
          certified_date?: string;
          last_audit_date?: string;
          is_active?: boolean;
          created_at?: string;
        };
      };
      audit_history: {
        Row: {
          id: string;
          website_id: string;
          score: number;
          performance_score: number;
          seo_score: number;
          accessibility_score: number;
          best_practices_score: number;
          audited_at: string;
        };
        Insert: {
          id?: string;
          website_id: string;
          score: number;
          performance_score: number;
          seo_score: number;
          accessibility_score: number;
          best_practices_score: number;
          audited_at?: string;
        };
        Update: {
          id?: string;
          website_id?: string;
          score?: number;
          performance_score?: number;
          seo_score?: number;
          accessibility_score?: number;
          best_practices_score?: number;
          audited_at?: string;
        };
      };
    };
  };
}

// Helper types
export type User = Database["public"]["Tables"]["users"]["Row"];
export type CertifiedWebsite =
  Database["public"]["Tables"]["certified_websites"]["Row"];
export type AuditHistory = Database["public"]["Tables"]["audit_history"]["Row"];
