import PublicShell from "@/components/PublicShell";
import ContactForm from "./ContactForm";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Contact", description: "Contact the Vaidyalaya Seva team." };

export default async function ContactPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("site_settings").select("value").eq("key", "contact").maybeSingle();
  const contact = data?.value || {};
  return (
    <PublicShell>
      <div className="mx-auto max-w-2xl px-4 py-12">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Contact Us</h1>
        <p className="text-gray-700 mb-8">
          Questions about projects, partnerships, media or anything else — we would love to hear from you.
        </p>
        {(contact.email || contact.phone || contact.address) && (
          <div className="card p-5 mb-8 text-sm space-y-1">
            {contact.email && <p><strong>Email:</strong> {contact.email}</p>}
            {contact.phone && <p><strong>Phone:</strong> {contact.phone}</p>}
            {contact.address && <p><strong>Address:</strong> {contact.address}</p>}
          </div>
        )}
        <ContactForm />
      </div>
    </PublicShell>
  );
}
