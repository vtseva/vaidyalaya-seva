"use client";

import { useActionState } from "react";
import { updateImpactStat, type ActionState } from "@/app/actions/admin";

const initial: ActionState = { ok: false, message: "" };

export default function ImpactStatRow({ stat }: { stat: { id: string; label: string; value: string; note: string | null } }) {
  const [state, action, pending] = useActionState(updateImpactStat, initial);
  return (
    <form action={action} className="card p-4 grid gap-3 sm:grid-cols-[180px_140px_1fr_auto] items-end">
      <input type="hidden" name="id" value={stat.id} />
      <p className="font-semibold text-primary-900 self-center">{stat.label}</p>
      <div><label className="label">Value</label><input name="value" defaultValue={stat.value} className="input" /></div>
      <div><label className="label">Note (scope)</label><input name="note" defaultValue={stat.note || ""} className="input" /></div>
      <div className="flex items-center gap-2">
        <button type="submit" disabled={pending} className="btn-primary !py-2.5 disabled:opacity-60">Save</button>
        {state.ok && <span className="text-green-700 text-sm" role="status">✓</span>}
        {!state.ok && state.message && <span className="text-red-700 text-xs" role="alert">{state.message}</span>}
      </div>
    </form>
  );
}
