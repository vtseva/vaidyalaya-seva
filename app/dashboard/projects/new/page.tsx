import ProjectForm from "@/components/ProjectForm";
import { requireStaff } from "@/lib/auth";

export default async function NewProjectPage() {
  await requireStaff();
  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">New Project</h1>
      <ProjectForm />
    </div>
  );
}
