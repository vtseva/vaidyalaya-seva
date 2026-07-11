import Link from "next/link";
import Image from "next/image";

export default function SiteFooter({ links, contact }: {
  links?: { vtsbharath?: string; vtseva?: string; chinnajeeyar?: string };
  contact?: { email?: string; phone?: string; address?: string };
}) {
  return (
    <footer className="bg-primary-900 text-primary-100 mt-16">
      <div className="mx-auto max-w-6xl px-4 py-12 grid gap-10 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Image src="/images/logo-vikasa-tarangini.png" alt="Vikasa Tarangini logo" width={48} height={48} />
            <Image src="/images/logo-vt-seva.png" alt="VT Seva logo" width={58} height={45} />
          </div>
          <p className="font-serif text-white text-lg mb-2">Vaidyalaya Seva</p>
          <p className="text-sm leading-relaxed">
            Service with Compassion, Dignity and Care. A joint initiative of Vikasa Tarangini (India)
            and VT Seva (USA) to create cleaner, safer and more dignified public healthcare facilities.
          </p>
        </div>
        <div>
          <p className="font-semibold text-white mb-3">Explore</p>
          <ul className="space-y-2 text-sm">
            <li><Link href="/about" className="hover:text-white">About the Initiative</Link></li>
            <li><Link href="/projects" className="hover:text-white">Project Library</Link></li>
            <li><Link href="/impact" className="hover:text-white">Impact Dashboard</Link></li>
            <li><Link href="/request-support" className="hover:text-white">Request Hospital Support</Link></li>
            <li><Link href="/get-involved" className="hover:text-white">Donate, Volunteer & Partner</Link></li>
            <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-white">Terms of Use</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-white mb-3">Our Organizations</p>
          <ul className="space-y-2 text-sm">
            <li><a href={links?.vtsbharath || "https://www.vtsbharath.org"} className="hover:text-white" rel="noopener">Vikasa Tarangini – vtsbharath.org</a></li>
            <li><a href={links?.vtseva || "https://www.vtsworld.org"} className="hover:text-white" rel="noopener">VT Seva – vtsworld.org</a></li>
            <li><a href={links?.chinnajeeyar || "https://www.chinnajeeyar.org"} className="hover:text-white" rel="noopener">chinnajeeyar.org</a></li>
          </ul>
          {(contact?.email || contact?.phone) && (
            <div className="mt-4 text-sm">
              {contact.email && <p>Email: {contact.email}</p>}
              {contact.phone && <p>Phone: {contact.phone}</p>}
            </div>
          )}
        </div>
      </div>
      <div className="border-t border-primary-800 py-4 text-center text-xs text-primary-200">
        © {new Date().getFullYear()} Vaidyalaya Seva · Vikasa Tarangini & VT Seva. Your support is our strength to serve.
      </div>
    </footer>
  );
}
