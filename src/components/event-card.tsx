import Link from "next/link";
import { MapPin } from "lucide-react";
import type { FestivalEvent } from "@/lib/types";
import { formatDateIST, formatTimeIST } from "@/lib/time";
import { StatusBadge } from "@/components/status-badge";

export function EventCard({ event, showDate = false }: { event: FestivalEvent; showDate?: boolean }) {
  return (
    <article className="rounded-lg border border-maroon-800/10 bg-white p-4 shadow-soft">
      <div className="flex flex-wrap items-center gap-2">
        <time className="text-sm font-bold text-maroon-800">
          {showDate ? `${formatDateIST(event.startsAt)} · ` : ""}
          {formatTimeIST(event.startsAt)}
        </time>
        <StatusBadge value={event.state} />
        {event.sampleContent ? <StatusBadge value="updated" label="Committee review" /> : null}
      </div>
      <h3 className="mt-3 text-lg font-extrabold leading-snug text-maroon-950">{event.nameEn}</h3>
      <p className="mt-1 text-base font-semibold text-maroon-800">{event.nameMr}</p>
      <p className="mt-3 text-sm leading-6 text-zinc-700">{event.descriptionEn}</p>
      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-zinc-700">
        <span className="inline-flex items-center gap-1">
          <MapPin size={16} aria-hidden="true" />
          {event.venueEn} / {event.venueMr}
        </span>
        <span className="rounded-full bg-saffron-50 px-2 py-1 font-semibold text-maroon-800">{event.category}</span>
      </div>
      <Link href={`/event/${event.slug}`} className="mt-4 inline-flex min-h-11 items-center rounded-full bg-maroon-600 px-4 text-sm font-bold text-white hover:bg-maroon-800">
        Details / तपशील
      </Link>
    </article>
  );
}
