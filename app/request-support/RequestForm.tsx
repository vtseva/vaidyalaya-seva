"use client";

import { useActionState, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { submitHospitalRequest, type FormState } from "@/app/actions/public";
import { PROJECT_TYPES } from "@/lib/format";

const initial: FormState = { ok: false, message: "" };
const STEPS = ["Hospital", "Requester", "Assistance", "Evidence", "Consent"];

const MAX_FILES = 6;
const MAX_SIZE = 10 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "application/pdf", "video/mp4"];

type Uploaded = { path: string; name: string; type: string };

export default function RequestForm() {
  const [step, setStep] = useState(0);
  const [state, action, pending] = useActionState(submitHospitalRequest, initial);
  const [files, setFiles] = useState<Uploaded[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  async function handleFiles(list: FileList | null) {
    if (!list || list.length === 0) return;
    setUploadError("");
    if (files.length + list.length > MAX_FILES) {
      setUploadError(`You can upload up to ${MAX_FILES} files.`);
      return;
    }
    setUploading(true);
    const supabase = createClient();
    const added: Uploaded[] = [];
    for (const file of Array.from(list)) {
      if (!ALLOWED.includes(file.type)) {
        setUploadError(`"${file.name}" is not a supported file type (photos, PDF or MP4 only).`);
        continue;
      }
      if (file.size > MAX_SIZE) {
        setUploadError(`"${file.name}" is larger than 10 MB.`);
        continue;
      }
      const ext = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "bin";
      const path = `${new Date().getFullYear()}/${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from("request-uploads").upload(path, file, { contentType: file.type });
      if (error) {
        setUploadError(`Could not upload "${file.name}". Please try again.`);
      } else {
        added.push({ path, name: file.name.slice(0, 150), type: file.type });
      }
    }
    setFiles((prev) => [...prev, ...added]);
    setUploading(false);
  }

  function validateStep(): boolean {
    const form = formRef.current;
    if (!form) return true;
    const stepEl = form.querySelector<HTMLElement>(`[data-step="${step}"]`);
    if (!stepEl) return true;
    const fields = stepEl.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>("input, select, textarea");
    for (const f of Array.from(fields)) {
      if (!f.checkValidity()) {
        f.reportValidity();
        return false;
      }
    }
    return true;
  }

  if (state.ok) {
    return (
      <div className="card p-8 bg-green-50 !border-green-200" role="status">
        <h2 className="text-xl font-bold text-green-900 mb-2">Request Submitted</h2>
        <p className="text-green-900">{state.message}</p>
      </div>
    );
  }

  return (
    <form ref={formRef} action={action} className="card p-6" noValidate={false}>
      {/* Step indicator */}
      <ol className="flex flex-wrap gap-2 mb-8" aria-label="Form steps">
        {STEPS.map((s, i) => (
          <li key={s} className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold ${i === step ? "bg-primary-800 text-white" : i < step ? "bg-green-100 text-green-800" : "bg-warm-100 text-gray-500"}`} aria-current={i === step ? "step" : undefined}>
            <span aria-hidden="true">{i < step ? "✓" : i + 1}</span> {s}
          </li>
        ))}
      </ol>

      {state.message && <p className="text-red-700 bg-red-50 rounded-lg p-3 text-sm mb-4" role="alert">{state.message}</p>}
      <input type="hidden" name="file_paths" value={JSON.stringify(files)} />

      {/* Step 1: Hospital */}
      <fieldset data-step="0" className={step === 0 ? "space-y-4" : "hidden"}>
        <legend className="text-lg font-bold text-primary-900 mb-2">Hospital Information</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2"><label className="label" htmlFor="hospital_name">Hospital name *</label><input id="hospital_name" name="hospital_name" required className="input" /></div>
          <div><label className="label" htmlFor="hospital_type">Hospital type</label><input id="hospital_type" name="hospital_type" className="input" placeholder="e.g., District Hospital, Maternity Hospital" /></div>
          <div>
            <label className="label" htmlFor="classification">Classification</label>
            <select id="classification" name="classification" className="input">
              <option value="">Select…</option><option>Government</option><option>Public</option><option>Charitable</option><option>Private</option>
            </select>
          </div>
          <div><label className="label" htmlFor="department">Department</label><input id="department" name="department" className="input" /></div>
          <div><label className="label" htmlFor="patients_per_month">Approx. patients per month</label><input id="patients_per_month" name="patients_per_month" className="input" /></div>
          <div className="sm:col-span-2"><label className="label" htmlFor="address">Address</label><input id="address" name="address" className="input" /></div>
          <div><label className="label" htmlFor="city">City *</label><input id="city" name="city" required className="input" /></div>
          <div><label className="label" htmlFor="district">District</label><input id="district" name="district" className="input" /></div>
          <div><label className="label" htmlFor="state">State *</label><input id="state" name="state" required className="input" /></div>
          <div><label className="label" htmlFor="postal_code">Postal code</label><input id="postal_code" name="postal_code" className="input" /></div>
          <div className="sm:col-span-2"><label className="label" htmlFor="hospital_website">Hospital website (optional)</label><input id="hospital_website" name="hospital_website" className="input" /></div>
        </div>
      </fieldset>

      {/* Step 2: Requester */}
      <fieldset data-step="1" className={step === 1 ? "space-y-4" : "hidden"}>
        <legend className="text-lg font-bold text-primary-900 mb-2">Your Information</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className="label" htmlFor="requester_name">Full name *</label><input id="requester_name" name="requester_name" required className="input" autoComplete="name" /></div>
          <div><label className="label" htmlFor="designation">Designation</label><input id="designation" name="designation" className="input" placeholder="e.g., Medical Superintendent" /></div>
          <div><label className="label" htmlFor="requester_department">Department</label><input id="requester_department" name="requester_department" className="input" /></div>
          <div><label className="label" htmlFor="relationship">Relationship to hospital</label><input id="relationship" name="relationship" className="input" placeholder="e.g., Administrator, Staff" /></div>
          <div><label className="label" htmlFor="email">Official email *</label><input id="email" name="email" type="email" required className="input" autoComplete="email" /></div>
          <div><label className="label" htmlFor="phone">Phone *</label><input id="phone" name="phone" required minLength={7} className="input" autoComplete="tel" /></div>
          <div><label className="label" htmlFor="alt_phone">Alternate phone</label><input id="alt_phone" name="alt_phone" className="input" /></div>
          <div>
            <label className="label" htmlFor="preferred_contact">Preferred contact method</label>
            <select id="preferred_contact" name="preferred_contact" className="input"><option>Phone</option><option>Email</option><option>WhatsApp</option></select>
          </div>
        </div>
      </fieldset>

      {/* Step 3: Assistance */}
      <fieldset data-step="2" className={step === 2 ? "space-y-4" : "hidden"}>
        <legend className="text-lg font-bold text-primary-900 mb-2">Assistance Required</legend>
        <div><label className="label" htmlFor="request_title">Request title *</label><input id="request_title" name="request_title" required minLength={5} className="input" placeholder="e.g., Renovation of OPD washrooms" /></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="project_type">Type of need</label>
            <select id="project_type" name="project_type" className="input">{PROJECT_TYPES.map((t) => <option key={t}>{t}</option>)}</select>
          </div>
          <div>
            <label className="label" htmlFor="urgency">Urgency *</label>
            <select id="urgency" name="urgency" required className="input" defaultValue="medium">
              <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="critical">Critical</option>
            </select>
          </div>
        </div>
        <div><label className="label" htmlFor="problem_description">Problem description *</label><textarea id="problem_description" name="problem_description" required minLength={20} rows={4} className="input" placeholder="Describe the problem and how it affects patients and staff" /></div>
        <div><label className="label" htmlFor="current_condition">Current condition</label><textarea id="current_condition" name="current_condition" rows={3} className="input" /></div>
        <div><label className="label" htmlFor="requested_assistance">Assistance requested</label><textarea id="requested_assistance" name="requested_assistance" rows={3} className="input" /></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className="label" htmlFor="areas_affected">Areas affected</label><input id="areas_affected" name="areas_affected" className="input" placeholder="e.g., Ground floor OPD, 2 wards" /></div>
          <div><label className="label" htmlFor="estimated_beneficiaries">Estimated beneficiaries</label><input id="estimated_beneficiaries" name="estimated_beneficiaries" className="input" /></div>
          <div><label className="label" htmlFor="estimated_budget">Estimated budget (optional)</label><input id="estimated_budget" name="estimated_budget" className="input" /></div>
          <div><label className="label" htmlFor="desired_timeline">Desired timeline (optional)</label><input id="desired_timeline" name="desired_timeline" className="input" /></div>
        </div>
        <label className="flex items-start gap-3 text-sm text-gray-700">
          <input type="checkbox" name="leadership_approved" className="mt-1 w-5 h-5" />
          <span>Hospital leadership has approved this request.</span>
        </label>
      </fieldset>

      {/* Step 4: Evidence */}
      <fieldset data-step="3" className={step === 3 ? "space-y-4" : "hidden"}>
        <legend className="text-lg font-bold text-primary-900 mb-2">Supporting Evidence</legend>
        <p className="text-sm text-gray-600">Upload photos of the affected areas, official request letters, estimates or short videos. Up to {MAX_FILES} files, 10 MB each (JPG, PNG, PDF, MP4). <strong>Do not upload patient records.</strong></p>
        <div>
          <label className="label" htmlFor="evidence">Files</label>
          <input id="evidence" type="file" multiple accept=".jpg,.jpeg,.png,.webp,.pdf,.mp4" className="input !py-2" onChange={(e) => handleFiles(e.target.files)} disabled={uploading || files.length >= MAX_FILES} />
        </div>
        {uploading && <p className="text-sm text-gray-600" role="status">Uploading…</p>}
        {uploadError && <p className="text-sm text-red-700" role="alert">{uploadError}</p>}
        {files.length > 0 && (
          <ul className="text-sm text-gray-700 space-y-1">
            {files.map((f) => <li key={f.path}>✓ {f.name}</li>)}
          </ul>
        )}
        <p className="text-xs text-gray-500">Files are stored privately and reviewed only by the Vaidyalaya Seva team.</p>
      </fieldset>

      {/* Step 5: Consent */}
      <fieldset data-step="4" className={step === 4 ? "space-y-3" : "hidden"}>
        <legend className="text-lg font-bold text-primary-900 mb-2">Consent & Declaration</legend>
        {[
          ["consent_accuracy", "The information provided is accurate to the best of my knowledge. *"],
          ["consent_authorized", "I am authorized, or have appropriate permission, to submit this request on behalf of the hospital. *"],
          ["consent_contact", "Vaidyalaya Seva may contact me about this request. *"],
          ["consent_media_review", "Submitted photos and documents may be reviewed internally. I understand public use of any images requires separate approval. *"],
        ].map(([name, label]) => (
          <label key={name} className="flex items-start gap-3 text-sm text-gray-700">
            <input type="checkbox" name={name} required className="mt-1 w-5 h-5 flex-none" />
            <span>{label}</span>
          </label>
        ))}
        <p className="text-xs text-gray-500 mt-2">
          Submission does not guarantee project acceptance or funding. Personal information is handled per
          our <a href="/privacy" className="text-primary-800 font-semibold hover:underline">privacy policy</a>.
        </p>
      </fieldset>

      {/* Navigation */}
      <div className="flex justify-between mt-8 gap-3">
        <button type="button" onClick={() => setStep((s) => Math.max(0, s - 1))} className={`btn-secondary ${step === 0 ? "invisible" : ""}`}>
          Back
        </button>
        {step < STEPS.length - 1 ? (
          <button type="button" onClick={() => { if (validateStep()) setStep((s) => s + 1); }} className="btn-primary">
            Continue
          </button>
        ) : (
          <button type="submit" disabled={pending || uploading} className="btn-accent disabled:opacity-60">
            {pending ? "Submitting…" : "Submit Request"}
          </button>
        )}
      </div>
    </form>
  );
}
