import PublicShell from "@/components/PublicShell";
import RequestForm from "./RequestForm";

export const metadata = {
  title: "Request Hospital Support",
  description: "Public hospitals can request infrastructure assistance from Vaidyalaya Seva — sanitation, wards, drinking water, waiting areas and more.",
};

export default function RequestSupportPage() {
  return (
    <PublicShell>
      <div className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Request Hospital Support</h1>
        <p className="text-gray-700 mb-6">
          Hospital administrators, medical officers and authorized staff can request infrastructure
          assistance — sanitation and washrooms, patient wards, drinking water, waiting areas, ambulances,
          nutrition and other hospital needs.
        </p>
        <div className="card p-5 mb-8 text-sm text-gray-700 space-y-2">
          <p><strong>What happens after you submit:</strong> our team reviews every request, may contact you
          for more information, and conducts a joint need assessment with hospital authorities before a
          project is approved and scoped.</p>
          <p><strong>Please note:</strong> submission does not guarantee acceptance or funding. Your contact
          information is kept private and used only to process this request.</p>
          <p className="text-red-700 font-medium">Please do not upload patient medical records or
          patient-identifiable information. This form is for infrastructure needs only.</p>
        </div>
        <RequestForm />
      </div>
    </PublicShell>
  );
}
