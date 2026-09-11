"use client";

import { useEffect, useMemo, useState } from "react";
import { submitAartiBooking } from "@/app/aarti/actions";
import { BiTitle } from "@/components/BiTitle";
import { adminStorageKeys, readStorageList, writeStorageList } from "@/lib/local-storage";
import type { AartiBooking, AartiSlot, BookingInput, FestivalSettings } from "@/lib/types";
import { bookingReference, canCreateBooking, hashMobile, normalizeFlat } from "@/lib/booking";
import { festivalDates, formatDateIST, formatTimeIST } from "@/lib/time";

type Props = {
  slots: AartiSlot[];
  bookings: AartiBooking[];
  settings: FestivalSettings;
  databaseEnabled: boolean;
};

function dayParts(date: string) {
  const value = new Date(`${date}T00:00:00+05:30`);
  return {
    weekday: new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", weekday: "short" }).format(value),
    day: new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", day: "numeric" }).format(value),
    month: new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", month: "short" }).format(value)
  };
}

function periodText(period: AartiSlot["period"]) {
  return period === "morning" ? "Morning" : "Evening";
}

function bookingFlat(booking: AartiBooking) {
  return `${booking.wing.toUpperCase()}-${booking.flatNumber.toUpperCase()}`;
}

function officialAartiSlots(existingSlots: AartiSlot[]): AartiSlot[] {
  const byId = new Map(existingSlots.map((slot) => [slot.id, slot]));
  const slots: AartiSlot[] = [];

  for (let day = 15; day <= 25; day += 1) {
    const date = `2026-09-${String(day).padStart(2, "0")}`;
    const periods = day === 25 ? (["morning"] as const) : (["morning", "evening"] as const);
    for (const period of periods) {
      const id = `aarti-${date}-${period}`;
      const time = period === "morning" ? "08:00" : "20:00";
      const reportingTime = period === "morning" ? "07:45" : "19:45";
      const closeTime = period === "morning" ? "02:00" : "14:00";
      const existing = byId.get(id);
      slots.push(existing ? { ...existing, eventDate: date } : {
        id,
        eventDate: date,
        period,
        labelEn: period === "morning" ? "Morning Aarti" : "Evening Aarti",
        labelMr: period === "morning" ? "सकाळची आरती" : "संध्याकाळची आरती",
        startsAt: `${date}T${time}:00+05:30`,
        reportingAt: `${date}T${reportingTime}:00+05:30`,
        capacity: 1,
        confirmedCount: 0,
        waitlistedCount: 0,
        bookingOpensAt: "2026-09-01T08:00:00+05:30",
        bookingClosesAt: `${date}T${closeTime}:00+05:30`,
        waitlistEnabled: false,
        state: "open"
      });
    }
  }

  return slots;
}

export function AartiClient({ slots, bookings: initialBookings, settings, databaseEnabled }: Props) {
  const displaySlots = useMemo(() => officialAartiSlots(slots), [slots]);
  const firstValidDate = festivalDates.find((date) => displaySlots.some((slot) => slot.eventDate === date)) ?? festivalDates[0];
  const [selectedDate, setSelectedDate] = useState(firstValidDate);
  const [selectedSlotId, setSelectedSlotId] = useState(displaySlots.find((slot) => slot.eventDate === firstValidDate)?.id ?? "");
  const [bookings, setBookings] = useState<AartiBooking[]>(initialBookings);
  const [message, setMessage] = useState<string | null>(null);
  const [form, setForm] = useState({
    residentName: "",
    wing: "E",
    flatNumber: "",
    mobile: "",
    note: ""
  });

  useEffect(() => {
    if (!displaySlots.some((slot) => slot.eventDate === selectedDate)) {
      setSelectedDate(firstValidDate);
      setSelectedSlotId(displaySlots.find((slot) => slot.eventDate === firstValidDate)?.id ?? "");
      return;
    }
    if (!displaySlots.some((slot) => slot.id === selectedSlotId && slot.eventDate === selectedDate)) {
      setSelectedSlotId(displaySlots.find((slot) => slot.eventDate === selectedDate)?.id ?? "");
    }
  }, [displaySlots, firstValidDate, selectedDate, selectedSlotId]);

  useEffect(() => {
    if (databaseEnabled) {
      setBookings(initialBookings);
      return;
    }
    setBookings(readStorageList(adminStorageKeys.bookings, []));

    function syncBookings() {
      setBookings(readStorageList(adminStorageKeys.bookings, []));
    }

    window.addEventListener("storage", syncBookings);
    window.addEventListener("ppg-admin-data-changed", syncBookings);
    return () => {
      window.removeEventListener("storage", syncBookings);
      window.removeEventListener("ppg-admin-data-changed", syncBookings);
    };
  }, [databaseEnabled, initialBookings]);

  function saveBookings(next: AartiBooking[]) {
    setBookings(next);
    if (!databaseEnabled) {
      writeStorageList(adminStorageKeys.bookings, next);
    }
  }

  const dateSlots = displaySlots.filter((slot) => slot.eventDate === selectedDate);
  const selectedSlot = displaySlots.find((slot) => slot.id === selectedSlotId) ?? dateSlots[0];
  const selectedDateParts = dayParts(selectedDate);
  const enrichedSlot = useMemo(() => {
    if (!selectedSlot) return undefined;
    const confirmedCount = bookings.filter((booking) => booking.slotId === selectedSlot.id && booking.status === "confirmed").length;
    const waitlistedCount = bookings.filter((booking) => booking.slotId === selectedSlot.id && booking.status === "waitlisted").length;
    return {
      ...selectedSlot,
      confirmedCount,
      waitlistedCount,
      state: confirmedCount > 0 ? "full" : selectedSlot.state
    };
  }, [bookings, selectedSlot]);

  async function submitBooking(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!enrichedSlot) return;
    const input: BookingInput = {
      ...form,
      slotId: enrichedSlot.id,
      participantCount: 1,
      note: "",
      consent: true,
      idempotencyKey: `${normalizeFlat(form.wing, form.flatNumber)}-${hashMobile(form.mobile)}-${enrichedSlot.id}`
    };
    const singleBookingSlot = { ...enrichedSlot, capacity: 1, waitlistEnabled: false };
    const result = canCreateBooking(input, singleBookingSlot, bookings, settings.duplicatePolicy);
    if (!result.ok) {
      setMessage(result.reason);
      return;
    }
    if (result.existing) {
      setMessage(`Existing confirmation found: ${result.existing.reference}`);
      return;
    }
    const flatKey = normalizeFlat(input.wing, input.flatNumber);
    if (databaseEnabled) {
      const response = await submitAartiBooking(input);
      if (response.error || !response.booking) {
        setMessage(response.error ?? "Unable to book this slot.");
        return;
      }
      saveBookings([...bookings.filter((item) => item.id !== response.booking?.id), response.booking]);
      setMessage(`Slot booked: ${response.booking.reference}`);
      return;
    }

    const booking: AartiBooking = {
      id: crypto.randomUUID(),
      reference: bookingReference(enrichedSlot.id, flatKey, input.idempotencyKey),
      slotId: enrichedSlot.id,
      residentName: input.residentName.trim(),
      wing: input.wing.trim().toUpperCase(),
      flatNumber: input.flatNumber.trim().toUpperCase(),
      mobileHash: hashMobile(input.mobile),
      participantCount: input.participantCount,
      note: "",
      status: result.status,
      waitlistPosition: undefined,
      verifiedAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    saveBookings([...bookings, booking]);
    setMessage(`Slot booked: ${booking.reference}`);
  }

  const bookedSlots = bookings.filter((booking) => booking.status === "confirmed");

  return (
    <div className="space-y-5 lg:grid lg:grid-cols-[0.95fr_1.05fr] lg:gap-5 lg:space-y-0">
      <section className="rounded-[26px] bg-card p-4 shadow-soft lg:p-5">
        <div className="text-[11.5px] font-bold uppercase tracking-[0.14em] text-ink-soft">Step 1 · Date</div>
        <div className="-mx-1 mt-3 flex gap-2 overflow-x-auto px-1 pb-2">
          {festivalDates.map((date) => {
            const parts = dayParts(date);
            const hasSlots = displaySlots.some((slot) => slot.eventDate === date);
            const active = selectedDate === date;
            return (
              <button
                key={date}
                type="button"
                disabled={!hasSlots}
                onClick={() => {
                  const nextSlot = displaySlots.find((slot) => slot.eventDate === date);
                  setSelectedDate(date);
                  setSelectedSlotId(nextSlot?.id ?? "");
                }}
                className={`${active ? "bg-accent text-white" : "bg-surface text-ink"} ${hasSlots ? "" : "opacity-45"} flex h-[72px] w-[52px] shrink-0 flex-col items-center justify-center rounded-[16px] text-center transition-colors`}
                aria-label={`${formatDateIST(date)}${hasSlots ? "" : ", no aarti booking"}`}
              >
                <span className={`text-[10px] font-bold uppercase ${active ? "text-white/85" : "text-ink-soft"}`}>{parts.weekday}</span>
                <span className="font-latinDisplay text-[20px] leading-none">{parts.day}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-4 text-[11.5px] font-bold uppercase tracking-[0.14em] text-ink-soft">Step 2 · Slot</div>
        <div className="mt-3 grid gap-3">
          {dateSlots.map((slot) => {
            const isBooked = bookings.some((booking) => booking.slotId === slot.id && booking.status === "confirmed");
            const active = selectedSlotId === slot.id;
            return (
              <button
                key={slot.id}
                type="button"
                onClick={() => setSelectedSlotId(slot.id)}
                disabled={isBooked}
                className={`${active && !isBooked ? "border-2 border-accent2 bg-card" : isBooked ? "border border-transparent bg-surface" : "border border-ink/10 bg-card"} rounded-[20px] p-4 text-left shadow-soft transition-colors disabled:cursor-not-allowed`}
              >
                <div className="flex items-start justify-between gap-3">
                  <BiTitle en={slot.labelEn} mr={slot.labelMr} />
                  <span className={`${isBooked ? "bg-neutral-300 text-ink" : "bg-accent2 text-white"} shrink-0 rounded-pill px-3 py-1.5 text-[10.5px] font-bold uppercase tracking-[0.1em]`}>
                    {isBooked ? "Booked" : "Open"}
                  </span>
                </div>
                <div className="mt-4 flex items-baseline gap-3 border-t border-ink/10 pt-4">
                  <span className={`${isBooked ? "text-ink-soft" : "text-accent"} font-latinDisplay text-[24px] leading-none`}>{formatTimeIST(slot.startsAt).toLowerCase()}</span>
                  <span className={`${isBooked ? "text-ink-soft" : "text-ink-muted"} text-[13px] leading-5`}>
                    {isBooked ? bookedSlots.find((booking) => booking.slotId === slot.id)?.flatNumber ? bookingFlat(bookedSlots.find((booking) => booking.slotId === slot.id) as AartiBooking) : "Already booked" : `report by ${formatTimeIST(slot.reportingAt).toLowerCase()}`}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
        <p className="mt-4 text-[13px] leading-6 text-ink-muted">25 September has a morning slot only because Maha Aarti is at 4:30 pm. Cancellations close at 2:00 am on the day.</p>

        <section className="mt-6">
          <h2 className="font-latinDisplay text-[21px] leading-tight text-ink">Booked slots</h2>
          {bookedSlots.length > 0 ? (
            <ul className="mt-3 grid gap-2">
              {bookedSlots.map((booking) => {
                const slot = displaySlots.find((item) => item.id === booking.slotId);
                if (!slot) return null;
                return (
                  <li key={booking.id} className="rounded-[18px] bg-surface p-3 text-[13px] leading-5 text-ink-muted">
                    <span className="block font-bold text-ink">{formatDateIST(slot.eventDate)} · {periodText(slot.period)} · {formatTimeIST(slot.startsAt).toLowerCase()}</span>
                    <span className="block">{bookingFlat(booking)} · {booking.residentName}</span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="mt-3 rounded-[18px] bg-surface p-3 text-[13px] font-semibold text-ink-muted">No slots booked yet.</p>
          )}
        </section>
      </section>

      <section className="space-y-5">
        {enrichedSlot ? (
          <form onSubmit={submitBooking} className="rounded-t-[26px] bg-card px-5 pb-5 pt-4 shadow-[0_-8px_26px_rgba(60,35,15,.14)] lg:rounded-[26px] lg:shadow-soft">
            <div className="mx-auto mb-4 h-1 w-10 rounded-pill bg-ink/20" aria-hidden="true" />
            <h2 className="font-latinDisplay text-[21px] leading-tight text-ink">Confirm your booking</h2>
            <p className="mt-1 text-[13px] font-semibold leading-5 text-ink-soft">
              {selectedDateParts.weekday} {selectedDateParts.day} {selectedDateParts.month} · {enrichedSlot.labelEn} · {formatTimeIST(enrichedSlot.startsAt).toLowerCase()}
            </p>
            <div className="mt-4 grid grid-cols-1 gap-3 min-[380px]:grid-cols-2">
              <label className="grid gap-1.5 text-[12px] font-bold text-ink-muted min-[380px]:col-span-2">Full name<input required value={form.residentName} onChange={(e) => setForm({ ...form, residentName: e.target.value })} className="min-h-12 w-full rounded-pill border border-ink/20 px-4 text-[15px] font-normal text-ink" /></label>
              <label className="grid min-w-0 gap-1.5 text-[12px] font-bold text-ink-muted">Wing<select required value={form.wing} onChange={(e) => setForm({ ...form, wing: e.target.value })} className="min-h-12 w-full rounded-pill border border-ink/20 bg-card px-4 text-[15px] font-normal text-ink">
                {["E", "F", "G", "H"].map((wing) => <option key={wing} value={wing}>{wing}</option>)}
              </select></label>
              <label className="grid min-w-0 gap-1.5 text-[12px] font-bold text-ink-muted">Flat<input required value={form.flatNumber} onChange={(e) => setForm({ ...form, flatNumber: e.target.value })} className="min-h-12 w-full rounded-pill border border-ink/20 px-4 text-[15px] font-normal uppercase text-ink" /></label>
              <label className="grid gap-1.5 text-[12px] font-bold text-ink-muted min-[380px]:col-span-2">Mobile<input required value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} className="min-h-12 w-full rounded-pill border border-ink/20 px-4 text-[15px] font-normal text-ink" placeholder="10-digit number" /></label>
            </div>
            <button type="submit" disabled={enrichedSlot.state === "full"} className="mt-4 inline-flex min-h-12 w-full items-center justify-center rounded-pill bg-accent px-5 text-[16px] font-extrabold text-white hover:bg-accent-700 disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-ink-muted">
              Book this slot
            </button>
            {message ? <p role="status" className="mt-3 rounded-[16px] bg-accent-100 px-3 py-2 text-sm font-bold text-accent-700">{message}</p> : null}
          </form>
        ) : null}

      </section>
    </div>
  );
}
