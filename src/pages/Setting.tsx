import React, { useRef, useState } from "react";
import { Link } from "react-router";
import toast from "react-hot-toast";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { ArrowRight } from "lucide-react";
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
          <h2 className="text-normal text-2xl md:text-3xl">Profile Settings</h2>
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
          <div className="jost">
            <div className="bg-white p-10 rounded-3xl border border-gray-200">
              <div className="border-b border-gray-300 pb-5">
                <p className="text-2xl text-medium">Genral Setting</p>
                <p className="text-gray-500 text-md font-normal">
                  Update your settings
                </p>
              </div>
              <div className="border-b border-gray-300 pb-5">
                {typeof profile === "string" ? (
                  <img src={profile} alt="" className="w-24 rounded-md mt-2" />
                ) : (
                  <p className="min-w-24 min-h-24 w-24 h-24 rounded-md bg-gray-300 text-6xl uppercase text-normal flex justify-center items-center">
                    {username?.slice(0, 1)}
                  </p>
                )}
              </div>
              <div>
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 my-5">
                    <div className="flex flex-col gap-1">
                      <p>Username</p>
                      <span className="flex gap-2 items-center border border-gray-300 rounded-md">
                        <span className="w-10 h-10 flex justify-center items-center bg-[#27746B] text-white rounded-l-md">
                          <i className="fa-regular fa-user"></i>
                        </span>
                        <input
                          type="text"
                          placeholder="Enter username"
                          name="username"
                          value={username || ""}
                          onChange={handleChange}
                          className="text-normal w-full outline-0"
                        />
                      </span>
                    </div>

                    <div className="flex flex-col gap-1">
                      <p>First Name</p>
                      <span className="flex gap-2 items-center border border-gray-300 rounded-md">
                        <span className="w-10 h-10 flex justify-center items-center bg-[#27746B] text-white rounded-l-md">
                          <i className="fa-regular fa-user"></i>
                        </span>
                        <input
                          type="text"
                          placeholder="Enter username"
                          name="firstName"
                          value={firstName || ""}
                          onChange={handleChange}
                          className="text-normal w-full outline-0"
                        />
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p>Last Name</p>
                      <span className="flex gap-2 items-center border border-gray-300 rounded-md">
                        <span className="w-10 h-10 flex justify-center items-center bg-[#27746B] text-white rounded-l-md">
                          <i className="fa-regular fa-user"></i>
                        </span>
                        <input
                          type="text"
                          placeholder="Enter username"
                          name="lastName"
                          value={lastName || ""}
                          onChange={handleChange}
                          className="text-normal w-full outline-0"
                        />
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p>Secret Key</p>
                      <span className="flex gap-2 items-center border border-gray-300 rounded-md">
                        <span className="w-10 h-10 flex justify-center items-center bg-[#27746B] text-white rounded-l-md">
                          <i className="fa-regular fa-user"></i>
                        </span>
                        <input
                          type="text"
                          placeholder="Enter secureKey"
                          name="secureKey"
                          value={secureKey || ""}
                          onChange={handleChange}
                          className="text-normal w-full outline-0"
                        />
                      </span>
                    </div>

                    <div className="flex flex-col gap-1">
                      <p>Email address</p>
                      <span className="flex gap-2 items-center border border-gray-300 rounded-md">
                        <span className="w-10 h-10 flex justify-center items-center bg-[#27746B] text-white rounded-l-md">
                          <i className="fa-regular fa-envelope"></i>
                        </span>
                        <input
                          type="text"
                          name="email"
                          value={email || ""}
                          placeholder="Enter email address"
                          className="text-normal w-full outline-0 "
                        />
                      </span>
                    </div>

                    <div className="flex flex-col gap-1">
                      <p>Enter phone number</p>
                      <span className="flex gap-2 items-center border border-gray-300 rounded-md">
                        <span className="w-10 h-10 flex justify-center items-center bg-[#27746B] text-white rounded-l-md">
                          <i className="fa-solid fa-phone-volume"></i>
                        </span>
                        <input
                          type="text"
                          name="phone"
                          value={phone || ""}
                          onChange={handleChange}
                          placeholder="Enter phone number"
                          className="text-normal w-full outline-0"
                        />
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p>Enter your address</p>
                      <span className="flex gap-2 items-center border border-gray-300 rounded-md">
                        <span className="w-10 h-10 flex justify-center items-center bg-[#27746B] text-white rounded-l-md">
                          <i className="fa-regular fa-id-badge"></i>
                        </span>
                        <input
                          type="text"
                          name="address"
                          value={address || ""}
                          onChange={handleChange}
                          placeholder="ENter address"
                          className="text-normal w-full outline-0"
                        />
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p>Profile Status</p>
                      <p className="bg-green-100 text-green-600 px-5 py-2 rounded-xl w-fit font-medium">
                        {userAuth?.status}
                      </p>
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
                    className="bg-[#BDF188] text-[#000000] flex justify-center items-center gap-1 w-fit border border-[#76c725] px-10 py-4 rounded-2xl cursor-pointer"
                  >
                    <p>Save</p>
                    <ArrowRight />
                  </button>
                </form>
              </div>
            </div>

            <div className="mt-5 bg-white border border-gray-200 p-10 rounded-3xl">
              <div className="my-5">
                <p className="text-gray-700 text-medium text-xl pb-5">
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
        title="Do you want save info setting?"
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
