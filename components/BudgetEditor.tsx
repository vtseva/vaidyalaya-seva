"use client";

import { useActionState } from "react";
import { addBudgetItem, deleteBudgetItem, type ActionState } from "@/app/actions/admin";
import { inr } from "@/lib/format";

const initial: ActionState = { ok: false, message: "" };

type Item = { id: string; component: string; description: string | null; planned_amount: number | null };

export default function BudgetEditor({ projectId, items }: { projectId: string; items: Item[] }) {
  const [state, action, pending] = useActionState(addBudgetItem, initial);
  const total = items.reduce((s, i) => s + (Number(i.planned_amount) || 0), 0);

  return (
    <section className="card p-6">
      <h2 className="text-lg font-bold mb-4">Itemized Budget</h2>
      {items.length > 0 && (
        <table className="w-full text-sm mb-4">
          <thead><tr className="text-left border-b border-warm-100"><th className="py-2">Component</th><th className="py-2 hidden sm:table-cell">Description</th><th className="py-2 text-right">Planned</th><th /></tr></thead>
          <tbody>
            {items.map((i) => (
              <tr key={i.id} className="border-b border-warm-100">
                <td className="py-2 font-medium">{i.component}</td>
                <td className="py-2 text-gray-600 hidden sm:table-cell">{i.description}</td>
                <td className="py-2 text-right">{inr(Number(i.planned_amount))}</td>
                <td className="py-2 text-right">
                  <button onClick={() => { if (confirm("Delete this budget item?")) deleteBudgetItem(i.id, projectId); }} className="text-red-600 text-xs font-semibold px-2 py-1 hover:underline">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            <tr className="font-bold"><td className="py-2">Total (calculated)</td><td className="hidden sm:table-cell" /><td className="py-2 text-right">{inr(total)}</td><td /></tr>
          </tbody>
        </table>
      )}
      {state.message && <p className={`text-sm mb-2 ${state.ok ? "text-green-800" : "text-red-700"}`}>{state.message}</p>}
      <form action={action} className="grid gap-3 sm:grid-cols-[1fr_1fr_140px_auto] items-end">
        <input type="hidden" name="project_id" value={projectId} />
        <div><label className="label" htmlFor="b-comp">Component</label><input id="b-comp" name="component" required className="input" /></div>
        <div><label className="label" htmlFor="b-desc">Description</label><input id="b-desc" name="description" className="input" /></div>
        <div><label className="label" htmlFor="b-amt">Planned (₹)</label><input id="b-amt" name="planned_amount" inputMode="numeric" className="input" /></div>
        <button type="submit" disabled={pending} className="btn-primary !py-2.5 disabled:opacity-60">Add</button>
      </form>
    </section>
  );
}
