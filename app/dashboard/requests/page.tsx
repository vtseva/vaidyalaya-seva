import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/auth";
import { statusLabel, fmtDate } from "@/lib/format";

export default async function RequestsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  await requireStaff();
  const { status } = await searchParams;
  const supabase = await createClient();
  let q = supabase.from("hospital_requests").select("id,reference,hospital_name,city,state,request_title,urgency,status,created_at").order("created_at", { ascending: false });
  if (status) q = q.eq("status", status);
  const { data: requests } = await q.limit(100);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Hospital Requests</h1>
      <div className="card divide-y divide-warm-100">
        {(requests || []).map((r) => (
          <Link key={r.id} href={`/dashboard/requests/${r.id}`} className="flex flex-wrap items-center justify-between gap-2 p-4 hover:bg-warm-50">
            <div>
              <p className="font-semibold">{r.reference} · {r.request_title}</p>
              <p className="text-sm text-gray-600">{r.hospital_name} · {r.city}, {r.state} · {fmtDate(r.created_at)}</p>
            </div>
            <div className="flex gap-2">
              <span className={`rounded text-xs font-semibold px-2 py-1 ${r.urgency === "critical" ? "bg-red-100 text-red-800" : r.urgency === "high" ? "bg-saffron-100 text-saffron-600" : "bg-warm-100 text-gray-700"}`}>{statusLabel(r.urgency)}</span>
              <span className="rounded bg-primary-50 text-primary-800 text-xs font-semibold px-2 py-1">{statusLabel(r.status)}</span>
            </div>
          </Link>
        ))}
        {(!requests || requests.length === 0) && <p className="p-6 text-gray-600">No hospital requests yet. They will appear here when submitted via the public form.</p>}
      </div>
    </div>
  );
}
