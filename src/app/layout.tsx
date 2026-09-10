import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Bell, CalendarDays, Home, ShieldCheck, Sparkles, Trophy } from "lucide-react";
import "./globals.css";
import { LanguageProvider } from "@/components/language-provider";
import { LanguageToggle } from "@/components/language-toggle";
import { copy } from "@/lib/i18n";

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
  themeColor: "#9f1239",
  width: "device-width",
  initialScale: 1
};

const nav = [
  { href: "/", label: "Home", icon: Home },
  { href: "/schedule", label: "Schedule", icon: CalendarDays },
  { href: "/aarti", label: "Aarti", icon: Bell },
  { href: "/winners", label: "Winners", icon: Trophy }
];

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <LanguageProvider>
          <header className="sticky top-0 z-30 border-b border-maroon-800/10 bg-saffron-50/90 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
              <Link href="/" className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-maroon-600 text-saffron-50">
                  <Sparkles aria-hidden="true" size={20} />
                </span>
                <span className="leading-tight">
                  <span className="block text-sm font-bold text-maroon-950">Palladium Plus</span>
                  <span className="block text-xs text-maroon-800">Ganeshotsav 2026</span>
                </span>
              </Link>
              <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
                {nav.map((item) => (
                  <Link key={item.href} href={item.href} className="rounded-full px-3 py-2 text-sm font-semibold text-maroon-800 hover:bg-white">
                    {item.label}
                  </Link>
                ))}
                <Link href="/admin" className="rounded-full px-3 py-2 text-sm font-semibold text-maroon-800 hover:bg-white">
                  Admin
                </Link>
              </nav>
              <LanguageToggle />
            </div>
          </header>
          <main className="mx-auto min-h-screen max-w-6xl px-4 pb-28 pt-5 md:pb-12">{children}</main>
          <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-maroon-800/10 bg-white/95 shadow-soft backdrop-blur md:hidden" aria-label="Mobile primary">
            <div className="safe-bottom grid grid-cols-4 px-2 pt-2">
              {nav.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href} className="flex min-h-14 flex-col items-center justify-center gap-1 rounded-lg text-xs font-semibold text-maroon-800">
                    <Icon aria-hidden="true" size={20} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </nav>
          <Link href="/admin" className="fixed bottom-24 right-4 z-30 rounded-full bg-maroon-800 p-3 text-white shadow-soft md:hidden" aria-label="Open admin area">
            <ShieldCheck size={20} aria-hidden="true" />
          </Link>
        </LanguageProvider>
      </body>
    </html>
  );
}
