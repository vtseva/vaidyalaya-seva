import { notFound } from "next/navigation";
import Link from "next/link";
import ProjectForm from "@/components/ProjectForm";
import BudgetEditor from "@/components/BudgetEditor";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/auth";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  await requireStaff();
  const { id } = await params;
  const supabase = await createClient();
  const { data: project } = await supabase.from("projects").select("*").eq("id", id).maybeSingle();
  if (!project) notFound();
  const { data: budget } = await supabase.from("project_budget_items").select("*").eq("project_id", id).order("sort");

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <h1 className="text-2xl font-bold">Edit · {project.project_code}</h1>
        {project.publication === "published" && (
          <Link href={`/projects/${project.slug}`} className="btn-secondary !py-2 text-sm">View public page</Link>
        )}
      </div>
      <ProjectForm project={project} />
      <div className="mt-8">
        <BudgetEditor projectId={id} items={budget || []} />
      </div>
    </div>
  );
}
