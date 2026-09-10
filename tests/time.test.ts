import { describe, expect, it } from "vitest";
import { eventsForTodayOrNext, festivalState, istDateFromISO } from "@/lib/time";
import { events } from "@/data/seed";

describe("festival time helpers", () => {
  it("uses Asia/Kolkata when deriving dates", () => {
    expect(istDateFromISO("2026-09-13T19:00:00Z")).toBe("2026-09-14");
  });

  it("reports festival state from IST dates", () => {
    expect(festivalState(new Date("2026-09-13T18:20:00Z"))).toBe("upcoming");
    expect(festivalState(new Date("2026-09-14T00:00:00+05:30"))).toBe("in_progress");
    expect(festivalState(new Date("2026-09-26T00:00:00+05:30"))).toBe("completed");
  });

  it("falls back to the next event when today has none", () => {
    const result = eventsForTodayOrNext(events, new Date("2026-09-13T12:00:00+05:30"));
    expect(result.isFallback).toBe(true);
    expect(result.date).toBe("2026-09-14");
    expect(result.events[0]?.nameEn).toContain("Installation");
  });
});
