import Image from "next/image";
import Link from "next/link";
import { Download, Eye, Share2 } from "lucide-react";
import { EventCard } from "@/components/event-card";
import { ParticipationCard } from "@/components/participation-card";
import { StatusBadge } from "@/components/status-badge";
import { getPublicHomeData } from "@/data/repository";
import { copy } from "@/lib/i18n";
import { eventsForTodayOrNext, festivalState, formatDateIST } from "@/lib/time";

export default async function HomePage() {
  const { announcements, events, opportunities } = await getPublicHomeData();
  const state = festivalState();
  const eventGroup = eventsForTodayOrNext(events);
  const pinned = announcements.filter((announcement) => announcement.isPinned);

  return (
    <div className="space-y-8">
      <section className="rounded-lg bg-maroon-800 px-5 py-7 text-white shadow-soft md:px-8 md:py-10">
        <StatusBadge value={state === "in_progress" ? "open" : state === "completed" ? "completed" : "updated"} label={copy.state[state].en} />
        <h1 className="mt-5 max-w-3xl text-3xl font-black leading-tight md:text-5xl">{copy.appName}</h1>
        <p className="mt-2 max-w-3xl text-xl font-bold text-saffron-100">{copy.appNameMr}</p>
        <p className="mt-5 max-w-2xl text-base leading-7 text-white/90">14 September to 25 September 2026. Today-first schedule, aarti seva nominations, winners, and participation updates for Palladium Plus residents.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/aarti" className="inline-flex min-h-11 items-center rounded-full bg-saffron-50 px-4 text-sm font-extrabold text-maroon-800">
            Book Aarti Seva / आरती सेवेसाठी नाव नोंदवा
          </Link>
          <Link href="/schedule" className="inline-flex min-h-11 items-center rounded-full border border-white/40 px-4 text-sm font-bold text-white">
            View Full Schedule / संपूर्ण वेळापत्रक पहा
          </Link>
        </div>
      </section>

      {pinned.length > 0 ? (
        <section aria-labelledby="announcements-heading" className="space-y-3">
          <h2 id="announcements-heading" className="text-xl font-black text-maroon-950">Pinned announcements / महत्त्वाच्या सूचना</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {pinned.map((announcement) => (
              <article key={announcement.id} className="rounded-lg border border-maroon-800/10 bg-white p-4 shadow-soft">
                <StatusBadge value={announcement.severity} />
                <h3 className="mt-3 text-lg font-extrabold text-maroon-950">{announcement.titleEn}</h3>
                <p className="font-semibold text-maroon-800">{announcement.titleMr}</p>
                <p className="mt-3 text-sm leading-6 text-zinc-700">{announcement.bodyEn}</p>
              </article>
            ))}
            {opportunities.map((opportunity) => (
              <ParticipationCard key={opportunity.id} opportunity={opportunity} />
            ))}
          </div>
        </section>
      ) : null}

      <section aria-labelledby="pamphlet-heading" className="rounded-lg border border-maroon-800/10 bg-white p-4 shadow-soft md:p-5">
        <div className="grid gap-5 md:grid-cols-[0.8fr_1.2fr] md:items-start">
          <div>
            <h2 id="pamphlet-heading" className="text-xl font-black text-maroon-950">Schedule pamphlet / कार्यक्रम पत्रिका</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-700">
              View or download the official Ganeshotsav schedule pamphlet shared by the committee.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href="/schedule-pamphlet.jpeg"
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-maroon-600 px-4 text-sm font-bold text-white hover:bg-maroon-800"
              >
                <Eye size={18} aria-hidden="true" />
                View pamphlet
              </a>
              <a
                href="/schedule-pamphlet.jpeg"
                download="palladium-plus-ganeshotsav-2026-schedule.jpeg"
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-maroon-800/20 bg-white px-4 text-sm font-bold text-maroon-800"
              >
                <Download size={18} aria-hidden="true" />
                Download
              </a>
            </div>
          </div>
          <a href="/schedule-pamphlet.jpeg" target="_blank" rel="noreferrer" className="block overflow-hidden rounded-lg border border-maroon-800/10 bg-saffron-50">
            <Image
              src="/schedule-pamphlet.jpeg"
              alt="Palladium Plus Society Ganeshotsav 2026 schedule pamphlet"
              width={2560}
              height={2560}
              className="h-auto w-full"
              priority
            />
          </a>
        </div>
      </section>

      <section aria-labelledby="today-heading" className="space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="today-heading" className="text-xl font-black text-maroon-950">
              {eventGroup.isFallback ? "Next events / पुढील कार्यक्रम" : "Today / आजचे कार्यक्रम"}
            </h2>
            <p className="text-sm font-semibold text-maroon-800">{formatDateIST(eventGroup.date)}</p>
          </div>
          <button type="button" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-maroon-800/20 bg-white px-4 text-sm font-bold text-maroon-800">
            <Share2 size={16} aria-hidden="true" />
            Share
          </button>
        </div>
        {eventGroup.events.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {eventGroup.events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-maroon-800/10 bg-white p-5 text-zinc-700">No upcoming published events are available yet.</div>
        )}
      </section>

    </div>
  );
}
