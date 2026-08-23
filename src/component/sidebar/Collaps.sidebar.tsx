import { NavLink, useLocation } from "react-router";
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
import MYVIBELIFE from "../../assets/logos/MyVibeLife.png";
import MYPHOTOLIFE from "../../assets/logos/MyPhotoLife.png";
import MYPHOTOGRAPHYLIFE from "../../assets/logos/MyPhotographyLife.png";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGetAllOnboardQuery } from "../../redux/features/onboard/onboardApi";
import { useAuth } from "../../hook/useAuth";
import { userMenu } from "../../utils/menu.data";

function CollapsSidebar() {
  const redirectUrl = import.meta.env.VITE_APP_REDIRECT_ROUTE;
  const { user, isLoading } = useAuth() as {
    user: { domain: string; package: string; id: string };
    isLoading: boolean | null;
  };
  const location = useLocation();
  const [showNav, setShowNav] = useState("");
  const menuRef = useRef<HTMLDivElement | null>(null);
  const domain = user?.domain ?? "";
  const { data } = useGetAllOnboardQuery({
    page: 1,
    limit: 10,
    searchBy: "",
    statusBy: "",
    userId: user?.id,
  });
  const totalOnboard = data?.data?.totalOnboard;
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
    mysaloonlife: MYSALOONLIFE,
    mybarberlife: MYBARBERLIFE,
    mygymlife: MYGYMLIFE,
    mynitelife: MYNITELIFE,
    mysalonlife: MYSALONLIFE,
    myworldlife: MYWORLDLIFE,
    mybarlife: MYBARLIFE,
    myeventlife: MYEVENTLIFE,
    myvibelife: MYVIBELIFE,
    myphotolife: MYPHOTOLIFE,
    myphotographylife: MYPHOTOGRAPHYLIFE,
  };

  const handleToggle = (menu: string) => {
    setShowNav((prev) => (prev === menu ? "" : menu));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowNav("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const isBuildMode = !isLoading && totalOnboard === 0;

  const isMenuActive = (menu: { children: { path: string }[] }) => {
    return menu.children.some((child) => {
      const childPath = child.path.startsWith("/")
        ? child.path
        : `/${child.path}`;
      if (childPath === "/") {
        return location.pathname === "/";
      }
      return (
        location.pathname === childPath ||
        location.pathname.startsWith(`${childPath}/`)
      );
    });
  };

  return (
    <div className="">
      <div className="flex justify-center items-center py-2">
        <a href={redirectUrl} target="_blank">
          <img
            src={getLogo[domain.replace(".me", "")]}
            alt=""
            className="w-12 h-12 min-w-12 min-h-12"
          />
        </a>
      </div>
      <div className="mt-5" ref={menuRef}>
        <nav className="mt-5">
          <ul className="flex flex-col gap-4">
            {userMenu?.map((menu) => (
              <li className="flex justify-center">
                <div className="relative z-50">
                  <button
                    onClick={() => handleToggle(menu.name)}
                    className={`border cursor-pointer border-gray-300 shadow-sm rounded-md w-12 h-12 flex justify-center items-center ${
                      isMenuActive(menu)
                        ? "text-[#000000] bg-[#96c94b]"
                        : "text-[#212529]"
                    }`}
                  >
                    <img src={menu?.icon} alt="" className="w-8" />
                  </button>
                  <AnimatePresence>
                    {showNav === menu.name && (
                      <motion.div
                        initial={{ opacity: 0, x: -10, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -10, scale: 0.95 }}
                        transition={{
                          duration: 0.18,
                          ease: "easeOut",
                        }}
                        className="absolute flex flex-col gap-1 left-full top-0 ml-3 w-64 bg-white shadow-lg rounded-md p-3 z-50"
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
                            <li key={child.name}>
                              <NavLink
                                to={
                                  user?.package !== "gold" && child.restrict
                                    ? "/"
                                    : child?.path
                                }
                                end={child.path === "/"}
                                onClick={() => setShowNav("")}
                                className={({ isActive }) =>
                                  `flex gap-2 rounded-lg items-center py-2 px-4 ${
                                    isActive
                                      ? "bg-[#96c94b] text-black"
                                      : "text-[#212529]"
                                  } ${
                                    user?.package !== "gold" && child.restrict
                                      ? "bg-gray-200 opacity-60"
                                      : "hover:text-[#000000] hover:bg-[#96c94b]"
                                  }`
                                }
                              >
                                <img src={child.icon} alt="" className="w-6" />
                                <p>{child.name}</p>
                              </NavLink>
                            </li>
                          ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default CollapsSidebar;
