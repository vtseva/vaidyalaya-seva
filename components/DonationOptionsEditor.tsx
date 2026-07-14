"use client";

import { useActionState, useTransition } from "react";
import { addDonationOption, toggleDonationOption, deleteDonationOption, type ActionState } from "@/app/actions/admin";

const initial: ActionState = { ok: false, message: "" };

type Option = { id: string; title: string; description: string | null; amount: number | null; active: boolean };

export default function DonationOptionsEditor({ options }: { options: Option[] }) {
  const [state, action, pending] = useActionState(addDonationOption, initial);
  const [, start] = useTransition();

  return (
    <section className="card p-6">
      <h2 className="text-lg font-bold mb-1">Donation Options</h2>
      <p className="text-sm text-gray-600 mb-4">Shown on the public donate page. Leave the amount blank to let the donor choose. An "Other amount" choice is always shown automatically.</p>
      {options.length > 0 && (
        <ul className="divide-y divide-warm-100 mb-5">
          {options.map((o) => (
            <li key={o.id} className={`py-3 flex flex-wrap items-center justify-between gap-3 ${o.active ? "" : "opacity-50"}`}>
              <div className="text-sm">
                <p className="font-semibold">{o.title} {o.amount != null ? <span className="text-saffron-600">· {Number(o.amount).toLocaleString()}</span> : <span className="text-gray-500">· donor chooses</span>}</p>
                {o.description && <p className="text-gray-600">{o.description}</p>}
              </div>
              <div className="flex gap-2">
                <button onClick={() => start(() => toggleDonationOption(o.id, !o.active))} className="rounded border border-gray-300 px-3 py-1.5 text-xs font-semibold hover:bg-warm-50 min-h-[36px]">
                  {o.active ? "Hide" : "Show"}
                </button>
                <button onClick={() => { if (confirm(`Delete "${o.title}"?`)) start(() => deleteDonationOption(o.id)); }} className="rounded border border-red-200 text-red-700 px-3 py-1.5 text-xs font-semibold hover:bg-red-50 min-h-[36px]">
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {state.message && <p className={`text-sm mb-3 ${state.ok ? "text-green-800" : "text-red-700"}`} role={state.ok ? "status" : "alert"}>{state.message}</p>}
      <form action={action} className="grid gap-3 sm:grid-cols-[1fr_140px] items-end">
        <div><label className="label" htmlFor="do-title">Title *</label><input id="do-title" name="title" required className="input" placeholder="e.g., Renovate one washroom" /></div>
        <div><label className="label" htmlFor="do-amount">Amount (blank = donor chooses)</label><input id="do-amount" name="amount" inputMode="decimal" className="input" /></div>
        <div className="sm:col-span-2"><label className="label" htmlFor="do-desc">Description</label><input id="do-desc" name="description" className="input" placeholder="What this contribution makes possible" /></div>
        <button type="submit" disabled={pending} className="btn-primary w-fit disabled:opacity-60">{pending ? "Adding…" : "Add Option"}</button>
      </form>
    </section>
  );
}
