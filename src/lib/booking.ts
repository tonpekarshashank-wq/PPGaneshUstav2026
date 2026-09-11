import { z } from "zod";
import type { AartiBooking, AartiSlot, BookingInput, DuplicatePolicy } from "@/lib/types";

export function isAllowedFlatNumber(flatNumber: string): boolean {
  const value = Number(flatNumber.trim());
  if (!Number.isInteger(value)) return false;
  const floor = Math.floor(value / 100);
  const unit = value % 100;
  return floor >= 1 && floor <= 11 && unit >= 1 && unit <= 6;
}

export const bookingInputSchema = z.object({
  slotId: z.string().min(1),
  residentName: z.string().trim().min(2).max(80),
  wing: z.string().trim().min(1).max(10).regex(/^[A-Za-z0-9 -]+$/),
  flatNumber: z.string().trim().regex(/^\d{3,4}$/).refine(isAllowedFlatNumber),
  mobile: z.string().trim().regex(/^(\+91[- ]?)?[6-9]\d{9}$/),
  participantCount: z.coerce.number().int().min(1).max(10),
  note: z.string().trim().max(240).optional(),
  consent: z.literal(true),
  idempotencyKey: z.string().min(8).max(120)
});

export function normalizeMobile(mobile: string): string {
  const digits = mobile.replace(/\D/g, "");
  return digits.length > 10 ? digits.slice(-10) : digits;
}

export function normalizeFlat(wing: string, flatNumber: string): string {
  return `${wing.trim().toUpperCase()}-${flatNumber.trim().toUpperCase()}`;
}

export function hashMobile(mobile: string, secret = process.env.BOOKING_MOBILE_HASH_SECRET ?? "local-dev-secret"): string {
  return stableHash(`${secret}:${normalizeMobile(mobile)}`);
}

export function bookingReference(slotId: string, flatKey: string, idempotencyKey: string): string {
  const digest = stableHash(`${slotId}:${flatKey}:${idempotencyKey}`).slice(0, 8);
  return `PPG-${digest.toUpperCase()}`;
}

function stableHash(value: string): string {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

export function canCreateBooking(
  input: BookingInput,
  slot: AartiSlot,
  bookings: AartiBooking[],
  duplicatePolicy: DuplicatePolicy
): { ok: true; status: "confirmed" | "waitlisted"; existing?: AartiBooking } | { ok: false; reason: string } {
  const parsed = bookingInputSchema.safeParse(input);
  if (!parsed.success) return { ok: false, reason: "Please check the form details." };
  if (slot.state === "closed" || slot.state === "cancelled") return { ok: false, reason: "This slot is closed." };

  const flatKey = normalizeFlat(input.wing, input.flatNumber);
  const mobileHash = hashMobile(input.mobile);
  const sameSubmission = bookings.find(
    (booking) => booking.slotId === slot.id && booking.mobileHash === mobileHash && normalizeFlat(booking.wing, booking.flatNumber) === flatKey
  );
  if (sameSubmission) return { ok: true, status: sameSubmission.status === "waitlisted" ? "waitlisted" : "confirmed", existing: sameSubmission };

  if (duplicatePolicy !== "unrestricted") {
    const activeByFlat = bookings.filter(
      (booking) => booking.status !== "cancelled" && normalizeFlat(booking.wing, booking.flatNumber) === flatKey
    );
    const violatesFestival = duplicatePolicy === "one_per_festival" && activeByFlat.length > 0;
    const violatesDay =
      duplicatePolicy === "one_per_day" &&
      activeByFlat.some((booking) => booking.slotId.startsWith(`aarti-${slot.eventDate}`));
    if (violatesFestival || violatesDay) return { ok: false, reason: "This flat already has an active aarti booking." };
  }

  const confirmed = bookings.filter((booking) => booking.slotId === slot.id && booking.status === "confirmed").length;
  if (confirmed < slot.capacity) return { ok: true, status: "confirmed" };
  if (slot.waitlistEnabled) return { ok: true, status: "waitlisted" };
  return { ok: false, reason: "This slot is full." };
}
