"use client";

import { useActionState } from "react";
import { updateSetting, type ActionState } from "@/app/actions/admin";

const initial: ActionState = { ok: false, message: "" };

export default function SettingsForm({ settingKey, title, fields, current }: {
  settingKey: string; title: string; fields: [string, string][]; current: Record<string, string>;
}) {
  const [state, action, pending] = useActionState(updateSetting, initial);
  return (
    <form action={action} className="card p-6 space-y-4">
      <h2 className="text-lg font-bold">{title}</h2>
      {state.message && (
        <p role={state.ok ? "status" : "alert"} className={`rounded-lg p-3 text-sm ${state.ok ? "bg-green-50 text-green-800" : "bg-red-50 text-red-700"}`}>{state.message}</p>
      )}
      <input type="hidden" name="key" value={settingKey} />
      {fields.map(([name, label]) => (
        <div key={name}>
          <label className="label" htmlFor={`${settingKey}-${name}`}>{label}</label>
          {label.length > 40 ? (
            <textarea id={`${settingKey}-${name}`} name={`f_${name}`} rows={3} defaultValue={current[name] ? String(current[name]) : ""} className="input" />
          ) : (
            <input id={`${settingKey}-${name}`} name={`f_${name}`} defaultValue={current[name] ? String(current[name]) : ""} className="input" />
          )}
        </div>
      ))}
      <button type="submit" disabled={pending} className="btn-primary disabled:opacity-60">{pending ? "Saving…" : "Save"}</button>
    </form>
  );
}
