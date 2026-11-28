import { baseApi, getErrorStatus } from "./base.api";
import { clearAuthToken, setAuthToken } from "../auth.token";
import type { BpsCheckoutPayload } from "../../utils/bps.checkout";

// ---------- Backend shapes (prisma `user` / `bpsMembership`) ----------

export type ActivationStatus = "PENDING" | "ACTIVATE" | "DEACTIVATE" | "SUSPEND";

export interface BpsMembership {
  id: string;
  userId: string | null;
  /** Stripe plan key, e.g. GROWTH_YEARLY. */
  plan: string;
  heading: string;
  tier: string;
  price: number;
  setupFee: number;
  status: ActivationStatus;
  transactionId: string;
  activate_at: string | null;
  csAccountId: string | null;
  csWorkspaceId: string | null;
  create_at: string;
  update_at: string;
}

export interface BpsUser {
  id: string;
  username: string | null;
  firstName: string;
  midName: string;
  lastName: string;
  email: string;
  phone: string | null;
  phoneCode: string | null;
  profile: string | null;
  landerName: string;
  domain: string;
  status: ActivationStatus;
  verifyEmail: boolean;
  create_at: string;
  bpsMembership: BpsMembership | null;
}

// ---------- Request bodies ----------

export interface RegisterBpsUserBody {
  email: string;
  firstName: string;
  midName: string;
  lastName: string;
  password: string;
  phone: string;
  phoneCode: string;
  landerName: string;
  domain: string;
  aggreement: boolean;
}

interface MessageResponse {
  status?: string;
  message: string;
}

export const bpsAuthApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // GET /bps/auth/logged — current BPS user from the bpsToken cookie.
    getLoggedBpsUser: build.query<BpsUser, void>({
      query: () => "bps/auth/logged",
      transformResponse: (res: { user: BpsUser }) => res.user,
      providesTags: ["BpsUser"],
      async onQueryStarted(_arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          // Expired or rejected token: stop sending it.
          if (getErrorStatus((err as { error?: unknown })?.error) === 401) clearAuthToken();
        }
      },
    }),

    // POST /bps/auth/register — creates the user and emails a 6-digit code.
    registerBpsUser: build.mutation<BpsUser, RegisterBpsUserBody>({
      query: (body) => ({ url: "bps/auth/register", method: "POST", body }),
      transformResponse: (res: { user: BpsUser }) => res.user,
    }),

    // POST /bps/auth/verify — confirms the emailed code.
    verifyBpsUser: build.mutation<MessageResponse, { code: string }>({
      query: (body) => ({ url: "bps/auth/verify", method: "POST", body }),
    }),

    // POST /auth/send/otp — emails a fresh code (same user table as BPS).
    resendBpsOtp: build.mutation<MessageResponse, { email: string }>({
      query: (body) => ({ url: "auth/send/otp", method: "POST", body }),
    }),

    // POST /bps/auth/login — sets the httpOnly bpsToken cookie.
    // Use `useSignIn()` (redux/hooks) to sign in and load the profile together.
    loginBpsUser: build.mutation<MessageResponse & { token?: string }, { email: string; password: string }>({
      query: (body) => ({ url: "bps/auth/login", method: "POST", body }),
      async onQueryStarted(_arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.token) setAuthToken(data.token);
        } catch {
          /* the page shows the error */
        }
      },
    }),

    // POST /bps/auth/logout — clears the bpsToken cookie.
    logoutBpsUser: build.mutation<MessageResponse, void>({
      query: () => ({ url: "bps/auth/logout", method: "POST" }),
    }),

    // POST /bps/auth/checkout/:id — returns the Stripe Checkout URL.
    checkoutBpsUser: build.mutation<
      { message: string; pageUrl: string },
      { userId: string; body: BpsCheckoutPayload }
    >({
      query: ({ userId, body }) => ({
        url: `bps/auth/checkout/${userId}`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_res, error) => (error ? [] : ["BpsUser"]),
    }),

    // POST /auth/send/code — emails a password reset link.
    sendResetLink: build.mutation<MessageResponse, { email: string }>({
      query: (body) => ({ url: "auth/send/code", method: "POST", body }),
    }),

    // POST /auth/reset — sets a new password using the emailed token.
    resetPassword: build.mutation<MessageResponse, { token: string; password: string }>({
      query: (body) => ({ url: "auth/reset", method: "POST", body }),
    }),
  }),
});

export const {
  useGetLoggedBpsUserQuery,
  useRegisterBpsUserMutation,
  useVerifyBpsUserMutation,
  useResendBpsOtpMutation,
  useLoginBpsUserMutation,
  useLogoutBpsUserMutation,
  useCheckoutBpsUserMutation,
  useSendResetLinkMutation,
  useResetPasswordMutation,
} = bpsAuthApi;
