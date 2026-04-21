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
