import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { fmtDate } from "@/lib/format";
import DonationOptionsEditor from "@/components/DonationOptionsEditor";

export default async function DonationsAdminPage() {
  await requireAdmin();
  const supabase = await createClient();
  const [{ data: options }, { data: donations }] = await Promise.all([
    supabase.from("donation_options").select("*").order("sort").order("created_at"),
    supabase.from("donations").select("*").order("created_at", { ascending: false }).limit(100),
  ]);
  const total = (donations || []).reduce((s, d) => s + Number(d.amount || 0), 0);
  const currency = donations?.[0]?.currency || "";

  return (
    <div className="max-w-4xl space-y-8">
      <h1 className="text-2xl font-bold">Donations</h1>
      <DonationOptionsEditor options={options || []} />
      <section className="card p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
          <h2 className="text-lg font-bold">Received via Stripe</h2>
          {donations && donations.length > 0 && (
            <p className="text-sm text-gray-600">Last {donations.length} · total {total.toLocaleString()} {currency}</p>
          )}
        </div>
        {(!donations || donations.length === 0) ? (
          <p className="text-gray-600 text-sm">No online donations recorded yet. They appear here automatically once Stripe payments come in (webhook must be configured). Stripe Dashboard remains the authoritative record.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-left border-b border-warm-100"><th className="py-2 pr-4">Date</th><th className="py-2 pr-4">Amount</th><th className="py-2 pr-4">Donor</th><th className="py-2">Email</th></tr></thead>
              <tbody>
                {donations.map((d) => (
                  <tr key={d.id} className="border-b border-warm-100">
                    <td className="py-2 pr-4">{fmtDate(d.created_at)}</td>
                    <td className="py-2 pr-4 font-semibold">{Number(d.amount).toLocaleString()} {d.currency}</td>
                    <td className="py-2 pr-4">{d.donor_name || "—"}</td>
                    <td className="py-2">{d.donor_email || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
