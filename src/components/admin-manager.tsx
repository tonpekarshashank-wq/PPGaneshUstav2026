"use client";

import { useMemo, useState } from "react";
import {
  saveAnnouncementToDatabase,
  saveBookingToDatabase,
  saveEventToDatabase,
  saveWinnerToDatabase
} from "@/app/admin/neon-actions";
import { CalendarPlus, Megaphone, Save, Trophy, Wand2 } from "lucide-react";
import { adminStorageKeys, readAdminEditableData, writeStorageList } from "@/lib/local-storage";
import type { AartiBooking, AartiSlot, Activity, Announcement, ContentStatus, EventState, FestivalEvent, Winner } from "@/lib/types";
import { bookingsToCsv } from "@/lib/csv";
import { formatDateIST, formatTimeIST } from "@/lib/time";

type Props = {
  announcements: Announcement[];
  events: FestivalEvent[];
  bookings: AartiBooking[];
  slots: AartiSlot[];
  activities: Activity[];
  winners: Winner[];
  databaseEnabled: boolean;
};

const statusOptions: ContentStatus[] = ["draft", "published", "archived"];
const eventStateOptions: EventState[] = ["scheduled", "updated", "cancelled", "completed"];

export function AdminManager(props: Props) {
  const initial = useMemo(
    () =>
      readAdminEditableData({
        announcements: props.announcements,
        events: props.events,
        bookings: props.bookings,
        winners: props.winners
      }),
    [props.announcements, props.bookings, props.events, props.winners]
  );
  const [announcements, setAnnouncements] = useState(initial.announcements);
  const [events, setEvents] = useState(initial.events);
  const [bookings, setBookings] = useState(initial.bookings);
  const [winners, setWinners] = useState(initial.winners);
  const [message, setMessage] = useState("Changes are saved locally in this browser.");

  async function saveAnnouncements(next: Announcement[], changed?: Announcement) {
    setAnnouncements(next);
    if (props.databaseEnabled && changed) {
      await saveAnnouncementToDatabase(changed);
      setMessage("Announcement saved to Neon.");
    } else {
      writeStorageList(adminStorageKeys.announcements, next);
      setMessage("Announcements saved locally.");
    }
  }

  async function saveEvents(next: FestivalEvent[], changed?: FestivalEvent) {
    setEvents(next);
    if (props.databaseEnabled && changed) {
      await saveEventToDatabase(changed);
      setMessage("Schedule saved to Neon.");
    } else {
      writeStorageList(adminStorageKeys.events, next);
      setMessage("Schedule saved locally.");
    }
  }

  async function saveBookings(next: AartiBooking[], changed?: AartiBooking) {
    setBookings(next);
    if (props.databaseEnabled && changed) {
      await saveBookingToDatabase(changed);
      setMessage("Aarti booking saved to Neon.");
    } else {
      writeStorageList(adminStorageKeys.bookings, next);
      setMessage("Aarti bookings saved locally.");
    }
  }

  async function saveWinners(next: Winner[], changed?: Winner) {
    setWinners(next);
    if (props.databaseEnabled && changed) {
      await saveWinnerToDatabase(changed);
      setMessage("Winner details saved to Neon.");
    } else {
      writeStorageList(adminStorageKeys.winners, next);
      setMessage("Winner details saved locally.");
    }
  }

  function updateAnnouncement(id: string, patch: Partial<Announcement>) {
    const changed = announcements.find((item) => item.id === id);
    if (!changed) return;
    const updated = { ...changed, ...patch };
    saveAnnouncements(announcements.map((item) => (item.id === id ? updated : item)), updated);
  }

  function updateEvent(id: string, patch: Partial<FestivalEvent>) {
    const changed = events.find((item) => item.id === id);
    if (!changed) return;
    const updated = { ...changed, ...patch };
    saveEvents(events.map((item) => (item.id === id ? updated : item)), updated);
  }

  function updateBooking(id: string, patch: Partial<AartiBooking>) {
    const changed = bookings.find((item) => item.id === id);
    if (!changed) return;
    const updated = { ...changed, ...patch, cancelledAt: patch.status === "cancelled" ? new Date().toISOString() : changed.cancelledAt };
    saveBookings(bookings.map((item) => (item.id === id ? updated : item)), updated);
  }

  function updateWinner(id: string, patch: Partial<Winner>) {
    const changed = winners.find((item) => item.id === id);
    if (!changed) return;
    const updated = { ...changed, ...patch };
    saveWinners(winners.map((item) => (item.id === id ? updated : item)), updated);
  }

  function addEvent() {
    const index = events.length + 1;
    const startsAt = "2026-09-14T18:00:00+05:30";
    const next: FestivalEvent = {
      id: `event-custom-${Date.now()}`,
      slug: `custom-schedule-${Date.now()}`,
      nameEn: `New schedule item ${index}`,
      nameMr: `नवीन कार्यक्रम ${index}`,
      descriptionEn: "Add details for this schedule item.",
      descriptionMr: "या कार्यक्रमाचे तपशील भरा.",
      startsAt,
      endsAt: "2026-09-14T19:00:00+05:30",
      venueEn: "Palladium Plus Society",
      venueMr: "पॅलेडियम प्लस सोसायटी",
      category: "Community",
      state: "scheduled",
      status: "draft",
      displayOrder: index
    };
    saveEvents([...events, next], next);
  }

  function addWinner() {
    const activity = props.activities[0];
    if (!activity) return;
    const next: Winner = {
      id: `winner-custom-${Date.now()}`,
      activityId: activity.id,
      rankOrder: 1,
      prizeEn: "First Prize",
      prizeMr: "प्रथम पारितोषिक",
      displayName: "New winner",
      consentToPublish: false,
      status: "draft"
    };
    saveWinners([...winners, next], next);
  }

  const csv = bookingsToCsv(bookings, props.slots);

  return (
    <div className="space-y-5">
      <p role="status" className="rounded-lg bg-saffron-50 px-4 py-3 text-sm font-bold text-maroon-900">{message}</p>

      <section className="rounded-lg border border-maroon-800/10 bg-white p-4 shadow-soft">
        <SectionHeading icon={<Megaphone size={20} />} title="Announcements" actionLabel="Save happens automatically" />
        <div className="mt-4 grid gap-4">
          {announcements.map((announcement) => (
            <article key={announcement.id} className="grid gap-3 rounded-lg bg-saffron-50 p-3">
              <div className="grid gap-3 md:grid-cols-2">
                <TextInput label="English title" value={announcement.titleEn} onChange={(value) => updateAnnouncement(announcement.id, { titleEn: value })} />
                <TextInput label="Marathi title" value={announcement.titleMr} onChange={(value) => updateAnnouncement(announcement.id, { titleMr: value })} />
              </div>
              <TextArea label="English body" value={announcement.bodyEn} onChange={(value) => updateAnnouncement(announcement.id, { bodyEn: value })} />
              <TextArea label="Marathi body" value={announcement.bodyMr} onChange={(value) => updateAnnouncement(announcement.id, { bodyMr: value })} />
              <div className="grid gap-3 md:grid-cols-3">
                <SelectInput label="Status" value={announcement.status} options={statusOptions} onChange={(value) => updateAnnouncement(announcement.id, { status: value as ContentStatus })} />
                <SelectInput label="Severity" value={announcement.severity} options={["information", "important", "urgent"]} onChange={(value) => updateAnnouncement(announcement.id, { severity: value as Announcement["severity"] })} />
                <label className="flex min-h-11 items-center gap-2 text-sm font-bold text-maroon-800">
                  <input type="checkbox" checked={announcement.isPinned} onChange={(event) => updateAnnouncement(announcement.id, { isPinned: event.target.checked })} className="h-5 w-5" />
                  Pinned
                </label>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-maroon-800/10 bg-white p-4 shadow-soft">
        <SectionHeading icon={<CalendarPlus size={20} />} title="Schedule" actionLabel="Add schedule item" onAction={addEvent} />
        <div className="mt-4 grid gap-4">
          {events.map((event) => (
            <article key={event.id} className="grid gap-3 rounded-lg bg-saffron-50 p-3">
              <div className="grid gap-3 md:grid-cols-2">
                <TextInput label="English name" value={event.nameEn} onChange={(value) => updateEvent(event.id, { nameEn: value })} />
                <TextInput label="Marathi name" value={event.nameMr} onChange={(value) => updateEvent(event.id, { nameMr: value })} />
                <TextInput label="Start date/time" type="datetime-local" value={toLocalInput(event.startsAt)} onChange={(value) => updateEvent(event.id, { startsAt: fromLocalInput(value) })} />
                <TextInput label="End date/time" type="datetime-local" value={toLocalInput(event.endsAt)} onChange={(value) => updateEvent(event.id, { endsAt: fromLocalInput(value) })} />
                <TextInput label="Venue EN" value={event.venueEn} onChange={(value) => updateEvent(event.id, { venueEn: value })} />
                <TextInput label="Venue MR" value={event.venueMr} onChange={(value) => updateEvent(event.id, { venueMr: value })} />
                <TextInput label="Category" value={event.category} onChange={(value) => updateEvent(event.id, { category: value })} />
                <SelectInput label="State" value={event.state} options={eventStateOptions} onChange={(value) => updateEvent(event.id, { state: value as EventState })} />
                <SelectInput label="Status" value={event.status} options={statusOptions} onChange={(value) => updateEvent(event.id, { status: value as ContentStatus })} />
              </div>
              <TextArea label="English description" value={event.descriptionEn} onChange={(value) => updateEvent(event.id, { descriptionEn: value })} />
              <TextArea label="Marathi description" value={event.descriptionMr} onChange={(value) => updateEvent(event.id, { descriptionMr: value })} />
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-maroon-800/10 bg-white p-4 shadow-soft">
        <SectionHeading icon={<Wand2 size={20} />} title="Aarti Bookings" actionLabel="Export CSV" href={`data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`} download="aarti-bookings.csv" />
        <div className="mt-4 grid gap-3">
          {bookings.length > 0 ? (
            bookings.map((booking) => {
              const slot = props.slots.find((item) => item.id === booking.slotId);
              return (
                <article key={booking.id} className="grid gap-3 rounded-lg bg-saffron-50 p-3 md:grid-cols-[1fr_1fr_1fr_auto] md:items-end">
                  <div className="text-sm text-maroon-900">
                    <p className="font-black">{slot ? `${formatDateIST(slot.eventDate)} · ${slot.labelEn}` : booking.slotId}</p>
                    <p>{slot ? formatTimeIST(slot.startsAt) : ""} · {booking.reference}</p>
                  </div>
                  <TextInput label="Resident name" value={booking.residentName} onChange={(value) => updateBooking(booking.id, { residentName: value })} />
                  <div className="grid grid-cols-2 gap-2">
                    <TextInput label="Wing" value={booking.wing} onChange={(value) => updateBooking(booking.id, { wing: value.toUpperCase() })} />
                    <TextInput label="Flat" value={booking.flatNumber} onChange={(value) => updateBooking(booking.id, { flatNumber: value.toUpperCase() })} />
                  </div>
                  <SelectInput label="Status" value={booking.status} options={["confirmed", "waitlisted", "cancelled"]} onChange={(value) => updateBooking(booking.id, { status: value as AartiBooking["status"] })} />
                  <div className="md:col-span-4">
                    <TextArea label="Admin note" value={booking.note ?? ""} onChange={(value) => updateBooking(booking.id, { note: value })} />
                  </div>
                </article>
              );
            })
          ) : (
            <p className="rounded-lg bg-zinc-100 p-3 text-sm font-semibold text-zinc-700">No aarti bookings found yet. Book a slot from the Aarti Seva page, then return here.</p>
          )}
        </div>
      </section>

      <section className="rounded-lg border border-maroon-800/10 bg-white p-4 shadow-soft">
        <SectionHeading icon={<Trophy size={20} />} title="Winners" actionLabel="Add winner" onAction={addWinner} />
        <div className="mt-4 grid gap-4">
          {winners.map((winner) => (
            <article key={winner.id} className="grid gap-3 rounded-lg bg-saffron-50 p-3">
              <div className="grid gap-3 md:grid-cols-3">
                <SelectInput label="Activity" value={winner.activityId} options={props.activities.map((activity) => activity.id)} optionLabels={Object.fromEntries(props.activities.map((activity) => [activity.id, activity.nameEn]))} onChange={(value) => updateWinner(winner.id, { activityId: value })} />
                <TextInput label="Display name" value={winner.displayName} onChange={(value) => updateWinner(winner.id, { displayName: value })} />
                <TextInput label="Rank order" type="number" value={String(winner.rankOrder)} onChange={(value) => updateWinner(winner.id, { rankOrder: Number(value) || 1 })} />
                <TextInput label="Prize EN" value={winner.prizeEn} onChange={(value) => updateWinner(winner.id, { prizeEn: value })} />
                <TextInput label="Prize MR" value={winner.prizeMr} onChange={(value) => updateWinner(winner.id, { prizeMr: value })} />
                <SelectInput label="Status" value={winner.status} options={statusOptions} onChange={(value) => updateWinner(winner.id, { status: value as ContentStatus })} />
                <TextInput label="Wing" value={winner.wing ?? ""} onChange={(value) => updateWinner(winner.id, { wing: value })} />
                <TextInput label="Flat" value={winner.flatNumber ?? ""} onChange={(value) => updateWinner(winner.id, { flatNumber: value })} />
                <TextInput label="Image URL" value={winner.imageUrl ?? ""} onChange={(value) => updateWinner(winner.id, { imageUrl: value })} />
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <TextArea label="Note EN" value={winner.noteEn ?? ""} onChange={(value) => updateWinner(winner.id, { noteEn: value })} />
                <TextArea label="Note MR" value={winner.noteMr ?? ""} onChange={(value) => updateWinner(winner.id, { noteMr: value })} />
              </div>
              <label className="flex min-h-11 items-center gap-2 text-sm font-bold text-maroon-800">
                <input type="checkbox" checked={winner.consentToPublish} onChange={(event) => updateWinner(winner.id, { consentToPublish: event.target.checked })} className="h-5 w-5" />
                Consent to publish name/details
              </label>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function SectionHeading({
  icon,
  title,
  actionLabel,
  onAction,
  href,
  download
}: {
  icon: React.ReactNode;
  title: string;
  actionLabel?: string;
  onAction?: () => void;
  href?: string;
  download?: string;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2 text-maroon-950">
        {icon}
        <h2 className="text-xl font-black">{title}</h2>
      </div>
      {href ? (
        <a href={href} download={download} className="inline-flex min-h-10 items-center gap-2 rounded-full bg-maroon-600 px-4 text-sm font-bold text-white">
          <Save size={16} aria-hidden="true" />
          {actionLabel}
        </a>
      ) : onAction ? (
        <button type="button" onClick={onAction} className="inline-flex min-h-10 items-center gap-2 rounded-full bg-maroon-600 px-4 text-sm font-bold text-white">
          <Save size={16} aria-hidden="true" />
          {actionLabel}
        </button>
      ) : (
        <span className="text-sm font-semibold text-zinc-600">{actionLabel}</span>
      )}
    </div>
  );
}

function TextInput({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return (
    <label className="grid gap-1 text-sm font-bold text-maroon-800">
      {label}
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} className="min-h-11 rounded-lg border border-maroon-800/20 bg-white px-3 text-base font-normal text-zinc-900" />
    </label>
  );
}

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-1 text-sm font-bold text-maroon-800">
      {label}
      <textarea value={value} onChange={(event) => onChange(event.target.value)} className="min-h-24 rounded-lg border border-maroon-800/20 bg-white px-3 py-2 text-base font-normal text-zinc-900" />
    </label>
  );
}

function SelectInput({
  label,
  value,
  options,
  optionLabels,
  onChange
}: {
  label: string;
  value: string;
  options: string[];
  optionLabels?: Record<string, string>;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-1 text-sm font-bold text-maroon-800">
      {label}
      <select value={value} onChange={(event) => onChange(event.target.value)} className="min-h-11 rounded-lg border border-maroon-800/20 bg-white px-3 text-base font-normal text-zinc-900">
        {options.map((option) => (
          <option key={option} value={option}>
            {optionLabels?.[option] ?? option}
          </option>
        ))}
      </select>
    </label>
  );
}

function toLocalInput(iso: string) {
  return iso.slice(0, 16);
}

function fromLocalInput(value: string) {
  return `${value}:00+05:30`;
}
