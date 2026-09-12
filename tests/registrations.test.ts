import { describe, expect, it } from "vitest";
import { findDuplicateRegistration, parseRegistrationEventParam, registrationEventHref, registrationReference } from "@/lib/registrations";
import type { RegistrationEntryPublic } from "@/lib/types";

describe("registrations", () => {
  it("builds and parses event query params with event id and slug", () => {
    const href = registrationEventHref("event-3", "2026-09-16-childrens-chess-and-carrom-competition");
    expect(href).toBe("/registrations?event=event-3/2026-09-16-childrens-chess-and-carrom-competition");
    expect(parseRegistrationEventParam("event-3/2026-09-16-childrens-chess-and-carrom-competition")).toEqual({
      eventId: "event-3",
      eventSlug: "2026-09-16-childrens-chess-and-carrom-competition"
    });
  });

  it("finds duplicate entries by event, participant name, wing, and flat", () => {
    const entries: RegistrationEntryPublic[] = [
      {
        id: "entry-1",
        reference: "EV3-ABCD",
        registrationEventId: "registration-event-3",
        eventId: "event-3",
        eventSlug: "2026-09-16-childrens-chess-and-carrom-competition",
        eventNameEn: "Children's Chess and Carrom Competition",
        eventNameMr: "लहान मुलांची बुद्धिबळ व कॅरम स्पर्धा",
        participantName: "Aarav Deshpande",
        wing: "E",
        flatNumber: "1104",
        ageGroup: "6-9",
        status: "confirmed",
        createdAt: "2026-09-15T10:00:00+05:30",
        updatedAt: "2026-09-15T10:00:00+05:30"
      }
    ];

    expect(
      findDuplicateRegistration(
        {
          registrationEventId: "registration-event-3",
          participantName: "  aarav   deshpande ",
          wing: "e",
          flatNumber: "1104"
        },
        entries
      )?.reference
    ).toBe("EV3-ABCD");
  });

  it("creates stable references for idempotent submissions", () => {
    expect(registrationReference("registration-event-3", "E-1104", "same-key")).toBe(registrationReference("registration-event-3", "E-1104", "same-key"));
  });
});
