import Logo from "../../assets/MBL_Logo_CROP.png";
import { NavLink } from "react-router";
import MobileHeader from "./Mobile.header";
import React, { useState } from "react";
import { Rocket, Users } from "lucide-react";

function Header() {
  const [isShow, setIsShow] = useState<boolean>(false);

  const redirectUrl = import.meta.env.VITE_APP_REDIRECT_ROUTE;

  return (
    <React.Fragment>
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="container flex justify-between items-center">
          <div>
            <a href="/">
              <img src={Logo} alt="" className="w-20 h-full" />
            </a>
          </div>
          <div className="lg:hidden block">
            {isShow ? (
              <button
                onClick={() => setIsShow(false)}
                className="cursor-pointer bg-[#96c94b] w-10 h-10 flex justify-center items-center rounded-md"
              >
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>
            ) : (
              <button
                onClick={() => setIsShow(true)}
                className="cursor-pointer bg-[#96c94b] w-10 h-10 flex justify-center items-center rounded-md"
              >
                <i className="fa-solid fa-bars text-xl"></i>
              </button>
            )}
          </div>
          <div className="lg:block hidden">
            <ul className="flex gap-8 items-center">
              <li>
                <NavLink
                  to={"/"}
                  className={({ isActive }) =>
                    `text-sm font-medium pb-1 hover:text-[#65B32E] hover:border-b-2 hover:border-[#65B32E] transition-all duration-100 ${
                      isActive
                        ? " text-[#65B32E] border-b-2 border-[#65B32E]"
                        : " text-[#212529]"
                    }`
                  }
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/pricing"
                  className={({ isActive }) =>
                    `text-sm font-medium pb-1 hover:text-[#65B32E] hover:border-b-2 hover:border-[#65B32E] transition-all duration-100 ${
                      isActive
                        ? " text-[#65B32E] border-b-2 border-[#65B32E]"
                        : " text-[#212529]"
                    }`
                  }
                >
                  Pricing
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/contact"
                  className={({ isActive }) =>
                    `text-sm font-medium pb-1 hover:text-[#65B32E] hover:border-b-2 hover:border-[#65B32E] transition-all duration-100 ${
                      isActive
                        ? " text-[#65B32E] border-b-2 border-[#65B32E]"
                        : " text-[#212529]"
                    }`
                  }
                >
                  Contact
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/follow-us"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={({ isActive }) =>
                    `text-sm font-medium pb-1 hover:text-[#65B32E] hover:border-b-2 hover:border-[#65B32E] transition-all duration-100 ${
                      isActive
                        ? " text-[#65B32E] border-b-2 border-[#65B32E]"
                        : " text-[#212529]"
                    }`
                  }
                >
                  Follow US
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/directory"
                  className={({ isActive }) =>
                    `text-sm font-medium pb-1 hover:text-[#65B32E] hover:border-b-2 hover:border-[#65B32E] transition-all duration-100 ${
                      isActive
                        ? " text-[#65B32E] border-b-2 border-[#65B32E]"
                        : " text-[#212529]"
                    }`
                  }
                >
                  Directory
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/partner"
                  className={({ isActive }) =>
                    `text-sm font-medium pb-1 hover:text-[#65B32E] hover:border-b-2 hover:border-[#65B32E] transition-all duration-100 ${
                      isActive
                        ? " text-[#65B32E] border-b-2 border-[#65B32E]"
                        : " text-[#212529]"
                    }`
                  }
                >
                  Partners
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/about-us"
                  className={({ isActive }) =>
                    `text-sm font-medium pb-1 hover:text-[#65B32E] hover:border-b-2 hover:border-[#65B32E] transition-all duration-100 ${
                      isActive
                        ? " text-[#65B32E] border-b-2 border-[#65B32E]"
                        : " text-[#212529]"
                    }`
                  }
                >
                  About Us
                </NavLink>
              </li>
            </ul>
          </div>
          <div className="gap-5 items-center lg:flex hidden">
            <a
              href={redirectUrl}
              target="_blank"
              className="hidden active:scale-[0.98] md:flex items-center gap-3 px-5 py-2.5 rounded-full border border-gray-200 text-sm font-bold text-gray-800 hover:bg-gray-50 transition-all"
            >
              <Users className="w-4 h-4 text-gray-600" />
              Login
            </a>
            <NavLink
              to="/pricing"
              className={({ isActive }) =>
                `flex items-center active:scale-[0.98] gap-2 px-5 py-2.5 rounded-full hover:bg-[#589c28] text-white text-sm font-medium shadow-lg transition-all ${
                  isActive
                    ? "bg-[#bb2d28] text-white shadow-[#bb2d28]/25"
                    : "bg-[#65B32E] text-black shadow-[#65B32E]/25"
                }`
              }
            >
              <Rocket className="w-4 h-4 fill-current" />
              Register Your Brand
            </NavLink>
          </div>
        </div>
      </header>
      <MobileHeader isShow={isShow} setIsShow={setIsShow} />
    </React.Fragment>
  );
}

export default Header;
