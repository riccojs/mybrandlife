import type { CreatePlanWristbandType } from "./wristband.types";

export interface UserType {
  frequency: string;
  domain: string;
  packageType: string;
  planKey: string;
  planPrice: number;
  planOldPrice: number;
  email: string;
  password: string;
  landerName: string;
  midName: string;
  firstName: string;
  lastName: string;
  nickName?: string;
  phone: string;
  secondEmail?: string;
  aggreement: boolean;
  discount: number;
  discountType: string;
  referalCode: string;
  primaryAddress: LocationType;
  shippingAddress: LocationType;
  phoneCode: string;
  privateDomain: string;
  username: string;
  profile: string | File | null;
}

export interface LocationType {
  state: string;
  city: string;
  country: string;
  zip: string;
  streetOne: string;
  streetTow: string;
  type: "PRIMARY" | "SHIPPING";
}

export interface OnboardTypes {
  referalCode: string;
  bio: string;
  tagLine: string;
  offerings: string;
  services: string[];
  funnySaying: string;
  userId: string | null;
  vfrCreate: string | null;
  socialLinks: UrlsTypes;
  headerImage?: File | null;
  logoImage?: File | null;
  bodyImage?: File | null;
  epkFile?: File | null;
  merchendiselogo?: File | null;
  merchendiseUrl: string;
  customPlatform: CustomPlatformItem[];
  wristbands: CreatePlanWristbandType[];
}

export interface CustomPlatformItem {
  name: string;
  url: string;
}

interface UrlsTypes {
  [key: string]: string;
}

export interface UserDataType {
  id: string | null;
  email: string | null;
  create_at: string | null;
  landerName: string;
  planPrice: number | null;
  profile: string | null;
  userTemplete: TemplateType[];
  discountType: string;
  enableDirectory: boolean;
  firstName: string;
  nickName: string;
  domain: string;
}

export interface TemplateType {
  id: string | null;
  logo: string | null;
  create_at: string | null;
  tagLine: string | null;
  offerings: string | null;
}

export interface UserSettingType {
  username: string;
  firstName: string;
  midName: string;
  lastName: string;
  email: string;
  phone: string;
  profile: File | null | string;
  landerName: string;
  package: string;
  frequency: string;
  status: string;
  domain: string;
  discountType: string;
  privateDomain: string;
  phoneCode: string;
  enablePrivateDomain: boolean;
  id: string;
}
