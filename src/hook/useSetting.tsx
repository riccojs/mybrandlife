import { useGetSettingQuery } from "../redux/features/auth/authApi";

export function useSetting() {
  const { data, isLoading, isError } = useGetSettingQuery();
  const setting = !isError && data?.setting ? data.setting : null;
  return { setting, isLoading };
}
