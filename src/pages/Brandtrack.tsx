import { TbDeviceDesktopAnalytics } from "react-icons/tb";
import LanderAnalytics from "../component/dashboard/Lander.analytics";
import ButtonClicksBar from "../component/dashboard/Button.clicks.bar";
import { Link, useNavigate } from "react-router";
import { useEffect } from "react";
import { useAuth } from "../hook/useAuth";

interface AuthType {
  user: ItemType | null;
  isLoading: boolean;
}

interface ItemType {
  midName: string;
  landerName: string;
  package: string;
  userTemplete: [];
  domain: string;
}

function Brandtrack() {
  const { user } = useAuth() as AuthType;
  const navigate = useNavigate();
  const lander = user?.landerName || "";

  useEffect(() => {
    if (user?.package !== "gold") {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const existTemplate = user && user?.userTemplete?.length > 0 ? true : false;

  return (
    <div className="p-5">
      <div className="flex md:flex-row flex-col justify-between items-start md:items-center">
        <div className="md:w-6/12 w-full">
          <h2 className="text-normal text-2xl md:text-3xl">BrandTrack</h2>
          <ul className="flex gap-2 items-center py-2">
            <li>
              <Link
                to="/dashboard"
                className="text-normal text-sm md:text-base"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <i className="fa-solid fa-angles-right text-xs"></i>
            </li>
            <li>
              <p className="text-normal text-sm md:text-base">{user?.domain}</p>
            </li>
            <li>
              <i className="fa-solid fa-angles-right text-xs"></i>
            </li>
            <li>
              <p className="text-normal text-sm md:text-base">
                BrandTrack Info
              </p>
            </li>
          </ul>
        </div>
      </div>
      <div className="bg-white border border-gray-200 flex gap-3 items-center w-full text-black text-3xl font-medium p-3 rounded-lg my-3">
        <TbDeviceDesktopAnalytics color="#7bb53d" size={50} />
        <p>BrandTrack</p>
      </div>
      {existTemplate ? (
        user?.package === "gold" ? (
          lander && <LanderAnalytics lander={lander} />
        ) : (
          <div className="relative w-full h-150 rounded-lg overflow-hidden bg-white border border-gray-200">
            <div className="absolute inset-0 blur-sm pointer-events-none opacity-90">
              <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                <p className="text-gray-400">Analytics Content</p>
              </div>
            </div>
            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
              <p className="text-sm font-semibold text-red-500 uppercase tracking-wide">
                Gold Package Only
              </p>
              <p className="mt-2 text-base text-gray-700 max-w-md">
                Analytics dashboard is available exclusively for Gold plan
                users. Upgrade your plan to unlock detailed insights and
                performance metrics.
              </p>
              <Link
                to="/subscription"
                className="mt-4 rounded-md bg-yellow-400 px-5 py-2 text-sm font-semibold text-black hover:bg-yellow-500"
              >
                Upgrade to Gold
              </Link>
            </div>
          </div>
        )
      ) : null}
      {existTemplate && user?.package === "gold"
        ? lander && <ButtonClicksBar lander={lander} />
        : null}
    </div>
  );
}

export default Brandtrack;
