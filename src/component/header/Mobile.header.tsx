import { Link, NavLink } from "react-router";
import Logo from "../../assets/MBL_Logo_CROP.png";
import { LayoutDashboard, Rocket, Users } from "lucide-react";
import { useAuth } from "../../hook/useAuth";

interface Types {
  isShow: boolean;
  setIsShow: React.Dispatch<React.SetStateAction<boolean>>;
}

function MobileHeader({ isShow, setIsShow }: Types) {
  const { user, isLoading } = useAuth() as {
    user: { landerName: string };
    isLoading: boolean | null;
  };
  const redirectUrl = import.meta.env.VITE_APP_REDIRECT_ROUTE;

  return (
    <section
      className={
        isShow
          ? "fixed w-72 inset-0 min-h-screen max-h-screen max-w-72 top-0 left-0 bg-white border-r border-gray-200 active z-60"
          : "fixed w-72 inset-0 min-h-screen max-h-screen max-w-72 top-0 left-0 bg-white border-r border-gray-200 inactive"
      }
    >
      <div className="w-full h-full relative">
        <div className="flex justify-center items-center py-5">
          <Link to="/" className="block">
            <img src={Logo} alt="" className="w-24 h-full" />
          </Link>
        </div>
        <div className="px-5">
          <ul className="flex flex-col gap-5">
            <li>
              <NavLink
                to={"/"}
                onClick={() => setIsShow(false)}
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
                onClick={() => setIsShow(false)}
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
                onClick={() => setIsShow(false)}
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
                onClick={() => setIsShow(false)}
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
                onClick={() => setIsShow(false)}
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
                onClick={() => setIsShow(false)}
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
                onClick={() => setIsShow(false)}
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
        {isLoading ? (
          <div className="items-center flex flex-col gap-2 px-2 mt-5">
            <div className="w-full h-10 rounded-full bg-slate-200 animate-pulse"></div>
            <div className="w-full h-10 rounded-full bg-slate-200 animate-pulse"></div>
          </div>
        ) : user ? (
          <div className="items-center flex flex-col gap-2 px-2 mt-5">
            <a
              href={redirectUrl}
              target="_blank"
              onClick={() => setIsShow(false)}
              className="flex items-center bg-[#65B32E] shadow-[#65B32E]/25 active:scale-[0.98] justify-center gap-2 px-5 py-2.5 w-full rounded-full hover:bg-[#589c28] text-white text-sm font-medium shadow-lg transition-all"
            >
              <LayoutDashboard className="w-4 h-4 fill-current" />
              Dashboard
            </a>
          </div>
        ) : (
          <div className="items-center flex flex-col gap-2 px-2 mt-5">
            <NavLink
              to="/auth/login"
              onClick={() => setIsShow(false)}
              className={({ isActive }) =>
                `active:scale-[0.98] flex justify-center items-center gap-3 px-5 py-2.5 w-full rounded-full border border-gray-200 text-sm font-bold text-gray-800 hover:bg-gray-50 transition-all ${
                  isActive ? "text-[#96c94b]" : "text-[#bb2d28]"
                }`
              }
            >
              <Users className="w-4 h-4 text-gray-600" />
              Login
            </NavLink>
            <NavLink
              to="/pricing"
              onClick={() => setIsShow(false)}
              className={({ isActive }) =>
                `flex items-center active:scale-[0.98] justify-center gap-2 px-5 py-2.5 w-full rounded-full hover:bg-[#589c28] text-white text-sm font-medium shadow-lg transition-all ${
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
        )}
        <div className="absolute bottom-5 left-5">
          <div className="flex gap-3 items-center justify-center mb-3">
            <a
              href="https://www.facebook.com/MyBrandLife"
              target="_blank"
              className="text-gray-300 hover:text-[#bb2d28]"
            >
              <i className="fa-brands fa-facebook"></i>
            </a>
            <a
              href="https://www.instagram.com/mybrandlife.me/"
              target="_blank"
              className="text-gray-300 hover:text-[#bb2d28]"
            >
              <i className="fa-brands fa-instagram"></i>
            </a>
            <a
              href="https://www.linkedin.com/company/mybrandlife/"
              target="_blank"
              className="text-gray-300 hover:text-[#bb2d28]"
            >
              <i className="fa-brands fa-linkedin"></i>
            </a>
            <a
              href="https://www.youtube.com/@MyBrandLife"
              target="_blank"
              className="text-gray-300 hover:text-[#bb2d28]"
            >
              <i className="fa-brands fa-youtube"></i>
            </a>
          </div>
          <p className="text-gray-400 text-xs font-normal">
            © {new Date().getFullYear()} MyBrandLife.me. All rights reserved.
          </p>
        </div>
        <button
          onClick={() => setIsShow(false)}
          className="absolute top-2 right-2 cursor-pointer"
        >
          <i className="fa-solid fa-xmark text-xl hover:text-[#bb2d28]"></i>
        </button>
      </div>
    </section>
  );
}

export default MobileHeader;
