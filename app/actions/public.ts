"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

export type FormState = { ok: boolean; message: string; reference?: string };

const requestSchema = z.object({
  hospital_name: z.string().min(2, "Hospital name is required").max(200),
  hospital_type: z.string().max(100).optional(),
  classification: z.string().max(50).optional(),
  department: z.string().max(150).optional(),
  address: z.string().max(300).optional(),
  city: z.string().min(1, "City is required").max(100),
  district: z.string().max(100).optional(),
  state: z.string().min(1, "State is required").max(100),
  postal_code: z.string().max(20).optional(),
  hospital_website: z.string().max(200).optional(),
  patients_per_month: z.string().max(50).optional(),
  requester_name: z.string().min(2, "Your name is required").max(150),
  designation: z.string().max(150).optional(),
  requester_department: z.string().max(150).optional(),
  email: z.string().email("A valid official email is required").max(200),
  phone: z.string().min(7, "Phone number is required").max(25),
  alt_phone: z.string().max(25).optional(),
  relationship: z.string().max(150).optional(),
  preferred_contact: z.string().max(30).optional(),
  request_title: z.string().min(5, "Request title is required").max(200),
  project_type: z.string().max(60).optional(),
  problem_description: z.string().min(20, "Please describe the problem (min 20 characters)").max(5000),
  current_condition: z.string().max(5000).optional(),
  requested_assistance: z.string().max(5000).optional(),
  areas_affected: z.string().max(1000).optional(),
  urgency: z.enum(["low", "medium", "high", "critical"]),
  estimated_beneficiaries: z.string().max(100).optional(),
  estimated_budget: z.string().max(100).optional(),
  desired_timeline: z.string().max(200).optional(),
  leadership_approved: z.string().optional(),
  consent_accuracy: z.literal("on", { message: "Please confirm the information is accurate" }),
  consent_authorized: z.literal("on", { message: "Please confirm you are authorized" }),
  consent_contact: z.literal("on", { message: "Please consent to being contacted" }),
  consent_media_review: z.literal("on", { message: "Please consent to internal review of media" }),
  file_paths: z.string().optional(), // JSON array of already-uploaded storage paths
});

export async function submitHospitalRequest(_prev: FormState, formData: FormData): Promise<FormState> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = requestSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0].message };
  }
  const d = parsed.data;
  const supabase = await createClient();
  const year = new Date().getFullYear();

  for (let attempt = 0; attempt < 5; attempt++) {
    const reference = `VSR-${year}-${String(Math.floor(1000 + Math.random() * 9000))}`;
    const { data: row, error } = await supabase
      .from("hospital_requests")
      .insert({
        reference,
        hospital_name: d.hospital_name,
        hospital_type: d.hospital_type,
        classification: d.classification,
        department: d.department,
        address: d.address,
        city: d.city,
        district: d.district,
        state: d.state,
        postal_code: d.postal_code,
        hospital_website: d.hospital_website,
        patients_per_month: d.patients_per_month,
        requester_name: d.requester_name,
        designation: d.designation,
        requester_department: d.requester_department,
        email: d.email,
        phone: d.phone,
        alt_phone: d.alt_phone,
        relationship: d.relationship,
        preferred_contact: d.preferred_contact,
        request_title: d.request_title,
        project_type: d.project_type,
        problem_description: d.problem_description,
        current_condition: d.current_condition,
        requested_assistance: d.requested_assistance,
        areas_affected: d.areas_affected,
        urgency: d.urgency,
        estimated_beneficiaries: d.estimated_beneficiaries,
        estimated_budget: d.estimated_budget,
        desired_timeline: d.desired_timeline,
        leadership_approved: d.leadership_approved === "on",
        consent_accuracy: true,
        consent_authorized: true,
        consent_contact: true,
        consent_media_review: true,
      })
      .select("id")
      .single();

    if (!error && row) {
      // Attach any files uploaded from the browser
      try {
        const paths: { path: string; name: string; type: string }[] = JSON.parse(d.file_paths || "[]");
        if (Array.isArray(paths) && paths.length > 0 && paths.length <= 10) {
          await supabase.from("hospital_request_files").insert(
            paths.slice(0, 10).map((f) => ({
              request_id: row.id,
              path: String(f.path).slice(0, 500),
              file_name: String(f.name).slice(0, 200),
              file_type: String(f.type).slice(0, 100),
            }))
          );
        }
      } catch { /* file metadata optional */ }
      return {
        ok: true,
        reference,
        message: `Your request has been submitted. Reference number: ${reference}. Please save this number — our team will review your request and contact you.`,
      };
    }
    if (error && !error.message.includes("duplicate")) {
      console.error("hospital_request insert failed", error.message);
      return { ok: false, message: "Something went wrong while submitting. Please try again." };
    }
  }
  return { ok: false, message: "Could not generate a reference number. Please try again." };
}

const volunteerSchema = z.object({
  name: z.string().min(2).max(150),
  email: z.string().email().max(200),
  phone: z.string().max(25).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  country: z.string().max(100).optional(),
  interests: z.string().max(1000).optional(),
  skills: z.string().max(1000).optional(),
  availability: z.string().max(300).optional(),
  consent: z.literal("on", { message: "Please provide consent to be contacted" }),
});

export async function submitVolunteer(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = volunteerSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message };
  const supabase = await createClient();
  const { consent, ...rest } = parsed.data;
  const { error } = await supabase.from("volunteer_submissions").insert({ ...rest, consent: true });
  if (error) return { ok: false, message: "Something went wrong. Please try again." };
  return { ok: true, message: "Thank you for volunteering! Our team will reach out to you." };
}

const partnershipSchema = z.object({
  kind: z.enum(["csr", "government"]),
  organization: z.string().min(2).max(200),
  contact_name: z.string().min(2).max(150),
  role_title: z.string().max(150).optional(),
  email: z.string().email().max(200),
  phone: z.string().max(25).optional(),
  jurisdiction: z.string().max(200).optional(),
  interest: z.string().max(1000).optional(),
  message: z.string().max(5000).optional(),
  consent: z.literal("on", { message: "Please provide consent to be contacted" }),
});

export async function submitPartnership(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = partnershipSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message };
  const supabase = await createClient();
  const { consent, ...rest } = parsed.data;
  const { error } = await supabase.from("partnership_submissions").insert({ ...rest, consent: true });
  if (error) return { ok: false, message: "Something went wrong. Please try again." };
  return { ok: true, message: "Thank you! Our partnerships team will contact you soon." };
}

const contactSchema = z.object({
  name: z.string().min(2).max(150),
  email: z.string().email().max(200),
  subject: z.string().max(200).optional(),
  inquiry_type: z.string().max(60).optional(),
  message: z.string().min(10, "Please write a message (min 10 characters)").max(5000),
});

export async function submitContact(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = contactSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message };
  const supabase = await createClient();
  const { error } = await supabase.from("contact_submissions").insert(parsed.data);
  if (error) return { ok: false, message: "Something went wrong. Please try again." };
  return { ok: true, message: "Message received. We will get back to you soon." };
}
