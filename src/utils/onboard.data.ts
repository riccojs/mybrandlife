import type { OnboardData, StepErrors } from "./onboard.types";
import { phoneError } from "./countries";

export const uid = () =>
  crypto.randomUUID?.() ?? Math.random().toString(36).slice(2) + Date.now().toString(36);

export const formatBytes = (n: number) =>
  n < 1024 ? `${n} B` : n < 1048576 ? `${(n / 1024).toFixed(0)} KB` : `${(n / 1048576).toFixed(1)} MB`;

// ---------- Options ----------
export const INDUSTRIES = [
  "Restaurant, Bar & Hospitality",
  "Retail & E-commerce",
  "Health, Wellness & Fitness",
  "Beauty & Personal Care",
  "Healthcare & Medical",
  "Real Estate",
  "Home Services & Trades",
  "Professional Services",
  "Technology & SaaS",
  "Supply Chain & Logistics",
  "Education & Training",
  "Events & Entertainment",
  "Automotive",
  "Nonprofit & Community",
  "Other",
];

export const TIMEZONES = [
  "Eastern Time (US & Canada)",
  "Central Time (US & Canada)",
  "Mountain Time (US & Canada)",
  "Arizona (no DST)",
  "Pacific Time (US & Canada)",
  "Alaska",
  "Hawaii",
  "Atlantic Time (Canada)",
  "UTC / GMT",
  "London (GMT/BST)",
  "Central European Time",
];

export const TONES = ["Professional", "Friendly", "Conversational", "Educational", "Bold", "Playful", "Premium", "Inspirational", "Witty", "Warm"];
export const MAX_TONES = 4;

export const GOALS = [
  "Brand awareness & visibility",
  "Stay consistently active",
  "Promote offers & events",
  "Drive foot traffic or bookings",
  "Website or MyBrandLife page visits",
  "Community engagement",
  "Thought leadership",
  "Recruiting & company culture",
];

export const ASSET_CATEGORIES = [
  { id: "logos", label: "Logos", accept: "image/*,.svg,.ai,.eps,.pdf" },
  { id: "photos", label: "Photos", accept: "image/*" },
  { id: "videos", label: "Videos", accept: "video/*" },
  { id: "brand-guide", label: "Brand guide", accept: ".pdf,.doc,.docx,.ppt,.pptx,image/*" },
  { id: "offers", label: "Offers & promotions", accept: "image/*,.pdf,.doc,.docx" },
  { id: "menus", label: "Menus / price lists", accept: "image/*,.pdf,.doc,.docx" },
  { id: "source", label: "Other source material", accept: "*" },
];

// Mirrors the backend PlatformName enum.
export const PLATFORMS = [
  { id: "FACEBOOK", label: "Facebook", color: "#1877F2", short: "f" },
  { id: "INSTAGRAM", label: "Instagram", color: "#E1306C", short: "IG" },
  { id: "LINKEDIN", label: "LinkedIn", color: "#0A66C2", short: "in" },
  { id: "TWITTER", label: "X (Twitter)", color: "#111111", short: "X" },
  { id: "TIKTOK", label: "TikTok", color: "#000000", short: "TT" },
  { id: "YOUTUBE", label: "YouTube", color: "#FF0000", short: "YT" },
  { id: "PINTEREST", label: "Pinterest", color: "#E60023", short: "P" },
  { id: "REDDIT", label: "Reddit", color: "#FF4500", short: "r/" },
  { id: "TELEGRAM", label: "Telegram", color: "#229ED9", short: "TG" },
  { id: "DISCORD", label: "Discord", color: "#5865F2", short: "DC" },
  { id: "SNAPCHAT", label: "Snapchat", color: "#E4D000", short: "SC" },
  { id: "DRIBBLE", label: "Dribbble", color: "#EA4C89", short: "Dr" },
];

export const MBL_GOLD_OPTIONS = [
  { id: "USE_NOW", title: "Use it now", description: "Set up my MyBrandLife Gold page alongside BPS onboarding." },
  { id: "FINISH_LATER", title: "Finish later", description: "Keep the benefit; I'll complete my page another time." },
  { id: "OPT_OUT", title: "Opt out of a public page", description: "Keep the entitlement but don't publish a public page for now." },
] as const;

// ---------- Empty + demo data ----------
export const emptyApprover = () => ({ id: uid(), name: "", email: "", role: "" });

export const EMPTY_ONBOARD: OnboardData = {
  brandName: "", contactName: "", contactCountry: "US", contactPhone: "", contactEmail: "", website: "", industry: "", timezone: "", location: "",
  description: "", targetAudience: "", productsServices: "", tones: [], goals: [], prohibited: "",
  competitors: "", recurringTopics: "", seasonalCycles: "", events: [], themesEmphasize: "", themesAvoid: "",
  approvalMode: "", primaryApprover: { id: "primary", name: "", email: "", role: "" }, additionalApprovers: [], approvalRule: "ANYONE", chainNotes: "",
  createWorkspace: false, assetFiles: [], assetNotes: "",
  platforms: [], socialNotes: "",
  mblGold: "",
  confirmed: false,
};

export const DEMO_ONBOARD: OnboardData = {
  brandName: "Harbor & Vine Bistro",
  contactName: "Jordan Rivera",
  contactCountry: "US",
  contactPhone: "555-010-2030",
  contactEmail: "jordan@harborandvine.com",
  website: "harborandvine.com",
  industry: "Restaurant, Bar & Hospitality",
  timezone: "Eastern Time (US & Canada)",
  location: "Charleston, SC — downtown & Mount Pleasant",
  description: "A neighborhood bistro serving seasonal Lowcountry dishes, natural wines, and a weekend brunch. We host live jazz on Thursdays and private events in our courtyard.",
  targetAudience: "Locals aged 28–55 who enjoy dining out, couples planning date nights, brunch groups, and visitors looking for an authentic Charleston experience.",
  productsServices: "Dinner service, weekend brunch, wine flights, private courtyard events, catering for up to 80 guests, gift cards.",
  tones: ["Friendly", "Warm", "Premium"],
  goals: ["Brand awareness & visibility", "Promote offers & events", "Drive foot traffic or bookings"],
  prohibited: "No discount claims over 20%. Never mention alcohol promotions to under-21 audiences. Avoid political topics and competitor comparisons.",
  competitors: "@lowcountrytable, @kingstreetkitchen — we like their behind-the-scenes kitchen reels.",
  recurringTopics: "Chef's weekly special, Thursday jazz night, wine of the week, staff spotlights, local farm partners.",
  seasonalCycles: "Spring oyster season, summer patio launch, fall harvest menu, holiday party bookings (Nov–Dec), Valentine's Day prix fixe.",
  events: [
    { id: uid(), title: "Holiday prix fixe menu launch", date: "2026-12-05", notes: "Four courses, $65 per person. Reservations open Nov 25." },
    { id: uid(), title: "New Year's Eve jazz dinner", date: "2026-12-31", notes: "Limited seating, live quartet, champagne toast." },
  ],
  themesEmphasize: "Local sourcing, hospitality, the courtyard atmosphere, our chef's story.",
  themesAvoid: "Diet culture, heavy discounting, anything that feels like fast food.",
  approvalMode: "APPROVAL_REQUIRED",
  primaryApprover: { id: "primary", name: "Jordan Rivera", email: "jordan@harborandvine.com", role: "Owner" },
  additionalApprovers: [{ id: uid(), name: "Sam Lee", email: "sam@harborandvine.com", role: "General Manager" }],
  approvalRule: "ANYONE",
  chainNotes: "Promotions with pricing should be checked by Jordan; everyday posts can be approved by Sam.",
  createWorkspace: true,
  assetFiles: [
    { id: uid(), category: "logos", name: "harbor-vine-logo.svg", size: 48_210 },
    { id: uid(), category: "photos", name: "courtyard-evening.jpg", size: 2_480_000 },
    { id: uid(), category: "menus", name: "winter-dinner-menu.pdf", size: 640_000 },
  ],
  assetNotes: "Please use the navy + gold logo on light backgrounds. More food photos coming after our December shoot.",
  platforms: ["INSTAGRAM", "FACEBOOK", "TIKTOK", "PINTEREST"],
  socialNotes: "Instagram is our most important channel.",
  mblGold: "USE_NOW",
  confirmed: false,
};

// ---------- Validation ----------
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
const isUrlish = (v: string) => /^(https?:\/\/)?[\w-]+(\.[\w-]+)+(\/\S*)?$/i.test(v.trim());
const blank = (v: string) => !v.trim();

export function validateStep(step: number, d: OnboardData, platformLimit: number): StepErrors {
  const e: StepErrors = {};
  const req = (key: keyof OnboardData, msg: string) => {
    if (blank(String(d[key] ?? ""))) e[key] = msg;
  };

  switch (step) {
    case 0:
      req("brandName", "Enter your brand or business name.");
      req("contactName", "Enter the primary contact's name.");
      {
        const phoneErr = phoneError(d.contactPhone, d.contactCountry);
        if (phoneErr) e.contactPhone = phoneErr;
      }
      if (!isEmail(d.contactEmail)) e.contactEmail = "Enter a valid email address.";
      if (!isUrlish(d.website)) e.website = "Enter a valid website, e.g. yourbrand.com.";
      req("industry", "Choose an industry.");
      req("timezone", "Choose a timezone.");
      req("location", "Enter your location or service area.");
      break;
    case 1:
      req("description", "Describe your business.");
      req("targetAudience", "Describe your target audience.");
      req("productsServices", "List your main products or services.");
      if (d.tones.length === 0) e.tones = "Pick at least one tone.";
      if (d.goals.length === 0) e.goals = "Pick at least one goal.";
      req("prohibited", "List prohibited topics or claims, or write “None”.");
      break;
    case 2:
      req("recurringTopics", "Add the topics you want us to cover regularly.");
      req("seasonalCycles", "Describe your busy seasons or yearly cycles.");
      d.events.forEach((ev) => {
        if (blank(ev.title)) e[`events.${ev.id}.title`] = "Add a title or remove this item.";
      });
      break;
    case 3:
      if (!d.approvalMode) e.approvalMode = "Choose how content should be published.";
      if (d.approvalMode === "APPROVAL_REQUIRED") {
        if (blank(d.primaryApprover.name)) e["primaryApprover.name"] = "Enter the approver's name.";
        if (!isEmail(d.primaryApprover.email)) e["primaryApprover.email"] = "Enter a valid email.";
        const seen = new Set([d.primaryApprover.email.trim().toLowerCase()]);
        d.additionalApprovers.forEach((a) => {
          if (blank(a.name)) e[`approver.${a.id}.name`] = "Enter a name.";
          if (!isEmail(a.email)) e[`approver.${a.id}.email`] = "Enter a valid email.";
          else if (seen.has(a.email.trim().toLowerCase())) e[`approver.${a.id}.email`] = "This email is already an approver.";
          seen.add(a.email.trim().toLowerCase());
        });
      }
      break;
    case 4:
      if (!d.createWorkspace) e.createWorkspace = "Select “Create a workspace” to continue.";
      break;
    case 5:
      if (d.platforms.length === 0) e.platforms = "Choose at least one platform.";
      if (d.platforms.length > platformLimit) e.platforms = `Your plan includes up to ${platformLimit} platforms.`;
      break;
    case 6:
      if (!d.mblGold) e.mblGold = "Choose what to do with your MyBrandLife Gold benefit.";
      break;
    case 7:
      if (!d.confirmed) e.confirmed = "Please confirm your information is correct.";
      break;
  }
  return e;
}
