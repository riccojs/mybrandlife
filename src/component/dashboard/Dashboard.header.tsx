import WaveImg from "../../assets/wave.png";
import BannerImg from "../../assets/banner_img-DaEcZgVi.png";
import { Link } from "react-router";
import { useAuth } from "../../hook/useAuth";

interface AuthType {
  user: ItemType | null;
}

interface ItemType {
  username: string;
}

function DashboardHeader() {
  const { user } = useAuth() as AuthType;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Good Morning";
    if (hour >= 12 && hour < 17) return "Good Afternoon";
    if (hour >= 17 && hour < 21) return "Good Evening";
    return "Good Night 🌙";
  };

  return (
    <div className="flex lg:flex-row flex-col xl:gap-0 gap-10 items-center justify-between border border-gray-200 p-8 rounded-md bg-white">
      <div className="flex gap-2 flex-col">
        <div>
          <p className="text-[#96c94b] font-bold text-5xl uppercase">
            {getGreeting()}
          </p>
          <span className="flex gap-2 items-center mt-1">
            <p className="text-medium text-4xl capitalize">
              {user?.username ? user?.username : ""}
            </p>
            <img src={WaveImg} alt="" className="w-8" />
          </span>
        </div>
        <h3 className="text-3xl font-medium text-black">
          Streamline Operations with the Admin Dashboard
        </h3>

        <p className="text-normal text-md w-full md:w-7/12">
          Admin Dashboard provides a centralized hub where administrators can
          manage every aspect of the system in one place. From monitoring user
          activity and managing roles, to handling content, settings, payments,
          and reports—everything is accessible in an intuitive interface
          designed for efficiency.
        </p>
        <div className="flex gap-3 items-center">
          <Link to={"/admin/onboard"} className="w-fit primary-btn mt-5">
            Check all Onboards
          </Link>
          <Link
            to={"/admin/user"}
            className="w-fit py-2 px-4 bg-white border-2 rounded-lg border-[#96c94b] mt-5"
          >
            Check all Users
          </Link>
        </div>
      </div>
      <div className="lg:block hidden lg:w-12/12 2xl:w-4/12">
        <img src={BannerImg} alt="" className="w-96" />
      </div>
    </div>
  );
}

export default DashboardHeader;
