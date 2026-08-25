import React, { useRef, useState } from "react";
import { useUpdateUserByAdminMutation } from "../../redux/features/auth/authApi";
import Profile from "../../assets/MBL_Logo_CROP.png";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import toast from "react-hot-toast";
import WarningPopup from "../Warning.popup";
import DeactivateUser from "./Deactivate.user";
import { domains, frequencyData, packageData } from "../../utils/domains";
import { useParams } from "react-router";
import type { UserSettingType } from "../../utils/user.types";
import SelectComponent from "../ui/Select.component";
import InputComponent from "../ui/Input.component";
import UpdatePhone from "./Update.phone";

export interface UserType {
  frequency: string;
  domain: string;
  package: string;
  planKey: string;
  planPrice: number;
  planOldPrice: number;
  email: string;
  password: string;
  landerName: string;
  midName: string;
  firstName: string;
  lastName: string;
  nickName?: string;
  phone: string;
  secondEmail?: string;
  aggreement: boolean;
  enablePrivateDomain: boolean;
  discount: number;
  discountType: string;
  referalCode: string;
  phoneCode: string;
  privateDomain: string;
  username: string;
  status: string;
  profile: string | File | null;
}

interface TypeForm {
  data: {
    user: UserType;
  };
}

function UserForm({ data }: TypeForm) {
  const params = useParams();
  const id = params.id;
  const [show, setShow] = useState(false);
  const [open, setOpen] = useState(false);
  const [updateUserByAdmin, { isLoading: updateLoad }] =
    useUpdateUserByAdminMutation();
  const logoRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<UserSettingType>({
    username: data?.user?.username || "",
    firstName: data?.user?.firstName || "",
    midName: data?.user?.midName || "",
    lastName: data?.user?.lastName || "",
    email: data?.user?.email || "",
    phone: data?.user?.phone || "",
    profile: null,
    landerName: data?.user?.landerName || "",
    package: data?.user?.package || "",
    frequency: data?.user?.frequency || "",
    status: data?.user?.status || "",
    domain: data?.user?.domain || "",
    discountType: data?.user?.discountType || "",
    privateDomain: data?.user?.privateDomain || "",
    phoneCode: data?.user?.phoneCode || "",
    id: "",
    enablePrivateDomain: data?.user?.enablePrivateDomain || false,
  });

  const {
    username,
    firstName,
    midName,
    lastName,
    email,
    phone,
    profile,
    landerName,
    frequency,
    status,
    domain,
    discountType,
    enablePrivateDomain,
    privateDomain,
    phoneCode,
  } = user || {};

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("username", username ? username : "");
    formData.append("firstName", firstName ? firstName : "");
    formData.append("midName", midName ? midName : "");
    formData.append("lastName", lastName ? lastName : "");
    formData.append("email", email ? email : "");
    formData.append("phone", phone ? phone : "");
    formData.append("landerName", landerName ? landerName : "");
    formData.append("frequency", frequency ? frequency : "");
    formData.append("phoneCode", phoneCode ? phoneCode : "");
    formData.append("privateDomain", privateDomain ? privateDomain : "");
    formData.append("enablePrivateDomain", String(enablePrivateDomain));
    formData.append("domain", domain ? domain : "");
    formData.append("discountType", discountType ? discountType : "");
    formData.append("package", user.package ? user.package : "");
    if (profile && profile instanceof File) {
      formData.append("profile", profile);
    }

    updateUserByAdmin({ formData, id: id })
      .unwrap()
      .then((res) => {
        toast.success(res.message);
        if (logoRef.current) logoRef.current.value = "";
      })
      .catch((error) => {
        const err = error as FetchBaseQueryError;
        const errorMessage = (err.data as { message: string }).message;
        toast.error(errorMessage);
      });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!files || files.length === 0) return;
    const file = files[0] || null;
    setUser((prevState) => ({
      ...prevState,
      profile: file,
    }));
  };

  const domainData = domains.map((item) => ({ key: item, value: item }));

  return (
    <div className="w-full">
      <div className="w-full flex gap-5 items-center">
        <h2 className="text-xl text-normal font-medium">
          User Profile Information
        </h2>
        <p
          className={`px-4 py-2 rounded-xl w-fit font-bold text-sm ${
            status === "ACTIVATE"
              ? "bg-green-100 text-green-600"
              : status === "PENDING"
                ? "bg-yellow-100 text-yellow-600"
                : "bg-red-100 text-red-600"
          }`}
        >
          {status}
        </p>
      </div>
      <div className="mt-5">
        <div className="flex flex-wrap gap-5 items-center">
          <div className="w-20 h-20 min-h-20 min-w-20 rounded-full shadow-lg overflow-hidden p-1">
            <img
              src={
                profile
                  ? profile instanceof File
                    ? URL.createObjectURL(profile)
                    : profile
                  : Profile
              }
              alt="Profile"
              className="rounded-full w-full h-full object-cover"
            />
          </div>

          <button className="bg-[#cbf38b] px-6 py-3 rounded-lg text-md font-normal text-normal">
            <label
              htmlFor="image"
              className="flex gap-2 items-center cursor-pointer"
            >
              <i className="fa-solid fa-plus"></i>
              <p>Upload Image</p>
            </label>
            <input
              name="profile"
              ref={logoRef}
              accept="image/jpeg,image/jpg,image/png,image/svg+xml"
              onChange={handleFileChange}
              type="file"
              id="image"
              className="hidden"
            />
          </button>

          <button
            type="button"
            onClick={() =>
              setUser((prev) => ({
                ...prev,
                profile: null,
              }))
            }
            className="border border-gray-300 px-4 py-3 rounded-lg"
          >
            Remove
          </button>
        </div>
      </div>
      <div className="mt-10 w-full">
        <form>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="" className="text-md font-normal text-[#737373]">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={username}
                onChange={handleChange}
                className="bg-[#f5f5f5] text-[#262626] border border-gray-300 text-base px-4 py-3 rounded-xl w-full focus:outline-[#96c94b]"
                placeholder="Update Username"
              />
            </div>
            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="" className="text-md font-normal text-[#737373]">
                Domain
              </label>
              <SelectComponent
                value={domain}
                label="Select Domain"
                handleChange={(item: string) =>
                  setUser((prev) => ({ ...prev, domain: item }))
                }
                datas={domainData}
                color="#F3F3F3"
              />
            </div>
            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="" className="text-md font-normal text-[#737373]">
                Package
              </label>
              <SelectComponent
                value={user?.package}
                label="Select Package"
                handleChange={(item: string) =>
                  setUser((prev) => ({ ...prev, package: item }))
                }
                datas={packageData}
                color="#F3F3F3"
              />
            </div>
            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="" className="text-md font-normal text-[#737373]">
                Frequency
              </label>
              <SelectComponent
                value={frequency}
                label="Select Frequency"
                handleChange={(item: string) =>
                  setUser((prev) => ({ ...prev, frequency: item }))
                }
                datas={frequencyData}
                color="#F3F3F3"
              />
            </div>

            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="" className="text-md font-normal text-[#737373]">
                Fristname
              </label>
              <input
                type="text"
                name="firstName"
                value={firstName}
                onChange={handleChange}
                className="bg-[#f5f5f5] text-[#262626] border border-gray-300 text-base px-4 py-3 rounded-xl w-full focus:outline-[#96c94b]"
                placeholder="Update firstname"
              />
            </div>
            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="" className="text-md font-normal text-[#737373]">
                MidName
              </label>
              <input
                type="text"
                name="midName"
                value={midName}
                onChange={handleChange}
                className="bg-[#f5f5f5] text-[#262626] border border-gray-300 text-base px-4 py-3 rounded-xl w-full focus:outline-[#96c94b]"
                placeholder="Update Midname"
              />
            </div>
            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="" className="text-md font-normal text-[#737373]">
                Lastname
              </label>
              <input
                type="text"
                name="lastName"
                value={lastName}
                onChange={handleChange}
                className="bg-[#f5f5f5] text-[#262626] border border-gray-300 text-base px-4 py-3 rounded-xl w-full focus:outline-[#96c94b]"
                placeholder="Update Lastname"
              />
            </div>
            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="" className="text-md font-normal text-[#737373]">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={handleChange}
                className="bg-[#f5f5f5] text-[#262626] border border-gray-300 text-base px-4 py-3 rounded-xl w-full focus:outline-[#96c94b]"
                placeholder="Update Email"
              />
            </div>

            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="" className="text-md font-normal text-[#737373]">
                Lander Name
              </label>
              <input
                type="text"
                name="landerName"
                value={landerName}
                onChange={handleChange}
                className="bg-[#f5f5f5] text-[#262626] border border-gray-300 text-base px-4 py-3 rounded-xl w-full focus:outline-[#96c94b]"
                placeholder="Update Lander Name"
              />
            </div>
            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="" className="text-md font-normal text-[#737373]">
                Discount Type
              </label>
              <SelectComponent
                value={discountType}
                label="Select discount type"
                handleChange={(item: string) =>
                  setUser((prev) => ({ ...prev, discountType: item }))
                }
                datas={[
                  { key: "Monthly", value: "MONTHLY" },
                  { key: "Percent", value: "PERCENT" },
                  { key: "Lifetime", value: "LIFETIME" },
                ]}
                color="#F3F3F3"
              />
            </div>
            <UpdatePhone setUser={setUser} user={user} />
            <div className="flex flex-col gap-1">
              <p>Private Domain</p>
              <InputComponent
                type="text"
                placeholder="Update private domain"
                name="privateDomain"
                value={privateDomain || ""}
                handleChange={handleChange}
                autoComplete="privateDomain"
                required={false}
              />
              <div className="flex gap-2 mt-1">
                <input
                  type="checkbox"
                  id="enablePrivateDomain"
                  checked={enablePrivateDomain}
                  name="enablePrivateDomain"
                  onChange={handleChange}
                />
                <label
                  htmlFor="enablePrivateDomain"
                  className="text-md font-medium text-black mt-1 cursor-pointer"
                >
                  Activate or deactivate user domain.
                </label>
              </div>
            </div>
          </div>
          <div className="w-full flex gap-5 justify-end mt-5">
            <button
              className={`flex gap-2 items-center cursor-pointer px-6 py-3 rounded-lg text-md font-medium ${
                status === "ACTIVATE"
                  ? "bg-green-100 text-green-600"
                  : status === "PENDING"
                    ? "bg-yellow-100 text-yellow-600"
                    : "bg-red-100 text-red-600"
              }`}
              type="button"
              onClick={() => setShow(true)}
            >
              <p>Update Status</p>
            </button>
            <button
              className="bg-[#cbf38b] cursor-pointer px-6 py-3 rounded-lg text-md font-normal text-black"
              type="button"
              onClick={() => setOpen(true)}
            >
              Save
            </button>
          </div>
        </form>
      </div>
      <DeactivateUser
        setShow={setShow}
        isShow={show}
        status={status}
        id={id ?? ""}
      />

      <WarningPopup
        open={open}
        title="Do you want save this settings?"
        description={`The changes you are about to save will be applied to all associated items in the database. This action may impact existing records and related functionality. Please confirm that you wish to continue. Click "Save" to proceed or "Close" to cancel.`}
        smButton="Save"
        clButton="Close"
        onClose={() => setOpen(false)}
        onConfirm={() => handleSubmit()}
        loading={updateLoad}
      />
    </div>
  );
}

export default UserForm;
