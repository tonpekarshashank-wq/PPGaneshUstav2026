import { z } from "zod";
import { isAllowedFlatNumber, normalizeFlat } from "@/lib/booking";
import type { RegistrationEntryPublic, RegistrationInput } from "@/lib/types";

export function registrationEventHref(eventId: string, eventSlug: string) {
  return `/registrations?event=${encodeURIComponent(eventId)}/${encodeURIComponent(eventSlug)}`;
}

export function parseRegistrationEventParam(value: string | string[] | undefined): { eventId: string; eventSlug?: string } | undefined {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw) return undefined;
  const decoded = decodeURIComponent(raw);
  const [eventId, ...slugParts] = decoded.split("/");
  if (!eventId?.trim()) return undefined;
  return {
    eventId: eventId.trim(),
    eventSlug: slugParts.join("/").trim() || undefined
  };
}

export const registrationInputSchema = z.object({
  registrationEventId: z.string().min(1),
  participantName: z.string().trim().min(2).max(80),
  wing: z.enum(["E", "F", "G", "H"]),
  flatNumber: z.string().trim().regex(/^\d{3,4}$/).refine(isAllowedFlatNumber),
  ageGroup: z.string().trim().min(1).max(20),
  mobile: z.string().trim().regex(/^(\+91[- ]?)?[6-9]\d{9}$/),
  idempotencyKey: z.string().min(8).max(120)
});

export function registrationReference(registrationEventId: string, flatKey: string, idempotencyKey: string): string {
  const prefix = registrationEventId
    .replace(/^registration-/, "")
    .replace(/^event-/, "EV")
    .replace(/[^A-Za-z0-9]/g, "")
    .slice(0, 4)
    .toUpperCase()
    .padEnd(2, "R");
  return `${prefix}-${stableHash(`${registrationEventId}:${flatKey}:${idempotencyKey}`).slice(0, 4).toUpperCase()}`;
}

export function findDuplicateRegistration(input: Pick<RegistrationInput, "participantName" | "wing" | "flatNumber" | "registrationEventId">, entries: RegistrationEntryPublic[]) {
  const targetName = normalizeParticipantName(input.participantName);
  const targetFlat = normalizeFlat(input.wing, input.flatNumber);
  return entries.find(
    (entry) =>
      entry.registrationEventId === input.registrationEventId &&
      entry.status === "confirmed" &&
      normalizeParticipantName(entry.participantName) === targetName &&
      normalizeFlat(entry.wing, entry.flatNumber) === targetFlat
  );
}

function normalizeParticipantName(name: string) {
  return name.trim().replace(/\s+/g, " ").toLowerCase();
}

function stableHash(value: string): string {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}
