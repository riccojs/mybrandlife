import { useAuth } from "../../hook/useAuth";

interface AuthType {
  user: ItemType | null;
}

interface ItemType {
  midName: string | null;
  create_at: string | null;
  package: string | null;
  frequency: string | null;
  domain: string | null;
  landerName: string | null;
}

function DashTabs() {
  const { user } = useAuth() as AuthType;
  const {
    create_at,
    package: pkgType,
    frequency,
    domain,
    landerName,
  } = user || {};

  const daysAgo = create_at
    ? Math.floor(
        (Date.now() - new Date(create_at).getTime()) / (1000 * 60 * 60 * 24),
      )
    : 0;

  const formattedDate = (value: string) => {
    const createDate = new Date(value);
    return createDate?.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-5 my-5">
      <div className="border border-gray-200 p-5 rounded-lg bg-white">
        <div className="flex gap-3 items-center">
          <span className="text-[#00C897] bg-[#00c89625] min-w-20 min-h-20 flex justify-center items-center rounded-full">
            <i className="fa-brands fa-creative-commons-remix text-4xl"></i>
          </span>
          <span className="flex flex-col gap-1">
            <p className="text-medium text-3xl font-medium">Joined On</p>
            <h2 className="text-bold text-xl">
              {formattedDate(create_at ? create_at : "")}
            </h2>
            <p className="text-normal text-md">
              Joined {daysAgo} day{daysAgo !== 1 ? "s" : ""} ago!
            </p>
          </span>
        </div>
      </div>
      <div className="border border-gray-200 p-5 rounded-lg bg-white">
        <div className="flex gap-3 items-center">
          <span className="text-[#C91822] bg-[#c9182138] min-w-20 min-h-20 flex justify-center items-center rounded-full">
            <i className="fa-solid fa-money-bill-trend-up text-4xl"></i>
          </span>
          <span className="flex flex-col gap-1">
            <p className="text-medium text-3xl font-medium">
              Subscription Tier
            </p>
            <h2 className="text-bold text-xl">
              Your have chose {pkgType} Package
            </h2>
            <p className="text-normal text-md">Your tier is {frequency}</p>
          </span>
        </div>
      </div>
      <div className="border border-gray-200 p-5 rounded-lg bg-white">
        <div className="flex gap-3 items-center">
          <span className="text-[#FF782B] bg-[#ff792b33] min-w-20 min-h-20 flex justify-center items-center rounded-full">
            <i className="fa-regular fa-address-card text-4xl"></i>
          </span>
          <span className="flex flex-col gap-1">
            <p className="text-medium text-3xl font-medium">Selected Domain</p>
            <h2 className="text-bold text-xl">
              Your have chose {domain} domain
            </h2>
            <p className="text-normal text-md">
              Your landername is {landerName}
            </p>
          </span>
        </div>
      </div>
    </div>
  );
}

export default DashTabs;
