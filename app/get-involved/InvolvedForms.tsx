"use client";

import { useActionState, useState } from "react";
import { submitVolunteer, submitPartnership, type FormState } from "@/app/actions/public";

const initial: FormState = { ok: false, message: "" };

function Msg({ state }: { state: FormState }) {
  if (!state.message) return null;
  return (
    <p role={state.ok ? "status" : "alert"} className={`rounded-lg p-3 text-sm font-medium ${state.ok ? "bg-green-50 text-green-900" : "bg-red-50 text-red-700"}`}>
      {state.message}
    </p>
  );
}

export default function InvolvedForms() {
  const [tab, setTab] = useState<"volunteer" | "csr" | "government">("volunteer");
  const [volState, volAction, volPending] = useActionState(submitVolunteer, initial);
  const [partState, partAction, partPending] = useActionState(submitPartnership, initial);

  const tabs = [
    ["volunteer", "Volunteer"],
    ["csr", "CSR Partnership"],
    ["government", "Government"],
  ] as const;

  return (
    <section id="volunteer" className="scroll-mt-24">
      <span id="partner" className="block scroll-mt-24" />
      <h2 className="text-2xl font-bold mb-4">Volunteer & Partner With Us</h2>
      <div role="tablist" aria-label="Ways to get involved" className="flex flex-wrap gap-2 mb-5">
        {tabs.map(([key, label]) => (
          <button key={key} role="tab" aria-selected={tab === key} onClick={() => setTab(key)}
            className={`rounded-lg px-5 py-2.5 font-semibold min-h-[44px] ${tab === key ? "bg-primary-800 text-white" : "bg-white border border-gray-300 text-gray-700 hover:bg-primary-50"}`}>
            {label}
          </button>
        ))}
      </div>

      {tab === "volunteer" && (
        volState.ok ? <Msg state={volState} /> : (
        <form action={volAction} className="card p-6 space-y-4">
          <Msg state={volState} />
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="label" htmlFor="v-name">Name *</label><input id="v-name" name="name" required className="input" autoComplete="name" /></div>
            <div><label className="label" htmlFor="v-email">Email *</label><input id="v-email" name="email" type="email" required className="input" autoComplete="email" /></div>
            <div><label className="label" htmlFor="v-phone">Phone</label><input id="v-phone" name="phone" className="input" autoComplete="tel" /></div>
            <div><label className="label" htmlFor="v-city">City</label><input id="v-city" name="city" className="input" /></div>
            <div><label className="label" htmlFor="v-state">State</label><input id="v-state" name="state" className="input" /></div>
            <div><label className="label" htmlFor="v-country">Country</label><input id="v-country" name="country" className="input" defaultValue="India" /></div>
          </div>
          <div><label className="label" htmlFor="v-interests">Areas of interest</label><input id="v-interests" name="interests" className="input" placeholder="e.g., site coordination, documentation, fundraising" /></div>
          <div><label className="label" htmlFor="v-skills">Skills</label><input id="v-skills" name="skills" className="input" placeholder="e.g., civil engineering, photography, communications" /></div>
          <div><label className="label" htmlFor="v-avail">Availability</label><input id="v-avail" name="availability" className="input" placeholder="e.g., weekends" /></div>
          <label className="flex items-start gap-3 text-sm text-gray-700">
            <input type="checkbox" name="consent" required className="mt-1 w-5 h-5" />
            <span>I consent to being contacted by the Vaidyalaya Seva team about volunteering. *</span>
          </label>
          <button type="submit" disabled={volPending} className="btn-primary disabled:opacity-60">{volPending ? "Submitting…" : "Register as a Volunteer"}</button>
        </form>
        )
      )}

      {(tab === "csr" || tab === "government") && (
        partState.ok ? <Msg state={partState} /> : (
        <form action={partAction} className="card p-6 space-y-4" key={tab}>
          <Msg state={partState} />
          <input type="hidden" name="kind" value={tab} />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="label" htmlFor="p-org">{tab === "csr" ? "Organization *" : "Department / Institution *"}</label>
              <input id="p-org" name="organization" required className="input" />
            </div>
            <div><label className="label" htmlFor="p-name">Contact person *</label><input id="p-name" name="contact_name" required className="input" /></div>
            <div><label className="label" htmlFor="p-role">{tab === "csr" ? "Role" : "Designation"}</label><input id="p-role" name="role_title" className="input" /></div>
            <div><label className="label" htmlFor="p-email">{tab === "csr" ? "Email *" : "Official email *"}</label><input id="p-email" name="email" type="email" required className="input" /></div>
            <div><label className="label" htmlFor="p-phone">Phone</label><input id="p-phone" name="phone" className="input" /></div>
            {tab === "government" && (
              <div className="sm:col-span-2"><label className="label" htmlFor="p-jur">Jurisdiction</label><input id="p-jur" name="jurisdiction" className="input" placeholder="e.g., District / State / Department" /></div>
            )}
          </div>
          <div>
            <label className="label" htmlFor="p-interest">{tab === "csr" ? "Partnership interest" : "Collaboration interest"}</label>
            <input id="p-interest" name="interest" className="input" placeholder={tab === "csr" ? "e.g., funding sanitation projects in Telangana" : "e.g., district hospital improvement program"} />
          </div>
          <div><label className="label" htmlFor="p-msg">Message</label><textarea id="p-msg" name="message" rows={4} className="input" /></div>
          <label className="flex items-start gap-3 text-sm text-gray-700">
            <input type="checkbox" name="consent" required className="mt-1 w-5 h-5" />
            <span>I consent to being contacted by the Vaidyalaya Seva team. *</span>
          </label>
          <button type="submit" disabled={partPending} className="btn-primary disabled:opacity-60">{partPending ? "Submitting…" : "Submit Enquiry"}</button>
        </form>
        )
      )}
    </section>
  );
}
