export interface MembershipType {
  user: {
    membership: {
      id: string;
    } | null;
    id: string;
  };
  planKey: string;
  planPrice: number;
  frequency: string;
  planOldPrice: number;
  session: {
    id: string;
  } | null;
  status: boolean;
}
export interface UserType {
  planKey: string;
  planPrice: number;
  planOldPrice: number;
  frequency: string;
  planId: string;
  id: string;
}
export type WristbandNameType =
  | "BLACK"
  | "RED"
  | "GREEN"
  | "YELLOW"
  | "BLUE"
  | "WHITE"
  | "ORANGE";
export type ActivationStatus =
  | "PENDING"
  | "ACTIVATE"
  | "DEACTIVATE"
  | "SUSPEND";
export type MembershipStatus = "ACTIVE" | "EXPIRED" | "PENDING";
export type LayoutDetection = "LEFT" | "RIGHT" | "CENTER";
export interface ButtonSetType {
  name: ButtonNames;
  url: string;
  id: string;
}

type ButtonNames =
  | "FACEBOOK"
  | "TWITTER"
  | "LINKEDIN"
  | "YOUTUBE"
  | "CUSTOM"
  | "SNAPCHAT"
  | "TIKTOK"
  | "EMAIL"
  | "PHONE"
  | "INSTAGRAM"
  | "REDDIT"
  | "TUMBLR"
  | "PINTEREST"
  | "WHATSAPP"
  | "WECHAT"
  | "TELEGRAM"
  | "DISCORD"
  | "TWITCH"
  | "GITHUB"
  | "SOUNDCLOUD"
  | "VIMEO"
  | "SPOTIFY"
  | "CLUBHOUSE"
  | "PERISCOPE"
  | "DRIBBLE"
  | "BEHANCE"
  | "DAILYMOTION"
  | "MIXCLOUD"
  | "FLICKR"
  | "ANCHOR"
  | "PATREON"
  | "NEXTDOOR";

export interface PlanWristbandType {
  wristbandId: string;
  userId: string;
  title: string;
  description: string;
  price: number;
  subTotal: number;
  quantity: number;
  banner: string;
  color: string;
  status: string;
  shipped_at: string;
  delivered_at: string;
}
