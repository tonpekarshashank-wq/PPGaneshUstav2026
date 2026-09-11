import { LockKeyhole } from "lucide-react";
import { logoutAdmin } from "@/app/admin/actions";
import { AdminManager } from "@/components/admin-manager";
import { getAdminDashboardData } from "@/data/repository";
import { requireAdminSession } from "@/server/admin-auth";

export default async function AdminPage() {
  await requireAdminSession();
  const data = await getAdminDashboardData();
  const bookedSlots = data.bookings.filter((booking) => booking.status === "confirmed").length;
  const totalSlots = data.slots.length;
  const eventsToProofread = data.events.filter((event) => event.sampleContent || event.status === "draft").length;
  const resultsPending = data.activities.filter((activity) => !data.winners.some((winner) => winner.activityId === activity.id && winner.status === "published")).length;
  const nextBooking = data.bookings
    .filter((booking) => booking.status === "confirmed")
    .map((booking) => ({ booking, slot: data.slots.find((slot) => slot.id === booking.slotId) }))
    .filter((item): item is { booking: typeof data.bookings[number]; slot: typeof data.slots[number] } => Boolean(item.slot))
    .sort((a, b) => a.slot.startsAt.localeCompare(b.slot.startsAt))[0];

  return (
    <div className="space-y-5">
      <div className="-mx-4 -mt-5 bg-ink px-4 py-4 text-bg shadow-md lg:mx-0 lg:-mt-8 lg:rounded-lg lg:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent font-devDisplay text-sm font-bold text-white" lang="mr">श्री</span>
            <div>
              <div className="flex items-center gap-2">
                <LockKeyhole size={18} aria-hidden="true" />
                <h1 className="text-[15px] font-bold leading-tight">Committee console</h1>
              </div>
              <p className="mt-1 text-[10.5px] font-bold uppercase tracking-[0.1em] text-bg/55">Ganeshotsav 2026</p>
            </div>
          </div>
          <form action={logoutAdmin}>
            <button type="submit" className="inline-flex min-h-10 items-center rounded-pill border border-bg/30 px-4 text-sm font-bold text-bg hover:bg-bg/10">
              Sign out
            </button>
          </form>
        </div>
      </div>

      <section className="grid gap-3 md:grid-cols-4">
        {[
          ["Aarti slots booked", `${bookedSlots} / ${totalSlots}`, "card"],
          ["Events to proofread", eventsToProofread, "card"],
          ["Results pending", resultsPending, "card"],
          ["Next aarti", nextBooking ? formatAdminSlot(nextBooking.slot.startsAt) : "None", "sage"]
        ].map(([label, value, tone]) => (
          <article key={label} className={`${tone === "sage" ? "bg-accent2 text-white" : "bg-card text-ink"} rounded-[18px] p-4 shadow-soft`}>
            <p className={`${tone === "sage" ? "text-bg/75" : "text-ink-soft"} text-[10.5px] font-bold uppercase tracking-[0.12em]`}>{label}</p>
            <p className="mt-2 font-latinDisplay text-[30px] leading-tight">{value}</p>
            {tone === "sage" && nextBooking ? <p className="mt-1 text-[12px] font-semibold text-bg/85">{nextBooking.booking.wing}-{nextBooking.booking.flatNumber} · {nextBooking.booking.residentName}</p> : null}
          </article>
        ))}
      </section>

      <AdminManager
        announcements={data.announcements}
        events={data.events}
        bookings={data.bookings}
        slots={data.slots}
        activities={data.activities}
        winners={data.winners}
        databaseEnabled={data.databaseEnabled}
      />
    </div>
  );
}

function formatAdminSlot(iso: string) {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    weekday: "short",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(iso));
}
