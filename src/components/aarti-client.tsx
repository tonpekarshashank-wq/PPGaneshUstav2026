"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Search, XCircle } from "lucide-react";
import { cancelAartiBooking, submitAartiBooking } from "@/app/aarti/actions";
import { StatusBadge } from "@/components/status-badge";
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

export function AartiClient({ slots, bookings: initialBookings, settings, databaseEnabled }: Props) {
  const validDates = festivalDates.filter((date) => date !== "2026-09-14");
  const [selectedDate, setSelectedDate] = useState(validDates[0]);
  const [selectedSlotId, setSelectedSlotId] = useState(slots.find((slot) => slot.eventDate === validDates[0])?.id ?? "");
  const [bookings, setBookings] = useState<AartiBooking[]>(initialBookings);
  const [message, setMessage] = useState<string | null>(null);
  const [lookup, setLookup] = useState({ mobile: "", wing: "", flatNumber: "" });
  const [form, setForm] = useState({
    residentName: "",
    wing: "",
    flatNumber: "",
    mobile: "",
    note: "",
    consent: false
  });

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

  const dateSlots = slots.filter((slot) => slot.eventDate === selectedDate);
  const selectedSlot = slots.find((slot) => slot.id === selectedSlotId) ?? dateSlots[0];
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

    const waitlistPosition = result.status === "waitlisted" ? bookings.filter((booking) => booking.slotId === enrichedSlot.id && booking.status === "waitlisted").length + 1 : undefined;
    const booking: AartiBooking = {
      id: crypto.randomUUID(),
      reference: bookingReference(enrichedSlot.id, flatKey, input.idempotencyKey),
      slotId: enrichedSlot.id,
      residentName: input.residentName.trim(),
      wing: input.wing.trim().toUpperCase(),
      flatNumber: input.flatNumber.trim().toUpperCase(),
      mobileHash: hashMobile(input.mobile),
      participantCount: input.participantCount,
      note: input.note,
      status: result.status,
      waitlistPosition,
      verifiedAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    saveBookings([...bookings, booking]);
    setMessage(`Slot booked: ${booking.reference}`);
  }

  const ownBooking = bookings.find(
    (booking) =>
      booking.mobileHash === hashMobile(lookup.mobile) &&
      normalizeFlat(booking.wing, booking.flatNumber) === normalizeFlat(lookup.wing, lookup.flatNumber) &&
      booking.status !== "cancelled"
  );
  const bookedSlots = bookings.filter((booking) => booking.status === "confirmed");

  return (
    <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
      <section className="space-y-4 rounded-lg border border-maroon-800/10 bg-white p-4 shadow-soft">
        <h2 className="text-xl font-black text-maroon-950">Choose a slot / स्लॉट निवडा</h2>
        <label className="grid gap-1 text-sm font-bold text-maroon-800">
          Date / तारीख
          <select
            value={selectedDate}
            onChange={(event) => {
              const nextDate = event.target.value;
              setSelectedDate(nextDate);
              setSelectedSlotId(slots.find((slot) => slot.eventDate === nextDate)?.id ?? "");
            }}
            className="min-h-11 rounded-lg border border-maroon-800/20 px-3 text-base text-zinc-900"
          >
            {validDates.map((date) => (
              <option key={date} value={date}>
                {formatDateIST(date)}
              </option>
            ))}
          </select>
        </label>
        <div className="grid gap-2">
          {dateSlots.map((slot) => {
            const isBooked = bookings.some((booking) => booking.slotId === slot.id && booking.status === "confirmed");
            return (
              <button
                key={slot.id}
                type="button"
                onClick={() => setSelectedSlotId(slot.id)}
                disabled={isBooked}
                className={`min-h-16 rounded-lg border px-4 text-left disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-500 ${selectedSlotId === slot.id ? "border-maroon-600 bg-maroon-50" : "border-maroon-800/15 bg-white"}`}
              >
                <span className="block font-extrabold text-maroon-950">{slot.labelEn} / {slot.labelMr}</span>
                <span className="block text-sm text-zinc-700">{formatTimeIST(slot.startsAt)} · {isBooked ? "Booked / बुक झाले" : "Open / उपलब्ध"}</span>
              </button>
            );
          })}
        </div>
        {enrichedSlot ? (
          <div className="rounded-lg bg-saffron-50 p-3 text-sm text-maroon-900">
            <StatusBadge value={enrichedSlot.state === "full" ? "full" : "open"} />
            <p className="mt-2 font-semibold">Reporting time: {formatTimeIST(enrichedSlot.reportingAt)}. Cancellation cutoff: {formatTimeIST(enrichedSlot.bookingClosesAt)}.</p>
            <p className="mt-1">Once a slot is booked, it is blocked for other residents. 25 September has morning only because Maha Aarti is at 4:30 PM.</p>
          </div>
        ) : null}
      </section>

      <section className="space-y-5">
        <form onSubmit={submitBooking} className="grid gap-3 rounded-lg border border-maroon-800/10 bg-white p-4 shadow-soft">
          <h2 className="text-xl font-black text-maroon-950">Book Aarti Slot / आरती स्लॉट बुक करा</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1 text-sm font-bold text-maroon-800">Full name<input required value={form.residentName} onChange={(e) => setForm({ ...form, residentName: e.target.value })} className="min-h-11 rounded-lg border px-3 text-base text-zinc-900" /></label>
            <label className="grid gap-1 text-sm font-bold text-maroon-800">Mobile<input required value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} className="min-h-11 rounded-lg border px-3 text-base text-zinc-900" placeholder="+91..." /></label>
            <label className="grid gap-1 text-sm font-bold text-maroon-800">Wing<input required value={form.wing} onChange={(e) => setForm({ ...form, wing: e.target.value })} className="min-h-11 rounded-lg border px-3 text-base text-zinc-900" /></label>
            <label className="grid gap-1 text-sm font-bold text-maroon-800">Flat number<input required value={form.flatNumber} onChange={(e) => setForm({ ...form, flatNumber: e.target.value })} className="min-h-11 rounded-lg border px-3 text-base text-zinc-900" /></label>
          </div>
          <label className="grid gap-1 text-sm font-bold text-maroon-800">Note to committee<textarea value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} className="min-h-24 rounded-lg border px-3 py-2 text-base text-zinc-900" /></label>
          <label className="flex gap-3 text-sm font-semibold text-zinc-700">
            <input required type="checkbox" checked={form.consent} onChange={(e) => setForm({ ...form, consent: e.target.checked })} className="mt-1 h-5 w-5" />
            I agree that the committee may use this information only for aarti coordination. Demo verification is abstracted; production must connect OTP/admin verification.
          </label>
          <button type="submit" disabled={enrichedSlot?.state === "full"} className="inline-flex min-h-12 items-center justify-center rounded-full bg-maroon-600 px-5 font-extrabold text-white hover:bg-maroon-800 disabled:cursor-not-allowed disabled:bg-zinc-400">Book slot</button>
          {message ? <p role="status" className="rounded-lg bg-saffron-50 px-3 py-2 text-sm font-bold text-maroon-800">{message}</p> : null}
        </form>

        <section className="rounded-lg border border-maroon-800/10 bg-white p-4 shadow-soft">
          <h2 className="text-xl font-black text-maroon-950">Booked slots / बुक झालेले स्लॉट</h2>
          {bookedSlots.length > 0 ? (
            <ul className="mt-3 grid gap-2">
              {bookedSlots.map((booking) => {
                const slot = slots.find((item) => item.id === booking.slotId);
                if (!slot) return null;
                return (
                  <li key={booking.id} className="rounded-lg bg-saffron-50 p-3 text-sm text-maroon-900">
                    <span className="block font-bold">{formatDateIST(slot.eventDate)} · {slot.labelEn} / {slot.labelMr}</span>
                    <span className="block text-zinc-700">{formatTimeIST(slot.startsAt)} · Booked · Ref {booking.reference}</span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="mt-3 rounded-lg bg-zinc-100 p-3 text-sm font-semibold text-zinc-700">No slots booked yet.</p>
          )}
        </section>

        <section className="rounded-lg border border-maroon-800/10 bg-white p-4 shadow-soft">
          <h2 className="flex items-center gap-2 text-xl font-black text-maroon-950"><Search size={20} /> Find my booking / माझी नोंदणी शोधा</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <input aria-label="Lookup mobile" value={lookup.mobile} onChange={(e) => setLookup({ ...lookup, mobile: e.target.value })} className="min-h-11 rounded-lg border px-3 text-base" placeholder="Mobile" />
            <input aria-label="Lookup wing" value={lookup.wing} onChange={(e) => setLookup({ ...lookup, wing: e.target.value })} className="min-h-11 rounded-lg border px-3 text-base" placeholder="Wing" />
            <input aria-label="Lookup flat" value={lookup.flatNumber} onChange={(e) => setLookup({ ...lookup, flatNumber: e.target.value })} className="min-h-11 rounded-lg border px-3 text-base" placeholder="Flat" />
          </div>
          {lookup.mobile && lookup.wing && lookup.flatNumber ? (
            ownBooking ? (
              <div className="mt-4 rounded-lg bg-leaf-50 p-3 text-sm text-leaf-700">
                <p className="flex items-center gap-2 font-bold"><CheckCircle2 size={18} /> {ownBooking.reference} · {ownBooking.status}</p>
                <button
                  type="button"
                  onClick={async () => {
                    if (databaseEnabled) {
                      const result = await cancelAartiBooking(ownBooking.reference, ownBooking.mobileHash);
                      if (!result.ok) {
                        setMessage(result.error ?? "Unable to cancel booking.");
                        return;
                      }
                    }
                    saveBookings(bookings.map((booking) => booking.id === ownBooking.id ? { ...booking, status: "cancelled", cancelledAt: new Date().toISOString() } : booking));
                  }}
                  className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-full bg-maroon-600 px-4 font-bold text-white"
                >
                  <XCircle size={16} /> Cancel booking
                </button>
              </div>
            ) : (
              <p className="mt-4 rounded-lg bg-zinc-100 p-3 text-sm font-semibold text-zinc-700">No active booking found for these details.</p>
            )
          ) : null}
        </section>
      </section>
    </div>
  );
}
