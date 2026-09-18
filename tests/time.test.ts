import { describe, expect, it } from "vitest";
import { eventsForTodayOrNext, festivalDatesFrom, festivalState, isTodayOrFutureIST, istDateFromISO } from "@/lib/time";
import { events } from "@/data/seed";

describe("festival time helpers", () => {
  it("uses Asia/Kolkata when deriving dates", () => {
    expect(istDateFromISO("2026-09-13T19:00:00Z")).toBe("2026-09-14");
  });

  it("only offers today and future festival dates for booking", () => {
    expect(festivalDatesFrom("2026-09-18")[0]).toBe("2026-09-18");
    expect(festivalDatesFrom("2026-09-18")).not.toContain("2026-09-17");
    expect(festivalDatesFrom("2026-09-26")).toEqual([]);
  });

  it("identifies events occurring today or later in India", () => {
    expect(isTodayOrFutureIST("2026-09-18T08:00:00+05:30", "2026-09-18")).toBe(true);
    expect(isTodayOrFutureIST("2026-09-17T20:00:00+05:30", "2026-09-18")).toBe(false);
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
