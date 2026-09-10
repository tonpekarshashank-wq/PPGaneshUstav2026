"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { EventCard } from "@/components/event-card";
import type { FestivalEvent } from "@/lib/types";
import { festivalDates, formatDateIST, istDateFromISO } from "@/lib/time";

export function ScheduleBrowser({ events }: { events: FestivalEvent[] }) {
  const [date, setDate] = useState(festivalDates[0]);
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const categories = useMemo(() => ["All", ...Array.from(new Set(events.map((event) => event.category)))], [events]);
  const filtered = events.filter((event) => {
    const text = `${event.nameEn} ${event.nameMr} ${event.category}`.toLowerCase();
    return istDateFromISO(event.startsAt) === date && (category === "All" || event.category === category) && text.includes(query.toLowerCase());
  });

  return (
    <div className="space-y-4">
      <div className="grid gap-3 rounded-lg border border-maroon-800/10 bg-white p-4 shadow-soft md:grid-cols-[1fr_1fr_1.2fr]">
        <label className="grid gap-1 text-sm font-bold text-maroon-800">
          Date / तारीख
          <select value={date} onChange={(event) => setDate(event.target.value)} className="min-h-11 rounded-lg border border-maroon-800/20 px-3 text-base text-zinc-900">
            {festivalDates.map((festivalDate) => (
              <option key={festivalDate} value={festivalDate}>
                {formatDateIST(festivalDate)}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm font-bold text-maroon-800">
          Category / प्रकार
          <select value={category} onChange={(event) => setCategory(event.target.value)} className="min-h-11 rounded-lg border border-maroon-800/20 px-3 text-base text-zinc-900">
            {categories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm font-bold text-maroon-800">
          Search / शोध
          <span className="relative">
            <Search className="absolute left-3 top-3 text-zinc-500" size={18} aria-hidden="true" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} className="min-h-11 w-full rounded-lg border border-maroon-800/20 px-10 text-base text-zinc-900" placeholder="Chess, आरती..." />
          </span>
        </label>
      </div>
      {filtered.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((event) => (
            <EventCard key={event.id} event={event} showDate />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-maroon-800/10 bg-white p-5 text-zinc-700">No events match these filters. Try another date or category.</div>
      )}
    </div>
  );
}
