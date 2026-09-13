import type {
  AartiBooking,
  AartiSlot,
  Activity,
  Announcement,
  FestivalEvent,
  FestivalSettings,
  ParticipationOpportunity,
  RegistrationEntry,
  RegistrationEvent,
  Winner
} from "@/lib/types";
import { registrationEventHref } from "@/lib/registrations";

const venue = {
  en: "Palladium Plus Society",
  mr: "पॅलेडियम प्लस सोसायटी"
};

function ist(date: string, time: string) {
  return `${date}T${time}:00+05:30`;
}

export const settings: FestivalSettings = {
  festivalStartDate: "2026-09-14",
  festivalEndDate: "2026-09-25",
  timezone: "Asia/Kolkata",
  duplicatePolicy: "one_per_festival",
  defaultCapacity: 10,
  cancellationCutoffHours: 6,
  waitlistPromotion: "admin_review"
};

export const announcements: Announcement[] = [
  {
    id: "ann-welcome",
    titleEn: "Ganeshotsav schedule is ready for committee review",
    titleMr: "गणेशोत्सव वेळापत्रक समिती पुनरावलोकनासाठी तयार आहे",
    bodyEn: "Please confirm translations, venues, contacts, and participation rules before publishing to residents.",
    bodyMr: "रहिवाशांसाठी प्रकाशित करण्यापूर्वी भाषांतर, ठिकाणे, संपर्क आणि सहभाग नियम तपासा.",
    severity: "important",
    startsAt: ist("2026-09-01", "08:00"),
    endsAt: ist("2026-09-25", "23:00"),
    isPinned: true,
    status: "published"
  },
  {
    id: "ann-anand-mela-stall",
    titleEn: "Book your stall - Anand Mela",
    titleMr: "आनंद मेळा - तुमचा स्टॉल बुक करा",
    bodyEn: "Saturday, 19 September, 6:00 PM onwards at E Building Driveway. Homemade food, handicraft and art, fashion and style, jewellery and gifts, games, and more are welcome. Resident stall: Rs. 500; outside vendor: Rs. 1,000; extra table: Rs. 200. One table and two chairs included. Setup starts at 5:00 PM. Payment remains offline. Contact Mousami at +91 82176 27165 by 14 September.",
    bodyMr: "शनिवार, १९ सप्टेंबर, संध्याकाळी ६ पासून E बिल्डिंग ड्राइव्हवे येथे आनंद मेळा. घरगुती खाद्यपदार्थ, हस्तकला, फॅशन, दागिने, भेटवस्तू, खेळ आणि इतर स्टॉलचे स्वागत आहे. रहिवासी स्टॉल: रु. ५००; बाहेरील विक्रेता: रु. १,०००; अतिरिक्त टेबल: रु. २००. एक टेबल आणि दोन खुर्च्या समाविष्ट. सेटअप संध्याकाळी ५ पासून. पेमेंट ऑफलाइन आहे. १४ सप्टेंबरपर्यंत मौसमी यांच्याशी +९१ ८२१७६ २७१६५ वर संपर्क साधा.",
    severity: "information",
    startsAt: ist("2026-09-01", "08:00"),
    endsAt: ist("2026-09-19", "18:00"),
    isPinned: true,
    status: "published"
  }
];

const officialRows = [
  ["2026-09-14", "11:00", "Shri Ganesh Idol Installation and Pran Pratishtha", "श्री गणेश मूर्ती स्थापना व प्राणप्रतिष्ठा", "Puja"],
  ["2026-09-15", "19:00", "Haldi-Kumkum Ceremony and 21 Recitations of Ganapati Atharvashirsha", "हळदी-कुंकू समारंभ आणि गणपती अथर्वशीर्ष २१ आवर्तन", "Religious / Community"],
  ["2026-09-16", "20:30", "Children's Chess and Carrom Competition", "लहान मुलांची बुद्धिबळ व कॅरम स्पर्धा", "Kids / Competition"],
  ["2026-09-17", "18:00", "Bhajan by Sita Bhajani Mandal, Palladium Plus", "भजन – सीता भजनी मंडळ, पॅलेडियम प्लस", "Cultural / Devotional"],
  ["2026-09-18", "20:30", "Children's Fancy Dress and Dance Competition", "लहान मुलांची फॅन्सी ड्रेस व नृत्य स्पर्धा", "Kids / Competition"],
  ["2026-09-18", "21:15", "Movie Night - Mahaprabhu Jagannath", "मूव्ही नाईट – महाप्रभू जगन्नाथ", "Entertainment"],
  ["2026-09-19", "10:00", "Health Check-up Camp", "आरोग्य तपासणी शिबिर", "Health / Community"],
  ["2026-09-19", "10:00", "Children's Drawing Competition", "लहान मुलांची चित्रकला स्पर्धा", "Kids / Competition"],
  ["2026-09-19", "10:00", "Rangoli Competition", "रांगोळी स्पर्धा", "Competition"],
  ["2026-09-19", "18:00", "Anand Mela", "आनंद मेळा", "Community / Marketplace"],
  ["2026-09-20", "10:00", "Shri Satyanarayan Maha Puja", "श्री सत्यनारायण महापूजा", "Puja"],
  ["2026-09-20", "17:00", "Bhajan by Sant Dnyaneshwar Bhajani Mandal, Pune", "भजन – संत ज्ञानेश्वर भजनी मंडळ, पुणे", "Cultural / Devotional"],
  ["2026-09-20", "21:00", "Mahaprasad (Bhandara)", "महाप्रसाद (भंडारा)", "Community"],
  ["2026-09-21", "20:30", "Lemon-and-Spoon Race for Children and Musical Chairs for Women", "लिंबू चमचा (लहान मुले) आणि संगीत खुर्ची (महिलांसाठी)", "Games / Competition"],
  ["2026-09-22", "20:30", "Karaoke Night for Senior Citizens", "कराओके नाईट – ज्येष्ठांसाठी", "Cultural"],
  ["2026-09-23", "19:00", "Special Presentation by Shri Gurudev Tabla Academy, Pune", "विशेष सादरीकरण – श्री गुरुदेव तबला अकादमी, पुणे", "Cultural"],
  ["2026-09-24", "20:30", "Tambola", "तंबोला", "Games"],
  ["2026-09-25", "16:00", "Lezim and Flag Troupe Presentation", "लेझीम–ध्वज पथक सादरीकरण", "Cultural / Procession"],
  ["2026-09-25", "16:30", "Maha Aarti", "महाआरती", "Aarti"],
  ["2026-09-25", "17:00", "Visarjan Procession", "विसर्जन मिरवणूक", "Visarjan"]
] as const;

export const events: FestivalEvent[] = officialRows.map(([date, time, nameEn, nameMr, category], index) => {
  const id = `event-${index + 1}`;
  const slug = `${date}-${nameEn.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
  const registrationEnabled = ["event-3", "event-5", "event-8", "event-9", "event-14", "event-17"].includes(id);
  return {
    id,
    slug,
    nameEn,
    nameMr,
    descriptionEn: "Poster-transcribed event. English translation requires final committee proofread before go-live.",
    descriptionMr: "पोस्टरवरून घेतलेला कार्यक्रम. अंतिम प्रकाशनापूर्वी समितीने तपासणी करावी.",
    startsAt: ist(date, time),
    endsAt: ist(date, addMinutes(time, category === "Visarjan" ? 180 : 60)),
    venueEn: nameEn === "Anand Mela" ? "E Building Driveway" : venue.en,
    venueMr: nameEn === "Anand Mela" ? "E बिल्डिंग ड्राइव्हवे" : venue.mr,
    category,
    state: "scheduled",
    status: "published",
    registrationUrl: registrationEnabled ? registrationEventHref(id, slug) : undefined,
    displayOrder: index,
    sampleContent: true
  };
});

function addMinutes(time: string, minutes: number): string {
  const [hour, minute] = time.split(":").map(Number);
  const total = hour * 60 + minute + minutes;
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

export function generateAartiSlots(bookings: AartiBooking[] = []): AartiSlot[] {
  const slots: AartiSlot[] = [];
  for (let day = 15; day <= 25; day += 1) {
    const date = `2026-09-${String(day).padStart(2, "0")}`;
    const periods = day === 25 ? (["morning"] as const) : (["morning", "evening"] as const);
    for (const period of periods) {
      const time = period === "morning" ? "08:00" : "20:00";
      const id = `aarti-${date}-${period}`;
      const confirmedCount = bookings.filter((booking) => booking.slotId === id && booking.status === "confirmed").length;
      const waitlistedCount = bookings.filter((booking) => booking.slotId === id && booking.status === "waitlisted").length;
      slots.push({
        id,
        eventDate: date,
        period,
        labelEn: period === "morning" ? "Morning Aarti" : "Evening Aarti",
        labelMr: period === "morning" ? "सकाळची आरती" : "संध्याकाळची आरती",
        startsAt: ist(date, time),
        reportingAt: ist(date, period === "morning" ? "07:45" : "19:45"),
        capacity: settings.defaultCapacity,
        confirmedCount,
        waitlistedCount,
        bookingOpensAt: ist("2026-09-01", "08:00"),
        bookingClosesAt: ist(date, period === "morning" ? "02:00" : "14:00"),
        waitlistEnabled: true,
        state: confirmedCount >= settings.defaultCapacity ? "full" : "open"
      });
    }
  }
  return slots;
}

export const bookings: AartiBooking[] = [];

const registrationEventIds = ["event-3", "event-5", "event-8", "event-9", "event-14", "event-17"];

export const registrationEvents: RegistrationEvent[] = events
  .filter((event) => registrationEventIds.includes(event.id))
  .map((event) => ({
    id: `registration-${event.id}`,
    eventId: event.id,
    eventSlug: event.slug,
    nameEn: event.nameEn,
    nameMr: event.nameMr,
    category: event.category,
    startsAt: event.startsAt,
    venueEn: event.venueEn,
    venueMr: event.venueMr,
    opensAt: ist("2026-09-01", "08:00"),
    closesAt: event.startsAt,
    ageGroups: event.category.includes("Kids") || event.nameEn.includes("Children") ? ["6-9", "10-13", "14-17"] : ["Open"],
    status: "open",
    confirmedCount: 0
  }));

export const registrationEntries: RegistrationEntry[] = [];

export const activities: Activity[] = events
  .filter((event) => event.category.includes("Competition") || ["Games", "Community / Marketplace"].includes(event.category))
  .map((event) => ({
    id: `activity-${event.id}`,
    eventId: event.id,
    nameEn: event.nameEn,
    nameMr: event.nameMr,
    resultsStatus: "draft"
  }));

export const winners: Winner[] = [
  {
    id: "winner-sample-1",
    activityId: "activity-event-3",
    rankOrder: 1,
    prizeEn: "First Prize",
    prizeMr: "प्रथम पारितोषिक",
    displayName: "Results pending committee publication",
    noteEn: "Winners will appear here after consent-aware publication.",
    noteMr: "संमतीसह प्रकाशित झाल्यानंतर विजेते येथे दिसतील.",
    consentToPublish: false,
    status: "draft"
  }
];

export const opportunities: ParticipationOpportunity[] = [
  {
    id: "opp-anand-mela-stall",
    eventId: events.find((event) => event.nameEn === "Anand Mela")?.id,
    type: "stall_booking",
    titleEn: "Book your stall",
    titleMr: "तुमचा स्टॉल बुक करा",
    descriptionEn: "Anand Mela welcomes homemade food, handicraft and art, fashion and style, jewellery and gifts, games, and more.",
    descriptionMr: "आनंद मेळ्यासाठी घरगुती खाद्यपदार्थ, हस्तकला, फॅशन, दागिने, भेटवस्तू, खेळ आणि इतर स्टॉलचे स्वागत आहे.",
    eligibilityEn: "Residents and outside vendors with committee approval.",
    eligibilityMr: "समिती मान्यतेसह रहिवासी आणि बाहेरील विक्रेते.",
    deadlineAt: ist("2026-09-14", "23:59"),
    feeTextEn: "Resident stall: Rs. 500. Outside vendor stall: Rs. 1,000. Extra table: Rs. 200. Payment is offline.",
    feeTextMr: "रहिवासी स्टॉल: रु. ५००. बाहेरील विक्रेता: रु. १,०००. अतिरिक्त टेबल: रु. २००. पेमेंट ऑफलाइन आहे.",
    inclusionsEn: "One table and two chairs included. Setup from 5:00 PM at E Building Driveway.",
    inclusionsMr: "एक टेबल आणि दोन खुर्च्या समाविष्ट. E बिल्डिंग ड्राइव्हवे येथे संध्याकाळी ५ पासून सेटअप.",
    setupAt: ist("2026-09-19", "17:00"),
    contactName: "Mousami",
    contactMobile: "+918217627165",
    actionType: "whatsapp",
    featured: true,
    status: "published"
  }
];

export const allAartiSlots = generateAartiSlots(bookings);
