"use client";

import { useActionState } from "react";
import { saveProject, type ActionState } from "@/app/actions/admin";
import { PROJECT_TYPES } from "@/lib/format";

const initial: ActionState = { ok: false, message: "" };

type P = Record<string, string | number | boolean | null | undefined>;

export default function ProjectForm({ project }: { project?: P }) {
  const [state, action, pending] = useActionState(saveProject, initial);
  const p = project || {};
  const v = (k: string) => (p[k] == null ? "" : String(p[k]));

  return (
    <form action={action} className="space-y-6">
      {state.message && (
        <p role={state.ok ? "status" : "alert"} className={`rounded-lg p-3 text-sm font-medium ${state.ok ? "bg-green-50 text-green-900" : "bg-red-50 text-red-700"}`}>
          {state.message}
        </p>
      )}
      {p.id ? <input type="hidden" name="id" value={String(p.id)} /> : null}

      <section className="card p-6 space-y-4">
        <h2 className="text-lg font-bold">Basic Information</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div><label className="label" htmlFor="project_code">Project ID *</label><input id="project_code" name="project_code" required defaultValue={v("project_code")} className="input" placeholder="VS-2026-002" /></div>
          <div className="lg:col-span-2"><label className="label" htmlFor="name">Project name *</label><input id="name" name="name" required defaultValue={v("name")} className="input" /></div>
          <div>
            <label className="label" htmlFor="status">Project status</label>
            <select id="status" name="status" defaultValue={v("status") || "planned"} className="input">
              <option value="planned">Planned</option><option value="in_progress">In Progress</option>
              <option value="completed">Completed</option><option value="archived">Archived</option>
            </select>
          </div>
          <div>
            <label className="label" htmlFor="publication">Publication</label>
            <select id="publication" name="publication" defaultValue={v("publication") || "draft"} className="input">
              <option value="draft">Draft</option><option value="in_review">In Review</option>
              <option value="published">Published</option><option value="archived">Archived</option>
            </select>
          </div>
          <div>
            <label className="label" htmlFor="project_type">Project type</label>
            <select id="project_type" name="project_type" defaultValue={v("project_type") || PROJECT_TYPES[0]} className="input">
              {PROJECT_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <input type="checkbox" name="featured" defaultChecked={p.featured === true} className="w-5 h-5" /> Feature on homepage
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className="label" htmlFor="hospital_name">Hospital name *</label><input id="hospital_name" name="hospital_name" required defaultValue={v("hospital_name")} className="input" /></div>
          <div><label className="label" htmlFor="hospital_type">Hospital type</label><input id="hospital_type" name="hospital_type" defaultValue={v("hospital_type")} className="input" /></div>
          <div><label className="label" htmlFor="department">Department / Unit</label><input id="department" name="department" defaultValue={v("department")} className="input" /></div>
          <div><label className="label" htmlFor="city">City</label><input id="city" name="city" defaultValue={v("city")} className="input" /></div>
          <div><label className="label" htmlFor="district">District</label><input id="district" name="district" defaultValue={v("district")} className="input" /></div>
          <div><label className="label" htmlFor="state">State</label><input id="state" name="state" defaultValue={v("state")} className="input" /></div>
        </div>
        <div><label className="label" htmlFor="short_summary">Short summary * (shown on cards)</label><textarea id="short_summary" name="short_summary" required rows={2} defaultValue={v("short_summary")} className="input" /></div>
        <div><label className="label" htmlFor="executive_summary">Executive summary</label><textarea id="executive_summary" name="executive_summary" rows={3} defaultValue={v("executive_summary")} className="input" /></div>
      </section>

      <section className="card p-6 space-y-4">
        <h2 className="text-lg font-bold">Need & Objectives</h2>
        <div><label className="label" htmlFor="background">Background</label><textarea id="background" name="background" rows={3} defaultValue={v("background")} className="input" /></div>
        <div><label className="label" htmlFor="need_assessment">Need assessment</label><textarea id="need_assessment" name="need_assessment" rows={3} defaultValue={v("need_assessment")} className="input" /></div>
        <div><label className="label" htmlFor="scope">Scope</label><textarea id="scope" name="scope" rows={2} defaultValue={v("scope")} className="input" /></div>
        <div><label className="label" htmlFor="major_works">Major works</label><textarea id="major_works" name="major_works" rows={2} defaultValue={v("major_works")} className="input" /></div>
        <div><label className="label" htmlFor="expected_impact">Expected impact</label><textarea id="expected_impact" name="expected_impact" rows={2} defaultValue={v("expected_impact")} className="input" /></div>
        <div><label className="label" htmlFor="beneficiary_groups">Beneficiary groups</label><input id="beneficiary_groups" name="beneficiary_groups" defaultValue={v("beneficiary_groups")} className="input" /></div>
      </section>

      <section className="card p-6 space-y-4">
        <h2 className="text-lg font-bold">Execution & Finance</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div><label className="label" htmlFor="start_date">Start date</label><input id="start_date" name="start_date" type="date" defaultValue={v("start_date")} className="input" /></div>
          <div><label className="label" htmlFor="target_completion_date">Target completion</label><input id="target_completion_date" name="target_completion_date" type="date" defaultValue={v("target_completion_date")} className="input" /></div>
          <div><label className="label" htmlFor="actual_completion_date">Actual completion</label><input id="actual_completion_date" name="actual_completion_date" type="date" defaultValue={v("actual_completion_date")} className="input" /></div>
          <div><label className="label" htmlFor="approved_budget">Approved budget (₹)</label><input id="approved_budget" name="approved_budget" defaultValue={v("approved_budget")} className="input" inputMode="numeric" /></div>
          <div><label className="label" htmlFor="funding_source">Funding source</label><input id="funding_source" name="funding_source" defaultValue={v("funding_source")} className="input" /></div>
          <div><label className="label" htmlFor="partners">Partners</label><input id="partners" name="partners" defaultValue={v("partners")} className="input" /></div>
        </div>
        <div><label className="label" htmlFor="budget_notes">Budget notes</label><textarea id="budget_notes" name="budget_notes" rows={2} defaultValue={v("budget_notes")} className="input" /></div>
        <p className="text-sm text-gray-500">Itemized budget rows can be added after saving (totals are calculated automatically from line items on the public page).</p>
      </section>

      <section className="card p-6 space-y-4">
        <h2 className="text-lg font-bold">Media & Notes</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className="label" htmlFor="cover_image">Cover image path/URL</label><input id="cover_image" name="cover_image" defaultValue={v("cover_image")} className="input" placeholder="Full image URL (Supabase storage)" /></div>
          <div><label className="label" htmlFor="hero_image">Hero image path/URL</label><input id="hero_image" name="hero_image" defaultValue={v("hero_image")} className="input" /></div>
        </div>
        <div><label className="label" htmlFor="lessons_learned">Lessons learned</label><textarea id="lessons_learned" name="lessons_learned" rows={2} defaultValue={v("lessons_learned")} className="input" /></div>
        <div><label className="label" htmlFor="maintenance_plan">Future maintenance plan</label><textarea id="maintenance_plan" name="maintenance_plan" rows={2} defaultValue={v("maintenance_plan")} className="input" /></div>
        <div><label className="label" htmlFor="internal_notes">Internal notes (never public)</label><textarea id="internal_notes" name="internal_notes" rows={2} defaultValue={v("internal_notes")} className="input" /></div>
      </section>

      <button type="submit" disabled={pending} className="btn-primary disabled:opacity-60">
        {pending ? "Saving…" : "Save Project"}
      </button>
    </form>
  );
}
