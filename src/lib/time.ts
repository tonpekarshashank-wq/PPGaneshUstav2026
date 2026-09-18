import type { FestivalEvent } from "@/lib/types";

export const FESTIVAL_TIMEZONE = "Asia/Kolkata";
export const FESTIVAL_START_DATE = "2026-09-14";
export const FESTIVAL_END_DATE = "2026-09-25";

export const festivalDates = Array.from({ length: 12 }, (_, index) => {
  const day = 14 + index;
  return `2026-09-${String(day).padStart(2, "0")}`;
});

export function istDateFromISO(iso: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: FESTIVAL_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date(iso));
}

export function nowInISTDate(now = new Date()): string {
  return istDateFromISO(now.toISOString());
}

export function festivalDatesFrom(today: string): string[] {
  return festivalDates.filter((date) => date >= today);
}

export function isTodayOrFutureIST(iso: string, today = nowInISTDate()): boolean {
  return istDateFromISO(iso) >= today;
}

export function festivalState(now = new Date()): "upcoming" | "in_progress" | "completed" {
  const today = nowInISTDate(now);
  if (today < FESTIVAL_START_DATE) return "upcoming";
  if (today > FESTIVAL_END_DATE) return "completed";
  return "in_progress";
}

export function formatTimeIST(iso: string, locale = "en-IN"): string {
  return new Intl.DateTimeFormat(locale, {
    timeZone: FESTIVAL_TIMEZONE,
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(iso));
}

export function formatDateIST(isoOrDate: string, locale = "en-IN"): string {
  const date = isoOrDate.length === 10 ? `${isoOrDate}T00:00:00+05:30` : isoOrDate;
  return new Intl.DateTimeFormat(locale, {
    timeZone: FESTIVAL_TIMEZONE,
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric"
  }).format(new Date(date));
}

export function eventsForTodayOrNext(events: FestivalEvent[], now = new Date()): {
  date: string;
  events: FestivalEvent[];
  isFallback: boolean;
} {
  const today = nowInISTDate(now);
  const published = events
    .filter((event) => event.status === "published")
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt) || a.displayOrder - b.displayOrder);
  const todayEvents = published.filter((event) => istDateFromISO(event.startsAt) === today);
  if (todayEvents.length > 0) return { date: today, events: todayEvents, isFallback: false };

  const nextEvent = published.find((event) => istDateFromISO(event.startsAt) >= today);
  if (!nextEvent) return { date: today, events: [], isFallback: false };
  const nextDate = istDateFromISO(nextEvent.startsAt);
  return {
    date: nextDate,
    events: published.filter((event) => istDateFromISO(event.startsAt) === nextDate),
    isFallback: true
  };
}

export function isBeforeCutoff(cutoffISO: string, now = new Date()): boolean {
  return now.getTime() < new Date(cutoffISO).getTime();
}
