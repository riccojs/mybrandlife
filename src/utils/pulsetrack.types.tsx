import type { UserType } from "./user.types";
import type { WristbandType } from "./wristband.types";

export interface PulsetrackType {
  id: string;
  sequence: number;
  landerId: string;
  name: string;
  baseDomain: string;
  basePath: string;
  idPrefix: string;
  active: string;
  subTotal: string;
  total: string;
  expediteProduction: string;
  expediteShipping: string;
  create_at: string;
  wristbands: WristbandType[];
  lander: UserType;
  address: string;
  city: string;
  state: string;
  zip: number;
}

export interface DefaultPulsetrackType {
  wristband: WristbandType[];
  pulsetrack: PulsetrackType[];
  analytics: AnalyticsType[];
}

export interface AnalyticsType {
  id: string;
  pulsetrackId: string;
  landerId: string;
  idPrefix: number;
  occurredAt: string;
  landingUrl: string;
  referrer: string;
  referrerDomain: string;
  browser: string;
  os: string;
  deviceType: string;
  screenWidth: number;
  screenHeight: number;
  devicePixelRatio: number;
  language: string;
  timeZone: string;
  connectionType: string;
  firstVisit: boolean;
  isUnique: boolean;
  ipAddress: string;
  geoCity: string;
  geoRegion: string;
  geoCountry: string;
  gpsLat: number;
  gpsLan: number;
  gpsAccuracy: number;
  gpsTimestamp: string;
  gpsConsent: boolean;
  create_at: string;
}
