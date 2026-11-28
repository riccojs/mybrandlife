import { Navigate, Outlet, useLocation } from "react-router";
import Header from "../component/Header";
import Footer from "../component/Footer";
import PageLoader from "../component/common/Page.loader";
import { useAuth } from "../redux/hooks";
import { isMembershipActive } from "../redux/slice/auth.slice";

/** Signed-in users with an active BPS membership only. */
function PrivateRoute() {
  const { user, status } = useAuth();
  const location = useLocation();

  if (status === "checking") {
    return (
      <>
        <Header />
        <PageLoader label="Checking your session…" />
      </>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/auth/sign-in"
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }

  // Signed in but the BPS membership isn't active yet: finish checkout first.
  if (!isMembershipActive(user)) return <Navigate to="/get-started" replace />;

  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default PrivateRoute;
