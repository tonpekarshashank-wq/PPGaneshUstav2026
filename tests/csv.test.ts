import { describe, expect, it } from "vitest";
import { generateAartiSlots } from "@/data/seed";
import { bookingsToCsv, registrationsToCsv } from "@/lib/csv";

describe("CSV export", () => {
  it("does not export mobile hashes or notes", () => {
    const csv = bookingsToCsv(
      [
        {
          id: "booking-1",
          reference: "PPG-ONE",
          slotId: generateAartiSlots()[0]!.id,
          residentName: "Resident",
          wing: "A",
          flatNumber: "101",
          mobileHash: "secret-hash",
          note: "private note",
          participantCount: 1,
          status: "confirmed",
          verifiedAt: "2026-09-01T00:00:00Z",
          createdAt: "2026-09-01T00:00:00Z"
        }
      ],
      generateAartiSlots()
    );
    expect(csv).not.toContain("secret-hash");
    expect(csv).not.toContain("private note");
    expect(csv).toContain("PPG-ONE");
  });

  it("exports registration review fields without private hashes", () => {
    const csv = registrationsToCsv([
      {
        id: "entry-1",
        reference: "EV3-0001",
        registrationEventId: "registration-event-3",
        eventId: "event-3",
        eventSlug: "2026-09-16-childrens-chess-competition",
        eventNameEn: "Children's Chess Competition",
        eventNameMr: "लहान मुलांची बुद्धिबळ स्पर्धा",
        participantName: "Aarav Deshpande",
        wing: "E",
        flatNumber: "1104",
        ageGroup: "6-9",
        mobileHash: "private-hash",
        mobileNumber: "9876543210",
        status: "confirmed",
        createdAt: "2026-09-01T00:00:00Z",
        updatedAt: "2026-09-01T00:00:00Z"
      }
    ]);
    expect(csv).toContain("Children's Chess Competition");
    expect(csv).toContain("9876543210");
    expect(csv).not.toContain("private-hash");
  });
});
