import { Navigate, Outlet } from "react-router";
import { useState } from "react";
import { useAuth } from "../hook/useAuth";
import Sidebar from "../component/sidebar/Sidebar";
import Header from "../component/header/Header";
import Footer from "../component/footer/Footer";
import MobileHeader from "../component/header/Mobile.header";
import Spiner from "../component/Spiner";

function PrivateRoute() {
  const [sidebar, setSidebard] = useState(false);
  const [navbar, setNavbar] = useState(false);
  const { user, isLoading } = useAuth() as {
    user: { email: string } | null;
    isLoading: boolean;
  };

  if (isLoading) {
    return <Spiner />;
  }

  if (!isLoading && !user) {
    return <Navigate to="/auth/login" />;
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

export default PrivateRoute;
