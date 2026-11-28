export type ProductMode = "social" | "signage";

export type BillingPeriod = "monthly" | "yearly";

export interface PricingPlan {
  id: string;
  name: string;
  description: string;

  monthlyPrice: string;
  yearlyPrice: string;

  monthlyPriceNote?: string;
  yearlyPriceNote?: string;

  setupFee?: string;
  monthlySetupFee?: string;
  yearlySetupFee?: string;

  features: string[];
  extraFeatures?: string[];

  buttonText: string;
  secondaryButtonText?: string;

  popular?: boolean;
}

export interface PricingSelection {
  product: ProductMode;
  billing: BillingPeriod;
  plan: PricingPlan;
}
