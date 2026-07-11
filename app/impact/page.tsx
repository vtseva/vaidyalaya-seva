import PublicShell from "@/components/PublicShell";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { fmtDate } from "@/lib/format";

export const metadata = {
  title: "Impact Dashboard",
  description: "Measurable, transparent impact of Vaidyalaya Seva hospital infrastructure projects across India.",
};
export const revalidate = 300;

export default async function ImpactPage() {
  const supabase = await createClient();
  const [{ data: stats }, { data: mission }, { data: projects }] = await Promise.all([
    supabase.from("impact_stats").select("*").eq("public", true).order("sort"),
    supabase.from("site_settings").select("value").eq("key", "mission").maybeSingle(),
    supabase.from("projects").select("slug,project_code,name,hospital_name,state,status,actual_completion_date").eq("publication", "published").order("created_at", { ascending: false }).limit(10),
  ]);

  const target = Number(mission?.value?.target || 70);
  const completed = Number(stats?.find((s) => s.key === "projects_completed")?.value || 0);
  const pct = Math.min(100, Math.round((completed / target) * 100));
  const lastUpdated = stats?.reduce((max, s) => (s.updated_at > max ? s.updated_at : max), "") || null;

  return (
    <PublicShell>
      <div className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Impact Dashboard</h1>
        <p className="text-gray-700 mb-10 max-w-3xl">
          Transparency and accountability are at the heart of Vaidyalaya Seva. These figures are maintained
          by our team and updated as projects progress.
        </p>

        <section className="card p-8 mb-10">
          <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
            <h2 className="text-2xl font-bold">Mission 70 Progress</h2>
            <p className="text-sm text-gray-500">Target: November 2026</p>
          </div>
          <p className="text-gray-700 mb-5">{mission?.value?.description}</p>
          <div className="w-full bg-warm-100 rounded-full h-5" role="progressbar" aria-valuenow={completed} aria-valuemin={0} aria-valuemax={target} aria-label="Mission 70 progress">
            <div className="bg-saffron-500 h-5 rounded-full flex items-center justify-end pr-2" style={{ width: `${Math.max(pct, 8)}%` }}>
              <span className="text-white text-xs font-bold">{pct}%</span>
            </div>
          </div>
          <p className="mt-3 text-gray-700"><strong>{completed}</strong> of <strong>{target}</strong> projects completed · <strong>{target - completed}</strong> remaining</p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-6">Key Figures</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {(stats || []).map((s) => (
              <div key={s.key} className="card p-6">
                <p className="text-3xl font-bold text-primary-800">{s.value}</p>
                <p className="font-semibold text-gray-800 mt-1">{s.label}</p>
                {s.note && <p className="text-xs text-gray-500 mt-2 leading-relaxed">{s.note}</p>}
              </div>
            ))}
          </div>
          {lastUpdated && <p className="text-xs text-gray-500 mt-3">Figures last updated {fmtDate(lastUpdated)}. Values are maintained by the Vaidyalaya Seva team; program-level and project-level figures are reported separately.</p>}
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Recent Projects</h2>
          <div className="card divide-y divide-warm-100">
            {(projects || []).map((p) => (
              <Link key={p.slug} href={`/projects/${p.slug}`} className="flex flex-wrap items-center justify-between gap-2 p-4 hover:bg-warm-50">
                <div>
                  <p className="font-semibold text-primary-900">{p.project_code} · {p.name}</p>
                  <p className="text-sm text-gray-600">{p.hospital_name}{p.state ? ` · ${p.state}` : ""}</p>
                </div>
                <span className={`rounded px-2 py-1 text-xs font-semibold ${p.status === "completed" ? "bg-green-100 text-green-800" : "bg-saffron-100 text-saffron-600"}`}>
                  {p.status === "in_progress" ? "In Progress" : p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                </span>
              </Link>
            ))}
            {(!projects || projects.length === 0) && <p className="p-6 text-gray-600">Projects will appear here as they are published.</p>}
          </div>
        </section>
      </div>
    </PublicShell>
  );
}
