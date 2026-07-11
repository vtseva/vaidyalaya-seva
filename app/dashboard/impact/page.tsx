import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/auth";
import ImpactStatRow from "@/components/ImpactStatRow";

export default async function ImpactAdminPage() {
  await requireStaff();
  const supabase = await createClient();
  const { data: stats } = await supabase.from("impact_stats").select("*").order("sort");

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-2">Impact Statistics</h1>
      <p className="text-gray-600 text-sm mb-6">
        These figures appear on the homepage and impact dashboard. Keep program-level and project-level
        scopes separate — use the note field to state exactly what each figure covers.
      </p>
      <div className="space-y-4">
        {(stats || []).map((s) => <ImpactStatRow key={s.id} stat={s} />)}
      </div>
    </div>
  );
}
