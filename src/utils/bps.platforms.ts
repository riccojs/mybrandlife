import { PlatformName } from "@prisma/client";

export const bpsPlatform: Record<string, PlatformName[]> = {
  basicPlan: ["FACEBOOK", "TWITTER"],
  starterPlan: ["FACEBOOK", "TWITTER", "LINKEDIN", "INSTAGRAM"],
  growthPlan: [
    "FACEBOOK",
    "TWITTER",
    "LINKEDIN",
    "INSTAGRAM",
    "TIKTOK",
    "PINTEREST",
  ],
  proPlan: [
    "FACEBOOK",
    "TWITTER",
    "LINKEDIN",
    "INSTAGRAM",
    "TIKTOK",
    "PINTEREST",
    "DISCORD",
    "YOUTUBE",
  ],
  enterprisePlan: [
    "FACEBOOK",
    "TWITTER",
    "LINKEDIN",
    "YOUTUBE",
    "TIKTOK",
    "INSTAGRAM",
    "REDDIT",
    "TELEGRAM",
    "PINTEREST",
    "DISCORD",
    "DRIBBLE",
    "SNAPCHAT",
  ],
};
