import HeaderProfile from "./Header.profile";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useLogoutMutation } from "../../redux/features/auth/authApi";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useAuth } from "../../hook/useAuth";
import WristbandIcon from "../../assets/menu-icons/ristband.svg";
import OnboardIcon from "../../assets/menu-icons/onboard.svg";
import LogoutModal from "../../component/Logout.modal";
import NotificationIcon from "../../assets/app-icons/notification.png";
import HeaderNotification from "./Header.notification";
import type { NotificationType } from "../../utils/notification.type";
import io from "socket.io-client";
import { BiCollapse } from "react-icons/bi";
import { RiCollapseDiagonalLine, RiMenu3Line } from "react-icons/ri";
import { ChevronDown, CircleHelp } from "lucide-react";

const socket = io(import.meta.env.VITE_APP_API_URL);

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
  } | null;
}

function Header({ setSidebard, sidebar, setNavbar }: Types) {
  const [logout, { isLoading }] = useLogoutMutation();
  const [isProfile, setIsProfile] = useState(false);
  const [isNotify, setIsNotify] = useState(false);
  const [hasNewNotification, setHasNewNotification] = useState(false);
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
    domain,
    firstName,
    lastName,
  } = user || {};
  const existTemplate = user && user?.userTemplete?.length > 0 ? true : false;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notifyRef.current &&
        !notifyRef.current.contains(event.target as Node)
      ) {
        setIsNotify(false);
      }
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
    const userData = {
      email: email,
    };
    logout(userData)
      .unwrap()
      .then((res) => {
        toast.success(res.message);
      })
      .catch((error) => {
        const err = error as FetchBaseQueryError;
        const errorMessage = (err.data as { message: string }).message;
        toast.error(errorMessage);
      });
  };

  useEffect(() => {
    socket.on("newNotification", (notification: NotificationType) => {
      if (!notification?.seen) {
        setHasNewNotification(true);
      }
    });

    return () => {
      socket.off("newNotification");
    };
  }, []);

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
        <div className="flex gap-2 items-center">
          {existTemplate && (
            <a
              href={`https://${domain}/${landerName}`}
              target="_blank"
              className="bg-[#cbf38b] h-10 w-10 md:min-w-10 text-center rounded-full flex justify-center items-center text-base font-normal"
            >
              <img src={OnboardIcon} alt="" className="w-5" />
            </a>
          )}
          <a
            href="https://yourworldlife.store/collections/mybrandlife"
            target="_blank"
            className="bg-[#cbf38b] h-10 w-10 md:min-w-10 text-center rounded-full flex justify-center items-center text-base font-normal"
          >
            <img src={WristbandIcon} className="w-6" alt="" />
          </a>
        </div>
      </div>
      <div className="flex gap-3 md:gap-5 items-center">
        {secureKey && (
          <div className="relative" ref={notifyRef}>
            <button
              onClick={() => {
                setIsNotify((prev) => !prev);
                setHasNewNotification(false);
              }}
              className="relative border border-gray-200 p-2 rounded-lg cursor-pointer"
            >
              <img src={NotificationIcon} alt="" className="w-6 min-w-6 h-6" />

              {hasNewNotification && (
                <p className="bg-red-500 w-2 h-2 rounded-full absolute -top-0.5 -right-0.5"></p>
              )}
            </button>
            <HeaderNotification isNotify={isNotify} setIsNotify={setIsNotify} />
          </div>
        )}

        <a
          href="https://mybrandlife.me/contact"
          target="_blank"
          className="hidden h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 sm:inline-flex"
        >
          <CircleHelp className="h-5 w-5" />
        </a>

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
              <span className="mt-0.5 text-[10px] text-slate-500">{email}</span>
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
