import Logo from "../../assets/MBL_Logo_CROP.png";
import { Link, NavLink, useLocation } from "react-router";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import menuData from "../../utils/menu.data";

function SidebarCollaps() {
  const [showNav, setShowNav] = useState("");
  const location = useLocation();
  const handleToggle = (menu: string) => {
    setShowNav((prev) => (prev === menu ? "" : menu));
  };

  const menuRef = useRef<HTMLDivElement | null>(null);

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

  const isMenuActive = (menu: { children: { path: string }[] }) => {
    return menu.children.some((child) => {
      if (child.path === "/") {
        return location.pathname === "/";
      }

      return location.pathname.startsWith(child.path);
    });
  };

  return (
    <div className="">
      <div className="flex justify-center items-center py-2">
        <Link to="/">
          <img src={Logo} alt="" className="w-12 h-12 min-w-12 min-h-12" />
        </Link>
      </div>
      <div className="mt-2" ref={menuRef}>
        <nav>
          <ul className="flex flex-col gap-3">
            {menuData?.map((menu) => (
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
                        {menu.children.map((child) => (
                          <li key={child.name}>
                            <NavLink
                              to={child.path}
                              end={child.path === "/"}
                              className={({ isActive }) =>
                                `flex gap-2 rounded-lg items-center hover:bg-[#96c94b] hover:text-black py-2 px-4 ${
                                  isActive
                                    ? "bg-[#96c94b] text-black"
                                    : "text-[#212529]"
                                }`
                              }
                            >
                              <img src={child.icon} alt="" className="w-6" />
                              <p className="font-medium text-base">
                                {child.name}
                              </p>
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

export default SidebarCollaps;
