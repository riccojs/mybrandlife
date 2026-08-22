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
import { ArrowRight } from "lucide-react";
import { useAuth } from "../hook/useAuth";
import type { UserSettingType } from "../utils/user.types";
import InputComponent from "../component/ui/Input.component";

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
          <h2 className="text-normal text-2xl md:text-3xl">Profile Setting</h2>
          <ul className="flex gap-2 items-center py-2">
            <li>
              <Link
                to="/dashboard"
                className="text-normal text-sm md:text-base"
              >
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
            <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-10">
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
                    {landerName?.slice(0, 1)}
                  </p>
                )}
              </div>
              <div>
                <form className="grid grid-cols-1 md:grid-cols-2 gap-5 my-5">
                  <div className="flex flex-col gap-1 w-full">
                    <p>First Name</p>
                    <InputComponent
                      type="text"
                      placeholder="Update first name"
                      name="firstName"
                      value={firstName || ""}
                      handleChange={handleChange}
                      autoComplete="firstName"
                      required={false}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <p>Mid Name</p>
                    <InputComponent
                      type="text"
                      placeholder="Update middle name"
                      name="midName"
                      value={midName || ""}
                      handleChange={handleChange}
                      autoComplete="midName"
                      required={false}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <p>Last Name</p>
                    <InputComponent
                      type="text"
                      placeholder="Update last name"
                      name="lastName"
                      value={lastName || ""}
                      handleChange={handleChange}
                      autoComplete="lastName"
                      required={false}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <p>Username</p>
                    <InputComponent
                      type="text"
                      placeholder="Update username"
                      name="username"
                      value={username || ""}
                      handleChange={handleChange}
                      autoComplete="username"
                      required={false}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <p>Email address</p>
                    <InputComponent
                      type="email"
                      placeholder="Enter email address"
                      name="email"
                      value={email || ""}
                      handleChange={handleChange}
                      autoComplete="email"
                      required={false}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <p>Lander Name</p>
                    <input
                      type="text"
                      name="landerName"
                      value={landerName || ""}
                      disabled
                      className="bg-[#e8e8e8] cursor-not-allowed border border-gray-300 focus:outline focus:outline-[#96c94b] focus:border py-3 px-3 w-full rounded-xl text-normal"
                    />
                    <p className="text-black bg-amber-50 px-3 py-2 text-sm mt-1 rounded-xl">
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
                  <div className="md:col-span-2">
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
                    className="bg-[#BDF188] text-[#000000] flex justify-center items-center gap-1 w-fit border border-[#76c725] px-10 py-4 rounded-2xl cursor-pointer"
                  >
                    <p>Save</p>
                    <ArrowRight />
                  </button>
                </form>
              </div>
            </div>
            <div className="my-5 bg-white border border-gray-200 rounded-xl p-10">
              <div className="my-5">
                <p className="text-gray-700 text-medium text-xl pb-5">
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
