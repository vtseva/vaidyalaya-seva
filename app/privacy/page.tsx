import PublicShell from "@/components/PublicShell";

export const metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <PublicShell>
      <div className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <div className="space-y-4 text-gray-700 leading-relaxed">
          <p>Vaidyalaya Seva (operated jointly by Vikasa Tarangini and VT Seva) collects only the information needed to review hospital assistance requests, coordinate volunteering and partnerships, and respond to enquiries.</p>
          <p>Information submitted through our forms — including hospital request details, contact information and uploaded documents — is stored securely and is accessible only to authorized Vaidyalaya Seva administrators. Hospital request attachments are kept private and are never published without separate, explicit approval.</p>
          <p>We ask hospitals not to upload patient medical records or patient-identifiable information. Our work concerns infrastructure, not protected medical information.</p>
          <p>We do not sell or share personal information with third parties for marketing. Photographs of completed projects are published only for transparency and reporting, with identifying information reviewed before publication.</p>
          <p>To request correction or deletion of your information, contact us through the contact page.</p>
        </div>
      </div>
    </PublicShell>
  );
}
