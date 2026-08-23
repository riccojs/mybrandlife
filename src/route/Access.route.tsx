import { Navigate, Outlet } from "react-router";
import { useAuth } from "../hook/useAuth";
import Spiner from "../component/Spiner";

function AccessRoute() {
  const { user, isLoading } = useAuth() as {
    user: {
      package?: string;
    } | null;
    isLoading: boolean;
  };
  if (isLoading) {
    return <Spiner />;
  }
  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }
  if (user.package !== "gold") {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}

export default AccessRoute;
