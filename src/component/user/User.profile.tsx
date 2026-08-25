import { useParams } from "react-router";
import { useGetOneUserQuery } from "../../redux/features/auth/authApi";
import UserForm from "./User.form";

function UserProfile() {
  const params = useParams();
  const id = params.id;
  const { data, isLoading } = useGetOneUserQuery(id);

  return isLoading ? (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#cbf38b] border-solid"></div>
    </div>
  ) : (
    <UserForm data={data} />
  );
}

export default UserProfile;
