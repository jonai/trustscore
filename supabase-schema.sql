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
  -- Website Quality fields
  website_quality_score INTEGER NOT NULL DEFAULT 0,
  word_count INTEGER DEFAULT 0,
  has_favicon BOOLEAN DEFAULT false,
  has_open_graph BOOLEAN DEFAULT false,
  og_tags_count INTEGER DEFAULT 0,
  has_twitter_cards BOOLEAN DEFAULT false,
  twitter_tags_count INTEGER DEFAULT 0,
  has_sitemap BOOLEAN DEFAULT false,
  schema_count INTEGER DEFAULT 0,
  has_canonical BOOLEAN DEFAULT false,
  has_hreflang BOOLEAN DEFAULT false,
  -- Trust & Security fields
  trust_security_score INTEGER NOT NULL DEFAULT 0,
  has_https BOOLEAN DEFAULT false,
  has_hsts BOOLEAN DEFAULT false,
  hsts_max_age INTEGER,
  has_csp BOOLEAN DEFAULT false,
  has_x_frame_options BOOLEAN DEFAULT false,
  has_x_content_type_options BOOLEAN DEFAULT false,
  has_referrer_policy BOOLEAN DEFAULT false,
  -- Existing fields
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
  website_quality_score INTEGER DEFAULT 0,
  trust_security_score INTEGER DEFAULT 0,
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


-- ============================================
-- MIGRATION: Run this if tables already exist
-- ============================================
-- ALTER TABLE public.certified_websites ADD COLUMN IF NOT EXISTS website_quality_score INTEGER NOT NULL DEFAULT 0;
-- ALTER TABLE public.certified_websites ADD COLUMN IF NOT EXISTS word_count INTEGER DEFAULT 0;
-- ALTER TABLE public.certified_websites ADD COLUMN IF NOT EXISTS has_favicon BOOLEAN DEFAULT false;
-- ALTER TABLE public.certified_websites ADD COLUMN IF NOT EXISTS has_open_graph BOOLEAN DEFAULT false;
-- ALTER TABLE public.certified_websites ADD COLUMN IF NOT EXISTS og_tags_count INTEGER DEFAULT 0;
-- ALTER TABLE public.certified_websites ADD COLUMN IF NOT EXISTS has_twitter_cards BOOLEAN DEFAULT false;
-- ALTER TABLE public.certified_websites ADD COLUMN IF NOT EXISTS twitter_tags_count INTEGER DEFAULT 0;
-- ALTER TABLE public.certified_websites ADD COLUMN IF NOT EXISTS has_sitemap BOOLEAN DEFAULT false;
-- ALTER TABLE public.certified_websites ADD COLUMN IF NOT EXISTS schema_count INTEGER DEFAULT 0;
-- ALTER TABLE public.certified_websites ADD COLUMN IF NOT EXISTS has_canonical BOOLEAN DEFAULT false;
-- ALTER TABLE public.certified_websites ADD COLUMN IF NOT EXISTS has_hreflang BOOLEAN DEFAULT false;
-- ALTER TABLE public.certified_websites ADD COLUMN IF NOT EXISTS trust_security_score INTEGER NOT NULL DEFAULT 0;
-- ALTER TABLE public.certified_websites ADD COLUMN IF NOT EXISTS has_https BOOLEAN DEFAULT false;
-- ALTER TABLE public.certified_websites ADD COLUMN IF NOT EXISTS has_hsts BOOLEAN DEFAULT false;
-- ALTER TABLE public.certified_websites ADD COLUMN IF NOT EXISTS hsts_max_age INTEGER;
-- ALTER TABLE public.certified_websites ADD COLUMN IF NOT EXISTS has_csp BOOLEAN DEFAULT false;
-- ALTER TABLE public.certified_websites ADD COLUMN IF NOT EXISTS has_x_frame_options BOOLEAN DEFAULT false;
-- ALTER TABLE public.certified_websites ADD COLUMN IF NOT EXISTS has_x_content_type_options BOOLEAN DEFAULT false;
-- ALTER TABLE public.certified_websites ADD COLUMN IF NOT EXISTS has_referrer_policy BOOLEAN DEFAULT false;
-- ALTER TABLE public.audit_history ADD COLUMN IF NOT EXISTS website_quality_score INTEGER DEFAULT 0;
-- ALTER TABLE public.audit_history ADD COLUMN IF NOT EXISTS trust_security_score INTEGER DEFAULT 0;
