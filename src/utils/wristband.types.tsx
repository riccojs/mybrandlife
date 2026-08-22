export interface WristbandType {
  id: string;
  title: string;
  description: string;
  price: number;
  quantity: number;
  stock: number;
  banner: string;
  status: string;
  color: string;
  trackingNumber: string;
  create_at: string;
  shipped_at: string;
  idPrefix: string;
  mode: string;
  qrCode: string;
  shippingCarrier: string;
  uniqeId: string;
  userId: string;
  complete_at: string;
  delivered_at: string;
  subTotal: number;
  wristbandId: string;
  assignedFirstName: string;
  assignedLastName: string;
  assignedNickname: string;
}

export interface CreatePlanWristbandType {
  wristbandId: string;
  title: string;
  description: string;
  price: number;
  subTotal: number;
  quantity: number;
  color: string;
  banner: string;
}

export interface CreateWristbandType {
  title: string;
  description: string;
  price: string;
  color: string;
  stock: string;
  status: string;
  profile: File | null;
}

export interface OrderWristbandType {
  title: string;
  price: number;
  quantity: number;
  stock: number;
  status: string;
  color: string;
  trackingNumber: string;
  create_at: string;
  shipped_at: string;
  idPrefix: string;
  mode: string;
  qrCode: string;
  shippingCarrier: string;
  complete_at: string;
  delivered_at: string;
  subTotal: number;
  assignedFirstName: string;
  assignedLastName: string;
  assignedNickname: string;
}

export interface ExtraWristbandType {
  id: string;
  pulsetrackId: string;
  wristbandId: string;
  userId: string;
  idPrefix: string;
  title: string;
  price: number;
  quantity: number;
  subTotal: number;
  banner: string;
  color: string;
  assignedFirstName: string;
  assignedLastName: string;
  assignedNickname: string;
  status: string;
  shippingCarrier: string;
  trackingNumber: string;
  shipped_at: string;
  delivered_at: string;
  complete_at: string;
  transactionId: string;
  qrCode: string;
  mode: string;
  create_at: string;
  inproduction_at: string;
  cancel_at: string;
  refund_at: string;
  paid_at: string;
  disable_at: string;
  user: {
    firstName: string;
    lastName: string;
    id: string;
    email: string;
    landerName: string;
    midName: string;
    domain: string;
    privateDomain: string;
  };
}
