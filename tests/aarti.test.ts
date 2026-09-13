import { describe, expect, it } from "vitest";
import { generateAartiSlots } from "@/data/seed";
import { canCreateBooking, hashMobile, isAllowedFlatNumber } from "@/lib/booking";
import type { AartiBooking, BookingInput } from "@/lib/types";

describe("aarti slots", () => {
  it("validates allowed society flat ranges", () => {
    ["101", "106", "201", "606", "1001", "1006", "1101", "1106"].forEach((flat) => {
      expect(isAllowedFlatNumber(flat)).toBe(true);
    });
    ["100", "107", "207", "907", "1007", "1011", "1107", "1201", "A101"].forEach((flat) => {
      expect(isAllowedFlatNumber(flat)).toBe(false);
    });
  });

  it("generates the exact confirmed aarti schedule", () => {
    const slots = generateAartiSlots();
    expect(slots.find((slot) => slot.eventDate === "2026-09-14")).toBeUndefined();
    expect(slots.filter((slot) => slot.eventDate >= "2026-09-15" && slot.eventDate <= "2026-09-24")).toHaveLength(20);
    expect(slots.filter((slot) => slot.eventDate === "2026-09-25")).toHaveLength(1);
    expect(slots.find((slot) => slot.eventDate === "2026-09-25" && slot.period === "evening")).toBeUndefined();
  });

  it("returns an existing duplicate submission instead of creating another booking", () => {
    const slot = generateAartiSlots()[0]!;
    const input: BookingInput = {
      slotId: slot.id,
      residentName: "Resident One",
      wing: "A",
      flatNumber: "101",
      mobile: "9876543210",
      participantCount: 2,
      consent: true,
      idempotencyKey: "idem-a-101"
    };
    const existing: AartiBooking = {
      id: "booking-1",
      reference: "PPG-EXISTING",
      slotId: slot.id,
      residentName: input.residentName,
      wing: "A",
      flatNumber: "101",
      mobileHash: hashMobile(input.mobile),
      participantCount: 2,
      status: "confirmed",
      verifiedAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    const result = canCreateBooking(input, slot, [existing], "one_per_festival");
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.existing?.reference).toBe("PPG-EXISTING");
  });

  it("waitlists after capacity when enabled", () => {
    const slot = { ...generateAartiSlots()[0]!, capacity: 1, waitlistEnabled: true };
    const bookings: AartiBooking[] = [
      {
        id: "booking-1",
        reference: "PPG-ONE",
        slotId: slot.id,
        residentName: "One",
        wing: "A",
        flatNumber: "101",
        mobileHash: hashMobile("9876543210"),
        participantCount: 1,
        status: "confirmed",
        verifiedAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      }
    ];
    const result = canCreateBooking(
      {
        slotId: slot.id,
        residentName: "Two",
        wing: "B",
        flatNumber: "202",
        mobile: "9876543211",
        participantCount: 1,
        consent: true,
        idempotencyKey: "idem-b-202"
      },
      slot,
      bookings,
      "one_per_festival"
    );
    expect(result).toMatchObject({ ok: true, status: "waitlisted" });
  });

  it("allows multiple flats in the same slot until capacity", () => {
    const slot = { ...generateAartiSlots()[0]!, capacity: 10, waitlistEnabled: false };
    const bookings: AartiBooking[] = Array.from({ length: 9 }, (_, index) => ({
      id: `booking-${index + 1}`,
      reference: `PPG-${index + 1}`,
      slotId: slot.id,
      residentName: `Resident ${index + 1}`,
      wing: "E",
      flatNumber: String(index < 6 ? 101 + index : 201 + index - 6),
      mobileHash: hashMobile(`98765432${String(index).padStart(2, "0")}`),
      participantCount: 1,
      status: "confirmed",
      verifiedAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    }));

    const result = canCreateBooking(
      {
        slotId: slot.id,
        residentName: "Tenth Resident",
        wing: "H",
        flatNumber: "1106",
        mobile: "9876543299",
        participantCount: 1,
        consent: true,
        idempotencyKey: "idem-h-1106"
      },
      slot,
      bookings,
      "one_per_festival"
    );

    expect(result).toMatchObject({ ok: true, status: "confirmed" });
  });
});
