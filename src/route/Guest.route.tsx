import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../redux/hooks";
import { isMembershipActive } from "../redux/slice/auth.slice";
import PageLoader from "../component/common/Page.loader";

/** Auth pages (sign in, reset) are only for signed-out visitors. */
function GuestRoute() {
  const { user, status } = useAuth();
  const location = useLocation();

  if (status === "checking") return <PageLoader label="Checking your session…" />;
  if (user) {
    // Signed in but not paid yet: finish checkout first.
    // Keep plan_code / billing_cycle from the sign-in URL so the chosen plan carries over.
    if (!isMembershipActive(user)) {
      return <Navigate to={{ pathname: "/get-started", search: location.search }} replace />;
    }
    const from = (location.state as { from?: string } | null)?.from;
    return <Navigate to={from && from.startsWith("/") ? from : "/onboard"} replace />;
  }
  return <Outlet />;
}

export default GuestRoute;
