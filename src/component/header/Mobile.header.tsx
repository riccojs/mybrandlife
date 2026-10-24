import { Link, NavLink, useLocation } from "react-router";
import Logo from "../../assets/MBL_Logo_CROP.png";
import { useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import menuData from "../../utils/menu.data";

interface Types {
  navbar: boolean;
  setNavbar: React.Dispatch<React.SetStateAction<boolean>>;
}

function MobileHeader({ navbar, setNavbar }: Types) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [closedMenu, setClosedMenu] = useState<string | null>(null);
  const location = useLocation();

  const handleToggle = (menuName: string) => {
    if (currentOpenMenu === menuName) {
      setOpenMenu(null);
      if (activeMenu?.name === menuName) {
        setClosedMenu(menuName);
      }
      return;
    }
    setOpenMenu(menuName);
    setClosedMenu(null);
  };

  const activeMenu = menuData.find((menu) =>
    menu.children?.some(
      (child) =>
        location.pathname === child.path ||
        location.pathname.startsWith(`${child.path}/`),
    ),
  );

  const currentOpenMenu =
    openMenu !== null
      ? openMenu
      : activeMenu?.name !== closedMenu
        ? activeMenu?.name
        : null;

  const handleClose = () => {
    setNavbar(false);
  };

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
          <div className="flex justify-between items-center px-5 py-2">
            <Link to={"/"}>
              <img src={Logo} alt="" className="w-16 md:w-24" />
            </Link>
            <button
              onClick={handleClose}
              className="border bg-gray-200 border-gray-300 shadow-sm rounded-full w-10 h-10 flex justify-center items-center cursor-pointer"
            >
              <i className="fa-solid fa-xmark text-xl"></i>
            </button>
          </div>
          <div className="mt-5">
            <h2 className="text-thin text-sm pl-8 uppercase tracking-widest">
              Overview
            </h2>
            <nav className="mt-5">
              <ul className="flex flex-col gap-3">
                {menuData.map((menu) => {
                  const isOpen = currentOpenMenu === menu.name;
                  return (
                    <li key={menu.name} className="px-4">
                      <button
                        onClick={() => handleToggle(menu.name)}
                        className={`flex items-center cursor-pointer justify-between w-full py-2 px-4 rounded-lg ${isOpen ? "bg-[#96c94b]" : ""}`}
                      >
                        <div className="flex items-center gap-2">
                          <img src={menu?.icon} alt="" className="w-5 md:w-6" />
                          <p className="font-medium text-sm md:text-base">
                            {menu.name}
                          </p>
                        </div>
                        <span>
                          {isOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
                        </span>
                      </button>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.ul
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="ml-3 mt-2 flex flex-col gap-1 overflow-hidden"
                          >
                            {menu.children.map((child, index) => (
                              <li key={index}>
                                <NavLink
                                  to={child?.path}
                                  onClick={() => setNavbar(false)}
                                  className={({ isActive }) =>
                                    `flex gap-2 rounded-lg items-center hover:text-[#000000] hover:bg-[#96c94b] py-2 px-4 ${
                                      isActive
                                        ? " text-[#000000] bg-[#96c94b]"
                                        : " text-[#212529]"
                                    }`
                                  }
                                >
                                  <img
                                    src={child?.icon}
                                    alt=""
                                    className="w-5 md:w-6"
                                  />
                                  <p className="font-medium text-sm md:text-base">
                                    {child.name}
                                  </p>
                                </NavLink>
                              </li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}

export default MobileHeader;
