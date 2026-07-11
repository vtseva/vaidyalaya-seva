import PublicShell from "@/components/PublicShell";
import InvolvedForms from "./InvolvedForms";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Get Involved – Donate, Volunteer, Partner",
  description: "Support Vaidyalaya Seva as a donor, volunteer, CSR organization or government partner.",
};

export default async function GetInvolvedPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("site_settings").select("key,value").in("key", ["donate", "contact"]);
  const donate = data?.find((r) => r.key === "donate")?.value || {};

  return (
    <PublicShell>
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Get Involved</h1>
        <p className="text-gray-700 mb-10 max-w-3xl">
          Every Vaidyalaya Seva project is powered by donors, volunteers and partners. Whether you are an
          individual, a CSR team or a government department — there is a place for you in this mission.
        </p>

        <section id="donate" className="mb-12 scroll-mt-24">
          <h2 className="text-2xl font-bold mb-3">Support a Project</h2>
          <div className="card p-6">
            <p className="text-gray-700 leading-relaxed mb-4">
              {donate.headline || "Your support is our strength to serve."} Donations fund fully documented
              hospital infrastructure projects — each with an itemized budget, execution records and
              before/after evidence you can inspect in our <a href="/projects" className="text-primary-800 font-semibold hover:underline">project library</a>.
            </p>
            {donate.instructions ? (
              <p className="text-gray-700 whitespace-pre-line">{donate.instructions}</p>
            ) : (
              <div className="rounded-lg bg-saffron-100 p-4 text-sm text-gray-800">
                <p className="font-semibold mb-1">Donation channels are being finalized.</p>
                <p>In the meantime, please reach out through the contact form below or via{" "}
                  <a href="https://www.vtsworld.org" className="font-semibold text-primary-800 hover:underline" rel="noopener">vtsworld.org</a> (USA) or{" "}
                  <a href="https://www.vtsbharath.org" className="font-semibold text-primary-800 hover:underline" rel="noopener">vtsbharath.org</a> (India),
                  and our team will guide you.</p>
              </div>
            )}
          </div>
        </section>

        <InvolvedForms />
      </div>
    </PublicShell>
  );
}
