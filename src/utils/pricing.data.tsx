import type { PricingPlan } from "./pricing.types";

export const socialPlans: PricingPlan[] = [
  {
    id: "basic",
    name: "Basic",
    description: "Entry-level consistent presence",
    setupFee: "$299 (not waived on yearly)",
    monthlyPrice: "$299/mo",
    yearlyPrice: "$3,289/yr",
    monthlySetupFee: "$299",
    yearlySetupFee: "$299 (not waived on yearly)",
    features: [
      "2 social platforms",
      "3 text/photo posts per week",
      "0 video/animation posts per week",
      "Human marketing creation",
      "Smart scheduling for better reach",
      "SLA to first post: 3–4 weeks",
      "SLA for edits: 5 working days, up to 3 edits",
      "TikTok included: No",
      "Add-ons available (SignPulse not available at this tier)",
      "Free MyBrandLife Gold Lander",
      "Includes: 1x SMSL",
      "Yearly savings vs monthly: $299",
    ],
    buttonText: "Select Basic (posting only)",
    secondaryButtonText: "+ Talk about adding SignPulse",
  },

  {
    id: "starter",
    name: "Starter",
    description: "Growing brands & venues",
    setupFee: "$299 (not waived on yearly)",
    monthlyPrice: "$499/mo",
    yearlyPrice: "$5,489/yr",
    monthlySetupFee: "$299",
    yearlySetupFee: "$299 (not waived on yearly)",
    features: [
      "4 social platforms",
      "4 text/photo posts per week",
      "1 video/animation post per week",
      "Human marketing creation",
      "Smart scheduling for better reach",
      "SLA to first post: 3–4 weeks",
      "SLA for edits: 3 working days, up to 4 edits",
      "TikTok included: No",
      "Add-ons available (SignPulse not available at this tier)",
      "Free MyBrandLife Gold Lander",
      "Includes: 1x SMSS",
      "Yearly savings vs monthly: $499",
    ],
    buttonText: "Select Starter (posting only)",
    secondaryButtonText: "+ Ask about SignPulse bundle",
  },

  {
    id: "growth",
    name: "Growth",
    description: "Busy bars & venues",
    setupFee: "$299 (not waived on yearly)",
    monthlyPrice: "$899/mo",
    yearlyPrice: "$9,889/yr",
    monthlySetupFee: "$299",
    yearlySetupFee: "$299 (waived on yearly)",
    features: [
      "6 social platforms",
      "4 text/photo posts per week",
      "2 video/animation posts per week",
      "Human marketing creation",
      "Smart scheduling for better reach",
      "SLA to first post: 2–3 weeks",
      "SLA for edits: 2 working days, up to 5 edits",
      "TikTok included (part of your platform options)",
      "All add-ons available",
      "Free MyBrandLife Gold Lander",
      "Includes: 1x SMSL",
      "Yearly savings vs monthly: $1,198",
    ],
    buttonText: "Select Growth (posting only)",
    secondaryButtonText: "+ Add SignPulse & unlock bundle discounts",
    popular: true,
  },

  {
    id: "pro",
    name: "Pro",
    description: "Multi-venue operators",
    setupFee: "$499 (waived on yearly)",
    monthlyPrice: "$1,499/mo",
    yearlyPrice: "$16,489/yr",
    monthlySetupFee: "$499",
    yearlySetupFee: "$499 (waived on yearly)",
    features: [
      "8 social platforms",
      "7 text/photo posts per week",
      "5 video/animation posts per week",
      "Human marketing creation",
      "Smart scheduling for better reach",
      "SLA to first post: 2–3 weeks",
      "SLA for edits: 5 working days, up to 3 edits",
      "TikTok included (part of your platform options)",
      "All add-ons available",
      "Free MyBrandLife Gold Lander",
      "Includes: 1x SMSL, 1x SMSP, 1x VFSL",
      "Yearly savings vs monthly: $1,998",
    ],
    buttonText: "Select Pro (posting only)",
    secondaryButtonText: "+ Add SignPulse & unlock bundle discounts",
  },

  {
    id: "enterprise",
    name: "Enterprise",
    description: "Chains & complex rollouts",
    setupFee: "$499 (waived on yearly)",
    monthlyPrice: "$1,999/mo",
    yearlyPrice: "$21,989/yr",
    monthlySetupFee: "$499",
    yearlySetupFee: "$499 (waived on yearly)",
    features: [
      "12 social platforms",
      "10 text/photo posts per week",
      "7 video/animation posts per week",
      "Human marketing creation",
      "Smart scheduling for better reach",
      "SLA to first post: 1–2 weeks",
      "SLA for edits: 5 working days, up to 3 edits",
      "TikTok included (part of your platform options)",
      "All add-ons available",
      "Free MyBrandLife Gold Lander",
      "Includes: 2x SMSL, 1x SMSP, 1x VFSS",
      "Yearly savings vs monthly: $2,498",
    ],

    buttonText: "Talk about Enterprise",
    secondaryButtonText: "Enterprise + SignPulse bundle",
  },
];

export const signagePlans: PricingPlan[] = [
  {
    id: "anchor",
    name: "Anchor",
    description: "Most customers run 1–2 Anchor signs",
    monthlyPrice: "Not available",
    yearlyPrice: "$999/yr per original sign",
    monthlyPriceNote: "Monthly per original sign: Not available",
    yearlyPriceNote: "Monthly per original sign: Not available (yearly only)",
    features: [
      "Content approach: same content across all Anchor signs",
      "Best for: logo loops and static general ads",
      "Update frequency: 4 content updates per year",
    ],

    buttonText: "Select Anchor (signage only)",
    secondaryButtonText: "Anchor + BPS bundle (5%+ off)",
  },

  {
    id: "menu",
    name: "Menu",
    description: "Most customers run 2–4 signs",
    monthlyPrice: "$149/mo per original sign",
    yearlyPrice: "$1,788/yr per original sign",
    monthlyPriceNote: "Monthly per original sign: $149",
    yearlyPriceNote: "Monthly per original sign: $149",
    features: [
      "Content approach: different content on each screen",
      "Best for: digital menu boards",
      "Update frequency: 1 content update per month",
    ],
    buttonText: "Select Menu (signage only)",
    secondaryButtonText: "Menu + BPS bundle (5%+ off)",
    popular: true,
  },

  {
    id: "momentum",
    name: "Momentum",
    description: "Most customers run 2–3 signs",
    monthlyPrice: "$239/mo per original sign",
    yearlyPrice: "$2,868/yr per original sign",
    monthlyPriceNote: "Monthly per original sign: $239",
    yearlyPriceNote: "Monthly per original sign: $239",
    features: [
      "Content approach: same content across most signs",
      "Best for: changing promos & seasonal offers",
      "Update frequency: 2 content updates per month",
    ],
    buttonText: "Select Momentum (signage only)",
    secondaryButtonText: "Momentum + BPS bundle (5%+ off)",
  },

  {
    id: "weekly",
    name: "Weekly",
    description: "Most customers run 4+ signs",
    monthlyPrice: "$399/mo per original sign",
    yearlyPrice: "$4,788/yr per original sign",
    monthlyPriceNote: "Monthly per original sign: $399",
    yearlyPriceNote: "Monthly per original sign: $399",
    features: [
      "Content approach: mix of shared and unique content",
      "Best for: aggressive in-house promos/campaigns",
      "Update frequency: weekly updates",
    ],

    buttonText: "Select Weekly (signage only)",
    secondaryButtonText: "Weekly + BPS bundle (5%+ off)",
  },
];

export const signageCoreFees = {
  title: "Core fees (all plans):",
  description: [
    "New account setup: $299 one-time",
    "Additional sign setup: $99 each",
    "Premium player per screen: $10/mo",
  ],
  note: "Free on Anchor, $99 on Menu, Momentum, Weekly",
};

export const pricingContent = {
  social: {
    eyebrow: "BRANDPULSE SOCIAL",
    title: "Done-for-you social posting (BPS)",
    description:
      "Real humans create and schedule your marketing content across multiple social platforms. Packages scale from Basic to Enterprise so you can match your volume, platforms, and SLA to your business.",
    bottomBannerTitle: "Bundle with SignPulse and keep it all in sync.",
    bottomBannerText:
      "When you add SignPulse digital signage to a qualifying BPS plan, your posts, promos and menus can power your in-house screens too. SignPulse plans include 5% off when bundled with BPS, plus another 5% off on eligible signage deployments.",
    bottomNote:
      "Only need screens right now? Switch to Digital Signage Only above to see SignPulse by itself.",
  },
  signage: {
    eyebrow: "SIGNPULSE",
    title: "SignPulse Digital Signage",
    description:
      "Done-for-you digital signage content, scheduling, and updates. Anchor through Weekly cover different deployment styles, content approaches, and update frequencies — all with optional bundling into BPS.",
    bottomBannerTitle: "Plan stacking + bundling = better pricing.",
    bottomBannerText:
      "All SignPulse plans include an extra 5% off with plan stacking plus 5% off when bundled with BPS. That means your signage gets cheaper as you roll it out across more screens and tie it into your social posting.",
    bottomNote:
      "Want us to handle social posting too? Switch back to Social Posting above to see BPS tiers, then combine them with your chosen SignPulse plan.",
  },
};
