import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/auth";
import { statusLabel, fmtDate } from "@/lib/format";

export default async function DashboardProjects() {
  await requireStaff();
  const supabase = await createClient();
  const { data: projects } = await supabase.from("projects").select("id,project_code,name,hospital_name,status,publication,updated_at").order("updated_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-bold">Projects</h1>
        <Link href="/dashboard/projects/new" className="btn-primary">+ New Project</Link>
      </div>
      <div className="card divide-y divide-warm-100">
        {(projects || []).map((p) => (
          <Link key={p.id} href={`/dashboard/projects/${p.id}`} className="flex flex-wrap items-center justify-between gap-2 p-4 hover:bg-warm-50">
            <div>
              <p className="font-semibold">{p.project_code} · {p.name}</p>
              <p className="text-sm text-gray-600">{p.hospital_name} · updated {fmtDate(p.updated_at)}</p>
            </div>
            <div className="flex gap-2">
              <span className="rounded bg-warm-100 text-gray-700 text-xs font-semibold px-2 py-1">{statusLabel(p.status)}</span>
              <span className={`rounded text-xs font-semibold px-2 py-1 ${p.publication === "published" ? "bg-green-100 text-green-800" : "bg-saffron-100 text-saffron-600"}`}>{statusLabel(p.publication)}</span>
            </div>
          </Link>
        ))}
        {(!projects || projects.length === 0) && <p className="p-6 text-gray-600">No projects yet. Create the first one.</p>}
      </div>
    </div>
  );
}
