"use client";

import { useActionState } from "react";
import { submitContact, type FormState } from "@/app/actions/public";

const initial: FormState = { ok: false, message: "" };

export default function ContactForm() {
  const [state, action, pending] = useActionState(submitContact, initial);
  if (state.ok) {
    return <div className="card p-6 bg-green-50 !border-green-200 text-green-900 font-medium" role="status">{state.message}</div>;
  }
  return (
    <form action={action} className="card p-6 space-y-4">
      {state.message && <p className="text-red-700 bg-red-50 rounded-lg p-3 text-sm" role="alert">{state.message}</p>}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="label">Name *</label>
          <input id="name" name="name" required className="input" autoComplete="name" />
        </div>
        <div>
          <label htmlFor="email" className="label">Email *</label>
          <input id="email" name="email" type="email" required className="input" autoComplete="email" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="subject" className="label">Subject</label>
          <input id="subject" name="subject" className="input" />
        </div>
        <div>
          <label htmlFor="inquiry_type" className="label">Inquiry type</label>
          <select id="inquiry_type" name="inquiry_type" className="input">
            <option>General</option><option>Donation</option><option>Volunteering</option>
            <option>CSR / Partnership</option><option>Hospital Support</option><option>Media</option>
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="message" className="label">Message *</label>
        <textarea id="message" name="message" required rows={5} className="input" />
      </div>
      <button type="submit" disabled={pending} className="btn-primary disabled:opacity-60">
        {pending ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
