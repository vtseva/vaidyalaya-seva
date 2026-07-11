import Image from "next/image";
import Link from "next/link";
import PublicShell from "@/components/PublicShell";

export const metadata = {
  title: "About",
  description: "About Vaidyalaya Seva — a joint initiative of Vikasa Tarangini (India) and VT Seva (USA) improving public healthcare infrastructure.",
};

export default function AboutPage() {
  return (
    <PublicShell>
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">About Vaidyalaya Seva</h1>
        <p className="text-saffron-600 font-semibold mb-8">Service with Compassion, Dignity and Care</p>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-3">The Initiative</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            Vaidyalaya Seva is a flagship humanitarian initiative jointly undertaken by Vikasa Tarangini and
            VT Seva to improve public healthcare infrastructure through volunteer-driven service. The
            initiative creates cleaner, safer and more dignified environments for patients and healthcare
            workers in government hospitals — guided by the philosophy of serving all beings as service to God.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Every project is documented with a standardized template: need assessment, scope, itemized
            budget, execution details, before-and-after photographs and measured impact — so donors,
            CSR partners and government bodies can see exactly where support goes.
          </p>
        </section>

        <section className="mb-10 grid gap-6 md:grid-cols-2">
          <div className="card p-6">
            <Image src="/images/logo-vikasa-tarangini.png" alt="Vikasa Tarangini logo" width={64} height={64} className="mb-4" />
            <h2 className="text-xl font-bold mb-2">Vikasa Tarangini (India, 1992)</h2>
            <p className="text-gray-700 text-sm leading-relaxed">
              Established in India in 1992, Vikasa Tarangini has supported free education, healthcare
              services, women’s cancer screening camps, disaster relief, drinking water access, clothing
              and food distribution, and animal welfare camps.
            </p>
            <a href="https://www.vtsbharath.org" className="text-primary-800 font-semibold text-sm mt-3 inline-block hover:underline" rel="noopener">vtsbharath.org →</a>
          </div>
          <div className="card p-6">
            <Image src="/images/logo-vt-seva.png" alt="VT Seva logo" width={78} height={60} className="mb-4" />
            <h2 className="text-xl font-bold mb-2">VT Seva (USA, 2008)</h2>
            <p className="text-gray-700 text-sm leading-relaxed">
              Founded in the USA in 2008 as a registered 501(c)(3) nonprofit, VT Seva serves through
              centers across the country, focuses on youth leadership programs, and extends outreach
              support to initiatives in India.
            </p>
            <a href="https://www.vtsworld.org" className="text-primary-800 font-semibold text-sm mt-3 inline-block hover:underline" rel="noopener">vtsworld.org →</a>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-3">Our Inspiration</h2>
          <div className="grid gap-6 md:grid-cols-[1fr_280px] items-start">
            <p className="text-gray-700 leading-relaxed">
              Both organizations were founded by H.H. Sri Chinna Jeeyar Swamiji and work as
              volunteer-driven nonprofit organizations, united in mission and reach across both countries.
              Continuing this mission of service, the two organizations came together to launch
              Vaidyalaya Seva, dedicated to improving public healthcare infrastructure.
            </p>
            <Image src="/images/swamiji-healthcare.jpg" alt="H.H. Sri Chinna Jeeyar Swamiji with healthcare volunteers" width={560} height={373} className="rounded-xl w-full object-cover" />
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-3">Mission 70</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            To commemorate the 70th Tirunakshatram of H.H. Sri Chinna Jeeyar Swamiji, we have launched an
            ambitious mission to complete at least <strong>70 Vaidyalaya Seva projects by November 2026</strong>.
            The first phase — renovating washroom facilities at the Modern Government Maternity Hospital
            (MGMH) in Petlaburj, Hyderabad — is complete, with 10 projects covering 172 washroom units
            across 4 floors finished in the first half of 2026.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Future initiatives will focus on hospital sanitation, patient ward improvements, drinking water
            facilities, patient waiting areas, healthcare infrastructure upgrades, ambulances, and
            nutritious food for outpatients, patient families and hospital staff.
          </p>
        </section>

        <section className="card p-6 bg-primary-50 !border-primary-100">
          <h2 className="text-xl font-bold mb-2">Be Part of the Journey</h2>
          <p className="text-gray-700 mb-4">Together, we envision government hospitals where every patient is welcomed with cleanliness, dignity, comfort and hope.</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/get-involved" className="btn-primary">Get Involved</Link>
            <Link href="/projects" className="btn-secondary">See Our Work</Link>
          </div>
        </section>
      </div>
    </PublicShell>
  );
}
