import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/auth";
import { fmtDate } from "@/lib/format";
import HandledButton from "@/components/HandledButton";

export default async function SubmissionsPage() {
  await requireStaff();
  const supabase = await createClient();
  const [{ data: volunteers }, { data: partnerships }, { data: contacts }] = await Promise.all([
    supabase.from("volunteer_submissions").select("*").order("created_at", { ascending: false }).limit(50),
    supabase.from("partnership_submissions").select("*").order("created_at", { ascending: false }).limit(50),
    supabase.from("contact_submissions").select("*").order("created_at", { ascending: false }).limit(50),
  ]);

  return (
    <div className="space-y-10">
      <h1 className="text-2xl font-bold">Form Inbox</h1>

      <section>
        <h2 className="text-lg font-bold mb-3">Volunteer Registrations</h2>
        <div className="card divide-y divide-warm-100">
          {(volunteers || []).map((v) => (
            <div key={v.id} className={`p-4 flex flex-wrap justify-between gap-3 ${v.handled ? "opacity-60" : ""}`}>
              <div className="text-sm">
                <p className="font-semibold">{v.name} · {v.email}{v.phone ? ` · ${v.phone}` : ""}</p>
                <p className="text-gray-600">{[v.city, v.state, v.country].filter(Boolean).join(", ")} · {fmtDate(v.created_at)}</p>
                {v.interests && <p className="text-gray-700 mt-1">Interests: {v.interests}</p>}
                {v.skills && <p className="text-gray-700">Skills: {v.skills}</p>}
              </div>
              {!v.handled && <HandledButton table="volunteer_submissions" id={v.id} />}
            </div>
          ))}
          {(!volunteers || volunteers.length === 0) && <p className="p-6 text-gray-600">No volunteer registrations yet.</p>}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold mb-3">CSR & Government Enquiries</h2>
        <div className="card divide-y divide-warm-100">
          {(partnerships || []).map((p) => (
            <div key={p.id} className={`p-4 flex flex-wrap justify-between gap-3 ${p.handled ? "opacity-60" : ""}`}>
              <div className="text-sm">
                <p className="font-semibold">
                  <span className={`rounded px-1.5 py-0.5 text-xs mr-2 ${p.kind === "csr" ? "bg-saffron-100 text-saffron-600" : "bg-primary-50 text-primary-800"}`}>{p.kind.toUpperCase()}</span>
                  {p.organization} · {p.contact_name}
                </p>
                <p className="text-gray-600">{p.email}{p.phone ? ` · ${p.phone}` : ""} · {fmtDate(p.created_at)}</p>
                {p.interest && <p className="text-gray-700 mt-1">Interest: {p.interest}</p>}
                {p.message && <p className="text-gray-700 whitespace-pre-line">{p.message}</p>}
              </div>
              {!p.handled && <HandledButton table="partnership_submissions" id={p.id} />}
            </div>
          ))}
          {(!partnerships || partnerships.length === 0) && <p className="p-6 text-gray-600">No partnership enquiries yet.</p>}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold mb-3">Contact Messages</h2>
        <div className="card divide-y divide-warm-100">
          {(contacts || []).map((c) => (
            <div key={c.id} className={`p-4 flex flex-wrap justify-between gap-3 ${c.handled ? "opacity-60" : ""}`}>
              <div className="text-sm">
                <p className="font-semibold">{c.name} · {c.email} {c.inquiry_type && <span className="text-xs text-gray-500">({c.inquiry_type})</span>}</p>
                {c.subject && <p className="text-gray-800 font-medium">{c.subject}</p>}
                <p className="text-gray-700 whitespace-pre-line">{c.message}</p>
                <p className="text-gray-500 text-xs mt-1">{fmtDate(c.created_at)}</p>
              </div>
              {!c.handled && <HandledButton table="contact_submissions" id={c.id} />}
            </div>
          ))}
          {(!contacts || contacts.length === 0) && <p className="p-6 text-gray-600">No contact messages yet.</p>}
        </div>
      </section>
    </div>
  );
}
