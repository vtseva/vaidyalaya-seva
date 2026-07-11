import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/auth";
import { statusLabel, fmtDate } from "@/lib/format";
import RequestStatusForm from "@/components/RequestStatusForm";

export default async function RequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireStaff();
  const { id } = await params;
  const supabase = await createClient();
  const { data: r } = await supabase.from("hospital_requests").select("*").eq("id", id).maybeSingle();
  if (!r) notFound();
  const [{ data: files }, { data: updates }] = await Promise.all([
    supabase.from("hospital_request_files").select("*").eq("request_id", id),
    supabase.from("hospital_request_updates").select("*, profiles:author(full_name)").eq("request_id", id).order("created_at", { ascending: false }),
  ]);

  const signed: { name: string; url: string }[] = [];
  for (const f of files || []) {
    const { data } = await supabase.storage.from("request-uploads").createSignedUrl(f.path, 3600);
    if (data?.signedUrl) signed.push({ name: f.file_name || f.path, url: data.signedUrl });
  }

  const Field = ({ l, v }: { l: string; v?: string | boolean | null }) =>
    v == null || v === "" ? null : (
      <div><dt className="text-gray-500 text-xs uppercase tracking-wide">{l}</dt><dd className="font-medium">{typeof v === "boolean" ? (v ? "Yes" : "No") : v}</dd></div>
    );

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-3 flex-wrap mb-6">
        <h1 className="text-2xl font-bold">{r.reference}</h1>
        <span className="rounded bg-primary-50 text-primary-800 text-sm font-semibold px-3 py-1">{statusLabel(r.status)}</span>
        <span className="text-sm text-gray-500">Submitted {fmtDate(r.created_at)}</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <section className="card p-6">
            <h2 className="text-lg font-bold mb-2">{r.request_title}</h2>
            <p className="text-gray-700 whitespace-pre-line mb-4">{r.problem_description}</p>
            <dl className="grid gap-3 sm:grid-cols-2 text-sm">
              <Field l="Type" v={r.project_type} />
              <Field l="Urgency" v={statusLabel(r.urgency)} />
              <Field l="Current condition" v={r.current_condition} />
              <Field l="Assistance requested" v={r.requested_assistance} />
              <Field l="Areas affected" v={r.areas_affected} />
              <Field l="Estimated beneficiaries" v={r.estimated_beneficiaries} />
              <Field l="Estimated budget" v={r.estimated_budget} />
              <Field l="Desired timeline" v={r.desired_timeline} />
              <Field l="Leadership approved" v={r.leadership_approved} />
            </dl>
          </section>

          <section className="card p-6">
            <h2 className="text-lg font-bold mb-3">Hospital</h2>
            <dl className="grid gap-3 sm:grid-cols-2 text-sm">
              <Field l="Hospital" v={r.hospital_name} />
              <Field l="Type" v={r.hospital_type} />
              <Field l="Classification" v={r.classification} />
              <Field l="Department" v={r.department} />
              <Field l="Address" v={r.address} />
              <Field l="City" v={r.city} />
              <Field l="District" v={r.district} />
              <Field l="State" v={r.state} />
              <Field l="Postal code" v={r.postal_code} />
              <Field l="Website" v={r.hospital_website} />
              <Field l="Patients/month" v={r.patients_per_month} />
            </dl>
          </section>

          <section className="card p-6">
            <h2 className="text-lg font-bold mb-3">Requester (private)</h2>
            <dl className="grid gap-3 sm:grid-cols-2 text-sm">
              <Field l="Name" v={r.requester_name} />
              <Field l="Designation" v={r.designation} />
              <Field l="Department" v={r.requester_department} />
              <Field l="Relationship" v={r.relationship} />
              <Field l="Email" v={r.email} />
              <Field l="Phone" v={r.phone} />
              <Field l="Alt phone" v={r.alt_phone} />
              <Field l="Preferred contact" v={r.preferred_contact} />
            </dl>
          </section>

          {signed.length > 0 && (
            <section className="card p-6">
              <h2 className="text-lg font-bold mb-3">Attachments (private, links valid 1 hour)</h2>
              <ul className="space-y-2 text-sm">
                {signed.map((f) => (
                  <li key={f.url}><a href={f.url} target="_blank" rel="noopener" className="text-primary-800 font-medium hover:underline">📎 {f.name}</a></li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <div className="space-y-6">
          <RequestStatusForm requestId={r.id} currentStatus={r.status} />
          <section className="card p-6">
            <h2 className="text-lg font-bold mb-3">Review History</h2>
            <ul className="space-y-3 text-sm">
              {(updates || []).map((u) => (
                <li key={u.id} className="border-b border-warm-100 pb-2">
                  <p className="text-gray-700 whitespace-pre-line">{u.note}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {u.profiles?.full_name || "Team"} · {fmtDate(u.created_at)}{u.new_status ? ` · → ${statusLabel(u.new_status)}` : ""}
                  </p>
                </li>
              ))}
              {(!updates || updates.length === 0) && <li className="text-gray-500">No review notes yet.</li>}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
