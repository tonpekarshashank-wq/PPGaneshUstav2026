import { BiTitle } from "@/components/BiTitle";
import { getWinnersData } from "@/data/repository";
import type { Activity, FestivalEvent, Winner } from "@/lib/types";

function eventDateLabel(event?: FestivalEvent) {
  if (!event) return "Date to be confirmed";
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "short"
  }).format(new Date(event.startsAt));
}

function rankLabel(rank: number) {
  if (rank === 1) return "1st";
  if (rank === 2) return "2nd";
  if (rank === 3) return "3rd";
  return `${rank}th`;
}

function categoryLabel(event?: FestivalEvent) {
  if (!event) return "Activity";
  if (event.category.includes("Kids")) return "Kids";
  if (event.category.includes("Games")) return "Games";
  if (event.category.includes("Community")) return "Community";
  if (event.category.includes("Competition")) return "Competition";
  return event.category;
}

type ResultActivity = {
  activity: Activity;
  event?: FestivalEvent;
  winners: Winner[];
};

function DeclaredCard({ item }: { item: ResultActivity }) {
  return (
    <section className="overflow-hidden rounded-[22px] bg-card shadow-soft">
      <div className="bg-accent2 p-4 text-bg">
        <div className="[&_[data-size=card]]:!text-bg [&_[lang=en]]:!text-bg/80">
          <BiTitle en={`${item.activity.nameEn} · ${eventDateLabel(item.event)}`} mr={item.activity.nameMr} />
        </div>
      </div>
      <div>
        {item.winners.map((winner, index) => (
          <article key={winner.id} className={`${index === item.winners.length - 1 ? "" : "border-b border-ink/10"} flex items-center gap-3 px-4 py-4`}>
            <div className={`${winner.rankOrder === 1 ? "bg-accent text-white" : "bg-surface text-ink-muted"} flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full font-latinDisplay text-[16px] leading-none`}>
              {winner.rankOrder}
            </div>
            <div className="min-w-0">
              <p className="truncate text-[15.5px] font-bold leading-tight text-ink">{winner.displayName}</p>
              <p className="mt-1 text-[13px] leading-tight text-ink-soft">
                {winner.wing && winner.flatNumber ? `${winner.wing.toUpperCase()} wing · ${winner.flatNumber}` : rankLabel(winner.rankOrder)}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function AwaitingRow({ item }: { item: ResultActivity }) {
  return (
    <article className="flex items-center gap-3 rounded-[18px] bg-surface px-4 py-4">
      <div className="min-w-0 flex-1">
        <div className="[&_[data-size=card]]:!text-[18px]">
          <BiTitle en={`${item.activity.nameEn} · judged ${eventDateLabel(item.event)}`} mr={item.activity.nameMr} />
        </div>
      </div>
      <span className="shrink-0 rounded-pill bg-neutral-300 px-3 py-1.5 text-[10.5px] font-bold uppercase tracking-[0.08em] text-ink-muted">Soon</span>
    </article>
  );
}

export default async function WinnersPage() {
  const { activities, events, winners } = await getWinnersData();
  const eventById = new Map(events.map((event) => [event.id, event]));
  const results: ResultActivity[] = activities.map((activity) => ({
    activity,
    event: activity.eventId ? eventById.get(activity.eventId) : undefined,
    winners: winners.filter((winner) => winner.activityId === activity.id).sort((a, b) => a.rankOrder - b.rankOrder)
  }));
  const declared = results.filter((item) => item.winners.length > 0);
  const awaiting = results.filter((item) => item.winners.length === 0);
  const categories = Array.from(new Set(results.map((item) => categoryLabel(item.event)))).slice(0, 3);

  return (
    <div className="space-y-5">
      <section className="relative -mx-4 -mt-5 overflow-hidden bg-accent-700 px-4 py-6 text-bg shadow-md lg:mx-0 lg:-mt-8 lg:rounded-lg lg:px-6 lg:py-7">
        <div className="absolute -right-16 -top-24 h-48 w-48 rounded-full bg-[rgba(198,113,57,.38)]" aria-hidden="true" />
        <div className="relative">
          <p className="text-[11.5px] font-bold uppercase tracking-[0.14em] text-bg/65">Published results</p>
          <h1 className="mt-4 font-latinDisplay text-[28px] leading-[1.08] text-bg">Winners</h1>
          <p className="mt-1 font-devDisplay text-[18px] font-semibold leading-snug text-bg/75" lang="mr">विजेते</p>
          <p className="mt-3 max-w-2xl text-[15.5px] leading-7 text-bg/80">Published with consent. Mobile numbers and private notes are never shown.</p>
        </div>
      </section>

      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        <span className="shrink-0 rounded-pill bg-ink px-4 py-2.5 text-[12.5px] font-bold text-white">Declared {declared.length}</span>
        <span className="shrink-0 rounded-pill border border-ink/20 px-4 py-2.5 text-[12.5px] font-bold text-ink">Awaiting {awaiting.length}</span>
        {categories.map((category) => (
          <span key={category} className="shrink-0 rounded-pill border border-ink/20 px-4 py-2.5 text-[12.5px] font-bold text-ink">{category}</span>
        ))}
      </div>

      {declared.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {declared.map((item) => <DeclaredCard key={item.activity.id} item={item} />)}
        </div>
      ) : (
        <section className="rounded-[22px] bg-card p-5 text-center shadow-soft">
          <p className="font-latinDisplay text-[22px] leading-tight text-ink">No declared winners yet</p>
          <p className="mt-2 text-[14px] leading-6 text-ink-muted">Results will appear here once the committee publishes consented winner details.</p>
        </section>
      )}

      <section>
        <p className="text-[11.5px] font-bold uppercase tracking-[0.14em] text-ink-soft">Awaiting results</p>
        <div className="mt-3 grid gap-2">
          {awaiting.length > 0 ? (
            awaiting.map((item) => <AwaitingRow key={item.activity.id} item={item} />)
          ) : (
            <p className="rounded-[18px] bg-surface p-4 text-[13px] font-semibold text-ink-muted">All activity results have been declared.</p>
          )}
        </div>
      </section>

      <section className="rounded-[18px] bg-card p-4 text-center shadow-soft">
        <h2 className="text-[14.5px] font-bold leading-5 text-ink">Get results on WhatsApp</h2>
        <p className="mt-2 text-[13px] leading-6 text-ink-muted">The committee posts each result to the society group as it is signed off.</p>
      </section>
    </div>
  );
}
