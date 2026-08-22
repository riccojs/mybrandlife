import type { UserType } from "./user.types";

export interface SpinType {
  isEnable: boolean;
  groupType: string;
  id: string;
  create_at: string;
  title: string;
  url: string;
  lander: {
    id: string;
    landerName: string;
    domain: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
  };
}

export interface RequestType {
  id: string;
  create_at: string;
  email: string;
  name: string;
  note: string;
  phone: string;
  accu: boolean;
  lat: string;
  lon: string;
  templateId: string;
  templete: {
    user: UserType;
  };
}
