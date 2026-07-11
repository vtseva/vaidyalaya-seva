import Link from "next/link";
import Image from "next/image";
import { requireStaff } from "@/lib/auth";
import { signOut } from "@/app/actions/admin";

export const metadata = { title: "Dashboard", robots: { index: false } };

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireStaff();
  const isAdmin = profile.role === "super_admin" || profile.role === "admin";

  const nav = [
    ["/dashboard", "Overview"],
    ["/dashboard/projects", "Projects"],
    ["/dashboard/requests", "Hospital Requests"],
    ["/dashboard/impact", "Impact Stats"],
    ["/dashboard/submissions", "Form Inbox"],
    ...(isAdmin ? [["/dashboard/settings", "Site Settings"]] : []),
  ];

  return (
    <div className="min-h-screen bg-warm-50">
      <header className="bg-primary-900 text-white">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between flex-wrap gap-2">
          <Link href="/dashboard" className="flex items-center gap-2 font-serif font-bold">
            <Image src="/images/logo-vt-seva.png" alt="" width={36} height={28} className="bg-white rounded p-0.5" />
            Vaidyalaya Seva · Dashboard
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-primary-100">{profile.full_name} · {profile.role.replace("_", " ")}</span>
            <Link href="/" className="hover:underline">View site</Link>
            <form action={signOut}><button className="rounded bg-primary-700 px-3 py-1.5 hover:bg-primary-600">Sign out</button></form>
          </div>
        </div>
        <nav className="mx-auto max-w-7xl px-4 flex gap-1 overflow-x-auto" aria-label="Dashboard navigation">
          {nav.map(([href, label]) => (
            <Link key={href} href={href} className="whitespace-nowrap px-3 py-2.5 text-sm font-medium text-primary-100 hover:text-white hover:bg-primary-800 rounded-t">
              {label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
    </div>
  );
}
