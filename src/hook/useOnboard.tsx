import { useParams } from "react-router";
import { useGetOneOnboardQuery } from "../redux/features/onboard/onboardApi";

export function useOnboard() {
  const params = useParams();
  // const domain = "mystudentlife.me";
  const domain = window.location.hostname;
  const name = params?.name;
  const { data, isLoading, isError } = useGetOneOnboardQuery({ name, domain });
  const onboard = !isError && data?.onboard ? data.onboard : null;
  return { onboard, isLoading };
}
