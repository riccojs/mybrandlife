import { Link } from "react-router";
import Avater1 from "../../assets/avater-1.webp";
import RecentUserLoader from "../loader/Recent.loader";

interface DataTypes {
  data: {
    users: UserDataType[];
  };
  isLoading: boolean;
}

interface TemplateType {
  id: string | null;
  logo: string | null;
  create_at: string | null;
  tagLine: string | null;
  offerings: string | null;
}

interface UserDataType {
  id: string | null;
  email: string | null;
  create_at: string | null;
  landerName: string | null;
  profile: string | null;
  userTemplete: TemplateType[];
}

function DashboardMembers({ data, isLoading }: DataTypes) {
  const formattedDate = (value: string) => {
    const createDate = new Date(value);
    return createDate?.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // decide what to render
  let content;
  if (isLoading) {
    content = (
      <>
        <RecentUserLoader />
        <RecentUserLoader />
        <RecentUserLoader />
        <RecentUserLoader />
        <RecentUserLoader />
        <RecentUserLoader />
      </>
    );
  }
  if (!isLoading && data?.users?.length === 0) {
    content = <p>Data not found</p>;
  }
  if (!isLoading && data?.users?.length > 0) {
    content = data?.users?.slice(0, 5)?.map((item) => {
      const { id, landerName, email, create_at, userTemplete } = item || {};
      return (
        <div key={id} className="flex gap-2 items-center">
          <img
            src={userTemplete?.[0]?.logo ? userTemplete?.[0]?.logo : Avater1}
            alt=""
            className="w-18 h-18 rounded-full"
          />
          <div className="w-full flex justify-between items-center">
            <span>
              <h3 className="text-xl text-bold capitalize">{landerName}</h3>
              <p className="text-gray-500 text-base font-normal">{email}</p>
            </span>
            <span>
              <h3 className="text-sm text-bold">Join At</h3>
              <p className="text-gray-500 text-sm font-normal">
                {formattedDate(create_at ? create_at : "")}
              </p>
            </span>
          </div>
        </div>
      );
    });
  }
  return (
    <div className="border border-gray-200 p-5 rounded-md bg-white w-full lg:w-6/12">
      <span className="flex justify-between items-center">
        <h2 className="text-medium text-xl">Recent Join Users</h2>
        <Link to="/user" className="text-red-500">
          See all
        </Link>
      </span>

      <div className="w-14 h-1 rounded-full my-3 bg-[#00C897]"></div>
      <div className="flex flex-col gap-6">{content}</div>
    </div>
  );
}

export default DashboardMembers;
