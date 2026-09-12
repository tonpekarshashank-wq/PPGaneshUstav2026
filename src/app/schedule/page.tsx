import { ScheduleBrowser } from "@/components/schedule-browser";
import { getScheduleData } from "@/data/repository";

export default async function SchedulePage({
  searchParams
}: {
  searchParams: Promise<{ event?: string | string[] }>;
}) {
  const params = await searchParams;
  const selectedEventId = Array.isArray(params.event) ? params.event[0] : params.event;
  const events = await getScheduleData();
  return (
    <div className="space-y-5">
      <div className="relative -mx-4 -mt-5 overflow-hidden bg-accent-700 px-4 py-6 text-bg shadow-md lg:mx-0 lg:-mt-8 lg:rounded-lg lg:px-6 lg:py-7">
        <div className="absolute -right-16 -top-24 h-48 w-48 rounded-full bg-[rgba(198,113,57,.38)]" aria-hidden="true" />
        <div className="relative">
          <p className="text-[11.5px] font-bold uppercase tracking-[0.14em] text-bg/65">14-25 September 2026</p>
          <h1 className="mt-4 font-latinDisplay text-[28px] leading-[1.08] text-bg">Full schedule</h1>
          <p className="mt-1 font-devDisplay text-[18px] font-semibold leading-snug text-bg/75" lang="mr">संपूर्ण वेळापत्रक · १४-२५ सप्टेंबर</p>
          <p className="mt-3 max-w-2xl text-[15.5px] leading-7 text-bg/80">Browse the day-by-day programme, filter by activity type, and open event details for venue and timing updates.</p>
        </div>
      </div>
      <ScheduleBrowser events={events} selectedEventId={selectedEventId} />
    </div>
  );
}
