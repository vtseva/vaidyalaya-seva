import Link from "next/link";
import Image from "next/image";
import { fmtDate, inr } from "@/lib/format";

export default function ProjectCard({ p }: { p: {
  slug: string; project_code: string; name: string; hospital_name: string;
  city?: string | null; state?: string | null; project_type: string; status: string;
  short_summary: string; cover_image?: string | null; approved_budget?: number | null;
  actual_completion_date?: string | null;
} }) {
  return (
    <Link href={`/projects/${p.slug}`} className="card overflow-hidden hover:shadow-md transition-shadow flex flex-col">
      {p.cover_image && (
        <Image src={p.cover_image} alt={`${p.name} cover photo`} width={600} height={400} className="h-48 w-full object-cover" />
      )}
      <div className="p-5 flex flex-col gap-2 flex-1">
        <div className="flex items-center gap-2 text-xs">
          <span className="rounded bg-primary-50 text-primary-800 font-semibold px-2 py-1">{p.project_code}</span>
          <span className={`rounded px-2 py-1 font-semibold ${p.status === "completed" ? "bg-green-100 text-green-800" : "bg-saffron-100 text-saffron-600"}`}>
            {p.status === "in_progress" ? "In Progress" : p.status.charAt(0).toUpperCase() + p.status.slice(1)}
          </span>
        </div>
        <h3 className="font-serif font-bold text-lg leading-snug">{p.name}</h3>
        <p className="text-sm text-gray-600">{p.hospital_name}{p.city ? ` · ${p.city}` : ""}{p.state ? `, ${p.state}` : ""}</p>
        <p className="text-sm text-gray-600 line-clamp-2">{p.short_summary}</p>
        <div className="mt-auto pt-2 text-sm text-gray-500 flex justify-between">
          <span>{p.project_type}</span>
          {p.approved_budget ? <span>{inr(p.approved_budget)}</span> : null}
        </div>
      </div>
    </Link>
  );
}
