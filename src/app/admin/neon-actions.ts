"use server";

import { revalidatePath } from "next/cache";
import type { AartiBooking, Announcement, FestivalEvent, Winner } from "@/lib/types";
import { getSql, hasDatabaseUrl } from "@/server/db";

export async function saveAnnouncementToDatabase(item: Announcement) {
  if (!hasDatabaseUrl()) return;
  const sql = getSql();
  await sql`
    insert into announcements (id, title_en, title_mr, body_en, body_mr, severity, starts_at, ends_at, is_pinned, status, updated_at)
    values (${item.id}, ${item.titleEn}, ${item.titleMr}, ${item.bodyEn}, ${item.bodyMr}, ${item.severity}, ${item.startsAt}, ${item.endsAt}, ${item.isPinned}, ${item.status}, now())
    on conflict (id) do update set
      title_en = excluded.title_en,
      title_mr = excluded.title_mr,
      body_en = excluded.body_en,
      body_mr = excluded.body_mr,
      severity = excluded.severity,
      starts_at = excluded.starts_at,
      ends_at = excluded.ends_at,
      is_pinned = excluded.is_pinned,
      status = excluded.status,
      updated_at = now()
  `;
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function saveEventToDatabase(item: FestivalEvent) {
  if (!hasDatabaseUrl()) return;
  const sql = getSql();
  await sql`
    insert into events (
      id, slug, name_en, name_mr, description_en, description_mr, starts_at, ends_at,
      venue_en, venue_mr, category, state, status, registration_url, contact_label, display_order, sample_content, updated_at
    )
    values (
      ${item.id}, ${item.slug}, ${item.nameEn}, ${item.nameMr}, ${item.descriptionEn}, ${item.descriptionMr}, ${item.startsAt}, ${item.endsAt},
      ${item.venueEn}, ${item.venueMr}, ${item.category}, ${item.state}, ${item.status}, ${item.registrationUrl ?? null}, ${item.contactLabel ?? null}, ${item.displayOrder}, ${Boolean(item.sampleContent)}, now()
    )
    on conflict (id) do update set
      slug = excluded.slug,
      name_en = excluded.name_en,
      name_mr = excluded.name_mr,
      description_en = excluded.description_en,
      description_mr = excluded.description_mr,
      starts_at = excluded.starts_at,
      ends_at = excluded.ends_at,
      venue_en = excluded.venue_en,
      venue_mr = excluded.venue_mr,
      category = excluded.category,
      state = excluded.state,
      status = excluded.status,
      registration_url = excluded.registration_url,
      contact_label = excluded.contact_label,
      display_order = excluded.display_order,
      sample_content = excluded.sample_content,
      updated_at = now()
  `;
  revalidatePath("/");
  revalidatePath("/schedule");
  revalidatePath("/admin");
}

export async function saveBookingToDatabase(item: AartiBooking) {
  if (!hasDatabaseUrl()) return;
  const sql = getSql();
  await sql`
    update aarti_bookings
    set resident_name = ${item.residentName},
        wing = ${item.wing},
        flat_number = ${item.flatNumber},
        note = ${item.note ?? null},
        status = ${item.status},
        cancelled_at = ${item.cancelledAt ?? null}
    where id = ${item.id}
  `;
  revalidatePath("/aarti");
  revalidatePath("/admin");
}

export async function saveWinnerToDatabase(item: Winner) {
  if (!hasDatabaseUrl()) return;
  const sql = getSql();
  await sql`
    insert into winners (
      id, activity_id, rank_order, prize_en, prize_mr, display_name, wing, flat_number,
      image_url, note_en, note_mr, consent_to_publish, status, updated_at
    )
    values (
      ${item.id}, ${item.activityId}, ${item.rankOrder}, ${item.prizeEn}, ${item.prizeMr}, ${item.displayName}, ${item.wing ?? null}, ${item.flatNumber ?? null},
      ${item.imageUrl ?? null}, ${item.noteEn ?? null}, ${item.noteMr ?? null}, ${item.consentToPublish}, ${item.status}, now()
    )
    on conflict (id) do update set
      activity_id = excluded.activity_id,
      rank_order = excluded.rank_order,
      prize_en = excluded.prize_en,
      prize_mr = excluded.prize_mr,
      display_name = excluded.display_name,
      wing = excluded.wing,
      flat_number = excluded.flat_number,
      image_url = excluded.image_url,
      note_en = excluded.note_en,
      note_mr = excluded.note_mr,
      consent_to_publish = excluded.consent_to_publish,
      status = excluded.status,
      updated_at = now()
  `;
  revalidatePath("/winners");
  revalidatePath("/admin");
}
