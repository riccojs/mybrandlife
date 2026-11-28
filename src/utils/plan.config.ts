// Centralized BPS plan entitlements (Launch MVP Brief V3, Section 8).
// Keep these data-driven: the onboarding wizard and account UI read from here.

export type PlanCode = "basic" | "starter" | "growth" | "pro" | "enterprise";
export type BillingCycle = "monthly" | "annual";

export interface PlanEntitlement {
  code: PlanCode;
  name: string;
  platformLimit: number;
  staticPerWeek: number;
  imagePerWeek: number;
  videoPerWeek: number;
  analyticsLevel: string;
}

export const PLAN_ENTITLEMENTS: Record<PlanCode, PlanEntitlement> = {
  basic: { code: "basic", name: "Basic", platformLimit: 4, staticPerWeek: 2, imagePerWeek: 1, videoPerWeek: 0, analyticsLevel: "Basic" },
  starter: { code: "starter", name: "Starter", platformLimit: 6, staticPerWeek: 2, imagePerWeek: 2, videoPerWeek: 1, analyticsLevel: "Expanded" },
  growth: { code: "growth", name: "Growth", platformLimit: 8, staticPerWeek: 3, imagePerWeek: 3, videoPerWeek: 2, analyticsLevel: "Deeper" },
  pro: { code: "pro", name: "Pro", platformLimit: 10, staticPerWeek: 3, imagePerWeek: 4, videoPerWeek: 4, analyticsLevel: "Advanced" },
  enterprise: { code: "enterprise", name: "Enterprise", platformLimit: 12, staticPerWeek: 4, imagePerWeek: 6, videoPerWeek: 6, analyticsLevel: "Highest tier" },
};

export const isPlanCode = (value: unknown): value is PlanCode =>
  typeof value === "string" && value in PLAN_ENTITLEMENTS;

export const getPlan = (code: PlanCode | undefined) =>
  PLAN_ENTITLEMENTS[code && isPlanCode(code) ? code : "growth"];
