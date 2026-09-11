import type { Metadata, Viewport } from "next";
import { Baloo_2, Caprasimo, Figtree, Mukta } from "next/font/google";
import "./globals.css";
import { SiteShell } from "@/components/site-shell";
import { copy } from "@/lib/i18n";

const caprasimo = Caprasimo({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-latin-display"
});

const baloo2 = Baloo_2({
  subsets: ["devanagari", "latin"],
  weight: ["600", "700"],
  display: "swap",
  variable: "--font-devanagari-display"
});

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
  variable: "--font-latin-body"
});

const mukta = Mukta({
  subsets: ["devanagari", "latin"],
  weight: ["400", "600"],
  display: "swap",
  variable: "--font-devanagari-body"
});

export const metadata: Metadata = {
  title: `${copy.appName} | ${copy.appNameMr}`,
  description: "Mobile-first bilingual PWA for Palladium Plus Society Ganeshotsav 2026.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "PP Ganeshotsav"
  }
};

export const viewport: Viewport = {
  themeColor: "#7c3f1d",
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${caprasimo.variable} ${baloo2.variable} ${figtree.variable} ${mukta.variable}`}>
      <body className="font-sans antialiased">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
