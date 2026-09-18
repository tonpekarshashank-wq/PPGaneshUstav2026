"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MapPin, Search, X } from "lucide-react";
import { BiTitle } from "@/components/BiTitle";
import type { FestivalEvent } from "@/lib/types";
import { festivalDatesFrom, formatTimeIST, isTodayOrFutureIST, istDateFromISO } from "@/lib/time";

const categoryGroups = ["All", "Puja", "Kids", "Cultural", "Games", "Community"] as const;
type DateFilter = "All" | string;

function dayParts(date: string) {
  const value = new Date(`${date}T00:00:00+05:30`);
  return {
    day: new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", day: "2-digit" }).format(value),
    weekdayShort: new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", weekday: "short" }).format(value),
    heading: new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", weekday: "long", day: "numeric", month: "short" }).format(value)
  };
}

function timeParts(iso: string) {
  const formatted = formatTimeIST(iso).toLowerCase();
  const [time, period = ""] = formatted.split(" ");
  return { time, period };
}

function groupForCategory(category: string): (typeof categoryGroups)[number] {
  const value = category.toLowerCase();
  if (value.includes("puja") || value.includes("aarti") || value.includes("visarjan")) return "Puja";
  if (value.includes("kids") || value.includes("children")) return "Kids";
  if (value.includes("cultural") || value.includes("devotional") || value.includes("entertainment")) return "Cultural";
  if (value.includes("games") || value.includes("competition")) return "Games";
  return "Community";
}

function isTintedEvent(event: FestivalEvent) {
  const category = event.category.toLowerCase();
  return category.includes("aarti") || category.includes("visarjan");
}

function groupEventsByDate(events: FestivalEvent[]) {
  return events.reduce<Array<{ date: string; events: FestivalEvent[] }>>((groups, event) => {
    const eventDate = istDateFromISO(event.startsAt);
    const existing = groups.find((group) => group.date === eventDate);
    if (existing) {
      existing.events.push(event);
      return groups;
    }
    groups.push({ date: eventDate, events: [event] });
    return groups;
  }, []);
}

function TimelineEvent({ event, selected = false }: { event: FestivalEvent; selected?: boolean }) {
  const parts = timeParts(event.startsAt);
  const tinted = isTintedEvent(event);
  return (
    <article id={`event-${event.id}`} className="scroll-mt-44 grid grid-cols-[60px_18px_1fr] gap-3">
      <time className="pt-4 text-right">
        <span className="block text-sm font-bold leading-none text-ink">{parts.time}</span>
        <span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.1em] text-ink-soft">{parts.period}</span>
      </time>
      <div className="relative flex justify-center">
        <span className="absolute inset-y-0 w-px bg-ink/15" aria-hidden="true" />
        <span className={`relative mt-5 h-2.5 w-2.5 rounded-full ring-4 ring-bg ${tinted ? "bg-accent2" : "bg-accent"}`} aria-hidden="true" />
      </div>
      <div className={`mb-4 rounded-md p-4 shadow-sm ${selected ? "ring-2 ring-accent" : ""} ${tinted ? "bg-surface" : "bg-card"}`}>
        <div className="flex flex-wrap items-center gap-2">
          <span className={`${groupForCategory(event.category) === "Puja" ? "bg-accent2-100 text-ink" : "bg-accent-100 text-accent-700"} rounded-pill px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em]`}>{groupForCategory(event.category)}</span>
          <span className="rounded-pill border border-ink/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-ink-soft">{event.state}</span>
          {event.sampleContent ? <span className="rounded-pill bg-surface px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-ink-muted">Review</span> : null}
        </div>
        <div className="mt-3">
          <BiTitle en={event.nameEn} mr={event.nameMr} />
        </div>
        <p className="mt-3 text-[15px] leading-6 text-ink-muted">{event.descriptionEn}</p>
        <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-ink/10 pt-3 text-sm font-semibold text-accent-700">
          <span className="inline-flex items-center gap-1">
            <MapPin size={16} aria-hidden="true" />
            <span lang="mr">{event.venueMr}</span>
            <span aria-hidden="true">·</span>
            <span lang="en">{event.venueEn}</span>
          </span>
          {event.registrationUrl ? (
            <Link href={event.registrationUrl} className="inline-flex min-h-10 items-center rounded-pill bg-accent px-5 text-sm font-extrabold text-white shadow-sm hover:bg-accent-700">
              Register
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export function ScheduleBrowser({ events, selectedEventId, todayDate }: { events: FestivalEvent[]; selectedEventId?: string; todayDate: string }) {
  const currentEvents = useMemo(() => events.filter((event) => isTodayOrFutureIST(event.startsAt, todayDate)), [events, todayDate]);
  const currentFestivalDates = useMemo(() => festivalDatesFrom(todayDate), [todayDate]);
  const selectedEvent = currentEvents.find((event) => event.id === selectedEventId || event.slug === selectedEventId);
  const [date, setDate] = useState<DateFilter>(selectedEvent ? istDateFromISO(selectedEvent.startsAt) : "All");
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const eventCounts = useMemo(
    () =>
      currentFestivalDates.reduce<Record<string, number>>((counts, festivalDate) => {
        counts[festivalDate] = currentEvents.filter((event) => istDateFromISO(event.startsAt) === festivalDate).length;
        return counts;
      }, {}),
    [currentEvents, currentFestivalDates]
  );
  const filtered = currentEvents
    .filter((event) => {
      const text = `${event.nameEn} ${event.nameMr} ${event.category} ${event.venueEn} ${event.venueMr}`.toLowerCase();
      return (
        (date === "All" || istDateFromISO(event.startsAt) === date) &&
        (category === "All" || groupForCategory(event.category) === category) &&
        text.includes(query.toLowerCase())
      );
    })
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt) || a.displayOrder - b.displayOrder);
  const grouped = groupEventsByDate(filtered);

  return (
    <div className="space-y-5">
      <section className="sticky top-[69px] z-20 -mx-4 border-b border-ink/10 bg-bg/95 px-4 py-3 backdrop-blur lg:top-[69px]" aria-label="Schedule filters">
        <div className="flex gap-2 overflow-x-auto pb-2" role="list" aria-label="Festival dates">
          <button
            type="button"
            onClick={() => setDate("All")}
            className={`relative flex h-[72px] w-[64px] shrink-0 flex-col items-center justify-center rounded-md text-center ${
              date === "All" ? "bg-accent text-white shadow-sm" : "bg-surface text-ink"
            }`}
            aria-pressed={date === "All"}
          >
            <span className={`font-latinDisplay text-[20px] uppercase leading-none ${date === "All" ? "text-white" : "text-ink"}`}>All</span>
          </button>
          {currentFestivalDates.map((festivalDate) => {
            const parts = dayParts(festivalDate);
            const active = festivalDate === date;
            return (
              <button
                key={festivalDate}
                type="button"
                onClick={() => setDate(festivalDate)}
                className={`relative flex h-[72px] w-[52px] shrink-0 flex-col items-center justify-center rounded-md text-center ${
                  active ? "bg-accent text-white shadow-sm" : "bg-surface text-ink"
                }`}
                aria-pressed={active}
                aria-label={parts.heading}
              >
                <span className={`text-[10px] font-bold uppercase ${active ? "text-white/85" : "text-ink-soft"}`}>{parts.weekdayShort}</span>
                <span className="font-latinDisplay text-[22px] leading-none">{parts.day}</span>
                {eventCounts[festivalDate] > 0 ? <span className={`mt-1 h-1.5 w-1.5 rounded-full ${active ? "bg-white" : "bg-accent"}`} aria-hidden="true" /> : null}
              </button>
            );
          })}
        </div>

        <div className="mt-2 flex items-center gap-2">
          <div className="flex flex-1 gap-2 overflow-x-auto pb-1" aria-label="Category filters">
            {categoryGroups.map((item) => {
              const active = item === category;
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  className={`min-h-10 shrink-0 rounded-pill px-4 text-sm font-bold ${
                    active ? "bg-ink text-white" : "border border-ink/15 bg-bg text-ink"
                  }`}
                  aria-pressed={active}
                >
                  {item}
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={() => {
              setSearchOpen((open) => !open);
              if (searchOpen) setQuery("");
            }}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-card text-accent-700 shadow-sm"
            aria-label={searchOpen ? "Close search" : "Search schedule"}
            aria-pressed={searchOpen}
          >
            {searchOpen ? <X size={18} aria-hidden="true" /> : <Search size={18} aria-hidden="true" />}
          </button>
        </div>

        {searchOpen ? (
          <label className="mt-3 block">
            <span className="sr-only">Search events</span>
            <span className="relative block">
              <Search className="absolute left-3 top-3 text-ink-soft" size={18} aria-hidden="true" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="min-h-11 w-full rounded-pill border border-ink/15 bg-card px-10 text-base text-ink shadow-sm"
                placeholder="Search events..."
              />
            </span>
          </label>
        ) : null}
      </section>

      <header className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[11.5px] font-bold uppercase tracking-[0.14em] text-accent-700">{date === "All" ? "Current programme" : "Selected day"}</p>
          <h2 className="mt-1 font-latinDisplay text-3xl text-ink">{date === "All" ? "Today onwards" : dayParts(date).heading}</h2>
          <p className="mt-1 text-sm font-bold text-ink-muted">{filtered.length} event{filtered.length === 1 ? "" : "s"}</p>
        </div>
        {date !== "All" || category !== "All" || query ? (
          <button type="button" onClick={() => { setDate("All"); setCategory("All"); setQuery(""); }} className="rounded-pill bg-accent-100 px-3 py-2 text-xs font-bold text-accent-700">
            Clear
          </button>
        ) : null}
      </header>

      {filtered.length > 0 ? (
        <div className="space-y-8">
          {grouped.map((group) => {
            const parts = dayParts(group.date);
            return (
              <section key={group.date} aria-labelledby={`schedule-${group.date}`} className="space-y-2">
                <div className="flex items-center gap-3">
                  <h3 id={`schedule-${group.date}`} className="shrink-0 text-[13px] font-bold uppercase tracking-[0.06em] text-accent-700">{parts.heading}</h3>
                  <span className="h-px flex-1 bg-ink/15" aria-hidden="true" />
                  <span className="text-[11.5px] font-bold text-ink-soft">{group.events.length} event{group.events.length === 1 ? "" : "s"}</span>
                </div>
                <div className="space-y-0">
                  {group.events.map((event) => (
                    <TimelineEvent key={event.id} event={event} selected={event.id === selectedEvent?.id} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        <div className="rounded-md bg-card p-5 text-ink-muted shadow-sm">No events match these filters. Try another date or category.</div>
      )}
    </div>
  );
}
