import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import { createClient } from "@/lib/supabase/server";

export default async function PublicShell({ children }: { children: React.ReactNode }) {
  let links, contact, donateUrl;
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("site_settings").select("key,value").in("key", ["links", "contact", "donate"]);
    links = data?.find((r) => r.key === "links")?.value;
    contact = data?.find((r) => r.key === "contact")?.value;
    donateUrl = "/donate";
  } catch { /* render with defaults */ }
  return (
    <>
      <SiteHeader donateUrl={donateUrl || ""} />
      <main id="main">{children}</main>
      <SiteFooter links={links} contact={contact} />
    </>
  );
}
