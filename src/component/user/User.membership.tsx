import { useParams } from "react-router";
import { useGetOneUserQuery } from "../../redux/features/auth/authApi";
import MembershipForm from "./Membership.form";

function UserMembership() {
  const params = useParams();
  const id = params.id;
  const { data, isLoading } = useGetOneUserQuery(id);

  return isLoading ? (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#cbf38b] border-solid"></div>
    </div>
  ) : (
    <MembershipForm data={data} id={data?.user?.id} />
  );
}

export default UserMembership;
