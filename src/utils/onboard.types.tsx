// BPS post-payment onboarding — Launch MVP Brief V3, Section 5.

export type ApprovalMode = "" | "NO_APPROVAL" | "APPROVAL_REQUIRED";
export type ApprovalRule = "ANYONE" | "EVERYONE";
export type MblGoldChoice = "" | "USE_NOW" | "FINISH_LATER" | "OPT_OUT";

export interface Approver {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface PromoEvent {
  id: string;
  title: string;
  date: string;
  notes: string;
}

export interface AssetFile {
  id: string;
  category: string;
  name: string;
  size: number;
}

export interface OnboardData {
  // 1. Business
  brandName: string;
  contactName: string;
  contactCountry: string;
  contactPhone: string;
  contactEmail: string;
  website: string;
  industry: string;
  timezone: string;
  location: string;

  // 2. Brand direction
  description: string;
  targetAudience: string;
  productsServices: string;
  tones: string[];
  goals: string[];
  prohibited: string;

  // 3. Trend context
  competitors: string;
  recurringTopics: string;
  seasonalCycles: string;
  events: PromoEvent[];
  themesEmphasize: string;
  themesAvoid: string;

  // 4. Approval preference
  approvalMode: ApprovalMode;
  primaryApprover: Approver;
  additionalApprovers: Approver[];
  approvalRule: ApprovalRule;
  chainNotes: string;

  // 5. Assets
  /** Customer asked BPS to create a workspace for their brand assets. */
  createWorkspace: boolean;
  assetFiles: AssetFile[];
  assetNotes: string;

  // 6. Social platforms
  /** Selected platform ids (see PLATFORMS). */
  platforms: string[];
  socialNotes: string;

  // 7. MBL Gold
  mblGold: MblGoldChoice;

  // 8. Submit
  confirmed: boolean;
}

export interface OnboardRecord {
  data: OnboardData;
  currentStep: number;
  maxStep: number;
  updatedAt: string | null;
  submittedAt: string | null;
}

export type StepErrors = Record<string, string>;

export interface StepProps {
  data: OnboardData;
  update: (patch: Partial<OnboardData>) => void;
  errors: StepErrors;
}
