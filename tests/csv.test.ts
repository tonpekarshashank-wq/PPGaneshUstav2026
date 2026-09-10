import { describe, expect, it } from "vitest";
import { generateAartiSlots } from "@/data/seed";
import { bookingsToCsv } from "@/lib/csv";

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
});
