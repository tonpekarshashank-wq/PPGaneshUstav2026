type AnalyticsPayload = Record<string, string | number | boolean | null | undefined>;

const piiKeys = ["name", "mobile", "phone", "flat", "wing", "note", "resident"];

export function scrubAnalyticsPayload(payload: AnalyticsPayload): AnalyticsPayload {
  return Object.fromEntries(
    Object.entries(payload).filter(([key]) => !piiKeys.some((pii) => key.toLowerCase().includes(pii)))
  );
}

export function trackEvent(eventName: string, payload: AnalyticsPayload = {}) {
  if (process.env.NEXT_PUBLIC_ANALYTICS_ENABLED !== "true") return;
  const safePayload = scrubAnalyticsPayload(payload);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("privacy-analytics", { detail: { eventName, payload: safePayload } }));
  }
}
