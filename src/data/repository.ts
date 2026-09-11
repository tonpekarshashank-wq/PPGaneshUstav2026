import {
  allAartiSlots,
  announcements,
  bookings,
  events,
  activities,
  opportunities,
  settings,
  winners
} from "@/data/seed";
import type { AartiSlot, Announcement, FestivalEvent } from "@/lib/types";
import { istDateFromISO } from "@/lib/time";
import { hasDatabaseUrl } from "@/server/db";
import {
  getNeonAartiBookings,
  getNeonAartiSlots,
  getNeonAnnouncements,
  getNeonEvents,
  getNeonWinners
} from "@/server/neon-repository";

function publicAnnouncements(items: Announcement[]) {
  const now = Date.now();
  return items
    .filter((announcement) => announcement.status === "published")
    .filter((announcement) => new Date(announcement.startsAt).getTime() <= now && new Date(announcement.endsAt).getTime() >= now)
    .sort((a, b) => Number(b.isPinned) - Number(a.isPinned) || new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
}

export async function getPublicHomeData() {
  if (hasDatabaseUrl()) {
    const [dbAnnouncements, dbEvents] = await Promise.all([getNeonAnnouncements(), getNeonEvents()]);
    return {
      announcements: publicAnnouncements(dbAnnouncements),
      events: dbEvents.filter((event) => event.status === "published"),
      opportunities: opportunities.filter((opportunity) => opportunity.status === "published" && opportunity.featured),
      settings
    };
  }
  return {
    announcements: publicAnnouncements(announcements),
    events: events.filter((event) => event.status === "published"),
    opportunities: opportunities.filter((opportunity) => opportunity.status === "published" && opportunity.featured),
    settings
  };
}

export async function getScheduleData() {
  if (hasDatabaseUrl()) {
    return (await getNeonEvents()).filter((event) => event.status === "published");
  }
  return events.filter((event) => event.status === "published");
}

export async function getEventBySlug(slug: string): Promise<FestivalEvent | undefined> {
  if (hasDatabaseUrl()) {
    return (await getNeonEvents()).find((event) => event.slug === slug && event.status === "published");
  }
  return events.find((event) => event.slug === slug && event.status === "published");
}

export async function getAartiData(): Promise<{ slots: AartiSlot[]; settings: typeof settings; bookings: typeof bookings; databaseEnabled: boolean }> {
  if (hasDatabaseUrl()) {
    const [dbSlots, dbBookings] = await Promise.all([getNeonAartiSlots(), getNeonAartiBookings()]);
    return { slots: dbSlots, bookings: dbBookings, settings, databaseEnabled: true };
  }
  return { slots: allAartiSlots, bookings, settings, databaseEnabled: false };
}

export async function getWinnersData() {
  if (hasDatabaseUrl()) {
    const dbEvents = await getNeonEvents();
    return {
      activities,
      events: dbEvents.filter((event) => event.status === "published"),
      winners: (await getNeonWinners()).filter((winner) => winner.status === "published" && winner.consentToPublish)
    };
  }
  return {
    activities,
    events: events.filter((event) => event.status === "published"),
    winners: winners.filter((winner) => winner.status === "published" && winner.consentToPublish)
  };
}

export async function getAdminDashboardData() {
  if (hasDatabaseUrl()) {
    const [dbAnnouncements, dbEvents, dbSlots, dbBookings, dbWinners] = await Promise.all([
      getNeonAnnouncements(),
      getNeonEvents(),
      getNeonAartiSlots(),
      getNeonAartiBookings(),
      getNeonWinners()
    ]);
    return {
      announcements: dbAnnouncements,
      events: dbEvents,
      slots: dbSlots,
      bookings: dbBookings,
      activities,
      winners: dbWinners,
      opportunities,
      settings,
      databaseEnabled: true,
      todayEvents: dbEvents.filter((event) => istDateFromISO(event.startsAt) === "2026-09-14")
    };
  }
  return {
    announcements,
    events,
    slots: allAartiSlots,
    bookings,
    activities,
    winners,
    opportunities,
    settings,
    databaseEnabled: false,
    todayEvents: events.filter((event) => istDateFromISO(event.startsAt) === "2026-09-14")
  };
}
