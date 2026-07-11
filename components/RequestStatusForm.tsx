"use client";

import { useActionState } from "react";
import { updateRequestStatus, type ActionState } from "@/app/actions/admin";
import { REQUEST_STATUSES, statusLabel } from "@/lib/format";

const initial: ActionState = { ok: false, message: "" };

export default function RequestStatusForm({ requestId, currentStatus }: { requestId: string; currentStatus: string }) {
  const [state, action, pending] = useActionState(updateRequestStatus, initial);
  return (
    <form action={action} className="card p-6 space-y-3">
      <h2 className="text-lg font-bold">Update Status</h2>
      {state.message && <p className={`text-sm ${state.ok ? "text-green-800" : "text-red-700"}`}>{state.message}</p>}
      <input type="hidden" name="id" value={requestId} />
      <div>
        <label className="label" htmlFor="status">Status</label>
        <select id="status" name="status" defaultValue={currentStatus} className="input">
          {REQUEST_STATUSES.map((s) => <option key={s} value={s}>{statusLabel(s)}</option>)}
        </select>
      </div>
      <div>
        <label className="label" htmlFor="note">Review note (internal)</label>
        <textarea id="note" name="note" rows={3} className="input" placeholder="e.g., Called requester; assessment planned for next week" />
      </div>
      <button type="submit" disabled={pending} className="btn-primary w-full disabled:opacity-60">{pending ? "Saving…" : "Save"}</button>
    </form>
  );
}
