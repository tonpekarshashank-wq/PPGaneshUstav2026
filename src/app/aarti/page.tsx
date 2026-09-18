import { BiTitle } from "@/components/BiTitle";
import { AartiClient } from "@/components/aarti-client";
import { getAartiData } from "@/data/repository";
import { nowInISTDate } from "@/lib/time";

export const dynamic = "force-dynamic";

export default async function AartiPage() {
  const { slots, settings, bookings, databaseEnabled } = await getAartiData();
  return (
    <div className="space-y-5">
      <div className="relative -mx-4 -mt-5 overflow-hidden bg-accent-700 px-4 py-6 text-bg shadow-md lg:mx-0 lg:-mt-8 lg:rounded-lg lg:px-6 lg:py-7">
        <div className="absolute -right-16 -top-24 h-48 w-48 rounded-full bg-[rgba(198,113,57,.38)]" aria-hidden="true" />
        <div className="relative">
          <p className="text-[11.5px] font-bold uppercase tracking-[0.14em] text-bg/65">Resident booking</p>
          <h1 className="mt-4 [&_div]:!text-bg [&_[lang=en]]:!text-bg/80">
            <BiTitle en="Aarti Seva" mr="आरती सेवा" size="page" />
          </h1>
          <p className="mt-3 max-w-2xl text-[15.5px] leading-7 text-bg/80">Pick a date, pick a slot, book it. One slot per flat.</p>
        </div>
      </div>
      <AartiClient
        slots={slots}
        bookings={bookings}
        settings={settings}
        databaseEnabled={databaseEnabled}
        todayDate={nowInISTDate()}
      />
    </div>
  );
}
