import type { ReactNode } from "react";
import { useGetLoggedBpsUserQuery } from "./api/bps.auth.api";

/**
 * Keeps one subscription to GET /bps/auth/logged for the whole app. The auth
 * slice fills `state.auth.user` from it, and login/checkout invalidate it so
 * it refetches. Rechecks the session when the tab regains focus.
 */
function AuthBootstrap({ children }: { children: ReactNode }) {
  useGetLoggedBpsUserQuery(undefined, { refetchOnFocus: true });
  return <>{children}</>;
}

export default AuthBootstrap;
