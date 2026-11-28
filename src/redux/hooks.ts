import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "./store";
import { baseApi } from "./api/base.api";
import { bpsAuthApi, useLoginBpsUserMutation, useLogoutBpsUserMutation } from "./api/bps.auth.api";
import { patchUser, signedOut, type AuthUser } from "./slice/auth.slice";
import { clearAuthToken, setAuthToken } from "./auth.token";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

/** Signed-in BPS user plus session helpers. */
export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, status } = useAppSelector((s) => s.auth);
  const [logoutRequest] = useLogoutBpsUserMutation();

  const logout = useCallback(async () => {
    try {
      await logoutRequest().unwrap();
    } catch {
      // Sign out locally even if the request fails.
    }
    clearAuthToken();
    dispatch(signedOut());
    // Drop every cached response that belonged to this user.
    dispatch(baseApi.util.resetApiState());
  }, [dispatch, logoutRequest]);

  const updateUser = useCallback(
    (patch: Partial<Omit<AuthUser, "id">>) => dispatch(patchUser(patch)),
    [dispatch],
  );

  return { user, status, logout, updateUser };
}

export class SignInError extends Error {
  /** "credentials": login refused. "profile": logged in, but /logged failed. */
  readonly stage: "credentials" | "profile";

  constructor(message: string, stage: "credentials" | "profile", cause?: unknown) {
    super(message, { cause });
    this.stage = stage;
  }
}

/**
 * POST /bps/auth/login, then GET /bps/auth/logged. The auth slice picks up the
 * profile, so route guards redirect on their own. Resolves with the profile.
 */
export function useSignIn() {
  const dispatch = useAppDispatch();
  const [loginRequest] = useLoginBpsUserMutation();

  return useCallback(
    async (email: string, password: string) => {
      try {
        const res = await loginRequest({ email: email.trim().toLowerCase(), password }).unwrap();
        // Store before /logged runs so it can authenticate with the Bearer token.
        if (res.token) setAuthToken(res.token);
      } catch (err) {
        throw new SignInError("Login failed", "credentials", err);
      }
      try {
        return await dispatch(
          bpsAuthApi.endpoints.getLoggedBpsUser.initiate(undefined, { forceRefetch: true, subscribe: false }),
        ).unwrap();
      } catch (err) {
        throw new SignInError("Profile failed", "profile", err);
      }
    },
    [dispatch, loginRequest],
  );
}
