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
import type { AartiSlot, FestivalEvent } from "@/lib/types";
import { istDateFromISO } from "@/lib/time";
import { hasDatabaseUrl } from "@/server/db";
import {
  getNeonAartiBookings,
  getNeonAartiSlots,
  getNeonAnnouncements,
  getNeonEvents,
  getNeonWinners
} from "@/server/neon-repository";

export async function getPublicHomeData() {
  if (hasDatabaseUrl()) {
    const [dbAnnouncements, dbEvents] = await Promise.all([getNeonAnnouncements(), getNeonEvents()]);
    return {
      announcements: dbAnnouncements.filter((announcement) => announcement.status === "published"),
      events: dbEvents.filter((event) => event.status === "published"),
      opportunities: opportunities.filter((opportunity) => opportunity.status === "published" && opportunity.featured),
      settings
    };
  }
  return {
    announcements: announcements.filter((announcement) => announcement.status === "published"),
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
    return {
      activities,
      winners: (await getNeonWinners()).filter((winner) => winner.status === "published" && winner.consentToPublish)
    };
  }
  return {
    activities,
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
