import PublicShell from "@/components/PublicShell";
import { createClient } from "@/lib/supabase/server";
import { startDonation } from "@/app/actions/donate";

export const metadata = {
  title: "Donate",
  description: "Support Vaidyalaya Seva — fund documented, transparent public-hospital infrastructure projects.",
};
export const dynamic = "force-dynamic";

const CURRENCY = (process.env.DONATION_CURRENCY || "usd").toLowerCase();
const SYMBOL: Record<string, string> = { usd: "$", inr: "₹", eur: "€", gbp: "£" };

export default async function DonatePage({ searchParams }: { searchParams: Promise<{ error?: string; canceled?: string }> }) {
  const { error, canceled } = await searchParams;
  const configured = Boolean(process.env.STRIPE_SECRET_KEY);
  const supabase = await createClient();
  const [{ data: options }, { data: donateSetting }] = await Promise.all([
    supabase.from("donation_options").select("*").eq("active", true).order("sort"),
    supabase.from("site_settings").select("value").eq("key", "donate").maybeSingle(),
  ]);
  const sym = SYMBOL[CURRENCY] || "";
  const fallbackUrl = donateSetting?.value?.stripe_url || "";

  const messages: Record<string, string> = {
    amount: "Please enter a valid donation amount.",
    invalid: "That donation option is no longer available — please pick another.",
    stripe: "We could not start the payment. Please try again in a moment.",
    unconfigured: "Online payments are not enabled yet.",
  };

  return (
    <PublicShell>
      <div className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Support the Mission</h1>
        <p className="text-gray-700 mb-8 max-w-2xl">
          Every donation funds documented hospital infrastructure work — with itemized budgets and
          before/after evidence published in our project library. Payments are processed securely by Stripe.
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
            <p className="text-xs text-gray-500">One-time payment · processed by Stripe · you will receive an email receipt. Currency: {CURRENCY.toUpperCase()}.</p>
          </form>
        ) : fallbackUrl ? (
          <a href={fallbackUrl} className="btn-accent text-lg !px-10" rel="noopener">Donate Now</a>
        ) : (
          <div className="rounded-lg bg-saffron-100 p-5 text-gray-800">
            <p className="font-semibold mb-1">Online donations are being finalized.</p>
            <p className="text-sm">Please reach out via our <a href="/contact" className="font-semibold text-primary-800 hover:underline">contact form</a>, or through <a href="https://www.vtsworld.org" className="font-semibold text-primary-800 hover:underline" rel="noopener">vtsworld.org</a> (USA) / <a href="https://www.vtsbharath.org" className="font-semibold text-primary-800 hover:underline" rel="noopener">vtsbharath.org</a> (India).</p>
          </div>
        )}
      </div>
    </PublicShell>
  );
}
