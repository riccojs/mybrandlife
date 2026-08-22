import { Outlet } from "react-router";
import Header from "../component/header/Header";
import Footer from "../component/footer/Footer";

const PublicRoute = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};

export default PublicRoute;
