import { Outlet } from "react-router";
import Header from "../component/Header";
import Footer from "../component/Footer";
import FinalCTA from "../component/overview/Final.cta";

/**
 * `contained` keeps page content inside the 1280px column. Auth pages pass
 * `contained={false}` so their background can span the full screen width.
 */
function PublicRoute({ contained = true }: { contained?: boolean }) {
  return (
    <>
      <Header />
      <main
        className={
          contained ? "mx-auto max-w-7xl bg-white px-4 sm:px-6 lg:px-8" : "bg-white"
        }
      >
        <Outlet />
      </main>
      <FinalCTA />
      <Footer />
    </>
  );
}

export default PublicRoute;
