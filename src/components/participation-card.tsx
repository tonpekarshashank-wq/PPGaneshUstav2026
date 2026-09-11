import { MessageCircle, Phone, ExternalLink, Info } from "lucide-react";
import { BiTitle } from "@/components/BiTitle";
import type { ParticipationOpportunity } from "@/lib/types";
import { formatDateIST, isBeforeCutoff } from "@/lib/time";

export function ParticipationCard({ opportunity }: { opportunity: ParticipationOpportunity }) {
  const closed = opportunity.deadlineAt ? !isBeforeCutoff(opportunity.deadlineAt) : false;
  const actionHref =
    opportunity.actionType === "whatsapp" && opportunity.contactMobile
      ? `https://wa.me/${opportunity.contactMobile.replace(/\D/g, "")}`
      : opportunity.actionType === "call" && opportunity.contactMobile
        ? `tel:${opportunity.contactMobile}`
        : opportunity.externalUrl;
  const Icon = opportunity.actionType === "call" ? Phone : opportunity.actionType === "information" ? Info : opportunity.actionType === "whatsapp" ? MessageCircle : ExternalLink;

  return (
    <article className="rounded-lg border border-maroon-800/10 bg-white p-4 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <BiTitle en={opportunity.titleEn} mr={opportunity.titleMr} />
        <span className="rounded-full bg-saffron-100 px-2 py-1 text-xs font-bold text-maroon-800">Featured</span>
      </div>
      <p className="mt-3 text-sm leading-6 text-zinc-700">{opportunity.descriptionEn}</p>
      <p className="mt-2 text-sm leading-6 text-zinc-700">{opportunity.descriptionMr}</p>
      <dl className="mt-4 grid gap-2 text-sm text-zinc-700">
        {opportunity.deadlineAt ? (
          <div>
            <dt className="font-bold text-maroon-800">Deadline</dt>
            <dd>{formatDateIST(opportunity.deadlineAt)}</dd>
          </div>
        ) : null}
        {opportunity.feeTextEn ? (
          <div>
            <dt className="font-bold text-maroon-800">Fees</dt>
            <dd>{opportunity.feeTextEn}</dd>
          </div>
        ) : null}
        {opportunity.inclusionsEn ? (
          <div>
            <dt className="font-bold text-maroon-800">Included</dt>
            <dd>{opportunity.inclusionsEn}</dd>
          </div>
        ) : null}
      </dl>
      {closed ? (
        <p className="mt-4 rounded-lg bg-zinc-100 px-3 py-2 text-sm font-bold text-zinc-700">Registrations closed</p>
      ) : actionHref ? (
        <a href={actionHref} className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full bg-maroon-600 px-4 text-sm font-bold text-white hover:bg-maroon-800">
          <Icon size={18} aria-hidden="true" />
          Book your stall
        </a>
      ) : (
        <p className="mt-4 text-sm font-semibold text-maroon-800">Contact the committee for details.</p>
      )}
    </article>
  );
}
