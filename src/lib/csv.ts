import type { AartiBooking, AartiSlot } from "@/lib/types";

function escapeCell(value: unknown): string {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

export function bookingsToCsv(bookings: AartiBooking[], slots: AartiSlot[]): string {
  const rows = [
    ["reference", "slot_date", "period", "resident_name", "wing", "flat_number", "mobile_number", "participant_count", "status", "created_at"],
    ...bookings.map((booking) => {
      const slot = slots.find((item) => item.id === booking.slotId);
      return [
        booking.reference,
        slot?.eventDate ?? "",
        slot?.period ?? "",
        booking.residentName,
        booking.wing,
        booking.flatNumber,
        booking.mobileNumber ?? "",
        booking.participantCount,
        booking.status,
        booking.createdAt
      ];
    })
  ];
  return rows.map((row) => row.map(escapeCell).join(",")).join("\n");
}
