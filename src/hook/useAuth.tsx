import { useLoggedUserQuery } from "../redux/features/auth/authApi";

export function useAuth() {
  const { data, isLoading, isError } = useLoggedUserQuery();
  const user = !isError && data?.user ? data.user : null;
  return { user, isLoading };
}
