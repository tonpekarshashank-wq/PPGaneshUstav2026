import { RegistrationClient } from "@/components/registration-client";
import { getRegistrationsData } from "@/data/repository";
import { parseRegistrationEventParam } from "@/lib/registrations";

export default async function RegistrationsPage({
  searchParams
}: {
  searchParams: Promise<{ event?: string | string[] }>;
}) {
  const params = await searchParams;
  const selectedEvent = parseRegistrationEventParam(params.event);
  const data = await getRegistrationsData();

  return (
    <RegistrationClient
      registrationEvents={data.registrationEvents}
      entries={data.entries}
      selectedEventId={selectedEvent?.eventId}
      databaseEnabled={data.databaseEnabled}
    />
  );
}
