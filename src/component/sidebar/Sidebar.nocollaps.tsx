import Logo from "../../assets/MBL_Logo_CROP.png";
import { Link, NavLink, useLocation } from "react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import menuData from "../../utils/menu.data";

function SidebarNoCollaps() {
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

  return (
    <div className="">
      <div className="flex justify-center items-center py-2">
        <Link to={"/"}>
          <img src={Logo} alt="" className="w-24 h-24 min-w-24 min-h-24" />
        </Link>
      </div>
      <div className="mt-5">
        <h2 className="text-thin text-sm pl-8 uppercase tracking-widest">
          Overview
        </h2>
        <nav className="mt-5">
          <ul className="flex flex-col gap-3">
            {menuData.map((menu) => {
              const hasChildren =
                Array.isArray(menu.children) && menu.children.length > 0;

              if (!hasChildren) {
                return null;
              }
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
                              end={child.path === "/"}
                              className={({ isActive }) =>
                                `flex gap-2 rounded-lg items-center hover:text-[#000000] hover:bg-[#96c94b] py-2 px-4 ${
                                  isActive
                                    ? " text-[#000000] bg-[#96c94b]"
                                    : " text-[#212529]"
                                }`
                              }
                            >
                              <img src={child?.icon} alt="" className="w-6" />
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
    </div>
  );
}

export default SidebarNoCollaps;
