import Link from "next/link";
import PublicShell from "@/components/PublicShell";
import { createClient } from "@/lib/supabase/server";
import { startDonation } from "@/app/actions/donate";

export const metadata = {
  title: "Donate – Transform Public Healthcare",
  description: "Support Vaidyalaya Seva. Your tax-deductible contribution helps renovate government hospitals across India — every dollar documented with before/after evidence.",
};
export const dynamic = "force-dynamic";

const CURRENCY = (process.env.DONATION_CURRENCY || "usd").toLowerCase();
const SYMBOL: Record<string, string> = { usd: "$", inr: "₹", eur: "€", gbp: "£" };
const INDIA_DONATE_DEFAULT = "https://vtsbharath.org/vaidyalaya-seva-donate/";

export default async function DonatePage({ searchParams }: { searchParams: Promise<{ error?: string; canceled?: string }> }) {
  const { error, canceled } = await searchParams;
  const configured = Boolean(process.env.STRIPE_SECRET_KEY);
  const supabase = await createClient();
  const [{ data: options }, { data: donateSetting }, { data: linksSetting }] = await Promise.all([
    supabase.from("donation_options").select("*").eq("active", true).order("sort"),
    supabase.from("site_settings").select("value").eq("key", "donate").maybeSingle(),
    supabase.from("site_settings").select("value").eq("key", "links").maybeSingle(),
  ]);
  const sym = SYMBOL[CURRENCY] || "";
  const ein = donateSetting?.value?.ein || "";
  const indiaUrl = linksSetting?.value?.india_donate || INDIA_DONATE_DEFAULT;

  const messages: Record<string, string> = {
    amount: "Please enter a valid donation amount.",
    invalid: "That donation option is no longer available — please pick another.",
    stripe: "We could not start the payment. Please try again in a moment.",
    unconfigured: "Online payments are not enabled yet.",
  };

  return (
    <PublicShell>
      {/* Hero */}
      <section className="bg-primary-900">
        <div className="mx-auto max-w-4xl px-4 py-14 text-center">
          <h1 className="!text-white text-3xl sm:text-5xl font-bold leading-tight">
            Transform Public Healthcare.<br className="hidden sm:block" /> Restore Dignity. Save Lives.
          </h1>
          <p className="text-primary-100 mt-6 text-lg leading-relaxed max-w-3xl mx-auto">
            Every patient deserves access to clean, safe, and dignified healthcare facilities. Through
            Vaidyalaya Seva, VT Seva partners with Vikasa Tarangini to improve government hospitals across
            India — renovating essential infrastructure, enhancing patient care, and supporting critical
            healthcare needs.
          </p>
          <p className="text-saffron-100 mt-4 font-medium">
            Your contribution helps create healthier hospitals and better experiences for thousands of
            patients, families, and healthcare workers.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 py-12">
        {/* Country choice */}
        <section aria-label="Choose where you are donating from" className="grid gap-4 sm:grid-cols-2 mb-12">
          <a href="#donate-usa" className="card p-6 border-2 !border-primary-600 hover:shadow-md transition-shadow">
            <p className="text-3xl mb-2" aria-hidden="true">🇺🇸</p>
            <p className="font-serif font-bold text-primary-900 text-xl">Donate from the USA</p>
            <p className="text-sm text-gray-600 mt-2">
              In USD via secure Stripe checkout. VT Seva is a registered 501(c)(3) nonprofit — donations
              are tax-deductible.
            </p>
            <p className="text-primary-800 font-semibold text-sm mt-3">Donate below ↓</p>
          </a>
          <a href={indiaUrl} rel="noopener" className="card p-6 hover:shadow-md transition-shadow">
            <p className="text-3xl mb-2" aria-hidden="true">🇮🇳</p>
            <p className="font-serif font-bold text-primary-900 text-xl">Donate from India</p>
            <p className="text-sm text-gray-600 mt-2">
              In INR through Vikasa Tarangini (VTS Bharath) — the dedicated Vaidyalaya Seva fundraising
              page for Indian donors.
            </p>
            <p className="text-primary-800 font-semibold text-sm mt-3">Go to VTS Bharath →</p>
          </a>
        </section>

        {/* Transparency strip */}
        <section className="card p-5 mb-12 bg-primary-50 !border-primary-100 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-gray-700 max-w-md">
            <strong className="text-primary-900">Every dollar documented.</strong> Each project is published
            with itemized budgets and before/after photos — see exactly what your support builds.
          </p>
          <div className="flex gap-3">
            <Link href="/projects" className="btn-secondary !py-2 text-sm">Project Library</Link>
            <Link href="/impact" className="btn-secondary !py-2 text-sm">Impact</Link>
          </div>
        </section>

        {/* USA donation form */}
        <section id="donate-usa" className="scroll-mt-24">
          <h2 className="text-2xl font-bold mb-2">Donate from the USA</h2>
          <p className="text-gray-600 text-sm mb-6">
            Choose the impact you want to make — or give any amount. One-time payment, processed securely
            by Stripe ({CURRENCY.toUpperCase()}).
          </p>

          {canceled && <p className="rounded-lg bg-warm-100 p-4 text-gray-700 mb-6" role="status">Your payment was canceled — nothing was charged.</p>}
          {error && <p className="rounded-lg bg-red-50 p-4 text-red-700 mb-6" role="alert">{messages[error] || "Something went wrong."}</p>}

          {configured ? (
            <form action={startDonation} className="space-y-4">
              <fieldset className="space-y-3">
                <legend className="sr-only">Choose a donation option</legend>
                {(options || []).map((o) => (
                  <label key={o.id} className="card p-5 flex items-start gap-4 cursor-pointer hover:border-primary-200 has-[:checked]:border-primary-600 has-[:checked]:ring-2 has-[:checked]:ring-primary-100">
                    <input type="radio" name="option" value={o.id} required className="mt-1.5 w-5 h-5 flex-none" />
                    <span>
                      <span className="flex flex-wrap items-baseline gap-x-3">
                        <strong className="text-primary-900 text-lg">{o.title}</strong>
                        {o.amount != null && <span className="font-bold text-saffron-600 text-lg">{sym}{Number(o.amount).toLocaleString()}</span>}
                      </span>
                      {o.description && <span className="block text-sm text-gray-600 mt-1">{o.description}</span>}
                      {o.amount == null && <span className="block text-sm text-gray-500 mt-1">You choose the amount below.</span>}
                    </span>
                  </label>
                ))}
                <label className="card p-5 flex items-start gap-4 cursor-pointer hover:border-primary-200 has-[:checked]:border-primary-600 has-[:checked]:ring-2 has-[:checked]:ring-primary-100">
                  <input type="radio" name="option" value="other" required defaultChecked={(options || []).length === 0} className="mt-1.5 w-5 h-5 flex-none" />
                  <span className="flex-1">
                    <strong className="text-primary-900 text-lg">Other amount</strong>
                    <span className="block text-sm text-gray-600 mt-1 mb-2">Give any amount — every contribution restores dignity for patients.</span>
                    <span className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-700">{sym}</span>
                      <input name="custom_amount" inputMode="decimal" placeholder="50" className="input max-w-[180px]" aria-label={`Custom amount in ${CURRENCY.toUpperCase()}`} />
                    </span>
                  </span>
                </label>
              </fieldset>
              <button type="submit" className="btn-accent w-full sm:w-auto !px-12 text-lg">Donate Securely</button>
              <p className="text-xs text-gray-500">
                VT Seva is a registered 501(c)(3) nonprofit organization in the USA{ein ? ` (EIN: ${ein})` : ""}.
                Donations are tax-deductible to the extent permitted by law. You will receive an email
                receipt for your records. Many employers match charitable donations — check with your HR
                team to double your impact.
              </p>
            </form>
          ) : (
            <div className="rounded-lg bg-saffron-100 p-5 text-gray-800">
              <p className="font-semibold mb-1">Online donations are being finalized.</p>
              <p className="text-sm">Please reach out via our <a href="/contact" className="font-semibold text-primary-800 hover:underline">contact form</a>.</p>
            </div>
          )}
        </section>
      </div>
    </PublicShell>
  );
}
