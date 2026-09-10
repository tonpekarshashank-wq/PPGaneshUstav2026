import { ScheduleBrowser } from "@/components/schedule-browser";
import { getScheduleData } from "@/data/repository";

export default async function SchedulePage() {
  const events = await getScheduleData();
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-3xl font-black text-maroon-950">Full Schedule / संपूर्ण वेळापत्रक</h1>
        <p className="mt-2 max-w-2xl text-zinc-700">Official poster schedule for 14-25 September 2026. Every event shows English and Marathi names, with translations flagged for committee review.</p>
      </div>
      <ScheduleBrowser events={events} />
    </div>
  );
}
