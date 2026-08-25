import React from "react";
import { NavLink } from "react-router";
import { HiOutlineLogout } from "react-icons/hi";
import { useAuth } from "../../hook/useAuth";
import ProfileIcon from "../../assets/menu-icons/profile.svg";
import SettingIcon from "../../assets/menu-icons/settings.svg";
import OnboardIcon from "../../assets/menu-icons/onboard.svg";

interface Types {
  isProfile: boolean;
  isLoading: boolean;
  setIsProfile: React.Dispatch<React.SetStateAction<boolean>>;
  setShowLogout: React.Dispatch<React.SetStateAction<boolean>>;
}

function HeaderProfile({
  isProfile,
  setIsProfile,
  isLoading,
  setShowLogout,
}: Types) {
  const handleDown = () => {
    setIsProfile(false);
  };

  const { user } = useAuth();
  const { landerName, email, profile, username } = user as {
    landerName: string;
    email: string;
    profile: string;
    username: string;
  };

  return (
    <div
      className={`absolute bg-white p-3 rounded-xl shadow-xl border border-gray-100 w-60 top-12 right-0 transition-all duration-200 ease-in-out transform ${
        isProfile
          ? "opacity-100 scale-100 translate-y-0"
          : "opacity-0 scale-90 -translate-y-4 pointer-events-none"
      }`}
    >
      <div className="flex gap-3 items-center border-b border-gray-300 p-3 mb-3">
        {profile ? (
          <img
            src={profile}
            alt=""
            className="w-10 min-w-10 rounded-full h-10 object-cover"
          />
        ) : (
          <p className="w-10 h-10 min-w-10 rounded-full bg-[#FFD2A3] text-xl uppercase text-normal flex justify-center items-center">
            {username?.slice(0, 1)}
          </p>
        )}
        <div>
          <p className="text-md capitalize font-medium text-normal leading-4">
            {landerName}
          </p>
          <p className="text-[#525252] text-sm font-normal">
            {email?.slice(0, 16)}..
          </p>
        </div>
      </div>
      <ul className="flex flex-col gap-1 items-start justify-center">
        <li onClick={handleDown} className="w-full">
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex gap-2 text-[#525252] items-center justify-start hover:bg-[#F3F3F3] p-2 rounded-lg ${
                isActive ? " text-[#000000] bg-[#F3F3F3]" : " text-[#212529]"
              }`
            }
          >
            <img src={ProfileIcon} alt="" className="w-7" />
            <p className="font-medium text-md">Profile</p>
          </NavLink>
        </li>

        <li onClick={handleDown} className="w-full">
          <NavLink
            to="/onboard"
            className={({ isActive }) =>
              `flex gap-2 text-[#525252] items-center justify-start hover:bg-[#F3F3F3] p-2 rounded-lg ${
                isActive ? " text-[#000000] bg-[#F3F3F3]" : " text-[#212529]"
              }`
            }
          >
            <img src={OnboardIcon} alt="" className="w-6" />
            <p className="font-medium text-md">Onboard</p>
          </NavLink>
        </li>
        <li onClick={handleDown} className="w-full">
          <NavLink
            to="/setting"
            className={({ isActive }) =>
              `flex gap-2 text-[#525252] items-center justify-start hover:bg-[#F3F3F3] p-2 rounded-lg ${
                isActive ? " text-[#000000] bg-[#F3F3F3]" : " text-[#212529]"
              }`
            }
          >
            <img src={SettingIcon} alt="" className="w-6" />
            <p className="font-medium text-md">Setting</p>
          </NavLink>
        </li>
        <hr className="w-full h-1 bg-gray-100 opacity-15" />
        <li
          onClick={() => setShowLogout(true)}
          className="w-full hover:bg-[#F3F3F3] p-2 rounded-lg cursor-pointer flex gap-2 items-center"
        >
          <HiOutlineLogout size={25} />
          <p className="font-medium text-md">
            {isLoading ? "Loding.." : "Logout"}
          </p>
        </li>
      </ul>
    </div>
  );
}

export default HeaderProfile;
