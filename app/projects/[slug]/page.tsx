import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import PublicShell from "@/components/PublicShell";
import BeforeAfter from "@/components/BeforeAfter";
import { createClient } from "@/lib/supabase/server";
import { inr, fmtDate, statusLabel } from "@/lib/format";

export const revalidate = 120;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: p } = await supabase.from("projects").select("name,short_summary,cover_image,project_code").eq("slug", slug).eq("publication", "published").maybeSingle();
  if (!p) return { title: "Project not found" };
  return {
    title: `${p.project_code} · ${p.name}`,
    description: p.short_summary,
    openGraph: { images: p.cover_image ? [p.cover_image] : undefined },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: p } = await supabase.from("projects").select("*").eq("slug", slug).eq("publication", "published").maybeSingle();
  if (!p) notFound();

  const [{ data: budget }, { data: pairs }, { data: metrics }, { data: galleryMedia }, { data: testimonials }, { data: related }] = await Promise.all([
    supabase.from("project_budget_items").select("*").eq("project_id", p.id).order("sort"),
    supabase.from("before_after_pairs").select("*").eq("project_id", p.id).order("sort"),
    supabase.from("project_metrics").select("*").eq("project_id", p.id).eq("public", true).order("sort"),
    supabase.from("project_media").select("*").eq("project_id", p.id).eq("public", true).order("sort"),
    supabase.from("testimonials").select("*").eq("project_id", p.id).eq("approved", true).order("sort"),
    supabase.from("projects").select("slug,project_code,name,hospital_name,city,state").eq("publication", "published").neq("id", p.id).limit(3),
  ]);

  const plannedTotal = (budget || []).reduce((sum, b) => sum + (Number(b.planned_amount) || 0), 0);

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <section className="mb-10">
      <h2 className="text-2xl font-bold mb-3">{title}</h2>
      {children}
    </section>
  );

  return (
    <PublicShell>
      {/* Hero */}
      <div className="relative">
        <Image src={p.hero_image || p.cover_image || "/images/hero-mgmh-hospital.jpg"} alt={`${p.hospital_name} — ${p.name}`} width={2000} height={800} priority className="h-72 sm:h-96 w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-900/90 to-primary-900/10" />
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto max-w-5xl px-4 pb-8 w-full">
            <nav aria-label="Breadcrumb" className="text-primary-100 text-sm mb-2">
              <Link href="/" className="hover:underline">Home</Link> / <Link href="/projects" className="hover:underline">Projects</Link> / {p.project_code}
            </nav>
            <div className="flex items-center gap-3 mb-2">
              <span className="rounded bg-white/20 text-white text-xs font-bold px-2 py-1">{p.project_code}</span>
              <span className={`rounded text-xs font-bold px-2 py-1 ${p.status === "completed" ? "bg-green-500 text-white" : "bg-saffron-500 text-white"}`}>{statusLabel(p.status)}</span>
            </div>
            <h1 className="text-white text-2xl sm:text-4xl font-bold">{p.name}</h1>
            <p className="text-primary-100 mt-1">{p.hospital_name} · {p.city}{p.state ? `, ${p.state}` : ""}</p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-12">
        {/* Summary + quick facts */}
        <div className="grid gap-8 lg:grid-cols-[1fr_300px] mb-12">
          <div>
            <h2 className="text-2xl font-bold mb-3">Executive Summary</h2>
            <p className="text-gray-700 leading-relaxed text-lg">{p.executive_summary || p.short_summary}</p>
          </div>
          <aside className="card p-5 h-fit">
            <h2 className="font-semibold text-primary-900 mb-3 text-base">Project Facts</h2>
            <dl className="space-y-2 text-sm">
              <div><dt className="text-gray-500">Hospital</dt><dd className="font-medium">{p.hospital_name}</dd></div>
              <div><dt className="text-gray-500">Location</dt><dd className="font-medium">{[p.city, p.district, p.state].filter(Boolean).join(", ")}</dd></div>
              <div><dt className="text-gray-500">Type</dt><dd className="font-medium">{p.project_type}</dd></div>
              {p.department && <div><dt className="text-gray-500">Department / Unit</dt><dd className="font-medium">{p.department}</dd></div>}
              {p.approved_budget != null && <div><dt className="text-gray-500">Budget</dt><dd className="font-medium">{inr(Number(p.approved_budget))}</dd></div>}
              {p.actual_completion_date && <div><dt className="text-gray-500">Completed</dt><dd className="font-medium">{fmtDate(p.actual_completion_date)}</dd></div>}
              {p.funding_source && <div><dt className="text-gray-500">Funding</dt><dd className="font-medium">{p.funding_source}</dd></div>}
            </dl>
          </aside>
        </div>

        {metrics && metrics.length > 0 && (
          <Section title="Impact Highlights">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {metrics.map((m) => (
                <div key={m.id} className="card p-5 text-center">
                  <p className="text-2xl font-bold text-primary-800">{m.value}{m.unit ? <span className="text-base font-medium text-gray-500"> {m.unit}</span> : null}</p>
                  <p className="text-sm font-medium text-gray-700 mt-1">{m.label}</p>
                  {m.description && <p className="text-xs text-gray-500 mt-1">{m.description}</p>}
                </div>
              ))}
            </div>
          </Section>
        )}

        {p.background && <Section title="Background"><p className="text-gray-700 leading-relaxed">{p.background}</p></Section>}
        {p.need_assessment && <Section title="The Need"><p className="text-gray-700 leading-relaxed">{p.need_assessment}</p></Section>}
        {p.scope && <Section title="Scope of Work"><p className="text-gray-700 leading-relaxed">{p.scope}</p></Section>}
        {p.major_works && <Section title="Major Works Executed"><p className="text-gray-700 leading-relaxed">{p.major_works}</p></Section>}

        {pairs && pairs.length > 0 && (
          <Section title="Before & After Transformation">
            <div className="grid gap-6 md:grid-cols-2">
              {pairs.map((pair) => <BeforeAfter key={pair.id} pair={pair} />)}
            </div>
          </Section>
        )}

        {budget && budget.length > 0 && (
          <Section title="Project Budget">
            <div className="card overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-warm-100 text-left">
                    <th className="p-4 font-semibold">Component</th>
                    <th className="p-4 font-semibold hidden sm:table-cell">Description</th>
                    <th className="p-4 font-semibold text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {budget.map((b) => (
                    <tr key={b.id} className="border-b border-warm-100">
                      <td className="p-4 font-medium">{b.component}</td>
                      <td className="p-4 text-gray-600 hidden sm:table-cell">{b.description}</td>
                      <td className="p-4 text-right">{inr(Number(b.planned_amount))}</td>
                    </tr>
                  ))}
                  <tr className="bg-primary-50 font-bold">
                    <td className="p-4" colSpan={2}>Total Project Budget</td>
                    <td className="p-4 text-right text-primary-900">{inr(plannedTotal)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            {p.budget_notes && <p className="text-sm text-gray-500 mt-2">{p.budget_notes}</p>}
          </Section>
        )}

        {p.expected_impact && <Section title="Expected Impact"><p className="text-gray-700 leading-relaxed">{p.expected_impact}</p></Section>}

        {galleryMedia && galleryMedia.length > 0 && (
          <Section title="Project Gallery">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {galleryMedia.slice(0, 12).map((m) => (
                <Image key={m.id} src={m.path} alt={m.alt_text || m.caption || "Project photo"} width={400} height={400} className="rounded-lg h-40 w-full object-cover" />
              ))}
            </div>
            {galleryMedia[0]?.caption && <p className="text-sm text-gray-500 mt-2">{galleryMedia[0].caption}</p>}
          </Section>
        )}

        {testimonials && testimonials.length > 0 && (
          <Section title="Testimonials">
            <div className="grid gap-6 md:grid-cols-2">
              {testimonials.map((t) => (
                <blockquote key={t.id} className="card p-6">
                  <p className="text-gray-800 leading-relaxed">“{t.quote}”</p>
                  <footer className="mt-3 text-sm text-gray-600">
                    <strong className="text-primary-900">{t.person_name}</strong>
                    {t.role_title ? ` · ${t.role_title}` : ""}{t.organization ? `, ${t.organization}` : ""}
                  </footer>
                </blockquote>
              ))}
            </div>
          </Section>
        )}

        {p.partners && <Section title="Partners"><p className="text-gray-700">{p.partners}</p></Section>}
        {p.lessons_learned && <Section title="Lessons Learned"><p className="text-gray-700 leading-relaxed">{p.lessons_learned}</p></Section>}
        {p.maintenance_plan && <Section title="Future Maintenance"><p className="text-gray-700 leading-relaxed">{p.maintenance_plan}</p></Section>}

        <section className="card p-8 bg-primary-800 !border-0 text-center">
          <h2 className="text-2xl font-bold !text-white mb-2">Help Us Transform the Next Hospital</h2>
          <p className="text-primary-100 mb-5 max-w-xl mx-auto">Your support funds documented, transparent projects like this one — with every rupee accounted for.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/get-involved#donate" className="btn-accent">Support a Project</Link>
            <Link href="/request-support" className="btn-primary !bg-white/10 !border !border-white/50 hover:!bg-white/20">Request Hospital Support</Link>
          </div>
        </section>

        {related && related.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-bold mb-4">Related Projects</h2>
            <ul className="grid gap-3 sm:grid-cols-3">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link href={`/projects/${r.slug}`} className="card p-4 block hover:shadow-md transition-shadow">
                    <p className="text-xs font-bold text-primary-800">{r.project_code}</p>
                    <p className="font-medium">{r.name}</p>
                    <p className="text-sm text-gray-600">{r.hospital_name}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </PublicShell>
  );
}
