import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const staticPages = ["", "/about", "/projects", "/impact", "/get-involved", "/request-support", "/contact", "/privacy", "/terms"].map((p) => ({
    url: `${base}${p}`,
    changeFrequency: "weekly" as const,
  }));
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("projects").select("slug,updated_at").eq("publication", "published");
    return [
      ...staticPages,
      ...(data || []).map((p) => ({ url: `${base}/projects/${p.slug}`, lastModified: p.updated_at })),
    ];
  } catch {
    return staticPages;
  }
}
