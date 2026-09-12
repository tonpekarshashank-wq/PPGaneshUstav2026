import Image from "next/image";
import Link from "next/link";
import { Bell, CalendarDays, Download, Eye } from "lucide-react";
import { BiTitle } from "@/components/BiTitle";
import { getPublicHomeData } from "@/data/repository";
import { FESTIVAL_START_DATE, festivalState, formatDateIST, formatTimeIST, istDateFromISO, nowInISTDate } from "@/lib/time";
import type { Announcement, FestivalEvent } from "@/lib/types";

function daysBetween(startDate: string, endDate: string) {
  const start = new Date(`${startDate}T00:00:00+05:30`).getTime();
  const end = new Date(`${endDate}T00:00:00+05:30`).getTime();
  return Math.max(0, Math.ceil((end - start) / 86_400_000));
}

function festivalPill(state: ReturnType<typeof festivalState>) {
  if (state === "upcoming") {
    const days = daysBetween(nowInISTDate(), FESTIVAL_START_DATE);
    return days === 0 ? "Starts today" : `Starts in ${days} day${days === 1 ? "" : "s"}`;
  }
  if (state === "completed") return "Festival completed";
  const dayNumber = daysBetween(FESTIVAL_START_DATE, nowInISTDate()) + 1;
  return `Day ${dayNumber}`;
}

function dateParts(event: FestivalEvent) {
  const date = new Date(event.startsAt);
  const day = new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", day: "2-digit" }).format(date);
  const weekday = new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", weekday: "short" }).format(date);
  return { day, weekday, time: formatTimeIST(event.startsAt) };
}

function addDays(date: string, days: number) {
  const [year, month, day] = date.split("-").map(Number);
  const next = new Date(Date.UTC(year, month - 1, day + days));
  return `${next.getUTCFullYear()}-${String(next.getUTCMonth() + 1).padStart(2, "0")}-${String(next.getUTCDate()).padStart(2, "0")}`;
}

function happeningWindowEvents(events: FestivalEvent[]) {
  const today = nowInISTDate();
  const startDate = today < FESTIVAL_START_DATE ? FESTIVAL_START_DATE : today;
  const endDate = addDays(startDate, 2);
  const windowEvents = events
    .filter((event) => event.status === "published")
    .filter((event) => {
      const eventDate = istDateFromISO(event.startsAt);
      return eventDate >= startDate && eventDate <= endDate;
    })
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt) || a.displayOrder - b.displayOrder);

  return {
    startDate,
    endDate,
    events: windowEvents,
    isFallback: startDate !== today
  };
}

function HappeningCard({ event, featured = false }: { event: FestivalEvent; featured?: boolean }) {
  const parts = dateParts(event);
  return (
    <Link
      href={`/schedule?event=${event.id}`}
      className={`grid min-h-28 grid-cols-[72px_1fr] overflow-hidden rounded-md shadow-sm ${
        featured ? "bg-card" : "bg-surface"
      }`}
    >
      <div className={`flex flex-col items-center justify-center px-2 text-center ${featured ? "bg-accent text-white" : "bg-accent-100 text-accent-700"}`}>
        <span className="font-latinDisplay text-4xl leading-none">{parts.day}</span>
        <span className="mt-1 text-[11px] font-bold uppercase tracking-[0.12em]">{parts.weekday}</span>
        <span className="mt-2 text-[11px] font-bold">{parts.time}</span>
      </div>
      <div className="flex flex-col justify-center p-4">
        <span className="w-fit rounded-pill bg-accent-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-accent-700">{event.category}</span>
        <div className="mt-3">
          <BiTitle en={event.nameEn} mr={event.nameMr} />
        </div>
      </div>
    </Link>
  );
}

function HappeningNextWidget({ events, startDate, endDate, isFallback }: { events: FestivalEvent[]; startDate: string; endDate: string; isFallback: boolean }) {
  return (
    <aside className="rounded-lg bg-card p-4 text-ink shadow-lg ring-1 ring-accent-100/70">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[11.5px] font-bold uppercase tracking-[0.14em] text-ink-soft">{isFallback ? "Happening next" : "Happening today"}</p>
          <p className="mt-1 text-sm font-bold text-ink-muted">{formatDateIST(startDate)} - {formatDateIST(endDate)}</p>
        </div>
        <Link href="/schedule" className="rounded-pill bg-accent-100 px-3 py-2 text-xs font-bold text-accent-700">All 12 days</Link>
      </div>
      <div className="mt-4 grid max-h-[430px] gap-3 overflow-y-auto pr-1">
        {events.length > 0 ? (
          events.map((event, index) => <HappeningCard key={event.id} event={event} featured={index === 0} />)
        ) : (
          <div className="rounded-md bg-surface p-4 text-sm font-semibold text-ink-muted">No upcoming published events are available yet.</div>
        )}
      </div>
    </aside>
  );
}

function announcementTone(severity: Announcement["severity"]) {
  if (severity === "urgent") return "bg-accent text-white";
  if (severity === "important") return "bg-accent-100 text-accent-700";
  return "bg-accent2-100 text-ink";
}

export default async function HomePage() {
  const { announcements, events } = await getPublicHomeData();
  const state = festivalState();
  const eventWindow = happeningWindowEvents(events);

  return (
    <div className="space-y-8 bg-bg text-ink">
      <section className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] -mt-5 w-screen overflow-hidden bg-accent-700 text-bg lg:-mt-8">
        <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[rgba(198,113,57,.45)]" aria-hidden="true" />
        <div className="absolute right-16 top-28 h-36 w-36 rounded-full bg-[rgba(122,138,94,.35)]" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-[1120px] gap-7 px-4 py-9 lg:grid-cols-[1.12fr_.88fr] lg:items-center lg:py-14">
          <div>
            <span className="inline-flex min-h-9 items-center rounded-pill bg-bg/15 px-4 text-xs font-extrabold uppercase tracking-[0.1em] text-bg">
              <span className="mr-2 h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
              {festivalPill(state)}
            </span>
            <h1 className="mt-5 max-w-3xl font-latinDisplay text-[38px] leading-[1.04] text-bg md:text-[62px]">
              Ganeshotsav
              <span className="block">2026</span>
            </h1>
            <p className="mt-3 max-w-3xl font-devDisplay text-[23px] font-semibold leading-tight text-bg/75 md:text-[34px]" lang="mr">पॅलेडियम प्लस सोसायटी</p>
            <div className="mt-7 grid max-w-xl grid-cols-[1fr_auto_1fr] items-end gap-4 border-y border-bg/20 py-4">
              <div>
                <p className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-bg/65">From</p>
                <p className="mt-1 font-latinDisplay text-2xl leading-none text-bg">14 Sept</p>
              </div>
              <span className="mb-3 h-px w-12 bg-bg/30" aria-hidden="true" />
              <div className="text-right">
                <p className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-bg/65">To</p>
                <p className="mt-1 font-latinDisplay text-2xl leading-none text-bg">25 Sept</p>
              </div>
            </div>
            <p className="mt-5 max-w-2xl text-[15.5px] leading-7 text-bg/85">Today-first schedule, aarti seva bookings, results, and committee updates for Palladium Plus residents.</p>
            <div className="mt-7 grid gap-3 sm:flex sm:flex-wrap">
              <Link href="/aarti" className="inline-flex min-h-12 items-center justify-center rounded-pill bg-accent px-5 text-[15.5px] font-extrabold text-white shadow-sm hover:bg-bg hover:text-accent-700">
                Book Aarti Seva
              </Link>
              <Link href="/schedule" className="inline-flex min-h-12 items-center justify-center rounded-pill border border-bg/45 px-5 text-[15.5px] font-bold text-bg hover:bg-white/10">
                View Full Schedule
              </Link>
            </div>
          </div>

          <HappeningNextWidget events={eventWindow.events} startDate={eventWindow.startDate} endDate={eventWindow.endDate} isFallback={eventWindow.isFallback} />
        </div>
      </section>

      {announcements.length > 0 ? (
        <section aria-labelledby="announcements-heading" className="space-y-3">
          <p className="text-[11.5px] font-bold uppercase tracking-[0.14em] text-ink-soft">Committee updates</p>
          <h2 id="announcements-heading" className="font-latinDisplay text-3xl text-ink">Announcements</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {announcements.map((announcement) => (
              <article key={announcement.id} className="rounded-md bg-card p-4 shadow-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`${announcementTone(announcement.severity)} rounded-pill px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em]`}>{announcement.severity}</span>
                  {announcement.isPinned ? <span className="rounded-pill bg-surface px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-ink-soft">Pinned</span> : null}
                </div>
                <div className="mt-4">
                  <BiTitle en={announcement.titleEn} mr={announcement.titleMr} />
                </div>
                <p className="mt-3 text-sm font-semibold leading-6 text-ink" lang="mr">{announcement.bodyMr}</p>
                <p className="mt-2 text-sm leading-6 text-ink-muted">{announcement.bodyEn}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section className="grid gap-4 lg:grid-cols-[1.35fr_.65fr]">
        <section aria-labelledby="pamphlet-heading" className="overflow-hidden rounded-lg bg-card shadow-md">
          <div className="grid h-full gap-0 md:grid-cols-[.95fr_1.05fr]">
            <a href="/schedule-pamphlet.jpeg" target="_blank" rel="noreferrer" className="block bg-accent-700 p-3">
              <Image
                src="/schedule-pamphlet.jpeg"
                alt="Palladium Plus Society Ganeshotsav 2026 schedule pamphlet"
                width={2560}
                height={2560}
                className="h-full max-h-[420px] w-full rounded-md object-cover object-top"
                priority
              />
            </a>
            <div className="p-5 md:p-6">
              <p className="text-[11.5px] font-bold uppercase tracking-[0.14em] text-ink-soft">Committee pamphlet</p>
              <h2 id="pamphlet-heading" className="mt-3 font-latinDisplay text-3xl text-ink">Event Schedule</h2>
              <p className="mt-3 text-[15.5px] leading-7 text-ink-muted">
                The official printed schedule shared by the committee. View it full-size or download for WhatsApp.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href="/schedule-pamphlet.jpeg"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-11 items-center gap-2 rounded-pill bg-accent px-4 text-sm font-bold text-white hover:bg-accent-700"
                >
                  <Eye size={18} aria-hidden="true" />
                  View
                </a>
                <a
                  href="/schedule-pamphlet.jpeg"
                  download="palladium-plus-ganeshotsav-2026-schedule.jpeg"
                  className="inline-flex min-h-11 items-center gap-2 rounded-pill border border-accent-700/20 bg-card px-4 text-sm font-bold text-accent-700"
                >
                  <Download size={18} aria-hidden="true" />
                  Download
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-lg bg-accent2 p-5 text-white shadow-md md:p-6">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15">
              <Bell size={22} aria-hidden="true" />
            </span>
            <div>
              <p className="text-[11.5px] font-bold uppercase tracking-[0.14em] text-white/70">Daily rhythm</p>
              <h2 className="font-devDisplay text-3xl leading-none" lang="mr">आरतीची वेळ</h2>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-1">
            <div className="rounded-md bg-white/15 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-white/70">Morning</p>
              <p className="mt-2 font-latinDisplay text-3xl leading-none">8:00 am</p>
            </div>
            <div className="rounded-md bg-white/15 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-white/70">Evening</p>
              <p className="mt-2 font-latinDisplay text-3xl leading-none">8:00 pm</p>
            </div>
          </div>
          <p className="mt-5 text-sm leading-6 text-white/80">25 September has morning aarti only because Maha Aarti is at 4:30 PM.</p>
          <Link href="/aarti" className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-pill bg-white px-4 text-sm font-extrabold text-accent2">
            <CalendarDays size={18} aria-hidden="true" />
            Book a slot
          </Link>
        </section>
      </section>
    </div>
  );
}
