import React, { useEffect, useRef, useState } from "react";
import SettingPassUpdate from "../component/setting/Setting.pass.update";
import { Link } from "react-router";
import DeactivateAccount from "../component/setting/Deactivate.account";
import UpdateDirectoryStatus from "../component/setting/Update.directory.status";
import UpdateMerchendiseStatus from "../component/setting/Update.merchendise.status";
import SaveSettingWarn from "../component/setting/Save.setting.warn";
import ToggleBrandshare from "../component/setting/Toggle.brandshare";
import UpdatePhone from "../component/setting/Update.phone";
import UpdateProfile from "../component/setting/Update.profile";
import {
  ArrowRight,
  CircleCheckBig,
  Contact,
  FileUser,
  MailSearch,
  UserCheck,
  UserRoundPen,
  UserShield,
} from "lucide-react";
import { useAuth } from "../hook/useAuth";
import type { UserSettingType } from "../utils/user.types";

interface AuthType {
  user: {
    profile: string | File | null;
    landerName: string;
    email: string;
    addressOne: string;
    addressTow: string;
    phone: string;
    midName: string;
    secondEmail: string;
    username: string;
    lastName: string;
    firstName: string;
    id: string;
    referalCode: string;
    domain: string;
    privateDomain: string;
    phoneCode: string;
    enablePrivateDomain: boolean;
    userTemplete: [];
    status: string;
  } | null;
}

function Setting() {
  const logoRef = useRef<HTMLInputElement>(null);
  const { user: userAuth } = useAuth() as AuthType;
  const [isShow, setIsShow] = useState(false);
  const [user, setUser] = useState<UserSettingType>({
    username: "",
    firstName: "",
    midName: "",
    lastName: "",
    email: "",
    phone: "",
    profile: null,
    landerName: "",
    package: "",
    frequency: "",
    status: "",
    domain: "",
    discountType: "",
    privateDomain: "",
    phoneCode: "",
    id: "",
    enablePrivateDomain: false,
  });
  const { landerName, midName, lastName, firstName, username, email, profile } =
    user || {};

  useEffect(() => {
    if (!userAuth) return;

    setUser({
      username: userAuth.username ?? "",
      firstName: userAuth.firstName ?? "",
      midName: userAuth.midName ?? "",
      lastName: userAuth.lastName ?? "",
      email: userAuth.email ?? "",
      phone: userAuth.phone ?? "",
      profile: userAuth.profile ?? null,
      landerName: userAuth.landerName ?? "",
      package: "",
      frequency: "",
      status: "",
      domain: userAuth.domain ?? "",
      discountType: "",
      privateDomain: userAuth.privateDomain ?? "",
      phoneCode: userAuth.phoneCode ?? "",
      id: userAuth.id ?? "",
      enablePrivateDomain: userAuth.enablePrivateDomain ?? false,
    });
  }, [userAuth]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, value, checked } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <React.Fragment>
      <div className="p-3 md:p-5">
        <div className="md:w-6/12 w-full">
          <h2 className="text-normal text-xl md:text-3xl">Profile Setting</h2>
          <ul className="flex flex-wrap gap-2 items-center py-2">
            <li>
              <Link to="/" className="text-normal text-sm md:text-base">
                Dashboard
              </Link>
            </li>
            <li>
              <i className="fa-solid fa-angles-right text-xs"></i>
            </li>
            <li>
              <p className="text-normal text-sm md:text-base">{user?.domain}</p>
            </li>
            <li>
              <i className="fa-solid fa-angles-right text-xs"></i>
            </li>
            <li>
              <p className="text-normal text-sm md:text-base">
                Profile Setting
              </p>
            </li>
          </ul>
        </div>
        <div>
          <div className="jost">
            <div className="bg-white border border-gray-200 rounded-2xl shadow p-5 md:p-10">
              <div className="relative rounded-2xl h-44 md:h-54 bg-linear-to-r from-[#08251e] via-[#064333] to-[#087354]">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_82%_20%,rgba(17,185,129,0.19),transparent_40%),radial-gradient(ellipse_at_40%_100%,rgba(4,120,87,0.12),transparent_45%)]" />

                <div className="absolute left-2 md:left-7 top-4.5 rounded-full border border-white/15 bg-white/15 px-7 py-1.5 text-[10px] font-medium tracking-wide text-emerald-100">
                  Profile Infos
                </div>

                <div className="absolute right-2 md:right-7 top-4.5 flex items-center gap-2 rounded-full border border-white/15 bg-[#052e25]/75 px-5 py-1.5 text-[10px] text-emerald-100">
                  <CircleCheckBig size={12} />
                  {userAuth?.status}
                </div>
                <div className="absolute -bottom-8 md:-bottom-14 left-8">
                  {typeof profile === "string" ? (
                    <img
                      src={profile}
                      alt=""
                      className="w-18 md:w-32 rounded-full min-h-18 object-cover md:min-h-32 h-18 md:h-32"
                    />
                  ) : (
                    <p className="min-w-18 md:min-w-32 min-h-18 md:min-h-32 w-18 md:w-24 h-18 md:h-32 rounded-full bg-gray-300 text-6xl uppercase text-normal flex justify-center items-center">
                      {landerName?.slice(0, 1)}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-20">
                <form className="grid grid-cols-1 md:grid-cols-2 gap-5 my-5">
                  <div className="min-w-0">
                    <label className="text-sm font-semibold text-slate-900">
                      EMAIL ADDRESS
                    </label>
                    <div className="flex h-12 items-center gap-3 rounded-xl border border-[#dce5f2] bg-[#F7F9FB] px-3.5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/10">
                      <MailSearch
                        size={22}
                        className="shrink-0 text-[#8ba0c0]"
                      />
                      <input
                        type="text"
                        value={email ?? ""}
                        name="email"
                        onChange={handleChange}
                        className="h-full w-full min-w-0 bg-transparent text-sm text-slate-900 outline-none placeholder:text-[#8ba0c0]"
                      />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <label className="text-sm font-semibold text-slate-900">
                      FIRST NAME
                    </label>
                    <div className="flex h-12 items-center gap-3 rounded-xl border border-[#dce5f2] bg-[#F7F9FB] px-3.5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/10">
                      <UserRoundPen
                        size={22}
                        className="shrink-0 text-[#8ba0c0]"
                      />
                      <input
                        type="text"
                        value={firstName ?? ""}
                        name="firstName"
                        onChange={handleChange}
                        className="h-full w-full min-w-0 bg-transparent text-sm text-slate-900 outline-none placeholder:text-[#8ba0c0]"
                      />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <label className="text-sm font-semibold text-slate-900">
                      MID NAME
                    </label>
                    <div className="flex h-12 items-center gap-3 rounded-xl border border-[#dce5f2] bg-[#F7F9FB] px-3.5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/10">
                      <UserShield
                        size={22}
                        className="shrink-0 text-[#8ba0c0]"
                      />
                      <input
                        type="text"
                        value={midName ?? ""}
                        name="midName"
                        onChange={handleChange}
                        className="h-full w-full min-w-0 bg-transparent text-sm text-slate-900 outline-none placeholder:text-[#8ba0c0]"
                      />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <label className="text-sm font-semibold text-slate-900">
                      LAST NAME
                    </label>
                    <div className="flex h-12 items-center gap-3 rounded-xl border border-[#dce5f2] bg-[#F7F9FB] px-3.5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/10">
                      <UserCheck
                        size={22}
                        className="shrink-0 text-[#8ba0c0]"
                      />
                      <input
                        type="text"
                        value={lastName ?? ""}
                        name="lastName"
                        onChange={handleChange}
                        className="h-full w-full min-w-0 bg-transparent text-sm text-slate-900 outline-none placeholder:text-[#8ba0c0]"
                      />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <label className="text-sm font-semibold text-slate-900">
                      USER NAME
                    </label>
                    <div className="flex h-12 items-center gap-3 rounded-xl border border-[#dce5f2] bg-[#F7F9FB] px-3.5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/10">
                      <Contact size={22} className="shrink-0 text-[#8ba0c0]" />
                      <input
                        type="text"
                        value={username ?? ""}
                        name="username"
                        onChange={handleChange}
                        className="h-full w-full min-w-0 bg-transparent text-sm text-slate-900 outline-none placeholder:text-[#8ba0c0]"
                      />
                    </div>
                    <p className="bg-[#FEFBED] text-[#643315] text-xs font-normal px-3 py-2 rounded-lg mt-1">
                      Update your username to add here.
                    </p>
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="min-w-0">
                      <label className="text-sm font-semibold text-slate-900">
                        LANDER NAME
                      </label>
                      <div className="flex h-12 items-center gap-3 rounded-xl border border-[#dce5f2] bg-[#F7F9FB] px-3.5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/10">
                        <FileUser
                          size={22}
                          className="shrink-0 text-[#8ba0c0]"
                        />
                        <input
                          type="text"
                          value={landerName ?? ""}
                          name="lastName"
                          disabled
                          className="h-full w-full min-w-0 bg-transparent text-sm text-slate-900 outline-none placeholder:text-[#8ba0c0]"
                        />
                      </div>
                    </div>
                    <p className="bg-[#FEFBED] text-[#643315] text-xs font-normal px-3 py-2 rounded-lg">
                      Your landerName cannot be changed. If you need to update
                      your landerName, please{" "}
                      <Link
                        to="/contact"
                        className="text-red-500 hover:underline"
                      >
                        Contact Us
                      </Link>
                      .
                    </p>
                  </div>
                  <div>
                    <UpdatePhone setUser={setUser} user={user} />
                  </div>
                  <UpdateProfile
                    user={user}
                    setUser={setUser}
                    logoRef={logoRef}
                  />

                  <button
                    type="button"
                    onClick={() => {
                      setIsShow(true);
                    }}
                    className="bg-[#96c94b] mt-3 cursor-pointer text-[#000000] flex justify-center items-center gap-1 min-w-32 w-32 h-12 rounded-lg"
                  >
                    <p>Update</p>
                    <ArrowRight size={20} />
                  </button>
                </form>
              </div>
            </div>
            <div className="my-5 bg-white border border-gray-200 rounded-2xl shadow p-5 md:p-10">
              <div className="my-5">
                <p className="text-gray-700 text-medium text-base md:text-xl pb-2 md:pb-5">
                  Update your password
                </p>
              </div>
              <SettingPassUpdate id={userAuth ? userAuth?.id : ""} />
            </div>
            <UpdateDirectoryStatus />
            {userAuth?.referalCode && <ToggleBrandshare />}
            {userAuth && userAuth?.userTemplete?.length > 0 && (
              <UpdateMerchendiseStatus />
            )}
            <DeactivateAccount />

            {isShow && (
              <SaveSettingWarn
                isShow={isShow}
                setShow={setIsShow}
                id={userAuth?.id || ""}
                user={user}
                logoRef={logoRef}
              />
            )}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default Setting;
