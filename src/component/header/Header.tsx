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
  const { email, secureKey, profile, landerName, username, domain } =
    user || {};
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

        <div className="relative" ref={profileRef}>
          <div
            onClick={() => setIsProfile((prev) => !prev)}
            className="flex gap-2 items-center cursor-pointer"
          >
            {profile ? (
              <img
                src={profile}
                alt=""
                className="w-10 min-w-10 rounded-full h-10 object-cover"
              />
            ) : (
              <p className="w-10 h-10 rounded-full bg-[#FFD2A3] text-xl uppercase text-normal flex justify-center items-center">
                {!secureKey ? landerName?.slice(0, 1) : username?.slice(0, 1)}
              </p>
            )}
          </div>

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
