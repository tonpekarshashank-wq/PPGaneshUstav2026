import { describe, expect, it } from "vitest";
import { scrubAnalyticsPayload } from "@/lib/analytics";

describe("analytics privacy", () => {
  it("removes PII-like keys from payloads", () => {
    expect(
      scrubAnalyticsPayload({
        language: "en",
        residentName: "Hidden",
        mobile: "9876543210",
        flatNumber: "A-101",
        category: "Puja"
      })
    ).toEqual({ language: "en", category: "Puja" });
  });
});
