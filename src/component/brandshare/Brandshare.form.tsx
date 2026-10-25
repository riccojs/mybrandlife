import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import React, { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useUpdateReferralMutation } from "../../redux/features/referral/referralApi";
import SelectComponent from "../ui/Select.component";
import { LoaderCircle } from "lucide-react";

interface TypeForm {
  data: {
    referral: DataType;
  };
  setShowTab: React.Dispatch<React.SetStateAction<boolean>>;
  id: string;
}

interface DataType {
  code: string;
  value: string;
  type: string;
  active: boolean;
  limit: string;
  expire_in: string;
  label: string;
  link: string;
  profile: File | null;
}

interface PartnerType {
  code: string;
  value: string;
  type: string;
  active: boolean;
  limit: string;
  expire_in: string;
  label: string;
  link: string;
  profile: File | null;
}

function BrandshareForm({ data, setShowTab, id }: TypeForm) {
  const [referral, setReferral] = useState<PartnerType>({
    code: data?.referral?.code || "",
    value: data?.referral?.value || "",
    type: data?.referral?.type || "",
    active: data?.referral?.active || false,
    limit: data?.referral?.limit || "",
    expire_in: data
      ? new Date(data.referral.expire_in).toISOString().split("T")[0]
      : "",
    label: data?.referral?.label || "",
    link: data?.referral?.link || "",
    profile: null,
  });
  const logoRef = useRef<HTMLInputElement>(null);
  const [updateReferral, { isLoading: upLoad }] = useUpdateReferralMutation();
  const { code, value, type, active, limit, label, link, expire_in, profile } =
    referral;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setReferral({
      ...referral,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("code", code ? code : "");
    formData.append("value", value ? value : "");
    formData.append("type", type ? type : "");
    formData.append("limit", limit ? limit : "");
    formData.append("label", label ? label : "");
    formData.append("link", link ? link : "");
    formData.append("active", active ? "active" : "expired");
    formData.append("expire_in", expire_in ? expire_in : "");
    if (profile && profile instanceof File) {
      formData.append("profile", profile);
    }
    updateReferral({ id, formData })
      .unwrap()
      .then((res) => {
        toast.success(res.message);
        setShowTab(false);
      })
      .catch((error) => {
        const err = error as FetchBaseQueryError;
        const errorMessage = (err.data as { message: string }).message;
        toast.error(errorMessage);
      });
  };

  const handleTypeChange = (value: string) => {
    setReferral((prev) => ({
      ...prev,
      type: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const MAX_FILE_SIZE = 2 * 1024 * 1024;
    const file = files[0];
    if (file.size > MAX_FILE_SIZE) {
      alert("File size exceeds 2MB.");
      e.target.value = "";
      return;
    }
    setReferral((prevState) => ({
      ...prevState,
      profile: file,
    }));
  };
  return (
    <form onSubmit={handleSubmit} className="w-full my-5 flex flex-col gap-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="flex flex-col gap-1 w-full">
          <label htmlFor="" className="text-md font-normal text-black">
            BrandShare Code (Code must be unique)
          </label>
          <input
            type="text"
            name="code"
            value={code}
            onChange={handleChange}
            className="border border-gray-300 px-4 py-2 rounded-lg w-full focus:outline-1 focus:outline-[#96c94b]"
            placeholder="Enter BrandShare code"
          />
        </div>
        <div className="flex flex-col gap-1 w-full">
          <label htmlFor="" className="text-md font-normal text-black">
            Value
          </label>
          <input
            type="number"
            name="value"
            value={value}
            onChange={handleChange}
            className="border border-gray-300 px-4 py-2 rounded-lg w-full focus:outline-1 focus:outline-[#96c94b]"
            placeholder="Enter BrandShare value"
          />
        </div>
        <div className="flex flex-col gap-1 w-full">
          <label htmlFor="" className="text-md font-normal text-black">
            Limit
          </label>
          <input
            type="number"
            name="limit"
            value={limit}
            onChange={handleChange}
            className="border border-gray-300 px-4 py-2 rounded-lg w-full focus:outline-1 focus:outline-[#96c94b]"
            placeholder="Enter BrandShare value"
          />
        </div>
        <div className="flex flex-col gap-1 w-full">
          <label htmlFor="" className="text-md font-normal text-black">
            Expire In
          </label>
          <input
            type="date"
            name="expire_in"
            value={expire_in}
            onChange={handleChange}
            min={new Date().toISOString().split("T")[0]}
            className="border border-gray-300 px-4 py-2 rounded-lg w-full focus:outline-1 focus:outline-[#96c94b]"
            placeholder="Enter BrandShare value"
          />
        </div>
        <div className="flex flex-col gap-1 w-full">
          <label htmlFor="" className="text-md font-normal text-black">
            Label
          </label>
          <input
            type="text"
            name="label"
            value={label}
            onChange={handleChange}
            min={new Date().toISOString().split("T")[0]}
            className="border border-gray-300 px-4 py-2 rounded-lg w-full focus:outline-1 focus:outline-[#96c94b]"
            placeholder="Enter BrandShare value"
          />
        </div>
        <div className="flex flex-col gap-1 w-full">
          <label htmlFor="" className="text-md font-normal text-black">
            Link URL
          </label>
          <input
            type="url"
            name="link"
            value={link}
            onChange={handleChange}
            min={new Date().toISOString().split("T")[0]}
            className="border border-gray-300 px-4 py-2 rounded-lg w-full focus:outline-1 focus:outline-[#96c94b]"
            placeholder="Enter BrandShare value"
          />
        </div>
        <div className="flex flex-col gap-1 w-full">
          <label htmlFor="" className="text-md font-normal text-black">
            Logo
          </label>
          <input
            name="profile"
            ref={logoRef}
            accept="image/jpeg,image/jpg,image/png,image/svg+xml"
            onChange={handleFileChange}
            type="file"
            id="image"
            className="border border-gray-300 px-4 py-2 rounded-lg w-full focus:outline-1 focus:outline-[#96c94b]"
          />
          <span className="text-[11px] font-normal text-gray-500">
            Upload logo(JPG,JPEG,PNG,SVG only). Maximum file size:2MB.
          </span>
        </div>
        <div className="flex flex-col gap-1 w-full">
          <label htmlFor="" className="text-md font-normal text-black">
            Discount Type
          </label>
          <SelectComponent
            value={type}
            label="Select type"
            handleChange={handleTypeChange}
            datas={[
              { key: "Monthly", value: "MONTHLY" },
              { key: "Percent", value: "PERCENT" },
              { key: "Lifetime", value: "LIFETIME" },
            ]}
            color="#F3F3F3"
          />
        </div>
        <div className="flex gap-2 items-center">
          <input
            type="checkbox"
            name="active"
            id="active"
            checked={active}
            onChange={(e) =>
              setReferral((prev) => ({
                ...prev,
                active: e.target.checked,
              }))
            }
          />
          <label htmlFor="active" className="text-md font-normal text-black">
            Active referral
          </label>
        </div>
      </div>

      <div className="flex gap-3 items-center">
        <button
          onClick={() => setShowTab(false)}
          disabled={upLoad}
          className="bg-slate-200 text-[#000000] flex justify-center items-center gap-1 w-fit border border-gray-200 px-10 h-12 rounded-lg cursor-pointer"
        >
          Close
        </button>
        <button
          disabled={upLoad}
          type="submit"
          className={`${upLoad ? "bg-[#77a630] cursor-not-allowed" : "bg-[#96c94b] cursor-pointer"}  text-[#000000] flex justify-center items-center gap-1 min-w-32 w-32 h-12 rounded-lg`}
        >
          {upLoad ? <LoaderCircle className="animate-spin" /> : "Save"}
        </button>
      </div>
    </form>
  );
}

export default BrandshareForm;
