// DEMO onboarding store (localStorage, per user). Replace with
// GET/POST/PATCH /bps/onboard/:id when wiring the backend.
import { EMPTY_ONBOARD } from "../utils/onboard.data";
import type { OnboardRecord } from "../utils/onboard.types";

const key = (userId: string) => `bps_demo_onboard_${userId}`;

export function loadOnboard(userId: string): OnboardRecord {
  try {
    const raw = localStorage.getItem(key(userId));
    if (raw) {
      const rec = JSON.parse(raw) as OnboardRecord;
      const data = { ...EMPTY_ONBOARD, ...rec.data };
      // Older drafts stored platforms as { platform, handle } objects.
      data.platforms = (data.platforms as unknown[]).map((p) =>
        typeof p === "string" ? p : (p as { platform: string }).platform,
      );
      return { ...rec, data };
    }
  } catch {
    /* ignore corrupt drafts */
  }
  return { data: EMPTY_ONBOARD, currentStep: 0, maxStep: 0, updatedAt: null, submittedAt: null };
}

export function saveOnboard(userId: string, record: OnboardRecord) {
  localStorage.setItem(key(userId), JSON.stringify(record));
}

export async function submitOnboard(userId: string, record: OnboardRecord) {
  await new Promise((r) => setTimeout(r, 900));
  const submitted: OnboardRecord = { ...record, submittedAt: new Date().toISOString() };
  saveOnboard(userId, submitted);
  return submitted;
}

export function clearOnboard(userId: string) {
  localStorage.removeItem(key(userId));
}

