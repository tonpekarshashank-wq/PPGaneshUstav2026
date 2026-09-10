import { Trophy } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { getWinnersData } from "@/data/repository";

export default async function WinnersPage() {
  const { activities, winners } = await getWinnersData();
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-3xl font-black text-maroon-950">Winners / विजेते</h1>
        <p className="mt-2 max-w-2xl text-zinc-700">Published results show only consented resident details. Mobile numbers and private notes are never shown publicly.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {activities.map((activity) => {
          const activityWinners = winners.filter((winner) => winner.activityId === activity.id).sort((a, b) => a.rankOrder - b.rankOrder);
          return (
            <section key={activity.id} className="rounded-lg border border-maroon-800/10 bg-white p-4 shadow-soft">
              <h2 className="text-lg font-extrabold text-maroon-950">{activity.nameEn}</h2>
              <p className="font-semibold text-maroon-800">{activity.nameMr}</p>
              <div className="mt-4 space-y-3">
                {activityWinners.length > 0 ? (
                  activityWinners.map((winner) => (
                    <article key={winner.id} className="rounded-lg bg-saffron-50 p-3">
                      <p className="flex items-center gap-2 font-bold text-maroon-950"><Trophy size={18} aria-hidden="true" /> {winner.prizeEn} / {winner.prizeMr}</p>
                      <p className="mt-1 text-zinc-800">{winner.displayName}</p>
                      {winner.consentToPublish && winner.wing && winner.flatNumber ? <p className="text-sm text-zinc-700">{winner.wing}-{winner.flatNumber}</p> : null}
                      {winner.noteEn ? <p className="mt-2 text-sm text-zinc-700">{winner.noteEn}</p> : null}
                    </article>
                  ))
                ) : (
                  <div className="rounded-lg bg-zinc-100 p-3 text-sm text-zinc-700">
                    <StatusBadge value="completed" label="Results soon" />
                    <p className="mt-2 font-semibold">Results will be announced soon / निकाल लवकरच जाहीर केले जातील.</p>
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
