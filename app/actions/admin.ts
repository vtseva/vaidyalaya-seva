"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireStaff, requireAdmin } from "@/lib/auth";
import { REQUEST_STATUSES } from "@/lib/format";

export type ActionState = { ok: boolean; message: string };

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
}

const projectSchema = z.object({
  id: z.string().uuid().optional().or(z.literal("")),
  project_code: z.string().min(3).max(20).regex(/^[A-Z0-9-]+$/i, "Project ID may contain letters, numbers and hyphens"),
  name: z.string().min(3).max(200),
  status: z.enum(["planned", "in_progress", "completed", "archived"]),
  publication: z.enum(["draft", "in_review", "published", "archived"]),
  featured: z.string().optional(),
  hospital_name: z.string().min(2).max(200),
  hospital_type: z.string().max(100).optional(),
  department: z.string().max(200).optional(),
  city: z.string().max(100).optional(),
  district: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  project_type: z.string().max(60),
  short_summary: z.string().min(10).max(500),
  executive_summary: z.string().max(5000).optional(),
  background: z.string().max(8000).optional(),
  need_assessment: z.string().max(8000).optional(),
  scope: z.string().max(8000).optional(),
  major_works: z.string().max(8000).optional(),
  expected_impact: z.string().max(5000).optional(),
  beneficiary_groups: z.string().max(500).optional(),
  start_date: z.string().optional(),
  target_completion_date: z.string().optional(),
  actual_completion_date: z.string().optional(),
  approved_budget: z.string().optional(),
  funding_source: z.string().max(300).optional(),
  partners: z.string().max(500).optional(),
  budget_notes: z.string().max(2000).optional(),
  lessons_learned: z.string().max(8000).optional(),
  maintenance_plan: z.string().max(8000).optional(),
  cover_image: z.string().max(500).optional(),
  hero_image: z.string().max(500).optional(),
  internal_notes: z.string().max(8000).optional(),
});

export async function saveProject(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireStaff();
  const parsed = projectSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return { ok: false, message: `${issue.path.join(".")}: ${issue.message}` };
  }
  const d = parsed.data;
  const supabase = await createClient();

  const record = {
    project_code: d.project_code.toUpperCase(),
    name: d.name,
    slug: `${slugify(d.project_code)}-${slugify(d.name)}`,
    status: d.status,
    publication: d.publication,
    featured: d.featured === "on",
    hospital_name: d.hospital_name,
    hospital_type: d.hospital_type || null,
    department: d.department || null,
    city: d.city || null,
    district: d.district || null,
    state: d.state || null,
    project_type: d.project_type,
    short_summary: d.short_summary,
    executive_summary: d.executive_summary || null,
    background: d.background || null,
    need_assessment: d.need_assessment || null,
    scope: d.scope || null,
    major_works: d.major_works || null,
    expected_impact: d.expected_impact || null,
    beneficiary_groups: d.beneficiary_groups || null,
    start_date: d.start_date || null,
    target_completion_date: d.target_completion_date || null,
    actual_completion_date: d.actual_completion_date || null,
    approved_budget: d.approved_budget ? Number(d.approved_budget.replace(/[^0-9.]/g, "")) || null : null,
    funding_source: d.funding_source || null,
    partners: d.partners || null,
    budget_notes: d.budget_notes || null,
    lessons_learned: d.lessons_learned || null,
    maintenance_plan: d.maintenance_plan || null,
    cover_image: d.cover_image || null,
    hero_image: d.hero_image || null,
    internal_notes: d.internal_notes || null,
  };

  let error;
  if (d.id) {
    ({ error } = await supabase.from("projects").update(record).eq("id", d.id));
  } else {
    ({ error } = await supabase.from("projects").insert(record));
  }
  if (error) {
    if (error.message.includes("duplicate")) return { ok: false, message: "A project with this ID or name already exists." };
    return { ok: false, message: "Could not save the project. " + error.message };
  }
  revalidatePath("/projects");
  revalidatePath("/");
  revalidatePath("/dashboard/projects");
  return { ok: true, message: "Project saved." };
}

const budgetItemSchema = z.object({
  project_id: z.string().uuid(),
  component: z.string().min(1).max(200),
  description: z.string().max(500).optional(),
  planned_amount: z.string().optional(),
});

export async function addBudgetItem(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireStaff();
  const parsed = budgetItemSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { ok: false, message: "Component name is required." };
  const supabase = await createClient();
  const { error } = await supabase.from("project_budget_items").insert({
    project_id: parsed.data.project_id,
    component: parsed.data.component,
    description: parsed.data.description || null,
    planned_amount: parsed.data.planned_amount ? Number(parsed.data.planned_amount.replace(/[^0-9.]/g, "")) || null : null,
  });
  if (error) return { ok: false, message: "Could not add budget item." };
  revalidatePath("/dashboard/projects");
  return { ok: true, message: "Budget item added." };
}

export async function deleteBudgetItem(id: string, projectId: string) {
  await requireStaff();
  const supabase = await createClient();
  await supabase.from("project_budget_items").delete().eq("id", id);
  revalidatePath(`/dashboard/projects/${projectId}`);
}

export async function updateRequestStatus(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const profile = await requireStaff();
  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "");
  const note = String(formData.get("note") || "").slice(0, 4000);
  if (!id || !(REQUEST_STATUSES as readonly string[]).includes(status)) {
    return { ok: false, message: "Invalid status." };
  }
  const supabase = await createClient();
  const { error } = await supabase.from("hospital_requests").update({ status, reviewed_by: profile.id }).eq("id", id);
  if (error) return { ok: false, message: "Could not update the request." };
  if (note) {
    await supabase.from("hospital_request_updates").insert({ request_id: id, author: profile.id, note, new_status: status });
  }
  revalidatePath(`/dashboard/requests/${id}`);
  revalidatePath("/dashboard/requests");
  return { ok: true, message: "Request updated." };
}

export async function updateImpactStat(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireStaff();
  const id = String(formData.get("id") || "");
  const value = String(formData.get("value") || "").slice(0, 100);
  const note = String(formData.get("note") || "").slice(0, 500);
  if (!id || !value) return { ok: false, message: "Value is required." };
  const supabase = await createClient();
  const { error } = await supabase.from("impact_stats").update({ value, note: note || null }).eq("id", id);
  if (error) return { ok: false, message: "Could not update the statistic." };
  revalidatePath("/impact");
  revalidatePath("/");
  return { ok: true, message: "Statistic updated." };
}

export async function markSubmissionHandled(table: string, id: string) {
  await requireStaff();
  if (!["volunteer_submissions", "partnership_submissions", "contact_submissions"].includes(table)) return;
  const supabase = await createClient();
  await supabase.from(table).update({ handled: true }).eq("id", id);
  revalidatePath("/dashboard/submissions");
}

export async function updateSetting(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const key = String(formData.get("key") || "");
  if (!["contact", "links", "donate", "mission", "social"].includes(key)) return { ok: false, message: "Unknown setting." };
  const entries: Record<string, string> = {};
  for (const [k, v] of formData.entries()) {
    if (k.startsWith("f_")) entries[k.slice(2)] = String(v).slice(0, 2000);
  }
  const supabase = await createClient();
  const { data: current } = await supabase.from("site_settings").select("value").eq("key", key).maybeSingle();
  const merged = { ...(current?.value || {}), ...entries };
  if (key === "mission" && entries.target) (merged as Record<string, unknown>).target = Number(entries.target) || 70;
  const { error } = await supabase.from("site_settings").upsert({ key, value: merged });
  if (error) return { ok: false, message: "Could not save settings." };
  revalidatePath("/");
  revalidatePath("/impact");
  revalidatePath("/get-involved");
  revalidatePath("/contact");
  return { ok: true, message: "Settings saved." };
}

export async function approveTestimonial(id: string, approved: boolean) {
  await requireStaff();
  const supabase = await createClient();
  await supabase.from("testimonials").update({ approved }).eq("id", id);
  revalidatePath("/");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

const donationOptionSchema = z.object({
  title: z.string().min(2).max(120),
  description: z.string().max(500).optional(),
  amount: z.string().optional(),
});

export async function addDonationOption(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = donationOptionSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { ok: false, message: "Title is required (2–120 characters)." };
  const amtRaw = (parsed.data.amount || "").replace(/[^0-9.]/g, "");
  const amount = amtRaw ? Number(amtRaw) : null;
  if (amtRaw && (!Number.isFinite(amount) || amount! <= 0)) return { ok: false, message: "Amount must be a positive number, or blank for donor-chooses." };
  const supabase = await createClient();
  const { error } = await supabase.from("donation_options").insert({
    title: parsed.data.title,
    description: parsed.data.description || null,
    amount,
  });
  if (error) return { ok: false, message: "Could not add the option." };
  revalidatePath("/donate");
  revalidatePath("/dashboard/donations");
  return { ok: true, message: "Donation option added." };
}

export async function toggleDonationOption(id: string, active: boolean) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("donation_options").update({ active }).eq("id", id);
  revalidatePath("/donate");
  revalidatePath("/dashboard/donations");
}

export async function deleteDonationOption(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("donation_options").delete().eq("id", id);
  revalidatePath("/donate");
  revalidatePath("/dashboard/donations");
}
