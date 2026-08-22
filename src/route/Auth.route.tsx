import { Outlet } from "react-router";
import Spiner from "../component/Spiner";
import { useAuth } from "../hook/useAuth";

const AuthRoute = () => {
  const redirectUrl = import.meta.env.VITE_APP_REDIRECT_ROUTE;

  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Spiner />;
  }
  if (user) {
    window.location.replace(redirectUrl);
    return <Spiner />;
  }

  return <Outlet />;
};

export default AuthRoute;
