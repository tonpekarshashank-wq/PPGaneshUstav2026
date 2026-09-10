import { AartiClient } from "@/components/aarti-client";
import { getAartiData } from "@/data/repository";

export default async function AartiPage() {
  const { slots, settings, bookings, databaseEnabled } = await getAartiData();
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-3xl font-black text-maroon-950">Aarti Seva / आरती सेवा</h1>
        <p className="mt-2 max-w-3xl text-zinc-700">Select an eligible date and aarti time slot, then book it directly. Production submissions are protected by Supabase transactional functions and RLS; this local UI demonstrates the complete flow without exposing contact data publicly.</p>
      </div>
      <AartiClient slots={slots} bookings={bookings} settings={settings} databaseEnabled={databaseEnabled} />
    </div>
  );
}
