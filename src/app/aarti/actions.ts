"use server";

import { revalidatePath } from "next/cache";
import { bookingInputSchema, bookingReference, hashMobile, normalizeFlat } from "@/lib/booking";
import type { AartiBooking, BookingInput } from "@/lib/types";
import { getSql, hasDatabaseUrl, rowToCamel } from "@/server/db";

function mapBooking(row: Record<string, unknown>): AartiBooking {
  const item = rowToCamel(row) as Record<string, unknown>;
  return {
    id: String(item.id),
    reference: String(item.reference),
    slotId: String(item.slotId),
    residentName: String(item.residentName),
    wing: String(item.wing),
    flatNumber: String(item.flatNumber),
    mobileHash: String(item.mobileHash),
    mobileNumber: item.mobileNumber ? String(item.mobileNumber) : undefined,
    participantCount: Number(item.participantCount),
    note: item.note ? String(item.note) : undefined,
    status: item.status as AartiBooking["status"],
    waitlistPosition: item.waitlistPosition ? Number(item.waitlistPosition) : undefined,
    verifiedAt: item.verifiedAt instanceof Date ? item.verifiedAt.toISOString() : String(item.verifiedAt),
    createdAt: item.createdAt instanceof Date ? item.createdAt.toISOString() : String(item.createdAt),
    cancelledAt: item.cancelledAt ? (item.cancelledAt instanceof Date ? item.cancelledAt.toISOString() : String(item.cancelledAt)) : undefined
  };
}

export async function submitAartiBooking(input: BookingInput): Promise<{ booking?: AartiBooking; error?: string }> {
  if (!hasDatabaseUrl()) return { error: "Database is not configured." };
  const parsed = bookingInputSchema.safeParse(input);
  if (!parsed.success) return { error: "Please check the form details." };

  const sql = getSql();
  const flatKey = normalizeFlat(input.wing, input.flatNumber);
  const reference = bookingReference(input.slotId, flatKey, input.idempotencyKey);
  const id = `booking-${crypto.randomUUID()}`;

  try {
    const rows = await sql`
      select * from submit_aarti_booking(
        ${id},
        ${input.slotId},
        ${reference},
        ${input.residentName},
        ${input.wing},
        ${input.flatNumber},
        ${hashMobile(input.mobile)},
        ${normalizeMobileForStorage(input.mobile)},
        ${input.note ?? ""},
        ${input.idempotencyKey}
      )
    `;
    revalidatePath("/aarti");
    revalidatePath("/admin");
    return { booking: mapBooking(rows[0] as Record<string, unknown>) };
  } catch (error) {
    const detail = error instanceof Error ? error.message : "";
    const message = detail.includes("slot_full")
      ? "This slot is full."
      : detail.includes("duplicate_flat_slot")
        ? "This flat already has a booking for this slot."
        : "Unable to book this slot.";
    return { error: message };
  }
}

function normalizeMobileForStorage(mobile: string) {
  const digits = mobile.replace(/\D/g, "");
  return digits.length > 10 ? digits.slice(-10) : digits;
}

export async function cancelAartiBooking(reference: string, mobileHash: string): Promise<{ ok: boolean; error?: string }> {
  if (!hasDatabaseUrl()) return { ok: false, error: "Database is not configured." };
  const sql = getSql();
  const rows = await sql`
    update aarti_bookings
    set status = 'cancelled', cancelled_at = now()
    where reference = ${reference} and mobile_hash = ${mobileHash} and status <> 'cancelled'
    returning id
  `;
  revalidatePath("/aarti");
  revalidatePath("/admin");
  return rows.length > 0 ? { ok: true } : { ok: false, error: "Booking not found." };
}
