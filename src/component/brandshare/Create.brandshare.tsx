import { useRef, useState } from "react";
import toast from "react-hot-toast";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useCreateReferralMutation } from "../../redux/features/referral/referralApi";
import SelectComponent from "../ui/Select.component";

interface TypesForm {
  showTab: boolean;
  setShowTab: React.Dispatch<React.SetStateAction<boolean>>;
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

function CreateBrandshare({ showTab, setShowTab }: TypesForm) {
  const [referral, setReferral] = useState<PartnerType>({
    code: "",
    value: "",
    type: "",
    active: false,
    limit: "",
    expire_in: "",
    label: "",
    link: "",
    profile: null,
  });
  const [createReferral, { isLoading }] = useCreateReferralMutation();
  const { code, value, type, active, limit, label, link, expire_in, profile } =
    referral;
  const logoRef = useRef<HTMLInputElement>(null);

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
    createReferral(formData)
      .unwrap()
      .then((res) => {
        toast.success(res.message);
        setShowTab(false);
        if (logoRef.current) logoRef.current.value = "";
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
    <div className="inset-0 bg-[#00000053] flex fixed left-0 justify-center items-center w-full min-h-screen z-50 overflow-auto">
      <div
        className={`relative flex flex-col w-11/12 md:w-8/12 lg:w-6/12 2xl:w-5/12 m-auto justify-center p-10 rounded-3xl shadow-sm bg-[#ffffff] border border-gray-300 ${
          showTab ? "zoom-animation" : ""
        }`}
      >
        <h2 className="text-2xl font-medium text-black text-center mt-5 mb-2">
          Create BrandShare
        </h2>
        <p className="text-md font-normal text-black text-center">
          Ensure all mandatory fields are filled in with the correct
          information. Upon completion, you may proceed to establish the
          referral system.
        </p>

        <form
          onSubmit={handleSubmit}
          className="w-full my-5 flex flex-col gap-5"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="" className="text-md font-normal text-black">
                BrandShare Code
              </label>
              <input
                type="text"
                name="code"
                value={code}
                onChange={handleChange}
                required
                className="border border-gray-300 px-4 py-2 rounded-lg w-full focus:outline-1 focus:outline-[#96c94b]"
                placeholder="Enter BrandShare code"
              />
              <p className="text-gray-400 text-xs">(Code must be unique)</p>
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
                required
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
                required
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
                required
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
                required
                className="border border-gray-300 px-4 py-2 rounded-lg w-full focus:outline-1 focus:outline-[#96c94b]"
                placeholder="Enter BrandShare value"
              />
            </div>
            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="logo" className="text-md font-medium text-black">
                Brand Logo
              </label>

              <input
                name="profile"
                ref={logoRef}
                accept=".jpg,.jpeg,.png,.svg,image/jpeg,image/png,image/svg+xml"
                onChange={handleFileChange}
                type="file"
                id="logo"
                className="border border-gray-300 px-4 py-2 rounded-lg w-full focus:outline-1 focus:outline-[#96c94b]"
              />

              <span className="text-xs font-normal bg-amber-100 mt-1 text-black p-2 rounded-lg">
                Upload your brand logo (JPG, JPEG, PNG, SVG only). Maximum file
                size: 2MB.
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
                  setReferral((prev) => ({ ...prev, active: e.target.checked }))
                }
              />
              <label
                htmlFor="active"
                className="text-md font-normal text-black"
              >
                Active referral
              </label>
            </div>
          </div>

          <div className="flex gap-3 items-center">
            <button
              type="button"
              onClick={() => setShowTab(false)}
              className="w-fit bg-slate-200 text-black px-5 py-3 rounded-lg cursor-pointer"
            >
              Close
            </button>
            <button
              type="submit"
              className="bg-[#82C24E] py-3 px-5 rounded-lg text-black cursor-pointer"
            >
              {isLoading ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6 animate-spin"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                    />
                  </svg>
                  <p>Loading...</p>
                </>
              ) : (
                "Create BrandShare"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateBrandshare;
