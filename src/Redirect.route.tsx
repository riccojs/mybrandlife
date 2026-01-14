import { Navigate, useParams } from "react-router";

function RedirectRoute() {
  const params = useParams();
  const name = params.name;
  const redirecting = name ? `/${name}` : "/error";
  return <Navigate to={redirecting} replace />;
}

export default RedirectRoute;
