import React from "react";
import { Link } from "react-router";
import { useAuth } from "../hook/useAuth";
import {
  CalendarRange,
  CardSim,
  ChartBarBig,
  CircleCheckBig,
  ContactRound,
  MailSearch,
  MapPinHouse,
  PencilSparkles,
  UserCheck,
  UserRoundKey,
  UserRoundPen,
  UserShield,
} from "lucide-react";

interface authType {
  user: UserType | null;
}

interface UserType {
  profile: string | null;
  email: string | null;
  address: string | null;
  phone: string | null;
  status: string | null;
  username: string | null;
  lastName: string | null;
  firstName: string | null;
  secureKey: string | null;
  create_at: string;
}
function Profile() {
  const { user } = useAuth() as authType;

  const {
    email,
    phone,
    profile,
    address,
    username,
    status,
    lastName,
    firstName,
    secureKey,
    create_at,
  } = user || {};

  const formattedDate = (value: string) => {
    const createDate = new Date(value);
    return createDate?.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <React.Fragment>
      <div className="p-3 md:p-5">
        <div className="w-full">
          <h2 className="text-normal text-2xl md:text-3xl">Persoal Profile</h2>
          <ul className="flex gap-2 items-center py-2">
            <li>
              <Link
                to="/admin/dashboard"
                className="text-normal text-sm md:text-base"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <i className="fa-solid fa-angles-right text-xs"></i>
            </li>
            <li>
              <p className="text-normal text-sm md:text-base">{username}</p>
            </li>
          </ul>
        </div>
        <div>
          <div className="jost border border-gray-300 p-5 md:p-10 rounded-2xl shadow bg-white">
            <div className="border-b border-gray-300 pb-5">
              <p className="text-2xl text-medium"></p>
              <p className="text-gray-500 text-md font-normal"></p>
            </div>
            <div className="relative rounded-2xl h-44 md:h-54 bg-linear-to-r from-[#08251e] via-[#064333] to-[#087354]">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_82%_20%,rgba(17,185,129,0.19),transparent_40%),radial-gradient(ellipse_at_40%_100%,rgba(4,120,87,0.12),transparent_45%)]" />

              <div className="absolute left-2 md:left-7 top-4.5 rounded-full border border-white/15 bg-white/15 px-7 py-1.5 text-[10px] font-medium tracking-wide text-emerald-100">
                Profile Infos
              </div>

              <div className="absolute right-2 md:right-7 top-4.5 flex items-center gap-2 rounded-full border border-white/15 bg-[#052e25]/75 px-5 py-1.5 text-[10px] text-emerald-100">
                <CircleCheckBig size={12} />
                {status}
              </div>
              <div className="absolute -bottom-8 md:-bottom-14 left-8">
                {profile ? (
                  <img
                    src={profile}
                    alt=""
                    className="w-18 md:w-32 rounded-full min-h-18 object-cover md:min-h-32 h-18 md:h-32"
                  />
                ) : (
                  <p className="min-w-18 md:min-w-32 min-h-18 md:min-h-32 w-18 md:w-24 h-18 md:h-32 rounded-full bg-gray-300 text-6xl uppercase text-normal flex justify-center items-center">
                    {username?.slice(0, 1)}
                  </p>
                )}
              </div>
              <Link
                to="/setting"
                className="absolute -bottom-14 left-28 md:left-44 gap-2 border font-medium uppercase text-xs md:text-sm border-gray-200 bg-[#96c94b] text-black w-40 md:w-48 min-w-40 md:min-w-48 h-12 rounded-xl flex justify-center items-center"
              >
                <PencilSparkles size={20} />
                <p>Update Setting</p>
              </Link>
            </div>
            <div className="mt-20">
              <div className="grid grid-cols-1 md:grid-cols-2 mt-5 gap-3 md:gap-6">
                <div className="flex gap-2 items-center bg-[#F7F9FB] border-2 p-3 rounded-2xl border-gray-100">
                  <p className="min-w-14 w-14 h-14 text-xl rounded-full border border-[#C7F3DC] bg-[#EDFCF4] text-[#67A585] flex justify-center items-center">
                    <MailSearch size={22} />
                  </p>
                  <div>
                    <p className="text-[#909BB1] text-sm uppercase">
                      EMAIL ADDRESS
                    </p>
                    <p className="text-[#2E3442] text-md">{email}</p>
                  </div>
                </div>
                <div className="flex gap-2 items-center bg-[#F7F9FB] border-2 p-3 rounded-2xl border-gray-100">
                  <p className="min-w-14 w-14 h-14 text-xl rounded-full border border-[#C7F3DC] bg-[#EDFCF4] text-[#67A585] flex justify-center items-center">
                    <CardSim size={22} />
                  </p>
                  <div>
                    <p className="text-[#909BB1] text-sm uppercase">
                      PHONE NUMBER
                    </p>
                    <p className="text-[#2E3442] text-md">{phone}</p>
                  </div>
                </div>
                <div className="flex gap-2 items-center bg-[#F7F9FB] border-2 p-3 rounded-2xl border-gray-100">
                  <p className="min-w-14 w-14 h-14 text-xl rounded-full border border-[#C7F3DC] bg-[#EDFCF4] text-[#67A585] flex justify-center items-center">
                    <UserShield size={22} />
                  </p>
                  <div>
                    <p className="text-[#909BB1] text-sm uppercase">
                      USER ROLE
                    </p>
                    <p className="text-[#2E3442] text-md">Administrator</p>
                  </div>
                </div>
                <div className="flex gap-2 items-center bg-[#F7F9FB] border-2 p-3 rounded-2xl border-gray-100">
                  <p className="min-w-14 w-14 h-14 text-xl rounded-full border border-[#C7F3DC] bg-[#EDFCF4] text-[#67A585] flex justify-center items-center">
                    <MapPinHouse size={22} />
                  </p>
                  <div>
                    <p className="text-[#909BB1] text-sm uppercase">
                      ADMIN ADDRESS
                    </p>
                    <p className="text-[#2E3442] text-md">{address}</p>
                  </div>
                </div>
                <div className="flex gap-2 items-center bg-[#F7F9FB] border-2 p-3 rounded-2xl border-gray-100">
                  <p className="min-w-14 w-14 h-14 text-xl rounded-full border border-[#C7F3DC] bg-[#EDFCF4] text-[#67A585] flex justify-center items-center">
                    <ContactRound size={22} />
                  </p>
                  <div>
                    <p className="text-[#909BB1] text-sm uppercase">
                      USER NAME
                    </p>
                    <p className="text-[#2E3442] text-md">{username}</p>
                  </div>
                </div>
                <div className="flex gap-2 items-center bg-[#F7F9FB] border-2 p-3 rounded-2xl border-gray-100">
                  <p className="min-w-14 w-14 h-14 text-xl rounded-full border border-[#C7F3DC] bg-[#EDFCF4] text-[#67A585] flex justify-center items-center">
                    <UserRoundKey size={22} />
                  </p>
                  <div>
                    <p className="text-[#909BB1] text-sm uppercase">
                      SECURITY KEY
                    </p>
                    <p className="text-[#2E3442] text-md">{secureKey}</p>
                  </div>
                </div>
                <div className="flex gap-2 items-center bg-[#F7F9FB] border-2 p-3 rounded-2xl border-gray-100">
                  <p className="min-w-14 w-14 h-14 text-xl rounded-full border border-[#C7F3DC] bg-[#EDFCF4] text-[#67A585] flex justify-center items-center">
                    <UserRoundPen size={22} />
                  </p>
                  <div>
                    <p className="text-[#909BB1] text-sm uppercase">
                      FIRST NAME
                    </p>
                    <p className="text-[#2E3442] text-md">{firstName}</p>
                  </div>
                </div>
                <div className="flex gap-2 items-center bg-[#F7F9FB] border-2 p-3 rounded-2xl border-gray-100">
                  <p className="min-w-14 w-14 h-14 text-xl rounded-full border border-[#C7F3DC] bg-[#EDFCF4] text-[#67A585] flex justify-center items-center">
                    <UserCheck size={22} />
                  </p>
                  <div>
                    <p className="text-[#909BB1] text-sm uppercase">
                      LAST NAME
                    </p>
                    <p className="text-[#2E3442] text-md">{lastName}</p>
                  </div>
                </div>
                <div className="flex gap-2 items-center bg-[#F7F9FB] border-2 p-3 rounded-2xl border-gray-100">
                  <p className="min-w-14 w-14 h-14 text-xl rounded-full border border-[#C7F3DC] bg-[#EDFCF4] text-[#67A585] flex justify-center items-center">
                    <ChartBarBig size={22} />
                  </p>
                  <div>
                    <p className="text-[#909BB1] text-sm uppercase">
                      PROFILE STATUS
                    </p>
                    <p className="text-[#2E3442] text-md">{status}</p>
                  </div>
                </div>
                <div className="flex gap-2 items-center bg-[#F7F9FB] border-2 p-3 rounded-2xl border-gray-100">
                  <p className="min-w-14 w-14 h-14 text-xl rounded-full border border-[#C7F3DC] bg-[#EDFCF4] text-[#67A585] flex justify-center items-center">
                    <CalendarRange size={22} />
                  </p>
                  <div>
                    <p className="text-[#909BB1] text-sm uppercase">
                      JOINING DATE
                    </p>
                    <p className="text-[#2E3442] text-md">
                      {formattedDate(create_at ?? "")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default Profile;
