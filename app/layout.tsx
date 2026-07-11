import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "Vaidyalaya Seva – Service with Compassion, Dignity and Care",
    template: "%s | Vaidyalaya Seva",
  },
  description:
    "Vaidyalaya Seva is a joint initiative of Vikasa Tarangini (India) and VT Seva (USA) improving public healthcare infrastructure through volunteer-driven service.",
  openGraph: {
    siteName: "Vaidyalaya Seva",
    type: "website",
    images: ["/images/hero-mgmh-hospital.jpg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Source+Serif+4:wght@600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
