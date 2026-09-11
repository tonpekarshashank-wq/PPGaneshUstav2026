"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, CalendarDays, Home, MoreHorizontal, Trophy } from "lucide-react";

const mobileTabs = [
  { href: "/", label: "Home", icon: Home },
  { href: "/schedule", label: "Schedule", icon: CalendarDays },
  { href: "/aarti", label: "Aarti", icon: Bell },
  { href: "/winners", label: "Winners", icon: Trophy },
  { href: "/more", label: "More", icon: MoreHorizontal }
];

const desktopLinks = [
  { href: "/", label: "Home" },
  { href: "/schedule", label: "Schedule" },
  { href: "/winners", label: "Winners" },
  { href: "/more", label: "More" }
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const headerClass = isHome
    ? "border-accent-100/10 bg-accent-700 text-bg"
    : "border-accent-700/10 bg-bg text-ink";

  return (
    <>
      <header className={`sticky top-0 z-30 border-b ${headerClass}`}>
        <div className="mx-auto flex max-w-[1120px] items-center justify-between gap-4 px-4 py-3">
          <Link href="/" className="flex min-h-11 items-center gap-3" aria-label="Palladium Plus Ganeshotsav home">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-base font-bold text-white shadow-sm" lang="mr">
              श्री
            </span>
            <span className="leading-tight">
              <span className="block font-latinDisplay text-[15px] text-current">Palladium Plus</span>
              <span className={isHome ? "block text-[11px] font-bold text-bg/75" : "block text-[11px] font-bold text-ink-soft"}>Ganeshotsav 2026</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary">
            {desktopLinks.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative min-h-11 px-1 py-3 text-sm font-bold ${
                    isHome ? "text-bg/80 hover:text-white" : "text-ink-muted hover:text-ink"
                  }`}
                >
                  {item.label}
                  {active ? <span className="absolute inset-x-1 bottom-1 h-0.5 rounded-pill bg-accent" aria-hidden="true" /> : null}
                </Link>
              );
            })}
            <Link href="/aarti" className="inline-flex min-h-11 items-center rounded-pill bg-accent px-5 text-sm font-extrabold text-white shadow-sm hover:bg-accent-700">
              Book aarti
            </Link>
          </nav>

          <span className="rounded-pill bg-accent-100 px-3 py-1 text-xs font-bold text-accent-700 lg:hidden">Day 1</span>
        </div>
      </header>

      <main className="mx-auto min-h-screen max-w-[1120px] px-4 pb-28 pt-5 lg:pb-12 lg:pt-8">{children}</main>

      <footer className="border-t border-accent-700/10 bg-bg">
        <div className="mx-auto grid max-w-[1120px] gap-7 px-4 py-8 text-sm text-ink-muted lg:grid-cols-[1.2fr_.8fr] lg:items-start lg:py-10">
          <div>
            <p className="font-latinDisplay text-[17px] leading-tight text-ink">Palladium Plus Society Ganeshotsav 2026</p>
            <p className="mt-1 text-[13px] leading-6 text-ink-muted">Festival Committee - Palladium Plus</p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <nav aria-label="Footer pages">
              <p className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-ink-soft">Pages</p>
              <div className="mt-3 grid gap-1 font-semibold leading-7 text-ink-muted">
                <Link href="/" className="hover:text-accent-700">Home</Link>
                <Link href="/schedule" className="hover:text-accent-700">Schedule</Link>
                <Link href="/aarti" className="hover:text-accent-700">Aarti</Link>
                <Link href="/winners" className="hover:text-accent-700">Winners</Link>
              </div>
            </nav>
            <nav aria-label="Footer resources">
              <p className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-ink-soft">Resources</p>
              <div className="mt-3 grid gap-1 font-semibold leading-7 text-ink-muted">
                <Link href="/schedule-pamphlet.jpeg" className="hover:text-accent-700">Pamphlet</Link>
                <Link href="/admin/login" className="hover:text-accent-700">Admin sign-in</Link>
              </div>
            </nav>
          </div>
        </div>
      </footer>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-accent-700/10 bg-card/95 shadow-md backdrop-blur lg:hidden" aria-label="Mobile primary">
        <div className="safe-bottom grid grid-cols-5 px-2 pt-2">
          {mobileTabs.map((item) => {
            const Icon = item.icon;
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className="flex min-h-14 flex-col items-center justify-center gap-1 rounded-md text-[11px] font-bold text-ink-muted"
              >
                <span className={`flex h-9 w-9 items-center justify-center rounded-full ${active ? "bg-accent text-white" : "text-ink-soft"}`}>
                  <Icon aria-hidden="true" size={26} strokeWidth={2.75} />
                </span>
                <span className={active ? "text-accent-700" : undefined}>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
