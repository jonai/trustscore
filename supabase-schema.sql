-- TrustScore Database Schema
-- Run this in Supabase SQL Editor

-- Users table (extends Supabase Auth)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Certified websites table
CREATE TABLE IF NOT EXISTS public.certified_websites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  domain TEXT UNIQUE NOT NULL,
  url TEXT NOT NULL,
  current_score INTEGER NOT NULL,
  performance_score INTEGER NOT NULL DEFAULT 0,
  seo_score INTEGER NOT NULL DEFAULT 0,
  accessibility_score INTEGER NOT NULL DEFAULT 0,
  best_practices_score INTEGER NOT NULL DEFAULT 0,
  metrics JSONB,
  certified_date TIMESTAMPTZ DEFAULT NOW(),
  last_audit_date TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit history table (for historical chart)
CREATE TABLE IF NOT EXISTS public.audit_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  website_id UUID REFERENCES public.certified_websites(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  performance_score INTEGER NOT NULL DEFAULT 0,
  seo_score INTEGER NOT NULL DEFAULT 0,
  accessibility_score INTEGER NOT NULL DEFAULT 0,
  best_practices_score INTEGER NOT NULL DEFAULT 0,
  audited_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_certified_domain ON public.certified_websites(domain);
CREATE INDEX IF NOT EXISTS idx_certified_active ON public.certified_websites(is_active);
CREATE INDEX IF NOT EXISTS idx_audit_website ON public.audit_history(website_id);
CREATE INDEX IF NOT EXISTS idx_audit_date ON public.audit_history(audited_at);

-- Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certified_websites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_history ENABLE ROW LEVEL SECURITY;

-- Public read access for certified websites (for directory)
CREATE POLICY "Public read access for active certifications" 
  ON public.certified_websites FOR SELECT 
  USING (is_active = true);

-- Public read access for audit history
CREATE POLICY "Public read access for audit history" 
  ON public.audit_history FOR SELECT 
  USING (true);

-- Service role can do everything (for server-side operations)
-- Note: When using service_role key, RLS is bypassed
