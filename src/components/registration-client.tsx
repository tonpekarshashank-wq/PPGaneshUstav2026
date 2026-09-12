"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { submitRegistrationEntry } from "@/app/registrations/actions";
import { BiTitle } from "@/components/BiTitle";
import { hashMobile, normalizeFlat, normalizeMobile } from "@/lib/booking";
import { findDuplicateRegistration, registrationReference } from "@/lib/registrations";
import { formatTimeIST } from "@/lib/time";
import type { RegistrationEntryPublic, RegistrationEvent, RegistrationInput } from "@/lib/types";

type Props = {
  registrationEvents: RegistrationEvent[];
  entries: RegistrationEntryPublic[];
  selectedEventId?: string;
  databaseEnabled: boolean;
};

type Tab = "register" | "entries";

const wingOptions = ["All wings", "E", "F", "G", "H"];
const defaultForm = {
  participantName: "",
  wing: "E",
  flatNumber: "",
  ageGroup: "",
  mobile: ""
};

function eventDateLabel(iso: string) {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    weekday: "short",
    day: "numeric",
    month: "short"
  }).format(new Date(iso));
}

function shortDateLabel(iso: string) {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "short"
  }).format(new Date(iso));
}

export function RegistrationClient({ registrationEvents, entries: initialEntries, selectedEventId, databaseEnabled }: Props) {
  const selectedFromUrl = registrationEvents.find((event) => event.eventId === selectedEventId || event.id === selectedEventId);
  const [activeTab, setActiveTab] = useState<Tab>(selectedFromUrl ? "register" : "entries");
  const [selectedEvent, setSelectedEvent] = useState(selectedFromUrl?.id ?? registrationEvents[0]?.id ?? "");
  const [entries, setEntries] = useState(initialEntries);
  const [form, setForm] = useState(defaultForm);
  const [message, setMessage] = useState("");
  const [duplicate, setDuplicate] = useState<RegistrationEntryPublic | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [eventPickerOpen, setEventPickerOpen] = useState(!selectedFromUrl);
  const [query, setQuery] = useState("");
  const [eventFilter, setEventFilter] = useState(selectedFromUrl?.id ?? "All events");
  const [wingFilter, setWingFilter] = useState("All wings");
  const [ageFilter, setAgeFilter] = useState("All ages");

  const currentEvent = registrationEvents.find((event) => event.id === selectedEvent);
  const ageGroups = currentEvent?.ageGroups.length ? currentEvent.ageGroups : ["Open"];
  const selectedAgeGroup = form.ageGroup || ageGroups[0] || "Open";
  const allAgeGroups = Array.from(new Set(registrationEvents.flatMap((event) => event.ageGroups))).filter(Boolean);

  const filteredEntries = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return entries.filter((entry) => {
      const searchText = `${entry.participantName} ${entry.wing}-${entry.flatNumber} ${entry.flatNumber}`.toLowerCase();
      return (
        (!normalizedQuery || searchText.includes(normalizedQuery)) &&
        (eventFilter === "All events" || entry.registrationEventId === eventFilter) &&
        (wingFilter === "All wings" || entry.wing === wingFilter) &&
        (ageFilter === "All ages" || entry.ageGroup === ageFilter)
      );
    });
  }, [ageFilter, entries, eventFilter, query, wingFilter]);

  function viewEntry(entry: RegistrationEntryPublic) {
    setActiveTab("entries");
    setEventFilter(entry.registrationEventId);
    setWingFilter(entry.wing);
    setAgeFilter("All ages");
    setQuery(entry.participantName);
  }

  function updateForm(patch: Partial<typeof defaultForm>) {
    setDuplicate(undefined);
    setMessage("");
    setForm((current) => ({ ...current, ...patch }));
  }

  async function submitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!currentEvent) return;

    const input: RegistrationInput = {
      registrationEventId: currentEvent.id,
      participantName: form.participantName,
      wing: form.wing,
      flatNumber: form.flatNumber,
      ageGroup: selectedAgeGroup,
      mobile: form.mobile,
      idempotencyKey: `${currentEvent.id}-${normalizeFlat(form.wing, form.flatNumber)}-${form.participantName.trim().toLowerCase()}-${hashMobile(form.mobile)}`
    };

    const existing = findDuplicateRegistration(input, entries);
    if (existing) {
      setDuplicate(existing);
      setMessage("");
      return;
    }

    setIsSubmitting(true);
    setDuplicate(undefined);
    setMessage("");

    if (databaseEnabled) {
      const response = await submitRegistrationEntry(input);
      setIsSubmitting(false);
      if (response.error || !response.entry) {
        setMessage(response.error ?? "Unable to save this registration.");
        return;
      }
      setEntries((items) => [...items.filter((item) => item.id !== response.entry?.id), response.entry as RegistrationEntryPublic]);
      setMessage(`Registered: ${response.entry.participantName}`);
      setForm(defaultForm);
      return;
    }

    const idempotencyKey = input.idempotencyKey;
    const reference = registrationReference(input.registrationEventId, normalizeFlat(input.wing, input.flatNumber), idempotencyKey);
    const localEntry: RegistrationEntryPublic = {
      id: `local-registration-${Date.now()}`,
      reference,
      registrationEventId: currentEvent.id,
      eventId: currentEvent.eventId,
      eventSlug: currentEvent.eventSlug,
      eventNameEn: currentEvent.nameEn,
      eventNameMr: currentEvent.nameMr,
      participantName: input.participantName.trim(),
      wing: input.wing,
      flatNumber: input.flatNumber.trim(),
      ageGroup: input.ageGroup,
      status: "confirmed",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setEntries((items) => [...items, localEntry]);
    setIsSubmitting(false);
    setMessage(`Registered: ${localEntry.participantName}`);
    setForm(defaultForm);
  }

  function updateFlat(value: string) {
    updateForm({ flatNumber: value.replace(/\D/g, "") });
  }

  return (
    <section className="-mx-4 -mt-5 overflow-hidden bg-bg lg:mx-0 lg:-mt-8 lg:rounded-lg lg:shadow-soft">
      <div className="bg-accent-700 px-4 pb-0 pt-6 text-bg lg:px-7 lg:pt-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-latinDisplay text-[42px] leading-none text-bg lg:text-5xl">Registrations</h1>
            <p className="mt-1 font-devDisplay text-[24px] font-semibold leading-tight text-bg/75" lang="mr">नाव नोंदणी</p>
          </div>
          <p className="pt-1 text-sm font-extrabold text-bg/85">PP Ganeshotsav</p>
        </div>

        <div className="mt-10 grid grid-cols-2 text-center text-[18px] font-extrabold">
          <button
            type="button"
            onClick={() => setActiveTab("register")}
            className={`border-b-4 px-3 pb-4 ${activeTab === "register" ? "border-accent text-bg" : "border-bg/25 text-bg/80"}`}
          >
            Register
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("entries")}
            className={`border-b-4 px-3 pb-4 ${activeTab === "entries" ? "border-accent text-bg" : "border-bg/25 text-bg/80"}`}
          >
            All entries · {entries.length}
          </button>
        </div>
      </div>

      {activeTab === "register" ? (
        <div className="space-y-6 px-4 py-5 lg:px-7">
          <section>
            <p className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-ink-soft">Event</p>
            {currentEvent ? (
              <article className="mt-3 rounded-[28px] border-2 border-accent bg-card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="[&_[lang=mr]]:text-[27px] [&_[lang=mr]]:font-bold [&_[lang=mr]]:leading-tight">
                    <BiTitle en={currentEvent.nameEn} mr={currentEvent.nameMr} />
                  </div>
                  {eventPickerOpen ? (
                    <label className="shrink-0">
                      <span className="sr-only">Change event</span>
                      <span className="relative block">
                        <select
                          value={selectedEvent}
                          onChange={(event) => {
                            setSelectedEvent(event.target.value);
                            setDuplicate(undefined);
                            setMessage("");
                            setForm((current) => ({ ...current, ageGroup: "" }));
                            setEventPickerOpen(false);
                          }}
                          className="min-h-10 max-w-[160px] appearance-none rounded-pill border border-ink/20 bg-card px-3 pr-8 text-sm font-extrabold text-accent-700 shadow-sm outline-none"
                        >
                          {registrationEvents.map((event) => (
                            <option key={event.id} value={event.id}>{event.nameEn}</option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3 top-3 text-accent-700" size={15} aria-hidden="true" />
                      </span>
                    </label>
                  ) : (
                    <button type="button" onClick={() => setEventPickerOpen(true)} className="shrink-0 text-sm font-extrabold text-accent-700">
                      Change
                    </button>
                  )}
                </div>
                <p className="mt-2 text-[15px] font-bold text-ink-soft">
                  {eventDateLabel(currentEvent.startsAt)} · {formatTimeIST(currentEvent.startsAt).toLowerCase()}
                </p>
                <div className="mt-4 border-t border-ink/10 pt-4 text-[15px] font-bold text-ink-muted">
                  <span className="mr-2 inline-block h-2.5 w-2.5 rounded-full bg-accent" aria-hidden="true" />
                  Closes {shortDateLabel(currentEvent.closesAt)}, {formatTimeIST(currentEvent.closesAt).toLowerCase()} · {currentEvent.confirmedCount} entries so far
                </div>
              </article>
            ) : (
              <div className="mt-3 rounded-md bg-card p-5 text-sm font-semibold text-ink-muted shadow-sm">No registration events are open yet.</div>
            )}
          </section>

          <section>
            <div className="flex items-center justify-between gap-3">
              <p className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-ink-soft">Participants</p>
              <p className="text-sm font-extrabold text-ink-soft">1 added</p>
            </div>
            <form onSubmit={submitForm} className="mt-3 rounded-[26px] bg-card p-4 shadow-sm">
              <label className="grid gap-2 text-sm font-bold text-ink-muted">
                Participant name
                <input required value={form.participantName} onChange={(event) => updateForm({ participantName: event.target.value })} className="min-h-12 rounded-pill border border-ink/20 px-4 text-base font-normal text-ink" placeholder="Participant name" />
              </label>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <label className="grid gap-2 text-sm font-bold text-ink-muted">
                  Wing
                  <select required value={form.wing} onChange={(event) => updateForm({ wing: event.target.value })} className="min-h-12 rounded-pill border border-ink/20 bg-card px-4 text-base font-normal text-ink">
                    {["E", "F", "G", "H"].map((wing) => <option key={wing} value={wing}>{wing}</option>)}
                  </select>
                </label>
                <label className="grid gap-2 text-sm font-bold text-ink-muted">
                  Flat no.
                  <input
                    required
                    inputMode="numeric"
                    pattern="([1-9]0[1-6]|100[1-6]|110[1-6])"
                    value={form.flatNumber}
                    onChange={(event) => updateFlat(event.target.value)}
                    onInput={(event) => event.currentTarget.setCustomValidity("")}
                    onInvalid={(event) => event.currentTarget.setCustomValidity("Please enter a valid flat number")}
                    className="min-h-12 rounded-pill border border-ink/20 px-4 text-base font-normal text-ink"
                    placeholder="1104"
                  />
                </label>
              </div>
              <fieldset className="mt-4">
                <legend className="text-sm font-bold text-ink-muted">Age group</legend>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {ageGroups.map((age) => (
                    <button
                      key={age}
                      type="button"
                      onClick={() => updateForm({ ageGroup: age })}
                      className={`${selectedAgeGroup === age ? "bg-accent text-white" : "border border-ink/20 bg-card text-ink"} min-h-11 rounded-pill px-3 text-sm font-extrabold`}
                    >
                      {age}
                    </button>
                  ))}
                </div>
              </fieldset>
              <div className="mt-4 grid gap-3">
                <label className="grid gap-2 text-sm font-bold text-ink-muted">
                  Mobile
                  <input required value={form.mobile} onChange={(event) => updateForm({ mobile: normalizeMobile(event.target.value) })} className="min-h-12 rounded-pill border border-ink/20 px-4 text-base font-normal text-ink" placeholder="10-digit number" />
                </label>
              </div>
              {duplicate ? (
                <div className="mt-4 rounded-[20px] bg-accent-100 p-4">
                  <h3 className="font-extrabold text-accent-700">Already on the list?</h3>
                  <p className="mt-2 text-sm font-semibold leading-6 text-ink-muted">
                    An entry for <strong>{duplicate.participantName}, {duplicate.wing}-{duplicate.flatNumber}</strong> exists for this event.
                  </p>
                  <button type="button" onClick={() => viewEntry(duplicate)} className="mt-3 text-sm font-extrabold text-accent-700">
                    View that entry
                  </button>
                </div>
              ) : null}
              {message ? <p role="status" className="mt-4 rounded-[16px] bg-accent-100 px-3 py-2 text-sm font-bold text-accent-700">{message}</p> : null}
              <button type="submit" disabled={isSubmitting || !currentEvent} className="mt-4 min-h-12 w-full rounded-pill bg-accent px-5 text-base font-extrabold text-white shadow-sm hover:bg-accent-700 disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-ink-muted">
                {isSubmitting ? "Saving..." : "Register"}
              </button>
            </form>
            <button type="button" className="mt-5 min-h-14 w-full rounded-pill border-2 border-dashed border-accent/55 text-base font-extrabold text-accent-700">
              + Add another participant
            </button>
          </section>
        </div>
      ) : (
        <div className="space-y-5 px-4 py-5 lg:px-7">
          <section className="space-y-3">
            <label className="relative block">
              <span className="sr-only">Search entries</span>
              <Search className="absolute left-4 top-4 text-ink-soft" size={18} aria-hidden="true" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="min-h-14 w-full rounded-pill border border-ink/20 bg-card px-11 pr-20 text-base text-ink shadow-sm"
                placeholder="Search name or flat"
              />
              {query ? (
                <button type="button" onClick={() => setQuery("")} className="absolute right-4 top-4 text-sm font-extrabold text-accent-700">
                  Clear
                </button>
              ) : null}
            </label>
            <p className="text-sm font-semibold leading-6 text-ink-muted">Search by participant name or flat to find your entry.</p>
            <div className="flex gap-2 overflow-x-auto pb-1">
              <FilterSelect label="Event" value={eventFilter} onChange={setEventFilter} options={["All events", ...registrationEvents.map((event) => event.id)]} labels={Object.fromEntries(registrationEvents.map((event) => [event.id, event.nameEn]))} />
              <FilterSelect label="Wing" value={wingFilter} onChange={setWingFilter} options={wingOptions} />
              <FilterSelect label="Age" value={ageFilter} onChange={setAgeFilter} options={["All ages", ...allAgeGroups]} />
              {(query || eventFilter !== "All events" || wingFilter !== "All wings" || ageFilter !== "All ages") ? (
                <button type="button" onClick={() => { setQuery(""); setEventFilter("All events"); setWingFilter("All wings"); setAgeFilter("All ages"); }} className="inline-flex min-h-11 shrink-0 items-center rounded-pill bg-ink px-4 text-sm font-extrabold text-white">
                  Reset
                </button>
              ) : null}
            </div>
          </section>

          <section className="border-t border-ink/10 pt-5">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-extrabold text-ink">{filteredEntries.length} of {entries.length} entries</h2>
            </div>
            <div className="mt-4 space-y-3">
              {filteredEntries.length > 0 ? filteredEntries.map((entry) => (
                <article key={entry.id} className="rounded-[24px] bg-card p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-[21px] font-extrabold leading-tight text-ink">{entry.participantName}</h3>
                      <p className="mt-1 text-[15px] font-semibold text-ink-muted">{entry.wing}-{entry.flatNumber} · age {entry.ageGroup}</p>
                    </div>
                    <span className="max-w-[48%] rounded-pill bg-surface px-3 py-1.5 text-right text-[11.5px] font-extrabold leading-tight text-accent-700">
                      {entry.eventNameEn}
                    </span>
                  </div>
                  <div className="mt-4 border-t border-ink/10 pt-3 text-sm font-semibold text-ink-muted">
                    Registered {shortDateLabel(entry.createdAt)}
                  </div>
                </article>
              )) : (
                <div className="rounded-md bg-card p-5 text-sm font-semibold text-ink-muted shadow-sm">No entries match these filters yet.</div>
              )}
            </div>
          </section>
        </div>
      )}
    </section>
  );
}

function FilterSelect({ label, value, options, labels = {}, onChange }: { label: string; value: string; options: string[]; labels?: Record<string, string>; onChange: (value: string) => void }) {
  const active = value !== options[0];
  return (
    <label className="relative shrink-0">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`${active ? "border-ink bg-ink text-white" : "border-ink/20 bg-bg text-ink"} min-h-11 max-w-[180px] appearance-none rounded-pill border px-4 pr-9 text-sm font-extrabold shadow-sm outline-none`}
      >
        {options.map((option) => <option key={option} value={option}>{labels[option] ?? option}</option>)}
      </select>
      <ChevronDown className={`pointer-events-none absolute right-3 top-3.5 ${active ? "text-white" : "text-ink-soft"}`} size={14} aria-hidden="true" />
    </label>
  );
}
