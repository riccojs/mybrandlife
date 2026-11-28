import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { bpsAuthApi, type ActivationStatus, type BpsUser } from "../api/bps.auth.api";
import { isPlanCode, type BillingCycle, type PlanCode } from "../../utils/plan.config";
import { COUNTRIES, DEFAULT_COUNTRY } from "../../utils/countries";
import { loadOnboard } from "../../services/demo.onboard.service";

export type ServiceStatus = "SETUP_REQUIRED" | "SETUP_IN_PROGRESS" | "ACTIVE";

/** The signed-in user, in the shape the UI reads. Built from GET /bps/auth/logged. */
export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  phoneCountry: string;
  phoneCode: string;
  landerName: string;
  planCode: PlanCode;
  billingCycle: BillingCycle;
  /** bpsMembership.status, or null when the user never started checkout. */
  membershipStatus: ActivationStatus | null;
  serviceStatus: ServiceStatus;
  createdAt: string;
}

/** "checking" until the first /logged call settles. */
export type AuthStatus = "checking" | "authenticated" | "guest";

interface AuthState {
  user: AuthUser | null;
  status: AuthStatus;
}

const initialState: AuthState = { user: null, status: "checking" };

export const isMembershipActive = (user: AuthUser | null) =>
  user?.membershipStatus === "ACTIVATE";

function toAuthUser(api: BpsUser, previous: AuthUser | null): AuthUser {
  const plan = api.bpsMembership?.plan ?? "";
  const code = plan.split("_")[0]?.toLowerCase();
  const phoneCode = api.phoneCode ?? "+1";
  // Onboarding isn't wired to the API yet, so its progress still comes from
  // the local onboarding draft (or the value the onboarding page last set).
  const serviceStatus: ServiceStatus =
    previous?.id === api.id
      ? previous.serviceStatus
      : loadOnboard(api.id).submittedAt
        ? "SETUP_IN_PROGRESS"
        : "SETUP_REQUIRED";

  return {
    id: api.id,
    firstName: api.firstName ?? "",
    lastName: api.lastName ?? "",
    email: api.email,
    phone: api.phone ?? "",
    phoneCode,
    phoneCountry: COUNTRIES.find((c) => c.dial === phoneCode)?.iso ?? DEFAULT_COUNTRY,
    landerName: api.landerName,
    planCode: isPlanCode(code) ? code : "growth",
    billingCycle: plan.toUpperCase().endsWith("_MONTHLY") ? "monthly" : "annual",
    membershipStatus: api.bpsMembership?.status ?? null,
    serviceStatus,
    createdAt: api.create_at,
  };
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /** Local-only changes (e.g. onboarding progress) until those APIs are wired. */
    patchUser(state, action: PayloadAction<Partial<Omit<AuthUser, "id">>>) {
      if (state.user) state.user = { ...state.user, ...action.payload };
    },
    signedOut(state) {
      state.user = null;
      state.status = "guest";
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(bpsAuthApi.endpoints.getLoggedBpsUser.matchFulfilled, (state, action) => {
        state.user = toAuthUser(action.payload, state.user);
        state.status = "authenticated";
      })
      .addMatcher(bpsAuthApi.endpoints.getLoggedBpsUser.matchRejected, (state, action) => {
        // A "condition" rejection only means the request was skipped (already cached / in flight).
        if (action.meta.condition) return;
        state.user = null;
        state.status = "guest";
      });
  },
});

export const { patchUser, signedOut } = authSlice.actions;
export default authSlice.reducer;
