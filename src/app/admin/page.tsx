import { LockKeyhole, Settings } from "lucide-react";
import { logoutAdmin } from "@/app/admin/actions";
import { AdminManager } from "@/components/admin-manager";
import { getAdminDashboardData } from "@/data/repository";
import { requireAdminSession } from "@/server/admin-auth";

export default async function AdminPage() {
  await requireAdminSession();
  const data = await getAdminDashboardData();
  const fillRate = data.slots.length === 0 ? 0 : Math.round((data.slots.reduce((sum, slot) => sum + slot.confirmedCount, 0) / data.slots.reduce((sum, slot) => sum + slot.capacity, 0)) * 100);

  return (
    <div className="space-y-5">
      <div className="rounded-lg bg-maroon-800 p-5 text-white shadow-soft">
        <div className="flex items-center gap-2">
          <LockKeyhole aria-hidden="true" />
          <h1 className="text-3xl font-black">Committee Admin</h1>
        </div>
        <p className="mt-3 max-w-3xl text-white/90">Residents can view details and book aarti slots with only the public link. This area is gated by one configured admin account for managing the application.</p>
        <form action={logoutAdmin} className="mt-4">
          <button type="submit" className="inline-flex min-h-10 items-center rounded-full border border-white/40 px-4 text-sm font-bold text-white hover:bg-white/10">
            Sign out
          </button>
        </form>
      </div>

      <section className="grid gap-3 md:grid-cols-4">
        {[
          ["Today's events", data.todayEvents.length],
          ["Active announcements", data.announcements.filter((item) => item.status === "published").length],
          ["Aarti fill rate", `${fillRate}%`],
          ["Unpublished results", data.winners.filter((item) => item.status !== "published").length]
        ].map(([label, value]) => (
          <article key={label} className="rounded-lg border border-maroon-800/10 bg-white p-4 shadow-soft">
            <p className="text-sm font-bold text-maroon-800">{label}</p>
            <p className="mt-2 text-3xl font-black text-maroon-950">{value}</p>
          </article>
        ))}
      </section>

      <section className="rounded-lg border border-maroon-800/10 bg-white p-4 shadow-soft">
        <div className="flex items-center gap-2">
          <Settings className="text-maroon-800" aria-hidden="true" />
          <h2 className="text-xl font-black text-maroon-950">Settings, audit, and exports</h2>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg bg-saffron-50 p-3 text-sm text-maroon-900">
            <p><strong>Timezone:</strong> {data.settings.timezone}</p>
            <p><strong>Duplicate policy:</strong> {data.settings.duplicatePolicy}</p>
            <p><strong>Default capacity:</strong> {data.settings.defaultCapacity}</p>
            <p><strong>Cancellation cutoff:</strong> {data.settings.cancellationCutoffHours} hours</p>
          </div>
          <p className="text-sm leading-6 text-zinc-700">Edits below are saved locally in this browser for the MVP. Production should replace this with Supabase-backed persistence and audit logging.</p>
        </div>
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
