import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/auth";
import { statusLabel } from "@/lib/format";

export default async function DashboardHome() {
  await requireStaff();
  const supabase = await createClient();
  const [projects, requests, volunteers, partnerships, contacts] = await Promise.all([
    supabase.from("projects").select("status,publication"),
    supabase.from("hospital_requests").select("id,reference,hospital_name,request_title,status,created_at").order("created_at", { ascending: false }).limit(6),
    supabase.from("volunteer_submissions").select("id", { count: "exact", head: true }).eq("handled", false),
    supabase.from("partnership_submissions").select("id", { count: "exact", head: true }).eq("handled", false),
    supabase.from("contact_submissions").select("id", { count: "exact", head: true }).eq("handled", false),
  ]);

  const all = projects.data || [];
  const cards = [
    ["Published projects", all.filter((p) => p.publication === "published").length, "/dashboard/projects"],
    ["Draft projects", all.filter((p) => p.publication === "draft").length, "/dashboard/projects"],
    ["Open hospital requests", (requests.data || []).filter((r) => !["declined", "closed", "converted_to_project"].includes(r.status)).length, "/dashboard/requests"],
    ["Unhandled form submissions", (volunteers.count || 0) + (partnerships.count || 0) + (contacts.count || 0), "/dashboard/submissions"],
  ] as const;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Overview</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {cards.map(([label, count, href]) => (
          <Link key={label} href={href} className="card p-5 hover:shadow-md transition-shadow">
            <p className="text-3xl font-bold text-primary-800">{count}</p>
            <p className="text-sm font-medium text-gray-700">{label}</p>
          </Link>
        ))}
      </div>
      <h2 className="text-lg font-bold mb-3">Recent Hospital Requests</h2>
      <div className="card divide-y divide-warm-100">
        {(requests.data || []).map((r) => (
          <Link key={r.id} href={`/dashboard/requests/${r.id}`} className="flex flex-wrap justify-between gap-2 p-4 hover:bg-warm-50">
            <div>
              <p className="font-semibold">{r.reference} · {r.request_title}</p>
              <p className="text-sm text-gray-600">{r.hospital_name}</p>
            </div>
            <span className="rounded bg-primary-50 text-primary-800 text-xs font-semibold px-2 py-1 h-fit">{statusLabel(r.status)}</span>
          </Link>
        ))}
        {(!requests.data || requests.data.length === 0) && <p className="p-6 text-gray-600">No hospital requests yet.</p>}
      </div>
    </div>
  );
}
