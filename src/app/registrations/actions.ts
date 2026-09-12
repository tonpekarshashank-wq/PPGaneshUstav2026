"use server";

import { revalidatePath } from "next/cache";
import { hashMobile, normalizeFlat, normalizeMobile } from "@/lib/booking";
import { registrationInputSchema, registrationReference } from "@/lib/registrations";
import type { RegistrationEntryPublic, RegistrationInput } from "@/lib/types";
import { getSql, hasDatabaseUrl, rowToCamel } from "@/server/db";

function iso(value: unknown) {
  return value instanceof Date ? value.toISOString() : String(value);
}

function mapPublicRegistrationEntry(row: Record<string, unknown>): RegistrationEntryPublic {
  const item = rowToCamel(row) as Record<string, unknown>;
  return {
    id: String(item.id),
    reference: String(item.reference),
    registrationEventId: String(item.registrationEventId),
    eventId: String(item.eventId),
    eventSlug: String(item.eventSlug),
    eventNameEn: String(item.eventNameEn),
    eventNameMr: String(item.eventNameMr),
    participantName: String(item.participantName),
    wing: String(item.wing),
    flatNumber: String(item.flatNumber),
    ageGroup: String(item.ageGroup),
    status: "confirmed",
    createdAt: iso(item.createdAt),
    updatedAt: iso(item.updatedAt)
  };
}

export async function submitRegistrationEntry(input: RegistrationInput): Promise<{ entry?: RegistrationEntryPublic; error?: string }> {
  if (!hasDatabaseUrl()) return { error: "Database is not configured." };
  const parsed = registrationInputSchema.safeParse(input);
  if (!parsed.success) return { error: "Please check the form details." };

  const data = parsed.data;
  const sql = getSql();
  const id = `registration-entry-${crypto.randomUUID()}`;
  const flatKey = normalizeFlat(data.wing, data.flatNumber);
  const reference = registrationReference(data.registrationEventId, flatKey, data.idempotencyKey);

  try {
    const rows = await sql`
      with target_event as (
        select *
        from registration_events
        where id = ${data.registrationEventId}
          and status = 'open'
          and now() >= opens_at
          and now() <= closes_at
      ),
      inserted as (
        insert into registration_entries (
          id,
          reference,
          registration_event_id,
          participant_name,
          wing,
          flat_number,
          age_group,
          mobile_hash,
          mobile_number,
          status,
          idempotency_key
        )
        select
          ${id},
          ${reference},
          target_event.id,
          trim(${data.participantName}),
          ${data.wing},
          ${data.flatNumber},
          ${data.ageGroup},
          ${hashMobile(data.mobile)},
          ${normalizeMobile(data.mobile)},
          'confirmed',
          ${data.idempotencyKey}
        from target_event
        returning *
      )
      select
        inserted.id,
        inserted.reference,
        inserted.registration_event_id,
        re.event_id,
        e.slug as event_slug,
        e.name_en as event_name_en,
        e.name_mr as event_name_mr,
        inserted.participant_name,
        inserted.wing,
        inserted.flat_number,
        inserted.age_group,
        inserted.created_at,
        inserted.updated_at
      from inserted
      join registration_events re on re.id = inserted.registration_event_id
      join events e on e.id = re.event_id
    `;

    if (rows.length === 0) return { error: "Registration is closed for this event." };
    revalidatePath("/registrations");
    revalidatePath("/admin");
    return { entry: mapPublicRegistrationEntry(rows[0] as Record<string, unknown>) };
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message.includes("idempotency_key")) return { error: "This registration was already submitted." };
    if (message.includes("one_confirmed_registration_per_participant_flat_event")) return { error: "This participant and flat are already registered for this event." };
    return { error: "Unable to save this registration." };
  }
}
