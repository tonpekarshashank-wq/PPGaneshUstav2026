import { notFound } from "next/navigation";
import { EventCard } from "@/components/event-card";
import { getEventBySlug } from "@/data/repository";

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <EventCard event={event} showDate />
      <section className="rounded-lg border border-maroon-800/10 bg-white p-5 shadow-soft">
        <h2 className="text-xl font-black text-maroon-950">Participation details / सहभाग तपशील</h2>
        <p className="mt-3 text-zinc-700">{event.descriptionMr}</p>
        <p className="mt-3 text-sm font-semibold text-maroon-800">Status: {event.state}. Committee can update details from the admin area without code changes.</p>
      </section>
    </div>
  );
}
