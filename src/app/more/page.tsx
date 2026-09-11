import Link from "next/link";
import { Download, Eye, LockKeyhole, MessageCircle } from "lucide-react";

const items = [
  {
    href: "/schedule-pamphlet.jpeg",
    label: "View pamphlet",
    helper: "Open the official schedule poster.",
    icon: Eye,
    external: true
  },
  {
    href: "/schedule-pamphlet.jpeg",
    label: "Download pamphlet",
    helper: "Save the schedule image to your device.",
    icon: Download,
    download: true
  },
  {
    href: "#committee-contact",
    label: "Committee contacts",
    helper: "Contact details will be shared by the committee.",
    icon: MessageCircle
  },
  {
    href: "/admin/login",
    label: "Admin sign in",
    helper: "Committee-only access.",
    icon: LockKeyhole
  }
];

export default function MorePage() {
  return (
    <div className="space-y-5">
      <section className="rounded-lg bg-accent-700 p-5 text-white shadow-md">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent-100">More</p>
        <h1 className="mt-3 font-latinDisplay text-4xl leading-none">Resident links</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80">Quick access to festival resources, committee updates, and admin sign-in.</p>
      </section>

      <section className="grid gap-3 md:grid-cols-2">
        {items.map((item) => {
          const Icon = item.icon;
          const content = (
            <>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent-100 text-accent-700">
                <Icon size={22} aria-hidden="true" />
              </span>
              <span>
                <span className="block font-bold text-ink">{item.label}</span>
                <span className="mt-1 block text-sm leading-6 text-ink-muted">{item.helper}</span>
              </span>
            </>
          );

          if (item.external || item.download) {
            return (
              <a
                key={item.label}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noreferrer" : undefined}
                download={item.download ? true : undefined}
                className="flex min-h-20 items-center gap-3 rounded-md bg-card p-4 shadow-sm"
              >
                {content}
              </a>
            );
          }

          return (
            <Link key={item.label} href={item.href} className="flex min-h-20 items-center gap-3 rounded-md bg-card p-4 shadow-sm">
              {content}
            </Link>
          );
        })}
      </section>

      <section id="committee-contact" className="rounded-md bg-surface p-4 text-sm leading-6 text-ink-muted">
        <p className="font-bold text-ink">Committee contacts</p>
        <p className="mt-1">Contact details are intentionally not hard-coded here. The committee can publish the official number or WhatsApp link when ready.</p>
      </section>
    </div>
  );
}
