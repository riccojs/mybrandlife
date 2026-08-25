import { Link, NavLink, useLocation } from "react-router";
import Logo from "../../assets/logo.png";
import { useEffect, useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import menuData from "../../utils/menu.data";

interface Types {
  navbar: boolean;
  setNavbar: React.Dispatch<React.SetStateAction<boolean>>;
}

function MobileHeader({ navbar, setNavbar }: Types) {
  const handleClose = () => {
    setNavbar(false);
  };

  const [openMenu, setOpenMenu] = useState("");
  const location = useLocation();

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

  const activeMenu = menuData.find((menu) =>
    menu.children?.some(
      (child) =>
        location.pathname === child.path ||
        location.pathname.startsWith(`${child.path}/`),
    ),
  );

  const currentOpenMenu = activeMenu?.name || openMenu;

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
              <img onClick={handleClose} src={Logo} alt="" className="w-24" />
            </Link>
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
                          <img src={menu?.icon} alt="" className="w-6" />
                          <p className="font-medium">{menu.name}</p>
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
                                    className="w-6"
                                  />
                                  <p className="font-medium text-base">
                                    {child?.name}
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
