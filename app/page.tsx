import Link from "next/link";
import Image from "next/image";
import PublicShell from "@/components/PublicShell";
import BeforeAfter from "@/components/BeforeAfter";
import ProjectCard from "@/components/ProjectCard";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 300;

const PROCESS = [
  ["Hospital submits a request", "Hospitals tell us what their patients need most."],
  ["Review & need assessment", "Our team studies the request with hospital authorities."],
  ["Scope & budget approved", "A clear, itemized plan is agreed before work begins."],
  ["Work is executed", "Volunteer-led teams carry out the work with minimal disruption."],
  ["Quality inspection", "Facilities are inspected and prepared to hygienic standards."],
  ["Results published", "Every project is documented with budgets and before/after photos."],
];

const AREAS = [
  "Sanitation & Washrooms", "Patient Wards", "Waiting Areas", "Drinking Water",
  "Ambulance Support", "Nutrition", "Medical Infrastructure", "Other Hospital Needs",
];

export default async function HomePage() {
  const supabase = await createClient();
  const [{ data: stats }, { data: featured }, { data: recent }, { data: testimonials }, { data: mission }, { data: donateSetting }] =
    await Promise.all([
      supabase.from("impact_stats").select("*").eq("public", true).order("sort"),
      supabase.from("projects").select("*").eq("publication", "published").eq("featured", true).limit(1).maybeSingle(),
      supabase.from("projects").select("slug,project_code,name,hospital_name,city,state,project_type,status,short_summary,cover_image,approved_budget,actual_completion_date").eq("publication", "published").order("created_at", { ascending: false }).limit(3),
      supabase.from("testimonials").select("*").eq("approved", true).order("sort").limit(4),
      supabase.from("site_settings").select("value").eq("key", "mission").maybeSingle(),
      supabase.from("site_settings").select("value").eq("key", "donate").maybeSingle(),
    ]);

  let featuredPair = null;
  if (featured) {
    const { data } = await supabase.from("before_after_pairs").select("*").eq("project_id", featured.id).order("sort").limit(1).maybeSingle();
    featuredPair = data;
  }

  const target = Number(mission?.value?.target || 70);
  const completed = Number(stats?.find((s) => s.key === "projects_completed")?.value || 0);
  const inProgress = Number(stats?.find((s) => s.key === "projects_in_progress")?.value || 0);
  const pct = Math.min(100, Math.round((completed / target) * 100));
  const donateUrl = donateSetting?.value?.stripe_url || "/get-involved#donate";

  return (
    <PublicShell>
      {/* Hero */}
      <section className="relative">
        <Image src="/images/hero-mgmh-hospital.jpg" alt="Modern Government Maternity Hospital, Hyderabad" width={2000} height={1125} priority className="h-[420px] sm:h-[520px] w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-900/90 via-primary-900/50 to-primary-900/20" />
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto max-w-6xl px-4 pb-10 sm:pb-14 w-full">
            <h1 className="text-white text-3xl sm:text-5xl font-bold max-w-3xl leading-tight">
              Transforming Public Healthcare with Compassion, Dignity and Care
            </h1>
            <p className="text-primary-100 mt-4 max-w-2xl text-base sm:text-lg">
              Vaidyalaya Seva brings hospitals, volunteers, donors, healthcare professionals and community
              partners together to create cleaner, safer and more dignified public healthcare facilities.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={donateUrl} className="btn-accent" rel="noopener">Donate Now</a>
              <Link href="/request-support" className="btn-primary !bg-white/10 !border !border-white/60 hover:!bg-white/20">Request Hospital Support</Link>
              <Link href="/projects" className="btn-primary !bg-white/10 !border !border-white/60 hover:!bg-white/20">Explore Our Projects</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mission intro */}
      <section className="mx-auto max-w-6xl px-4 py-14 grid gap-10 md:grid-cols-2 items-center">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">A Joint Mission of Service</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            Vaidyalaya Seva is a joint initiative of <strong>Vikasa Tarangini</strong> (India, est. 1992) and{" "}
            <strong>VT Seva</strong> (USA, est. 2008, a registered 501(c)(3) nonprofit), inspired by
            H.H. Sri Chinna Jeeyar Swamiji. Both organizations serve society through practical,
            need-based, volunteer-driven projects.
          </p>
          <p className="text-gray-700 leading-relaxed mb-5">
            Together, they are dedicated to improving public healthcare infrastructure — restoring dignity
            where it matters most, for patients and the healthcare workers who serve them.
          </p>
          <Link href="/about" className="btn-secondary">Learn About the Organizations</Link>
        </div>
        <Image src="/images/swamiji-healthcare.jpg" alt="H.H. Sri Chinna Jeeyar Swamiji with healthcare volunteers" width={800} height={533} className="rounded-xl shadow-md w-full object-cover" />
      </section>

      {/* The need */}
      <section className="bg-white border-y border-warm-100">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Why Public Hospitals Need Support</h2>
          <p className="text-gray-700 max-w-3xl mb-8">
            Across India, busy government hospitals face aging infrastructure: unsafe sanitation, damaged
            fixtures, water leaks, poor flooring and drainage, and inadequate waiting areas. These
            conditions directly affect patient dignity and staff working conditions.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["/images/need-washroom-1.jpg", "/images/need-washroom-2.jpg", "/images/need-washroom-3.jpg", "/images/need-washroom-4.jpg"].map((src, i) => (
              <Image key={src} src={src} alt={`Deteriorated hospital washroom before renovation (${i + 1})`} width={500} height={400} className="rounded-lg h-44 w-full object-cover" />
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-3">Actual conditions documented during hospital assessments.</p>
        </div>
      </section>

      {/* Mission 70 */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="card p-8 md:p-10 bg-gradient-to-br from-primary-800 to-primary-900 !border-0 text-white">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold !text-white">Mission 70</h2>
              <p className="text-primary-100 mt-2 max-w-2xl">
                {mission?.value?.description ||
                  "Complete at least 70 Vaidyalaya Seva projects by November 2026 to commemorate the 70th Tirunakshatram of H.H. Sri Chinna Jeeyar Swamiji."}
              </p>
            </div>
            <Link href="/impact" className="btn-accent shrink-0">View Impact Dashboard</Link>
          </div>
          <div className="w-full bg-primary-700 rounded-full h-4" role="progressbar" aria-valuenow={completed} aria-valuemin={0} aria-valuemax={target} aria-label="Mission 70 progress">
            <div className="bg-saffron-500 h-4 rounded-full" style={{ width: `${pct}%` }} />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 text-center">
            {[
              [String(target), "Target Projects"],
              [String(completed), "Completed"],
              [String(inProgress), "In Progress"],
              [`${pct}%`, "Progress"],
            ].map(([v, l]) => (
              <div key={l}>
                <p className="text-3xl font-bold text-saffron-100">{v}</p>
                <p className="text-sm text-primary-100">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact snapshot */}
      <section className="mx-auto max-w-6xl px-4 pb-14">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6">Impact at a Glance</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(stats || []).map((s) => (
            <div key={s.key} className="card p-5 text-center">
              <p className="text-2xl font-bold text-primary-800">{s.value}</p>
              <p className="text-sm font-medium text-gray-700 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured project */}
      {featured && (
        <section className="bg-white border-y border-warm-100">
          <div className="mx-auto max-w-6xl px-4 py-14">
            <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold">Featured Project · {featured.project_code}</h2>
              <Link href={`/projects/${featured.slug}`} className="btn-secondary">View Full Project</Link>
            </div>
            <div className="grid gap-8 lg:grid-cols-2 items-start">
              <div>
                <h3 className="font-serif text-xl font-bold mb-2">{featured.name}</h3>
                <p className="text-gray-600 mb-1">{featured.hospital_name} · {featured.city}, {featured.state}</p>
                <p className="text-gray-700 leading-relaxed mt-3">{featured.executive_summary}</p>
                <p className="mt-4 text-gray-700"><strong>Expected impact:</strong> {featured.expected_impact}</p>
              </div>
              {featuredPair && <BeforeAfter pair={featuredPair} />}
            </div>
          </div>
        </section>
      )}

      {/* Process */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-2xl sm:text-3xl font-bold mb-8">How a Project Comes to Life</h2>
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PROCESS.map(([title, desc], i) => (
            <li key={title} className="card p-5 flex gap-4">
              <span className="flex-none w-9 h-9 rounded-full bg-saffron-500 text-white font-bold flex items-center justify-center" aria-hidden="true">{i + 1}</span>
              <div>
                <p className="font-semibold text-primary-900">{title}</p>
                <p className="text-sm text-gray-600 mt-1">{desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Areas of support */}
      <section className="bg-white border-y border-warm-100">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Areas of Support</h2>
          <p className="text-gray-700 mb-6 max-w-3xl">Beyond washroom rehabilitation, Vaidyalaya Seva is architected to serve every kind of hospital infrastructure need.</p>
          <ul className="flex flex-wrap gap-3">
            {AREAS.map((a) => (
              <li key={a} className="rounded-full bg-primary-50 text-primary-800 font-medium px-5 py-2.5">{a}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Testimonials */}
      {testimonials && testimonials.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8">Appreciated by Those We Serve</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {testimonials.map((t) => (
              <blockquote key={t.id} className="card p-6">
                <p className="text-gray-800 text-lg leading-relaxed">“{t.quote}”</p>
                <footer className="mt-4 text-sm text-gray-600">
                  <strong className="text-primary-900">{t.person_name}</strong>
                  {t.role_title ? ` · ${t.role_title}` : ""}{t.organization ? `, ${t.organization}` : ""}
                </footer>
              </blockquote>
            ))}
          </div>
        </section>
      )}

      {/* Partnership CTAs */}
      <section className="bg-primary-800">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="text-2xl sm:text-3xl font-bold !text-white mb-8">Join the Mission</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Hospitals", "Request support for your facility", "/request-support", "Request Support"],
              ["Donors", "Fund a documented, transparent project", donateUrl, "Donate"],
              ["Volunteers", "Serve alongside our teams", "/get-involved#volunteer", "Volunteer"],
              ["CSR & Government", "Partner on healthcare infrastructure", "/get-involved#partner", "Partner With Us"],
            ].map(([title, desc, href, cta]) => (
              <div key={title} className="rounded-xl bg-primary-700/60 p-6 flex flex-col">
                <p className="font-serif font-bold text-white text-lg">{title}</p>
                <p className="text-primary-100 text-sm mt-2 mb-5">{desc}</p>
                <Link href={href} className="btn-accent mt-auto !py-2.5 text-sm">{cta}</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest projects */}
      {recent && recent.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-14">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold">Latest Projects</h2>
            <Link href="/projects" className="text-primary-800 font-semibold hover:underline">View all →</Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recent.map((p) => <ProjectCard key={p.slug} p={p} />)}
          </div>
        </section>
      )}
    </PublicShell>
  );
}
