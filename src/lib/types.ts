export type Language = "en" | "mr";

export type ContentStatus = "draft" | "published" | "archived";
export type EventState = "scheduled" | "updated" | "cancelled" | "completed";
export type AartiPeriod = "morning" | "evening";
export type AartiSlotState = "upcoming" | "open" | "full" | "closed" | "cancelled";
export type BookingStatus = "confirmed" | "waitlisted" | "cancelled";
export type DuplicatePolicy = "one_per_festival" | "one_per_day" | "unrestricted";
export type OpportunityAction = "call" | "whatsapp" | "external_form" | "in_app_form" | "information";

export type Announcement = {
  id: string;
  titleEn: string;
  titleMr: string;
  bodyEn: string;
  bodyMr: string;
  severity: "information" | "important" | "urgent";
  startsAt: string;
  endsAt: string;
  isPinned: boolean;
  status: ContentStatus;
};

export type FestivalEvent = {
  id: string;
  slug: string;
  nameEn: string;
  nameMr: string;
  descriptionEn: string;
  descriptionMr: string;
  startsAt: string;
  endsAt: string;
  venueEn: string;
  venueMr: string;
  category: string;
  state: EventState;
  status: ContentStatus;
  displayOrder: number;
  sampleContent?: boolean;
  registrationUrl?: string;
  contactLabel?: string;
};

export type AartiSlot = {
  id: string;
  eventDate: string;
  period: AartiPeriod;
  labelEn: string;
  labelMr: string;
  startsAt: string;
  reportingAt: string;
  capacity: number;
  confirmedCount: number;
  waitlistedCount: number;
  bookingOpensAt: string;
  bookingClosesAt: string;
  waitlistEnabled: boolean;
  state: AartiSlotState;
};

export type AartiBooking = {
  id: string;
  reference: string;
  slotId: string;
  residentName: string;
  wing: string;
  flatNumber: string;
  mobileHash: string;
  participantCount: number;
  note?: string;
  status: BookingStatus;
  waitlistPosition?: number;
  verifiedAt: string;
  createdAt: string;
  cancelledAt?: string;
};

export type BookingInput = {
  slotId: string;
  residentName: string;
  wing: string;
  flatNumber: string;
  mobile: string;
  participantCount: number;
  note?: string;
  consent: boolean;
  idempotencyKey: string;
};

export type Activity = {
  id: string;
  eventId?: string;
  nameEn: string;
  nameMr: string;
  resultsStatus: ContentStatus;
};

export type Winner = {
  id: string;
  activityId: string;
  rankOrder: number;
  prizeEn: string;
  prizeMr: string;
  displayName: string;
  wing?: string;
  flatNumber?: string;
  imageUrl?: string;
  noteEn?: string;
  noteMr?: string;
  consentToPublish: boolean;
  status: ContentStatus;
};

export type ParticipationOpportunity = {
  id: string;
  eventId?: string;
  type: "activity_registration" | "volunteer" | "stall_booking" | "contribution" | "other";
  titleEn: string;
  titleMr: string;
  descriptionEn: string;
  descriptionMr: string;
  eligibilityEn: string;
  eligibilityMr: string;
  deadlineAt?: string;
  feeTextEn?: string;
  feeTextMr?: string;
  inclusionsEn?: string;
  inclusionsMr?: string;
  setupAt?: string;
  contactName?: string;
  contactMobile?: string;
  actionType: OpportunityAction;
  externalUrl?: string;
  featured: boolean;
  status: ContentStatus;
};

export type FestivalSettings = {
  festivalStartDate: string;
  festivalEndDate: string;
  timezone: "Asia/Kolkata";
  duplicatePolicy: DuplicatePolicy;
  defaultCapacity: number;
  cancellationCutoffHours: number;
  waitlistPromotion: "automatic" | "admin_review";
};
