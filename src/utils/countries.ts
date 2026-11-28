// Country dialing data used by every phone field. `groups` drives formatting
// (digits per block of the national number); `min`/`max` drive validation.

export interface Country {
  iso: string;
  name: string;
  dial: string;
  flag: string;
  groups: number[];
  min: number;
  max: number;
  /** Only available countries can be selected. Others are listed as "Not available yet". */
  available?: boolean;
}

export const COUNTRIES: Country[] = [
  { iso: "US", name: "United States", dial: "+1", flag: "🇺🇸", groups: [3, 3, 4], min: 10, max: 10, available: true },
  { iso: "CA", name: "Canada", dial: "+1", flag: "🇨🇦", groups: [3, 3, 4], min: 10, max: 10, available: true },
  { iso: "GB", name: "United Kingdom", dial: "+44", flag: "🇬🇧", groups: [4, 6], min: 10, max: 10 },
  { iso: "AU", name: "Australia", dial: "+61", flag: "🇦🇺", groups: [3, 3, 3], min: 9, max: 9 },
  { iso: "NZ", name: "New Zealand", dial: "+64", flag: "🇳🇿", groups: [2, 3, 4], min: 8, max: 10 },
  { iso: "IE", name: "Ireland", dial: "+353", flag: "🇮🇪", groups: [2, 3, 4], min: 9, max: 9 },
  { iso: "MX", name: "Mexico", dial: "+52", flag: "🇲🇽", groups: [3, 3, 4], min: 10, max: 10 },
  { iso: "BR", name: "Brazil", dial: "+55", flag: "🇧🇷", groups: [2, 5, 4], min: 10, max: 11 },
  { iso: "DE", name: "Germany", dial: "+49", flag: "🇩🇪", groups: [3, 4, 4], min: 10, max: 11 },
  { iso: "FR", name: "France", dial: "+33", flag: "🇫🇷", groups: [1, 2, 2, 2, 2], min: 9, max: 9 },
  { iso: "ES", name: "Spain", dial: "+34", flag: "🇪🇸", groups: [3, 3, 3], min: 9, max: 9 },
  { iso: "IT", name: "Italy", dial: "+39", flag: "🇮🇹", groups: [3, 3, 4], min: 9, max: 10 },
  { iso: "NL", name: "Netherlands", dial: "+31", flag: "🇳🇱", groups: [1, 4, 4], min: 9, max: 9 },
  { iso: "AE", name: "United Arab Emirates", dial: "+971", flag: "🇦🇪", groups: [2, 3, 4], min: 9, max: 9 },
  { iso: "SA", name: "Saudi Arabia", dial: "+966", flag: "🇸🇦", groups: [2, 3, 4], min: 9, max: 9 },
  { iso: "IN", name: "India", dial: "+91", flag: "🇮🇳", groups: [5, 5], min: 10, max: 10 },
  { iso: "BD", name: "Bangladesh", dial: "+880", flag: "🇧🇩", groups: [4, 6], min: 10, max: 10 },
  { iso: "PK", name: "Pakistan", dial: "+92", flag: "🇵🇰", groups: [3, 7], min: 10, max: 10 },
  { iso: "PH", name: "Philippines", dial: "+63", flag: "🇵🇭", groups: [3, 3, 4], min: 10, max: 10 },
  { iso: "SG", name: "Singapore", dial: "+65", flag: "🇸🇬", groups: [4, 4], min: 8, max: 8 },
  { iso: "ZA", name: "South Africa", dial: "+27", flag: "🇿🇦", groups: [2, 3, 4], min: 9, max: 9 },
  { iso: "NG", name: "Nigeria", dial: "+234", flag: "🇳🇬", groups: [3, 3, 4], min: 10, max: 10 },
  { iso: "JP", name: "Japan", dial: "+81", flag: "🇯🇵", groups: [2, 4, 4], min: 9, max: 10 },
];

export const DEFAULT_COUNTRY = "US";

export const isAvailableCountry = (iso: string | undefined) =>
  COUNTRIES.some((c) => c.iso === iso && c.available);

/** Returns the country if it can be selected, otherwise the default (US). */
export const getCountry = (iso: string | undefined) =>
  COUNTRIES.find((c) => c.iso === iso && c.available) ??
  COUNTRIES.find((c) => c.iso === DEFAULT_COUNTRY)!;

/** Best guess from the browser locale (e.g. "en-GB" → GB), falling back to US. */
export function detectCountry(): string {
  const langs = typeof navigator === "undefined" ? [] : navigator.languages ?? [navigator.language];
  for (const lang of langs) {
    const region = lang?.split("-")[1]?.toUpperCase();
    if (region && isAvailableCountry(region)) return region;
  }
  return DEFAULT_COUNTRY;
}

export function formatPhone(value: string, iso: string) {
  const c = getCountry(iso);
  const digits = value.replace(/\D/g, "").slice(0, c.max);
  const parts: string[] = [];
  let i = 0;
  for (const size of c.groups) {
    if (i >= digits.length) break;
    parts.push(digits.slice(i, i + size));
    i += size;
  }
  if (i < digits.length) parts.push(digits.slice(i));
  return parts.join("-");
}

export function phonePlaceholder(iso: string) {
  const c = getCountry(iso);
  return c.groups.map((n) => "X".repeat(n)).join("-");
}

export function phoneError(value: string, iso: string) {
  const c = getCountry(iso);
  const len = value.replace(/\D/g, "").length;
  if (len === 0) return "Enter a phone number.";
  if (len < c.min || len > c.max)
    return c.min === c.max
      ? `${c.name} numbers have ${c.min} digits.`
      : `${c.name} numbers have ${c.min}–${c.max} digits.`;
  return "";
}
