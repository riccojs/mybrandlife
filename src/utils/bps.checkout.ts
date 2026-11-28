// Builds the body for POST /bps/auth/checkout/:id from the pricing data the
// customer sees, so the stored membership matches what was shown on the page.
import { socialPlans } from "./pricing.data";
import type { BillingCycle, PlanCode } from "./plan.config";

/** Prisma `FeatureName` enum. */
export type BpsFeatureName =
  | "SOCIAL_PLATFORM"
  | "GENERAL_POST"
  | "VIDEO_POST"
  | "MARKETING_CREATION"
  | "SMART_SCHEDULING"
  | "SLA_POST"
  | "SLA_EDIT"
  | "TIKTOK_INCLUDE"
  | "ADD_ONS"
  | "FREE_MYBRANDLIFE"
  | "INCLUDES"
  | "YEARLY_SAVING";

export interface BpsCheckoutPayload {
  /** Stripe price key, e.g. GROWTH_YEARLY (backend env BASIC_MONTHLY … ENTERPRISE_YEARLY). */
  plan: string;
  /** Platform set key, e.g. growthPlan (backend utils/bps.platforms.ts). */
  planKey: string;
  heading: string;
  tier: string;
  /** Whole dollars (bpsMembership.price is an Int). */
  price: number;
  setupFee: number;
  features: { title: BpsFeatureName; value: number }[];
}

/** "$9,889/yr" → 9889 */
const toAmount = (text: string | undefined) => {
  const match = text?.match(/\$\s*([\d,]+)/);
  return match ? Number(match[1].replace(/,/g, "")) : 0;
};

const isWaived = (text: string | undefined) =>
  !!text && /waived/i.test(text) && !/not waived/i.test(text);

/** Reads the numeric value of each pricing feature line. */
export function parseFeatures(lines: string[]): BpsCheckoutPayload["features"] {
  const out: BpsCheckoutPayload["features"] = [];
  const add = (title: BpsFeatureName, value: number) => out.push({ title, value });

  for (const line of lines) {
    let m: RegExpMatchArray | null;
    if ((m = line.match(/^(\d+)\s+social platforms?/i))) add("SOCIAL_PLATFORM", +m[1]);
    else if ((m = line.match(/^(\d+)\s+text\/photo posts?/i))) add("GENERAL_POST", +m[1]);
    else if ((m = line.match(/^(\d+)\s+video\/animation posts?/i))) add("VIDEO_POST", +m[1]);
    else if (/human marketing creation/i.test(line)) add("MARKETING_CREATION", 1);
    else if (/smart scheduling/i.test(line)) add("SMART_SCHEDULING", 1);
    else if ((m = line.match(/SLA to first post:\s*(\d+)(?:\s*[–-]\s*(\d+))?\s*weeks?/i)))
      add("SLA_POST", +(m[2] ?? m[1]));
    else if ((m = line.match(/SLA for edits:\s*(\d+)\s*working days?/i))) add("SLA_EDIT", +m[1]);
    else if (/tiktok included/i.test(line)) add("TIKTOK_INCLUDE", /:\s*no\b/i.test(line) ? 0 : 1);
    else if (/add-ons available/i.test(line)) add("ADD_ONS", 1);
    else if (/mybrandlife gold/i.test(line)) add("FREE_MYBRANDLIFE", 1);
    else if (/^includes:/i.test(line)) {
      const counts = [...line.matchAll(/(\d+)\s*x/gi)].map((x) => +x[1]);
      add("INCLUDES", counts.reduce((a, b) => a + b, 0));
    } else if (/yearly savings/i.test(line)) add("YEARLY_SAVING", toAmount(line));
  }
  return out;
}

export function buildCheckoutPayload(planCode: PlanCode, cycle: BillingCycle): BpsCheckoutPayload {
  const plan = socialPlans.find((p) => p.id === planCode);
  if (!plan) throw new Error(`Unknown plan: ${planCode}`);
  const monthly = cycle === "monthly";
  const setupText = monthly ? plan.monthlySetupFee : plan.yearlySetupFee;

  return {
    plan: `${planCode.toUpperCase()}_${monthly ? "MONTHLY" : "YEARLY"}`,
    planKey: `${planCode}Plan`,
    heading: plan.description,
    tier: plan.name,
    price: toAmount(monthly ? plan.monthlyPrice : plan.yearlyPrice),
    setupFee: isWaived(setupText) ? 0 : toAmount(setupText),
    features: parseFeatures(plan.features),
  };
}
