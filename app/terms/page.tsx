import PublicShell from "@/components/PublicShell";

export const metadata = { title: "Terms of Use" };

export default function TermsPage() {
  return (
    <PublicShell>
      <div className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">Terms of Use</h1>
        <div className="space-y-4 text-gray-700 leading-relaxed">
          <p>This website is operated by the Vaidyalaya Seva initiative of Vikasa Tarangini (India) and VT Seva (USA). Content is provided for information and transparency about our public healthcare infrastructure projects.</p>
          <p>Submitting a hospital assistance request does not guarantee acceptance or funding. All requests are reviewed and prioritized by the Vaidyalaya Seva team in consultation with hospital authorities.</p>
          <p>Information you submit must be accurate, and you must be authorized to submit it. Media uploaded with requests is reviewed internally; public use of any submitted images requires separate approval.</p>
          <p>Project statistics are maintained in good faith and updated as projects progress. Program-level and project-level figures are reported separately.</p>
          <p>All logos and imagery remain the property of their respective organizations and may not be reused without permission.</p>
        </div>
      </div>
    </PublicShell>
  );
}
