import { Outlet } from "react-router";
import { useState } from "react";
import { useAuth } from "../hook/useAuth";
import Header from "../component/header/Header";
import MobileHeader from "../component/header/Mobile.header";
import Footer from "../component/footer/Footer";
import Sidebar from "../component/sidebar/Sidebar";
import Spiner from "../component/Spiner";

function AuthRoute() {
  const [sidebar, setSidebard] = useState(false);
  const [navbar, setNavbar] = useState(false);
  const redirectUrl = import.meta.env.VITE_APP_REDIRECT_ROUTE;
  const { user, isLoading } = useAuth() as {
    user: { role: string } | null;
    isLoading: boolean;
  };

  if (isLoading) {
    return <Spiner />;
  }

  if (!isLoading && !user) {
    window.location.replace(redirectUrl);
    return <Spiner />;
  }

  return (
    <main className="flex">
      <Sidebar sidebar={sidebar} />
      <div className="w-full min-w-0">
        <Header
          sidebar={sidebar}
          setSidebard={setSidebard}
          setNavbar={setNavbar}
        />
        <main className="h-auto min-h-screen bg-[#F5F5F5]">
          <Outlet />
        </main>
        <Footer />
        <MobileHeader setNavbar={setNavbar} navbar={navbar} />
      </div>
    </main>
  );
}

export default AuthRoute;
