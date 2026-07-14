import PublicShell from "@/components/PublicShell";
import Link from "next/link";

export const metadata = { title: "Thank You", robots: { index: false } };

export default function ThankYouPage() {
  return (
    <PublicShell>
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <p className="text-5xl mb-4" aria-hidden="true">🙏</p>
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">Thank You for Your Support</h1>
        <p className="text-gray-700 leading-relaxed mb-2">
          Your donation was received. A receipt has been emailed to you by Stripe.
        </p>
        <p className="text-gray-700 leading-relaxed mb-8">
          Your generosity helps create cleaner, safer and more dignified public healthcare facilities —
          and you can see exactly how funds are used in our project library.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/projects" className="btn-primary">See the Impact of Donations</Link>
          <Link href="/" className="btn-secondary">Back to Home</Link>
        </div>
      </div>
    </PublicShell>
  );
}
