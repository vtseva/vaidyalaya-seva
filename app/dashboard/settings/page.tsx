import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import SettingsForm from "@/components/SettingsForm";

export default async function SettingsPage() {
  await requireAdmin();
  const supabase = await createClient();
  const { data } = await supabase.from("site_settings").select("key,value");
  const get = (k: string) => (data?.find((r) => r.key === k)?.value || {}) as Record<string, string>;

  return (
    <div className="max-w-3xl space-y-8">
      <h1 className="text-2xl font-bold">Site Settings</h1>
      <SettingsForm
        settingKey="contact" title="Contact Information" current={get("contact")}
        fields={[["email", "Public email"], ["phone", "Public phone"], ["address", "Address"]]}
      />
      <SettingsForm
        settingKey="donate" title="Donation Section" current={get("donate")}
        fields={[["stripe_url", "Stripe payment link URL (donate buttons use this)"], ["headline", "Headline"], ["instructions", "Donation instructions (bank details, links — shown publicly when filled)"], ["contact_email", "Donations contact email"]]}
      />
      <SettingsForm
        settingKey="mission" title="Mission 70" current={get("mission")}
        fields={[["target", "Target project count"], ["target_date", "Target date (e.g., 2026-11)"], ["description", "Mission description"]]}
      />
      <SettingsForm
        settingKey="links" title="Organization Links" current={get("links")}
        fields={[["vtsbharath", "Vikasa Tarangini URL"], ["vtseva", "VT Seva URL"], ["chinnajeeyar", "Chinna Jeeyar URL"]]}
      />
    </div>
  );
}
