import "server-only";
import { getSql, rowToCamel } from "@/server/db";
import type { AartiBooking, AartiSlot, Announcement, FestivalEvent, Winner } from "@/lib/types";

function iso(value: unknown) {
  return value instanceof Date ? value.toISOString() : String(value);
}

export async function getNeonAnnouncements(): Promise<Announcement[]> {
  const sql = getSql();
  const rows = await sql`select * from announcements order by is_pinned desc, starts_at asc`;
  return rows.map((row) => {
    const item = rowToCamel(row) as Record<string, unknown>;
    return {
      id: String(item.id),
      titleEn: String(item.titleEn),
      titleMr: String(item.titleMr),
      bodyEn: String(item.bodyEn),
      bodyMr: String(item.bodyMr),
      severity: item.severity as Announcement["severity"],
      startsAt: iso(item.startsAt),
      endsAt: iso(item.endsAt),
      isPinned: Boolean(item.isPinned),
      status: item.status as Announcement["status"]
    };
  });
}

export async function getNeonEvents(): Promise<FestivalEvent[]> {
  const sql = getSql();
  const rows = await sql`select * from events order by starts_at asc, display_order asc`;
  return rows.map((row) => {
    const item = rowToCamel(row) as Record<string, unknown>;
    return {
      id: String(item.id),
      slug: String(item.slug),
      nameEn: String(item.nameEn),
      nameMr: String(item.nameMr),
      descriptionEn: String(item.descriptionEn ?? ""),
      descriptionMr: String(item.descriptionMr ?? ""),
      startsAt: iso(item.startsAt),
      endsAt: iso(item.endsAt),
      venueEn: String(item.venueEn),
      venueMr: String(item.venueMr),
      category: String(item.category),
      state: item.state as FestivalEvent["state"],
      status: item.status as FestivalEvent["status"],
      displayOrder: Number(item.displayOrder),
      sampleContent: Boolean(item.sampleContent),
      registrationUrl: item.registrationUrl ? String(item.registrationUrl) : undefined,
      contactLabel: item.contactLabel ? String(item.contactLabel) : undefined
    };
  });
}

export async function getNeonAartiSlots(): Promise<AartiSlot[]> {
  const sql = getSql();
  const rows = await sql`
    select s.*,
      to_char(s.event_date, 'YYYY-MM-DD') as event_date_text,
      coalesce(count(b.id) filter (where b.status = 'confirmed'), 0)::int as confirmed_count,
      coalesce(count(b.id) filter (where b.status = 'waitlisted'), 0)::int as waitlisted_count
    from aarti_slots s
    left join aarti_bookings b on b.slot_id = s.id
    group by s.id
    order by s.event_date asc, s.starts_at asc
  `;
  return rows.map((row) => {
    const item = rowToCamel(row) as Record<string, unknown>;
    return {
      id: String(item.id),
      eventDate: String(item.eventDateText),
      period: item.period as AartiSlot["period"],
      labelEn: String(item.labelEn),
      labelMr: String(item.labelMr),
      startsAt: iso(item.startsAt),
      reportingAt: iso(item.reportingAt),
      capacity: Number(item.capacity),
      confirmedCount: Number(item.confirmedCount),
      waitlistedCount: Number(item.waitlistedCount),
      bookingOpensAt: iso(item.bookingOpensAt),
      bookingClosesAt: iso(item.bookingClosesAt),
      waitlistEnabled: Boolean(item.waitlistEnabled),
      state: Number(item.confirmedCount) > 0 ? "full" : (item.status as AartiSlot["state"])
    };
  });
}

export async function getNeonAartiBookings(): Promise<AartiBooking[]> {
  const sql = getSql();
  const rows = await sql`select * from aarti_bookings order by created_at desc`;
  return rows.map((row) => {
    const item = rowToCamel(row) as Record<string, unknown>;
    return {
      id: String(item.id),
      reference: String(item.reference),
      slotId: String(item.slotId),
      residentName: String(item.residentName),
      wing: String(item.wing),
      flatNumber: String(item.flatNumber),
      mobileHash: String(item.mobileHash),
      participantCount: Number(item.participantCount),
      note: item.note ? String(item.note) : undefined,
      status: item.status as AartiBooking["status"],
      waitlistPosition: item.waitlistPosition ? Number(item.waitlistPosition) : undefined,
      verifiedAt: iso(item.verifiedAt),
      createdAt: iso(item.createdAt),
      cancelledAt: item.cancelledAt ? iso(item.cancelledAt) : undefined
    };
  });
}

export async function getNeonWinners(): Promise<Winner[]> {
  const sql = getSql();
  const rows = await sql`select * from winners order by rank_order asc`;
  return rows.map((row) => {
    const item = rowToCamel(row) as Record<string, unknown>;
    return {
      id: String(item.id),
      activityId: String(item.activityId),
      rankOrder: Number(item.rankOrder),
      prizeEn: String(item.prizeEn),
      prizeMr: String(item.prizeMr),
      displayName: String(item.displayName),
      wing: item.wing ? String(item.wing) : undefined,
      flatNumber: item.flatNumber ? String(item.flatNumber) : undefined,
      imageUrl: item.imageUrl ? String(item.imageUrl) : undefined,
      noteEn: item.noteEn ? String(item.noteEn) : undefined,
      noteMr: item.noteMr ? String(item.noteMr) : undefined,
      consentToPublish: Boolean(item.consentToPublish),
      status: item.status as Winner["status"]
    };
  });
}
