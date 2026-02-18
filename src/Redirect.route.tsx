import { useEffect } from "react";
import { useParams } from "react-router";

function RedirectRoute() {
  const { name } = useParams();

  useEffect(() => {
    window.location.href = name ? `/${name}` : "https://mybrandlife.me";
  }, [name]);

  return null;
}

export default RedirectRoute;
