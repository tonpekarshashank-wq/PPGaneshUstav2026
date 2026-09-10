import type { Language } from "@/lib/types";

export const languages: Record<Language, { label: string; short: string }> = {
  en: { label: "English", short: "EN" },
  mr: { label: "मराठी", short: "MR" }
};

export const copy = {
  appName: "Palladium Plus Society Ganeshotsav 2026",
  appNameMr: "पॅलेडियम प्लस सोसायटी गणेशोत्सव २०२६",
  nav: {
    home: { en: "Home", mr: "आजचे कार्यक्रम" },
    schedule: { en: "Schedule", mr: "संपूर्ण वेळापत्रक" },
    aarti: { en: "Aarti Seva", mr: "आरती सेवा" },
    winners: { en: "Winners", mr: "विजेते" },
    admin: { en: "Admin", mr: "प्रशासन" }
  },
  state: {
    upcoming: { en: "Festival upcoming", mr: "उत्सव लवकरच सुरू होईल" },
    in_progress: { en: "Festival in progress", mr: "उत्सव सुरू आहे" },
    completed: { en: "Festival completed", mr: "उत्सव पूर्ण झाला" }
  }
} as const;

export function pick(lang: Language, en: string, mr: string): string {
  return lang === "mr" ? mr : en;
}
