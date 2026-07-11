import PublicShell from "@/components/PublicShell";
import ProjectCard from "@/components/ProjectCard";
import { createClient } from "@/lib/supabase/server";
import { PROJECT_TYPES } from "@/lib/format";

export const metadata = {
  title: "Project Library",
  description: "Browse all Vaidyalaya Seva hospital infrastructure projects with budgets, photos and impact.",
};
export const revalidate = 120;

export default async function ProjectsPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const q = (sp.q || "").trim();
  const type = sp.type || "";
  const state = sp.state || "";
  const status = sp.status || "";
  const sort = sp.sort || "newest";

  const supabase = await createClient();
  let query = supabase
    .from("projects")
    .select("slug,project_code,name,hospital_name,city,state,project_type,status,short_summary,cover_image,approved_budget,actual_completion_date")
    .eq("publication", "published");

  if (q) query = query.or(`name.ilike.%${q}%,hospital_name.ilike.%${q}%,project_code.ilike.%${q}%,city.ilike.%${q}%`);
  if (type) query = query.eq("project_type", type);
  if (state) query = query.eq("state", state);
  if (status) query = query.eq("status", status);
  if (sort === "oldest") query = query.order("created_at", { ascending: true });
  else if (sort === "budget") query = query.order("approved_budget", { ascending: false, nullsFirst: false });
  else query = query.order("created_at", { ascending: false });

  const { data: projects, error } = await query.limit(60);
  const { data: states } = await supabase.from("projects").select("state").eq("publication", "published").not("state", "is", null);
  const stateOptions = [...new Set((states || []).map((s) => s.state as string))].sort();

  return (
    <PublicShell>
      <div className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Project Library</h1>
        <p className="text-gray-700 mb-8 max-w-3xl">
          Every Vaidyalaya Seva project is documented with the same standardized template — need, scope,
          itemized budget, execution and before/after evidence.
        </p>

        <form className="card p-4 mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5" method="get">
          <div className="lg:col-span-2">
            <label htmlFor="q" className="label">Search</label>
            <input id="q" name="q" defaultValue={q} className="input" placeholder="Project, hospital, city, ID…" />
          </div>
          <div>
            <label htmlFor="type" className="label">Type</label>
            <select id="type" name="type" defaultValue={type} className="input">
              <option value="">All types</option>
              {PROJECT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="state" className="label">State</label>
            <select id="state" name="state" defaultValue={state} className="input">
              <option value="">All states</option>
              {stateOptions.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <label htmlFor="sort" className="label">Sort</label>
              <select id="sort" name="sort" defaultValue={sort} className="input">
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="budget">Budget</option>
              </select>
            </div>
            <button type="submit" className="btn-primary !px-4">Apply</button>
          </div>
        </form>

        {error && <p className="text-red-700 bg-red-50 rounded-lg p-4">Could not load projects. Please try again shortly.</p>}
        {!error && (!projects || projects.length === 0) && (
          <div className="card p-10 text-center text-gray-600">
            <p className="font-semibold text-lg mb-1">No projects match your filters</p>
            <p className="text-sm">Try clearing the search or choosing a different type.</p>
          </div>
        )}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {(projects || []).map((p) => <ProjectCard key={p.slug} p={p} />)}
        </div>
      </div>
    </PublicShell>
  );
}
