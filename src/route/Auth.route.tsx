import { Navigate, Outlet } from "react-router";
import Spiner from "../component/Spiner";
import { useAuth } from "../hook/useAuth";

const AuthRoute = () => {
  const { user, isLoading } = useAuth();
  if (isLoading) {
    return <Spiner />;
  }
  if (!isLoading && user) {
    return <Navigate to="/" />;
  }
  return <Outlet />;
};

export default AuthRoute;
