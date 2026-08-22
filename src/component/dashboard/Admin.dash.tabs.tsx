import { useGetAllOnboardByDefaultQuery } from "../../redux/features/onboard/onboardApi";

interface DataTypes {
  data: {
    users: UserDataType[];
  };
  isLoading: boolean;
}

interface UserDataType {
  id: string | null;
  email: string | null;
  create_at: string | null;
  landerName: string | null;
  planPrice: number | null;
  profile: string | null;
  userTemplete: TemplateType[];
  discountType: string;
}

interface TemplateType {
  id: string | null;
  logo: string | null;
  create_at: string | null;
  tagLine: string | null;
  offerings: string | null;
}

function AdminDashTabs({ data }: DataTypes) {
  const totalUser = data?.users?.length;
  const { data: getData } = useGetAllOnboardByDefaultQuery();
  const getUserData = data?.users?.filter((item) => {
    if (item?.discountType) {
      return item.discountType !== "LIFETIME";
    }
    return;
  });

  const totalEarning = getUserData?.reduce(
    (acc, item) => acc + (item?.planPrice || 0),
    0,
  );

  const totalOnboarding = getData?.onboard?.length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-5">
      <div className="border border-gray-200 p-5 rounded-lg bg-white">
        <div className="flex gap-3 items-start">
          <span className="text-[#00C897] bg-[#00c89625] min-w-20 min-h-20 flex justify-center items-center rounded-full">
            <i className="fa-solid fa-circle-user text-4xl"></i>
          </span>
          <span className="flex flex-col gap-1">
            <p className="text-medium text-3xl font-medium">Joined Users</p>
            <p className="font-normal text-xl text-[#00C897]">
              {totalUser} users
            </p>
            <h2 className="text-bold text-md">
              This section provides a comprehensive overview of the total number
              of users who have successfully registered and joined the platform
            </h2>
          </span>
        </div>
      </div>
      <div className="border border-gray-200 p-5 rounded-lg bg-white">
        <div className="flex gap-3 items-start">
          <span className="text-[#C91822] bg-[#c9182138] min-w-20 min-h-20 flex justify-center items-center rounded-full">
            <i className="fa-solid fa-hand-holding-dollar text-4xl"></i>
          </span>
          <span className="flex flex-col gap-1">
            <p className="text-medium text-3xl font-medium">Total Earning</p>
            <h2 className="text-bold text-xl text-[#C91822]">
              ${Number(totalEarning).toFixed(2)}
            </h2>
            <p className="text-normal text-md">
              This section highlights the platform’s total earnings,
              representing the cumulative revenue generated from all subscribed
              plans.
            </p>
          </span>
        </div>
      </div>
      <div className="border border-gray-200 p-5 rounded-lg bg-white">
        <div className="flex gap-3 items-start">
          <span className="text-[#FF782B] bg-[#ff792b33] min-w-20 min-h-20 flex justify-center items-center rounded-full">
            <i className="fa-solid fa-handshake text-4xl"></i>
          </span>
          <span className="flex flex-col gap-1">
            <p className="text-medium text-3xl font-medium">Total Onboarding</p>
            <h2 className="text-bold text-xl text-[#FF782B]">
              {totalOnboarding} Peoples
            </h2>
            <p className="text-normal text-md">
              This section provides an overview of the total number of users who
              have successfully joined the platform.
            </p>
          </span>
        </div>
      </div>
    </div>
  );
}

export default AdminDashTabs;
