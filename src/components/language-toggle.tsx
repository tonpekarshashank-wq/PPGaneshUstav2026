"use client";

import { languages } from "@/lib/i18n";
import { useLanguage } from "@/components/language-provider";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();
  return (
    <div className="flex rounded-full border border-maroon-800/20 bg-white p-1" aria-label="Language preference">
      {(["en", "mr"] as const).map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => setLanguage(option)}
          className={`min-h-9 rounded-full px-3 text-sm font-bold transition ${
            language === option ? "bg-maroon-600 text-white" : "text-maroon-800 hover:bg-saffron-50"
          }`}
          aria-pressed={language === option}
        >
          {languages[option].short}
        </button>
      ))}
    </div>
  );
}
