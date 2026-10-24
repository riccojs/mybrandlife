import { Link, useNavigate } from "react-router";
import HeaderProfile from "./Header.profile";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useLogoutMutation } from "../../redux/features/auth/authApi";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useAuth } from "../../hook/useAuth";
import LogoutModal from "../../component/Logout.modal";
import { RiCollapseDiagonalLine, RiMenu3Line } from "react-icons/ri";
import { BiCollapse } from "react-icons/bi";
import OnboardIcon from "../../assets/menu-icons/onboard.svg";
import UserIcon from "../../assets/menu-icons/user.svg";
import { ChevronDown } from "lucide-react";
import HeaderNotification from "./Header.notification";

interface Types {
  setSidebard: React.Dispatch<React.SetStateAction<boolean>>;
  sidebar: boolean;
  setNavbar: React.Dispatch<React.SetStateAction<boolean>>;
}

interface UserAuth {
  user: {
    secureKey: string | null;
    landerName: string | null;
    profile: string | null;
    username: string | null;
    domain: string | null;
    userTemplete: [];
    email: string | null;
    firstName: string | null;
    lastName: string | null;
    address: string | null;
  } | null;
}

function Header({ setSidebard, sidebar, setNavbar }: Types) {
  const navigate = useNavigate();
  const [logout, { isLoading }] = useLogoutMutation();
  const [isProfile, setIsProfile] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);
  const notifyRef = useRef<HTMLDivElement | null>(null);

  const { user } = useAuth() as UserAuth;
  const {
    email,
    secureKey,
    profile,
    landerName,
    username,
    firstName,
    lastName,
    address,
  } = user || {};

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    let role;
    if (secureKey) {
      role = "ADMIN";
    } else {
      role = "USER";
    }
    const userData = {
      email: email,
      role: role,
    };
    logout(userData)
      .unwrap()
      .then((res) => {
        toast.success(res.message);
        navigate("/");
      })
      .catch((error) => {
        const err = error as FetchBaseQueryError;
        const errorMessage = (err.data as { message: string }).message;
        toast.error(errorMessage);
      });
  };

  return (
    <header className="sticky z-10 top-0 bg-white flex justify-between items-center h-16 border-b-2 border-gray-200 p-3 md:px-5">
      <div className="flex gap-2 items-center w-3/12">
        <button
          onClick={() => setSidebard(!sidebar)}
          className="xl:flex hidden bg-[#E2E2E2] border border-gray-200 w-10 min-w-10 h-10 justify-center items-center rounded-full cursor-pointer text-xl"
        >
          {sidebar ? <RiCollapseDiagonalLine /> : <BiCollapse />}
        </button>
        <button
          onClick={() => setNavbar(true)}
          className="flex xl:hidden bg-[#E2E2E2] border border-gray-200 w-10 min-w-10 h-10 justify-center items-center rounded-full cursor-pointer text-xl"
        >
          <RiMenu3Line size={20} />
        </button>
        <Link
          to="/onboard"
          className="bg-[#cbf38b] h-10 w-10 min-w-10 text-center rounded-full flex justify-center items-center text-base font-normal"
        >
          <img src={OnboardIcon} className="w-6" alt="" />
        </Link>
        <Link
          to="/user"
          className="bg-[#cbf38b] h-10 w-10 min-w-10 text-center rounded-full flex justify-center items-center text-base font-normal"
        >
          <img src={UserIcon} className="w-6" alt="" />
        </Link>
      </div>
      <div className="flex gap-3 items-center">
        <div className="relative" ref={notifyRef}>
          <HeaderNotification />
        </div>

        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setIsProfile((prev) => !prev)}
            className="flex items-center gap-2.5 rounded-xl p-1 transition-colors hover:bg-slate-100 cursor-pointer"
          >
            <div className="relative">
              {profile ? (
                <img
                  alt="Tanvir Ahamed"
                  className="h-8 w-8 rounded-lg object-cover ring-1 ring-slate-200"
                  src={profile}
                />
              ) : (
                <p className="w-8 h-8 rounded-lg ring-1 ring-slate-300 bg-slate-200 text-xl uppercase text-normal flex justify-center items-center">
                  {!secureKey ? landerName?.slice(0, 1) : username?.slice(0, 1)}
                </p>
              )}
              <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>
            <div className="hidden flex-col text-left leading-none xl:flex">
              <span className="text-xs font-semibold text-slate-900">
                {`${firstName} ${lastName}`}
              </span>
              <span className="mt-0.5 text-[10px] text-slate-500">
                {address}
              </span>
            </div>
            <ChevronDown
              className={`hidden h-3.5 w-3.5 text-slate-400 xl:block transition-transform duration-200 ${
                isProfile ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>

          <HeaderProfile
            isProfile={isProfile}
            setIsProfile={setIsProfile}
            isLoading={isLoading}
            setShowLogout={setShowLogout}
          />
          {showLogout && (
            <LogoutModal
              onCancel={() => setShowLogout(false)}
              onLogout={handleLogout}
              isLoading={isLoading}
            />
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
