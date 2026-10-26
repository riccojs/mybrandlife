import React, { useRef, useState } from "react";
import { Link } from "react-router";
import toast from "react-hot-toast";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import {
  ArrowRight,
  CardSim,
  CircleCheckBig,
  MailSearch,
  MapPinHouse,
  UserCheck,
  UserRoundKey,
  UserRoundPen,
} from "lucide-react";
import { useAuth } from "../hook/useAuth";
import { useUpdateAdminMutation } from "../redux/features/auth/authApi";
import SettingPassUpdate from "../component/setting/Setting.pass.update";
import ToggleMaintenance from "../component/setting/Toggle.maintenance";
import WarningPopup from "../component/Warning.popup";
import SettingProfile from "../component/setting/Admin.setting.profile";

interface UserType {
  profile: string | File | null;
  email: string | null;
  address: string | null;
  phone: string | null;
  username: string | null;
  lastName: string | null;
  firstName: string | null;
  id: string | null;
  secureKey: string | null;
  status: string | null;
}

interface AuthType {
  user: UserType | null;
}

function Setting() {
  const logoRef = useRef<HTMLInputElement>(null);
  const [updateAdmin, { isLoading }] = useUpdateAdminMutation();
  const { user: userAuth } = useAuth() as AuthType;
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<UserType>(() => ({
    profile: userAuth?.profile ?? null,
    email: userAuth?.email ?? "",
    address: userAuth?.address ?? "",
    phone: userAuth?.phone ?? "",
    username: userAuth?.username ?? "",
    lastName: userAuth?.lastName ?? "",
    firstName: userAuth?.firstName ?? "",
    id: userAuth?.id ?? "",
    secureKey: userAuth?.secureKey ?? "",
    status: userAuth?.status ?? "",
  }));
  const {
    lastName,
    firstName,
    username,
    email,
    phone,
    address,
    profile,
    secureKey,
    status,
  } = user || {};

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("username", username ? username : "");
    formData.append("firstName", firstName ? firstName : "");
    formData.append("lastName", lastName ? lastName : "");
    formData.append("phone", phone ? phone : "");
    formData.append("address", address ? address : "");
    formData.append("secureKey", secureKey ? secureKey : "");
    if (profile instanceof File) {
      formData.append("profile", profile);
    }
    const id = userAuth ? userAuth?.id : "";

    updateAdmin({ formData, id })
      .unwrap()
      .then((res) => {
        toast.success(res.message);
        if (logoRef.current) logoRef.current.value = "";
        setOpen(false);
      })
      .catch((error) => {
        const err = error as FetchBaseQueryError;
        const errorMessage = (err.data as { message: string }).message;
        toast.error(errorMessage);
      });
  };

  return (
    <React.Fragment>
      <div className="p-3 md:p-5">
        <div className="w-full">
          <h2 className="text-normal text-xl md:text-3xl">Profile Settings</h2>
          <ul className="flex gap-2 flex-wrap items-center py-2">
            <li>
              <Link to="/" className="text-normal text-sm md:text-base">
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
          <div className="jost">
            <div className="bg-white p-5 md:p-10 rounded-3xl border border-gray-200">
              <div className="relative rounded-2xl h-44 md:h-54 bg-linear-to-r from-[#08251e] via-[#064333] to-[#087354]">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_82%_20%,rgba(17,185,129,0.19),transparent_40%),radial-gradient(ellipse_at_40%_100%,rgba(4,120,87,0.12),transparent_45%)]" />

                <div className="absolute left-2 md:left-7 top-4.5 rounded-full border border-white/15 bg-white/15 px-7 py-1.5 text-[10px] font-medium tracking-wide text-emerald-100">
                  EDIT PROFILE
                </div>

                <div className="absolute right-2 md:right-7 top-4.5 flex items-center gap-2 rounded-full border border-white/15 bg-[#052e25]/75 px-5 py-1.5 text-[10px] text-emerald-100">
                  <CircleCheckBig size={12} />
                  {status}
                </div>
                <div className="absolute -bottom-8 md:-bottom-14 left-8">
                  {typeof profile === "string" ? (
                    <img
                      src={profile}
                      alt=""
                      className="w-18 md:w-32 rounded-full min-h-18 object-cover md:min-h-32 h-18 md:h-32"
                    />
                  ) : (
                    <p className="min-w-18 md:min-w-32 min-h-32 md:min-h-32 w-18 md:w-32 h-18 md:h-32 rounded-full bg-gray-300 text-6xl uppercase text-normal flex justify-center items-center">
                      {username?.slice(0, 1)}
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-10 md:mt-20">
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 my-5">
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
                        SECURITY KEY
                      </label>
                      <div className="flex h-12 items-center gap-3 rounded-xl border border-[#dce5f2] bg-[#F7F9FB] px-3.5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/10">
                        <UserRoundKey
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
                        PHONE NUMBER
                      </label>
                      <div className="flex h-12 items-center gap-3 rounded-xl border border-[#dce5f2] bg-[#F7F9FB] px-3.5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/10">
                        <CardSim
                          size={22}
                          className="shrink-0 text-[#8ba0c0]"
                        />
                        <input
                          type="text"
                          value={phone ?? ""}
                          name="phone"
                          onChange={handleChange}
                          className="h-full w-full min-w-0 bg-transparent text-sm text-slate-900 outline-none placeholder:text-[#8ba0c0]"
                        />
                      </div>
                    </div>
                    <div className="min-w-0">
                      <label className="text-sm font-semibold text-slate-900">
                        FULL ADDRESS
                      </label>
                      <div className="flex h-12 items-center gap-3 rounded-xl border border-[#dce5f2] bg-[#F7F9FB] px-3.5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/10">
                        <MapPinHouse
                          size={22}
                          className="shrink-0 text-[#8ba0c0]"
                        />
                        <input
                          type="text"
                          value={address ?? ""}
                          name="address"
                          onChange={handleChange}
                          className="h-full w-full min-w-0 bg-transparent text-sm text-slate-900 outline-none placeholder:text-[#8ba0c0]"
                        />
                      </div>
                    </div>

                    <SettingProfile
                      user={user}
                      setUser={setUser}
                      logoRef={logoRef}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(true);
                    }}
                    disabled={isLoading}
                    className="bg-[#96c94b] text-[#000000] flex justify-center items-center gap-1 w-fit border border-[#76c725] min-w-32 h-12 rounded-xl cursor-pointer"
                  >
                    <p>Save</p>
                    <ArrowRight size={18} />
                  </button>
                </form>
              </div>
            </div>

            <div className="mt-3 md:mt-5 bg-white border border-gray-200 p-5 md:p-10 rounded-3xl">
              <div className="my-5">
                <p className="text-gray-700 text-medium text-base md:text-xl pb-5">
                  Update your password
                </p>
              </div>
              <SettingPassUpdate id={userAuth ? userAuth?.id : ""} />
            </div>
            <ToggleMaintenance />
          </div>
        </div>
      </div>
      <WarningPopup
        open={open}
        title="Do you want to save info setting?"
        description={`To update your setting, click "Save". If you decide not to proceed, click "Close" to exit without saving your changes.`}
        smButton="Save"
        clButton="Close"
        onClose={() => setOpen(false)}
        onConfirm={handleSubmit}
        loading={isLoading}
      />
    </React.Fragment>
  );
}

export default Setting;
