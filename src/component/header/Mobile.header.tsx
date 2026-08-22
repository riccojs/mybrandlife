import { Link, NavLink, useLocation } from "react-router";
import { useEffect, useState } from "react";
import { useAuth } from "../../hook/useAuth";
import MYDJLIFE from "../../assets/logos/mydjlife.png";
import MYINFLUENCERLIFE from "../../assets/logos/myinfluencerlife.png";
import MYSTUDENTLIFE from "../../assets/logos/mystudentlife.png";
import MYRESTRURENTLIFE from "../../assets/logos/myrestrurentlife.png";
import MYBUSINESSLIFE from "../../assets/logos/myBusinessLife.png";
import MYCHEFLIFE from "../../assets/logos/myChefLife.png";
import MYMUSICLIFE from "../../assets/logos/myMusicLife.png";
import MYPIZZALIFE from "../../assets/logos/myPizzaLife.png";
import MYSTORELIFE from "../../assets/logos/myStoreLife.png";
import MYBARTENDINGLIFE from "../../assets/logos/myBartendingLife.png";
import MYFRELANCERLIFE from "../../assets/logos/myFreelancerLife.png";
import MYSERVICELIFE from "../../assets/logos/myservicelife.png";
import MYTEMPLIFE from "../../assets/logos/mytemplife.png";
import MYCOOKINGLIFE from "../../assets/logos/mycookinglife.png";
import MYCPALIFE from "../../assets/logos/mycpalife.png";
import MYENTERTAINMENTLIFE from "../../assets/logos/myentertainmentlife.png";
import MYNIGHTLIFE from "../../assets/logos/mynightlife.png";
import MYAILIFE from "../../assets/logos/myailife.png";
import MYCLUBLIFE from "../../assets/logos/myclublife.png";
import MYMEDIALIFE from "../../assets/logos/mymedialife.png";
import MYSTYLISTLIFE from "../../assets/logos/mystylistlife.png";
import MYDEVLIFE from "../../assets/logos/mydevlife.png";
import MYLATINLIFE from "../../assets/logos/mylatinlife.png";
import MYMARKETLIFE from "../../assets/logos/mymakerlife.png";
import MYSALOONLIFE from "../../assets/logos/mysaloonLife.png";
import MYBARBERLIFE from "../../assets/logos/mybarberlife.png";
import MYGYMLIFE from "../../assets/logos/mygymlife.png";
import MYNITELIFE from "../../assets/logos/mynitelife.png";
import MYSALONLIFE from "../../assets/logos/mysalonlife.png";
import MYWORLDLIFE from "../../assets/logos/myworldlife.png";
import MYBARLIFE from "../../assets/logos/mybarlife.png";
import MYEVENTLIFE from "../../assets/logos/myeventlife.png";
import { userMenu } from "../../utils/menu.data";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import { useGetAllOnboardQuery } from "../../redux/features/onboard/onboardApi";

interface Types {
  navbar: boolean;
  setNavbar: React.Dispatch<React.SetStateAction<boolean>>;
}

function MobileHeader({ navbar, setNavbar }: Types) {
  const handleClose = () => {
    setNavbar(false);
  };
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState("");
  const { user, isLoading } = useAuth() as {
    user: { id: string; domain: string; package: string } | null;
    isLoading: boolean;
  };
  const { data } = useGetAllOnboardQuery({
    page: 1,
    limit: 10,
    searchBy: "",
    statusBy: "",
    userId: user?.id,
  });
  const totalOnboard = data?.data?.totalOnboard;
  const domain = user?.domain ?? "";
  const getLogo: Record<string, string> = {
    mydjlife: MYDJLIFE,
    myinfluencerlife: MYINFLUENCERLIFE,
    mystudentlife: MYSTUDENTLIFE,
    myrestaurantlife: MYRESTRURENTLIFE,
    mybusinesslife: MYBUSINESSLIFE,
    mycheflife: MYCHEFLIFE,
    mymusiclife: MYMUSICLIFE,
    mypizzalife: MYPIZZALIFE,
    mystorelife: MYSTORELIFE,
    mybartendinglife: MYBARTENDINGLIFE,
    myfreelancerlife: MYFRELANCERLIFE,
    myservicelife: MYSERVICELIFE,
    mytemplife: MYTEMPLIFE,
    mycookinglife: MYCOOKINGLIFE,
    mycpalife: MYCPALIFE,
    myentertainmentlife: MYENTERTAINMENTLIFE,
    mynightlife: MYNIGHTLIFE,
    myailife: MYAILIFE,
    myclublife: MYCLUBLIFE,
    mymedialife: MYMEDIALIFE,
    mystylistlife: MYSTYLISTLIFE,
    mydevlife: MYDEVLIFE,
    mylatinlife: MYLATINLIFE,
    mymakerlife: MYMARKETLIFE,
    mysaloonLife: MYSALOONLIFE,
    mybarberlife: MYBARBERLIFE,
    mygymlife: MYGYMLIFE,
    mynitelife: MYNITELIFE,
    mysalonlife: MYSALONLIFE,
    myworldlife: MYWORLDLIFE,
    mybarlife: MYBARLIFE,
    myeventlife: MYEVENTLIFE,
  };

  useEffect(() => {
    if (navbar) {
      window.scrollTo(0, 0);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [navbar]);

  const handleToggle = (menu: string) => {
    const value = openMenu === menu ? "" : menu;
    setOpenMenu(value);
  };

  const isBuildMode = !isLoading && totalOnboard === 0;

  useEffect(() => {
    const activeMenu = userMenu.find((menu) =>
      menu.children.some((child) => location.pathname.includes(child.path)),
    );
    if (activeMenu) {
      setOpenMenu(activeMenu.name);
    }
  }, [location.pathname]);

  return (
    <header className="w-full">
      <div
        onClick={() => setNavbar(false)}
        className={`fixed top-0 left-0 w-full h-full bg-[#00000040] z-20 ${
          navbar ? "active" : "inactive"
        }`}
      ></div>

      <div
        className={
          navbar
            ? "w-72 h-screen bg-white border-r border-gray-200 absolute top-0 left-0 active z-20"
            : "w-72 h-screen bg-white border-r border-gray-200 absolute top-0 left-0 inactive"
        }
      >
        <div className="relative">
          <div className="flex justify-center items-center py-2">
            <Link to={""}>
              <img
                src={getLogo[domain.replace(".me", "")]}
                alt=""
                className="w-24 h-24 min-w-24 min-h-24"
              />
            </Link>
          </div>
          <div className="mt-5">
            <h2 className="text-thin text-sm pl-8 uppercase tracking-widest">
              Overview
            </h2>
            <nav className="mt-5">
              <ul className="flex flex-col gap-1">
                {userMenu.map((menu) => (
                  <li key={menu.name} className="px-4">
                    <button
                      onClick={() => handleToggle(menu.name)}
                      className={`flex items-center cursor-pointer justify-between w-full py-2 px-4 rounded-lg ${openMenu === menu.name ? "bg-[#96c94b]" : ""}`}
                    >
                      <div className="flex items-center gap-2">
                        <img src={menu?.icon} alt="" className="w-6" />
                        <p className="font-medium">{menu.name}</p>
                      </div>
                      <span>
                        {openMenu === menu.name ? (
                          <IoIosArrowUp />
                        ) : (
                          <IoIosArrowDown />
                        )}
                      </span>
                    </button>
                    <AnimatePresence>
                      {openMenu === menu.name && (
                        <motion.ul
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="ml-3 mt-2 flex flex-col gap-1 overflow-hidden"
                        >
                          {menu.children
                            .filter((child) => {
                              if (
                                child.name === "Onboard" ||
                                child.name === "Build Your Lander"
                              ) {
                                return isBuildMode
                                  ? child.name === "Build Your Lander"
                                  : child.name === "Onboard";
                              }
                              return true;
                            })
                            .map((child) => (
                              <li className="">
                                <NavLink
                                  to={
                                    user?.package !== "gold" && child.restrict
                                      ? "/dashboard"
                                      : child?.path
                                  }
                                  className={({ isActive }) =>
                                    `flex gap-2 rounded-lg items-center py-2 px-4 ${
                                      isActive
                                        ? " text-[#000000] bg-[#96c94b]"
                                        : " text-[#212529]"
                                    } ${
                                      user?.package !== "gold" && child.restrict
                                        ? "bg-gray-200 opacity-60"
                                        : "hover:text-[#000000] hover:bg-[#96c94b]"
                                    }`
                                  }
                                >
                                  <img
                                    src={child?.icon}
                                    alt=""
                                    className="w-6"
                                  />
                                  {user?.package !== "gold" &&
                                  child.restrict ? (
                                    <p className="font-medium text-base">
                                      {child.name}{" "}
                                      <span className="text-xs font-normal text-red-500">
                                        Gold Only
                                      </span>
                                    </p>
                                  ) : (
                                    <p className="font-medium text-base">
                                      {child.name}
                                    </p>
                                  )}
                                </NavLink>
                              </li>
                            ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <button
            onClick={handleClose}
            className="border border-gray-300 shadow-sm rounded-full bg-white w-8 h-8 flex justify-center items-center absolute top-1 -right-3.75 hover:bg-[#2B7F75] hover:text-white cursor-pointer"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>
    </header>
  );
}

export default MobileHeader;
