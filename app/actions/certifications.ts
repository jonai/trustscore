"use server";

import { createServerClient } from "@/lib/supabase";
import type { CertifiedWebsite, AuditHistory } from "@/types/database";

export interface CertifiedWebsiteWithFavicon extends CertifiedWebsite {
  favicon: string;
}

/**
 * Get all active certified websites for the directory
 */
export async function getCertifiedWebsites(): Promise<
  CertifiedWebsiteWithFavicon[]
> {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("certified_websites")
    .select("*")
    .eq("is_active", true)
    .order("certified_date", { ascending: false });

  if (error) {
    console.error("Error fetching certified websites:", error);
    return [];
  }

  // Add favicon URL for each domain
  return (data || []).map((site) => ({
    ...site,
    favicon: `https://www.google.com/s2/favicons?domain=${site.domain}&sz=64`,
  }));
}

/**
 * Get a single certified website by domain
 */
export async function getCertificationByDomain(
  domain: string
): Promise<CertifiedWebsite | null> {
  const supabase = createServerClient();

  // Clean the domain
  const cleanDomain = domain
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/$/, "");

  const { data, error } = await supabase
    .from("certified_websites")
    .select("*")
    .eq("domain", cleanDomain)
    .eq("is_active", true)
    .single();

  if (error) {
    console.error("Error fetching certification:", error);
    return null;
  }

  return data;
}

/**
 * Get audit history for a certified website (for the chart)
 */
export async function getAuditHistory(
  websiteId: string,
  limit: number = 30
): Promise<AuditHistory[]> {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("audit_history")
    .select("*")
    .eq("website_id", websiteId)
    .order("audited_at", { ascending: true })
    .limit(limit);

  if (error) {
    console.error("Error fetching audit history:", error);
    return [];
  }

  return data || [];
}

/**
 * Create a new certification (called after Stripe payment)
 */
export async function createCertification(data: {
  userId: string;
  domain: string;
  url: string;
  currentScore: number;
  performanceScore: number;
  seoScore: number;
  accessibilityScore: number;
  bestPracticesScore: number;
  metrics: Record<string, unknown>;
}): Promise<{ success: boolean; id?: string; error?: string }> {
  const supabase = createServerClient();

  // Clean the domain
  const cleanDomain = data.domain
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/$/, "");

  // Check if domain already exists
  const { data: existing } = await supabase
    .from("certified_websites")
    .select("id")
    .eq("domain", cleanDomain)
    .single();

  if (existing) {
    return { success: false, error: "Domain already certified" };
  }

  // Create the certification
  const { data: certification, error: certError } = await supabase
    .from("certified_websites")
    .insert({
      user_id: data.userId,
      domain: cleanDomain,
      url: data.url,
      current_score: data.currentScore,
      performance_score: data.performanceScore,
      seo_score: data.seoScore,
      accessibility_score: data.accessibilityScore,
      best_practices_score: data.bestPracticesScore,
      metrics: data.metrics,
    })
    .select("id")
    .single();

  if (certError) {
    console.error("Error creating certification:", certError);
    return { success: false, error: "Failed to create certification" };
  }

  // Create the first audit history entry
  await supabase.from("audit_history").insert({
    website_id: certification.id,
    score: data.currentScore,
    performance_score: data.performanceScore,
    seo_score: data.seoScore,
    accessibility_score: data.accessibilityScore,
    best_practices_score: data.bestPracticesScore,
  });

  return { success: true, id: certification.id };
}

/**
 * Check if a domain is already certified
 */
export async function isDomainCertified(domain: string): Promise<boolean> {
  const supabase = createServerClient();

  const cleanDomain = domain
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/$/, "");

  const { data } = await supabase
    .from("certified_websites")
    .select("id")
    .eq("domain", cleanDomain)
    .eq("is_active", true)
    .single();

  return !!data;
}
