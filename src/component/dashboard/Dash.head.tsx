import WaveImg from "../../assets/wave.png";
import BannerImg from "../../assets/banner_img-DaEcZgVi.png";
import { Link } from "react-router";

interface AuthType {
  user: ItemType | null;
}

interface ItemType {
  midName: string;
}

function DashHead({ user }: AuthType) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Good Morning";
    if (hour >= 12 && hour < 17) return "Good Afternoon";
    if (hour >= 17 && hour < 21) return "Good Evening";
    return "Good Night 🌙";
  };

  return (
    <div className="flex md:flex-row flex-col xl:gap-0 gap-10 justify-between border border-gray-200 p-8 rounded-md bg-white">
      <div className="flex gap-2 flex-col">
        <div>
          <p className="text-[#96c94b] font-bold text-5xl uppercase">
            {getGreeting()}
          </p>
          <span className="flex gap-2 items-center mt-1">
            <p className="text-medium text-4xl capitalize">
              {user?.midName ? user?.midName : ""}
            </p>
            <img src={WaveImg} alt="" className="w-8" />
          </span>
        </div>
        <h3 className="text-3xl font-medium text-black">
          Build Your Brand with My Brand Life
        </h3>
        <p className="text-normal text-md w-full">
          Welcome back - Your Brand, Your Life, Your Way
        </p>
        <p className="text-normal text-md w-full md:w-7/12">
          From idea to launch, manage everything in one place — create,
          customize, and scale your business with ease.
        </p>
        <Link to={"/onboard"} className="w-fit primary-btn mt-5">
          Check Onboard
        </Link>
      </div>
      <div className="md:block hidden">
        <img src={BannerImg} alt="" className="w-72" />
      </div>
    </div>
  );
}

export default DashHead;
