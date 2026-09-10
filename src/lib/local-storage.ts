import type { AartiBooking, Announcement, FestivalEvent, Winner } from "@/lib/types";

export const adminStorageKeys = {
  announcements: "ppg-admin-announcements",
  events: "ppg-admin-events",
  bookings: "ppg-aarti-bookings",
  winners: "ppg-admin-winners"
} as const;

type AdminEditableData = {
  announcements: Announcement[];
  events: FestivalEvent[];
  bookings: AartiBooking[];
  winners: Winner[];
};

export function readStorageList<T>(key: string, fallback: T[]): T[] {
  if (typeof window === "undefined") return fallback;
  try {
    const stored = window.localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T[]) : fallback;
  } catch {
    return fallback;
  }
}

export function writeStorageList<T>(key: string, value: T[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent("ppg-admin-data-changed", { detail: { key } }));
}

export function readAdminEditableData(fallback: AdminEditableData): AdminEditableData {
  return {
    announcements: readStorageList(adminStorageKeys.announcements, fallback.announcements),
    events: readStorageList(adminStorageKeys.events, fallback.events),
    bookings: readStorageList(adminStorageKeys.bookings, fallback.bookings),
    winners: readStorageList(adminStorageKeys.winners, fallback.winners)
  };
}
