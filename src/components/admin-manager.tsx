"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  saveAnnouncementToDatabase,
  saveBookingToDatabase,
  saveEventToDatabase,
  saveWinnerToDatabase
} from "@/app/admin/neon-actions";
import { CalendarPlus, ChevronDown, Download, Megaphone, Plus, Save, Trophy, Wand2 } from "lucide-react";
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

type AdminTab = "bookings" | "events" | "results" | "announcements";

const statusOptions: ContentStatus[] = ["draft", "published", "archived"];
const eventStateOptions: EventState[] = ["scheduled", "updated", "cancelled", "completed"];
const bookingStatusOptions: AartiBooking["status"][] = ["confirmed", "waitlisted", "cancelled"];

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
  const [activeTab, setActiveTab] = useState<AdminTab>("bookings");
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);
  const [expandedAnnouncementId, setExpandedAnnouncementId] = useState<string | null>(null);
  const [announcements, setAnnouncements] = useState(initial.announcements);
  const [events, setEvents] = useState(initial.events);
  const [bookings, setBookings] = useState(initial.bookings);
  const [winners, setWinners] = useState(initial.winners);
  const [message, setMessage] = useState(props.databaseEnabled ? "Changes save to Neon automatically." : "Changes are saved locally in this browser.");

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

  function updateAnnouncementDraft(id: string, patch: Partial<Announcement>) {
    const changed = announcements.find((item) => item.id === id);
    if (!changed) return;
    const updated = { ...changed, ...patch };
    setAnnouncements(announcements.map((item) => (item.id === id ? updated : item)));
    setMessage("Announcement changes are ready. Click Save on the expanded row.");
  }

  function saveAnnouncementDraft(id: string) {
    const changed = announcements.find((item) => item.id === id);
    if (!changed) return;
    saveAnnouncements(announcements, changed);
  }

  function addAnnouncement() {
    const now = Date.now();
    const next: Announcement = {
      id: `ann-custom-${now}`,
      titleEn: "New announcement",
      titleMr: "नवीन सूचना",
      bodyEn: "Add announcement details for residents.",
      bodyMr: "रहिवाशांसाठी सूचनेचे तपशील भरा.",
      severity: "information",
      startsAt: "2026-09-01T08:00:00+05:30",
      endsAt: "2026-09-25T23:00:00+05:30",
      isPinned: false,
      status: "draft"
    };
    setAnnouncements([next, ...announcements]);
    setExpandedAnnouncementId(next.id);
    setMessage("New announcement added. Review it, then click Save.");
  }

  function updateEventDraft(id: string, patch: Partial<FestivalEvent>) {
    const changed = events.find((item) => item.id === id);
    if (!changed) return;
    const updated = { ...changed, ...patch };
    setEvents(events.map((item) => (item.id === id ? updated : item)));
    setMessage("Schedule changes are ready. Click Save on the expanded row.");
  }

  function saveEventDraft(id: string) {
    const changed = events.find((item) => item.id === id);
    if (!changed) return;
    saveEvents(events, changed);
  }

  function addEvent() {
    const index = events.length + 1;
    const now = Date.now();
    const next: FestivalEvent = {
      id: `event-custom-${now}`,
      slug: `custom-schedule-${now}`,
      nameEn: `New schedule item ${index}`,
      nameMr: `नवीन कार्यक्रम ${index}`,
      descriptionEn: "Add details for this schedule item.",
      descriptionMr: "या कार्यक्रमाचे तपशील भरा.",
      startsAt: "2026-09-14T18:00:00+05:30",
      endsAt: "2026-09-14T19:00:00+05:30",
      venueEn: "Palladium Plus Society",
      venueMr: "पॅलेडियम प्लस सोसायटी",
      category: "Community",
      state: "scheduled",
      status: "draft",
      displayOrder: index
    };
    setEvents([...events, next]);
    setExpandedEventId(next.id);
    setMessage("New schedule item added. Review it, then click Save.");
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
  const tabs: { id: AdminTab; label: string; count: number }[] = [
    { id: "bookings", label: "Bookings", count: bookings.length },
    { id: "events", label: "Events", count: events.length },
    { id: "results", label: "Results", count: winners.length },
    { id: "announcements", label: "Announcements", count: announcements.length }
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`${activeTab === tab.id ? "bg-ink text-bg" : "border border-ink/20 text-ink"} shrink-0 rounded-pill px-4 py-2.5 text-[12.5px] font-bold`}
            >
              {tab.label} {tab.count}
            </button>
          ))}
        </div>
        <p role="status" className="rounded-pill bg-accent-100 px-4 py-2 text-[12.5px] font-bold text-accent-700">{message}</p>
      </div>

      {activeTab === "bookings" ? (
        <Panel
          icon={<Wand2 size={20} />}
          title="Aarti Bookings"
          action={
            <a href={`data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`} download="aarti-bookings.csv" className="inline-flex min-h-10 items-center gap-2 rounded-pill bg-accent px-4 text-sm font-bold text-white hover:bg-accent-700">
              <Download size={16} aria-hidden="true" />
              Export CSV
            </a>
          }
        >
          <BookingsTable bookings={bookings} slots={props.slots} onChange={updateBooking} />
        </Panel>
      ) : null}

      {activeTab === "events" ? (
        <Panel
          icon={<CalendarPlus size={20} />}
          title="Events"
          action={<ActionButton onClick={addEvent}>Add schedule item</ActionButton>}
        >
          <EventsTable
            events={events}
            expandedEventId={expandedEventId}
            onToggle={(id) => setExpandedEventId(expandedEventId === id ? null : id)}
            onChange={updateEventDraft}
            onSave={saveEventDraft}
          />
        </Panel>
      ) : null}

      {activeTab === "results" ? (
        <Panel
          icon={<Trophy size={20} />}
          title="Results"
          action={<ActionButton onClick={addWinner}>Add winner</ActionButton>}
        >
          <div className="grid gap-3">
            {winners.map((winner) => (
              <article key={winner.id} className="rounded-[18px] bg-surface p-4">
                <div className="grid gap-3 lg:grid-cols-3">
                  <SelectInput label="Activity" value={winner.activityId} options={props.activities.map((activity) => activity.id)} optionLabels={Object.fromEntries(props.activities.map((activity) => [activity.id, activity.nameEn]))} onChange={(value) => updateWinner(winner.id, { activityId: value })} />
                  <TextInput label="Display name" value={winner.displayName} onChange={(value) => updateWinner(winner.id, { displayName: value })} />
                  <TextInput label="Rank order" type="number" value={String(winner.rankOrder)} onChange={(value) => updateWinner(winner.id, { rankOrder: Number(value) || 1 })} />
                  <TextInput label="Prize EN" value={winner.prizeEn} onChange={(value) => updateWinner(winner.id, { prizeEn: value })} />
                  <TextInput label="Prize MR" value={winner.prizeMr} onChange={(value) => updateWinner(winner.id, { prizeMr: value })} />
                  <SelectInput label="Status" value={winner.status} options={statusOptions} onChange={(value) => updateWinner(winner.id, { status: value as ContentStatus })} />
                  <TextInput label="Wing" value={winner.wing ?? ""} onChange={(value) => updateWinner(winner.id, { wing: value.toUpperCase() })} />
                  <TextInput label="Flat" value={winner.flatNumber ?? ""} onChange={(value) => updateWinner(winner.id, { flatNumber: value.toUpperCase() })} />
                  <TextInput label="Image URL" value={winner.imageUrl ?? ""} onChange={(value) => updateWinner(winner.id, { imageUrl: value })} />
                </div>
                <div className="mt-3 grid gap-3 lg:grid-cols-2">
                  <TextArea label="Note EN" value={winner.noteEn ?? ""} onChange={(value) => updateWinner(winner.id, { noteEn: value })} />
                  <TextArea label="Note MR" value={winner.noteMr ?? ""} onChange={(value) => updateWinner(winner.id, { noteMr: value })} />
                </div>
                <label className="mt-3 flex min-h-10 items-center gap-2 text-sm font-bold text-ink-muted">
                  <input type="checkbox" checked={winner.consentToPublish} onChange={(event) => updateWinner(winner.id, { consentToPublish: event.target.checked })} className="h-5 w-5 accent-[var(--color-accent)]" />
                  Consent to publish name/details
                </label>
              </article>
            ))}
          </div>
        </Panel>
      ) : null}

      {activeTab === "announcements" ? (
        <Panel
          icon={<Megaphone size={20} />}
          title="Announcements"
          action={<ActionButton onClick={addAnnouncement}>Add announcement</ActionButton>}
        >
          <AnnouncementsTable
            announcements={announcements}
            expandedAnnouncementId={expandedAnnouncementId}
            onToggle={(id) => setExpandedAnnouncementId(expandedAnnouncementId === id ? null : id)}
            onChange={updateAnnouncementDraft}
            onSave={saveAnnouncementDraft}
          />
        </Panel>
      ) : null}
    </div>
  );
}

function BookingsTable({ bookings, slots, onChange }: { bookings: AartiBooking[]; slots: AartiSlot[]; onChange: (id: string, patch: Partial<AartiBooking>) => void }) {
  if (bookings.length === 0) {
    return <p className="rounded-[18px] bg-surface p-4 text-sm font-semibold text-ink-muted">No aarti bookings found yet.</p>;
  }
  const sortedBookings = [...bookings].sort((a, b) => adminBookingSlotTime(a, slots).localeCompare(adminBookingSlotTime(b, slots)));

  return (
    <div className="overflow-hidden rounded-[20px] bg-card shadow-soft">
      <div className="hidden bg-surface px-4 py-3 text-[10.5px] font-bold uppercase tracking-[0.12em] text-ink-muted min-[900px]:grid min-[900px]:grid-cols-[1.1fr_1.25fr_.7fr_.9fr_.9fr_.7fr]">
        <div>Date & slot</div>
        <div>Resident</div>
        <div>Flat</div>
        <div>Mobile</div>
        <div>Status</div>
        <div className="text-right">Action</div>
      </div>
      {sortedBookings.map((booking) => {
        const slot = slots.find((item) => item.id === booking.slotId);
        return (
          <article key={booking.id} className="grid gap-3 border-t border-ink/10 p-4 text-sm text-ink min-[900px]:grid-cols-[1.1fr_1.25fr_.7fr_.9fr_.9fr_.7fr] min-[900px]:items-center">
            <div>
              <p className="font-bold">{slot ? `${formatDateIST(slot.eventDate)} · ${formatTimeIST(slot.startsAt)}` : booking.slotId}</p>
              <p className="text-[12.5px] text-ink-soft">{slot?.labelEn ?? "Aarti slot"}</p>
            </div>
            <TextInput label="Resident" value={booking.residentName} onChange={(value) => onChange(booking.id, { residentName: value })} compact />
            <div className="grid grid-cols-2 gap-2">
              <TextInput label="Wing" value={booking.wing} onChange={(value) => onChange(booking.id, { wing: value.toUpperCase() })} compact />
              <TextInput label="Flat" value={booking.flatNumber} onChange={(value) => onChange(booking.id, { flatNumber: value.toUpperCase() })} compact />
            </div>
            <p className="text-ink-muted">{booking.mobileNumber ?? "Not captured"}</p>
            <SelectInput label="Status" value={booking.status} options={bookingStatusOptions} onChange={(value) => onChange(booking.id, { status: value as AartiBooking["status"] })} compact />
            <button type="button" onClick={() => onChange(booking.id, { status: booking.status === "cancelled" ? "confirmed" : "cancelled" })} className="text-left text-[12.5px] font-bold text-accent-700 min-[900px]:text-right">
              {booking.status === "cancelled" ? "Restore" : "Cancel"}
            </button>
          </article>
        );
      })}
    </div>
  );
}

function adminBookingSlotTime(booking: AartiBooking, slots: AartiSlot[]) {
  return slots.find((slot) => slot.id === booking.slotId)?.startsAt ?? booking.createdAt;
}

function EventsTable({
  events,
  expandedEventId,
  onToggle,
  onChange,
  onSave
}: {
  events: FestivalEvent[];
  expandedEventId: string | null;
  onToggle: (id: string) => void;
  onChange: (id: string, patch: Partial<FestivalEvent>) => void;
  onSave: (id: string) => void;
}) {
  if (events.length === 0) {
    return <p className="rounded-[18px] bg-surface p-4 text-sm font-semibold text-ink-muted">No schedule events found.</p>;
  }

  return (
    <div className="overflow-hidden rounded-[20px] bg-card shadow-soft">
      <div className="hidden bg-surface px-4 py-3 text-[10.5px] font-bold uppercase tracking-[0.12em] text-ink-muted min-[900px]:grid min-[900px]:grid-cols-[1fr_1.7fr_.85fr_.9fr_.8fr_.6fr]">
        <div>Date & time</div>
        <div>Event</div>
        <div>Category</div>
        <div>Venue</div>
        <div>Status</div>
        <div className="text-right">Edit</div>
      </div>
      {events.map((event) => {
        const expanded = expandedEventId === event.id;
        return (
          <article key={event.id} className="border-t border-ink/10">
            <button
              type="button"
              onClick={() => onToggle(event.id)}
              className="grid w-full gap-3 p-4 text-left text-sm text-ink min-[900px]:grid-cols-[1fr_1.7fr_.85fr_.9fr_.8fr_.6fr] min-[900px]:items-center"
              aria-expanded={expanded}
            >
              <div>
                <p className="font-bold">{formatDateIST(event.startsAt)}</p>
                <p className="text-[12.5px] text-ink-soft">{formatTimeIST(event.startsAt)} - {formatTimeIST(event.endsAt)}</p>
              </div>
              <div className="min-w-0">
                <p className="truncate font-bold">{event.nameEn}</p>
                <p className="truncate text-[12.5px] text-ink-soft" lang="mr">{event.nameMr}</p>
              </div>
              <p className="text-ink-muted">{event.category}</p>
              <p className="truncate text-ink-muted">{event.venueEn}</p>
              <div className="flex flex-wrap gap-2">
                <StatusTag tone={event.status === "published" ? "success" : event.status === "draft" ? "pending" : "neutral"}>{event.status}</StatusTag>
                {event.state === "cancelled" ? <StatusTag tone="danger">cancelled</StatusTag> : null}
              </div>
              <span className="flex items-center gap-1 text-[12.5px] font-bold text-accent-700 min-[900px]:justify-end">
                {expanded ? "Close" : "Edit"}
                <ChevronDown className={`${expanded ? "rotate-180" : ""} transition-transform`} size={16} aria-hidden="true" />
              </span>
            </button>

            {expanded ? (
              <div className="border-t border-ink/10 bg-surface p-4">
                <div className="grid gap-3 lg:grid-cols-3">
                  <TextInput label="English name" value={event.nameEn} onChange={(value) => onChange(event.id, { nameEn: value })} />
                  <TextInput label="Marathi name" value={event.nameMr} onChange={(value) => onChange(event.id, { nameMr: value })} />
                  <SelectInput label="Status" value={event.status} options={statusOptions} onChange={(value) => onChange(event.id, { status: value as ContentStatus })} />
                  <TextInput label="Start" type="datetime-local" value={toLocalInput(event.startsAt)} onChange={(value) => onChange(event.id, { startsAt: fromLocalInput(value) })} />
                  <TextInput label="End" type="datetime-local" value={toLocalInput(event.endsAt)} onChange={(value) => onChange(event.id, { endsAt: fromLocalInput(value) })} />
                  <SelectInput label="State" value={event.state} options={eventStateOptions} onChange={(value) => onChange(event.id, { state: value as EventState })} />
                  <TextInput label="Venue EN" value={event.venueEn} onChange={(value) => onChange(event.id, { venueEn: value })} />
                  <TextInput label="Venue MR" value={event.venueMr} onChange={(value) => onChange(event.id, { venueMr: value })} />
                  <TextInput label="Category" value={event.category} onChange={(value) => onChange(event.id, { category: value })} />
                </div>
                <div className="mt-3 grid gap-3 lg:grid-cols-2">
                  <TextArea label="English description" value={event.descriptionEn} onChange={(value) => onChange(event.id, { descriptionEn: value })} />
                  <TextArea label="Marathi description" value={event.descriptionMr} onChange={(value) => onChange(event.id, { descriptionMr: value })} />
                </div>
                <div className="mt-4 flex justify-end">
                  <button type="button" onClick={() => onSave(event.id)} className="inline-flex min-h-10 items-center gap-2 rounded-pill bg-accent px-4 text-sm font-bold text-white hover:bg-accent-700">
                    <Save size={16} aria-hidden="true" />
                    Save changes
                  </button>
                </div>
              </div>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}

function AnnouncementsTable({
  announcements,
  expandedAnnouncementId,
  onToggle,
  onChange,
  onSave
}: {
  announcements: Announcement[];
  expandedAnnouncementId: string | null;
  onToggle: (id: string) => void;
  onChange: (id: string, patch: Partial<Announcement>) => void;
  onSave: (id: string) => void;
}) {
  if (announcements.length === 0) {
    return <p className="rounded-[18px] bg-surface p-4 text-sm font-semibold text-ink-muted">No announcements found.</p>;
  }

  return (
    <div className="overflow-hidden rounded-[20px] bg-card shadow-soft">
      <div className="hidden bg-surface px-4 py-3 text-[10.5px] font-bold uppercase tracking-[0.12em] text-ink-muted min-[900px]:grid min-[900px]:grid-cols-[1.8fr_1fr_.9fr_.9fr_.6fr]">
        <div>Announcement</div>
        <div>Window</div>
        <div>Severity</div>
        <div>Status</div>
        <div className="text-right">Edit</div>
      </div>
      {announcements.map((announcement) => {
        const expanded = expandedAnnouncementId === announcement.id;
        return (
          <article key={announcement.id} className="border-t border-ink/10">
            <button
              type="button"
              onClick={() => onToggle(announcement.id)}
              className="grid w-full gap-3 p-4 text-left text-sm text-ink min-[900px]:grid-cols-[1.8fr_1fr_.9fr_.9fr_.6fr] min-[900px]:items-center"
              aria-expanded={expanded}
            >
              <div className="min-w-0">
                <p className="truncate font-bold">{announcement.titleEn}</p>
                <p className="truncate text-[12.5px] text-ink-soft" lang="mr">{announcement.titleMr}</p>
              </div>
              <div>
                <p className="font-bold">{formatDateIST(announcement.startsAt)}</p>
                <p className="text-[12.5px] text-ink-soft">to {formatDateIST(announcement.endsAt)}</p>
              </div>
              <StatusTag tone={announcement.severity === "urgent" ? "danger" : announcement.severity === "important" ? "pending" : "neutral"}>{announcement.severity}</StatusTag>
              <div className="flex flex-wrap gap-2">
                <StatusTag tone={announcement.status === "published" ? "success" : announcement.status === "draft" ? "pending" : "neutral"}>{announcement.status}</StatusTag>
                {announcement.isPinned ? <StatusTag tone="success">Pinned</StatusTag> : null}
              </div>
              <span className="flex items-center gap-1 text-[12.5px] font-bold text-accent-700 min-[900px]:justify-end">
                {expanded ? "Close" : "Edit"}
                <ChevronDown className={`${expanded ? "rotate-180" : ""} transition-transform`} size={16} aria-hidden="true" />
              </span>
            </button>

            {expanded ? (
              <div className="border-t border-ink/10 bg-surface p-4">
                <div className="grid gap-3 lg:grid-cols-2">
                  <TextInput label="English title" value={announcement.titleEn} onChange={(value) => onChange(announcement.id, { titleEn: value })} />
                  <TextInput label="Marathi title" value={announcement.titleMr} onChange={(value) => onChange(announcement.id, { titleMr: value })} />
                </div>
                <div className="mt-3 grid gap-3 lg:grid-cols-2">
                  <TextArea label="English body" value={announcement.bodyEn} onChange={(value) => onChange(announcement.id, { bodyEn: value })} />
                  <TextArea label="Marathi body" value={announcement.bodyMr} onChange={(value) => onChange(announcement.id, { bodyMr: value })} />
                </div>
                <div className="mt-3 grid gap-3 lg:grid-cols-5">
                  <SelectInput label="Status" value={announcement.status} options={statusOptions} onChange={(value) => onChange(announcement.id, { status: value as ContentStatus })} />
                  <SelectInput label="Severity" value={announcement.severity} options={["information", "important", "urgent"]} onChange={(value) => onChange(announcement.id, { severity: value as Announcement["severity"] })} />
                  <TextInput label="Starts" type="datetime-local" value={toLocalInput(announcement.startsAt)} onChange={(value) => onChange(announcement.id, { startsAt: fromLocalInput(value) })} />
                  <TextInput label="Ends" type="datetime-local" value={toLocalInput(announcement.endsAt)} onChange={(value) => onChange(announcement.id, { endsAt: fromLocalInput(value) })} />
                  <label className="flex min-h-11 items-end gap-2 text-sm font-bold text-ink-muted">
                    <input type="checkbox" checked={announcement.isPinned} onChange={(event) => onChange(announcement.id, { isPinned: event.target.checked })} className="mb-3 h-5 w-5 accent-[var(--color-accent)]" />
                    <span className="mb-3">Pinned</span>
                  </label>
                </div>
                <div className="mt-4 flex justify-end">
                  <button type="button" onClick={() => onSave(announcement.id)} className="inline-flex min-h-10 items-center gap-2 rounded-pill bg-accent px-4 text-sm font-bold text-white hover:bg-accent-700">
                    <Save size={16} aria-hidden="true" />
                    Save changes
                  </button>
                </div>
              </div>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}

function Panel({ icon, title, action, children }: { icon: ReactNode; title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded-[22px] bg-card p-4 shadow-soft lg:p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-ink">
          {icon}
          <h2 className="font-latinDisplay text-[22px] leading-tight">{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function ActionButton({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" onClick={onClick} className="inline-flex min-h-10 items-center gap-2 rounded-pill bg-accent px-4 text-sm font-bold text-white hover:bg-accent-700">
      <Plus size={16} aria-hidden="true" />
      {children}
    </button>
  );
}

function StatusTag({ tone, children }: { tone: "success" | "pending" | "danger" | "neutral"; children: ReactNode }) {
  const toneClass = {
    success: "bg-accent2 text-white",
    pending: "bg-accent-100 text-accent-700",
    danger: "bg-accent text-white",
    neutral: "bg-neutral-300 text-ink-muted"
  }[tone];
  return <span className={`${toneClass} rounded-pill px-3 py-1.5 text-[10.5px] font-bold uppercase tracking-[0.08em]`}>{children}</span>;
}

function TextInput({ label, value, onChange, type = "text", compact = false }: { label: string; value: string; onChange: (value: string) => void; type?: string; compact?: boolean }) {
  return (
    <label className={`${compact ? "gap-1 text-[11px]" : "gap-1.5 text-sm"} grid font-bold text-ink-muted`}>
      {label}
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} className={`${compact ? "min-h-9 px-3 text-sm" : "min-h-11 px-3 text-base"} w-full rounded-[12px] border border-ink/15 bg-card font-normal text-ink`} />
    </label>
  );
}

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-1.5 text-sm font-bold text-ink-muted">
      {label}
      <textarea value={value} onChange={(event) => onChange(event.target.value)} className="min-h-24 rounded-[12px] border border-ink/15 bg-card px-3 py-2 text-base font-normal text-ink" />
    </label>
  );
}

function SelectInput({
  label,
  value,
  options,
  optionLabels,
  onChange,
  compact = false
}: {
  label: string;
  value: string;
  options: readonly string[];
  optionLabels?: Record<string, string>;
  onChange: (value: string) => void;
  compact?: boolean;
}) {
  return (
    <label className={`${compact ? "gap-1 text-[11px]" : "gap-1.5 text-sm"} grid font-bold text-ink-muted`}>
      {label}
      <select value={value} onChange={(event) => onChange(event.target.value)} className={`${compact ? "min-h-9 px-3 text-sm" : "min-h-11 px-3 text-base"} w-full rounded-[12px] border border-ink/15 bg-card font-normal text-ink`}>
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
