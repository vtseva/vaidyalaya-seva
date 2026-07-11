"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function SeedUploader() {
  const [log, setLog] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

  async function handleFiles(list: FileList | null) {
    if (!list || list.length === 0) return;
    setBusy(true);
    const supabase = createClient();
    const lines: string[] = [];
    for (const file of Array.from(list)) {
      const name = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const { error } = await supabase.storage.from("public-media").upload(`images/${name}`, file, {
        contentType: file.type || "image/jpeg",
        upsert: true,
      });
      lines.push(error ? `✗ ${name}: ${error.message}` : `✓ ${name}`);
      setLog([...lines]);
    }
    setBusy(false);
  }

  return (
    <div className="card p-6 space-y-4">
      <label className="label" htmlFor="seed-files">Select image files (multiple allowed)</label>
      <input id="seed-files" type="file" multiple accept="image/*,.png,.jpg,.jpeg,.webp" className="input !py-2" disabled={busy} onChange={(e) => handleFiles(e.target.files)} />
      {busy && <p className="text-sm text-gray-600" role="status">Uploading…</p>}
      {log.length > 0 && (
        <ul className="text-sm font-mono space-y-0.5 max-h-80 overflow-y-auto" data-upload-log>
          {log.map((l, i) => <li key={i} className={l.startsWith("✓") ? "text-green-700" : "text-red-700"}>{l}</li>)}
        </ul>
      )}
      <p className="text-xs text-gray-500">{log.filter((l) => l.startsWith("✓")).length} uploaded · {log.filter((l) => l.startsWith("✗")).length} failed</p>
    </div>
  );
}
