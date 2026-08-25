import React, { useRef, useState } from "react";
import type { CreatePartnerType, PartnerType } from "../../utils/partner.types";
import { useUpdatePartnerMutation } from "../../redux/features/partner/partnerApi";
import SelectDomain from "../ui/Select.domain";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import toast from "react-hot-toast";

interface TypeForm {
  data: {
    partner: PartnerType;
  };
  setShowTab: React.Dispatch<React.SetStateAction<boolean>>;
  id: string;
}

function PartnerForm({ data, setShowTab, id }: TypeForm) {
  const [partner, setPartner] = useState<CreatePartnerType>({
    title: data?.partner?.title || "",
    description: data?.partner?.description || "",
    linkText: data?.partner?.linkText || "",
    link: data?.partner?.link || "",
    profile: null,
    type: data?.partner?.type || "",
    recipent: data?.partner?.recipent || [],
    recipentLabel: data?.partner?.recipentLabel || "",
  });
  const [emailInput, setEmailInput] = useState("");
  const [updatePartner, { isLoading: upLoad }] = useUpdatePartnerMutation();

  const {
    title,
    description,
    linkText,
    link,
    profile,
    type,
    recipent,
    recipentLabel,
  } = partner;
  const logoRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setPartner({
      ...partner,
      [name]: value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!files || files.length === 0) return;
    const file = files[0] || null;
    setPartner((prevState) => ({
      ...prevState,
      profile: file,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (type === "FORMTYPE" && recipent?.length === 0) {
      toast.error("Please add at least one email");
      return;
    }
    const formData = new FormData();
    formData.append("title", title ? title : "");
    formData.append("description", description ? description : "");
    formData.append("linkText", linkText ? linkText : "");
    formData.append("link", link ? link : "");
    formData.append("type", type ? type : "");
    formData.append("recipentLabel", recipentLabel ? recipentLabel : "");
    formData.append("recipent", JSON.stringify(partner.recipent));

    if (profile && profile instanceof File) {
      formData.append("profile", profile);
    }

    updatePartner({ id, formData })
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

  return (
    <form onSubmit={handleSubmit} className="w-full my-5 flex flex-col gap-5">
      <div className="flex flex-col gap-1 w-full">
        <label htmlFor="" className="text-md font-normal text-black">
          Title
        </label>
        <div>
          <input
            type="text"
            name="title"
            value={title}
            onChange={handleChange}
            required
            maxLength={65}
            className="border border-gray-300 px-4 py-2 rounded-lg w-full focus:outline-1 focus:outline-[#96c94b]"
            placeholder="Enter email"
          />
          <p className="text-sm font-normal text-gray-400">
            Maximum length 65 characters
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-1 w-full">
        <label htmlFor="" className="text-md font-normal text-black">
          Title
        </label>
        <SelectDomain
          value={partner.type}
          label="Select Type"
          handleChange={(value: string) =>
            setPartner((prev) => ({ ...prev, type: value }))
          }
          datas={[
            { key: "LINKTYPE", value: "LINKTYPE" },
            { key: "FORMTYPE", value: "FORMTYPE" },
          ]}
          color="#F3F3F3"
        />
      </div>
      <div className="flex flex-col gap-1 w-full">
        <label htmlFor="" className="text-md font-normal text-black">
          Description
        </label>
        <div>
          <textarea
            required
            name="description"
            onChange={handleChange}
            value={description}
            maxLength={230}
            rows={4}
            className="border border-gray-300 px-4 py-2 rounded-lg w-full focus:outline-1 focus:outline-[#96c94b]"
          ></textarea>
          <p className="text-sm font-normal text-gray-400">
            Maximum length 230 characters
          </p>
        </div>
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
      </div>

      {type === "LINKTYPE" ? (
        <>
          <div className="flex flex-col gap-1 w-full">
            <label htmlFor="" className="text-md font-normal text-black">
              Link Label
            </label>
            <input
              type="text"
              name="linkText"
              value={linkText}
              onChange={handleChange}
              required
              className="border border-gray-300 px-4 py-2 rounded-lg w-full focus:outline-1 focus:outline-[#96c94b]"
              placeholder="Enter link label"
            />
          </div>
          <div className="flex flex-col gap-1 w-full">
            <label htmlFor="" className="text-md font-normal text-black">
              Link
            </label>
            <input
              type="url"
              name="link"
              value={link}
              onChange={handleChange}
              required
              className="border border-gray-300 px-4 py-2 rounded-lg w-full focus:outline-1 focus:outline-[#96c94b]"
              placeholder="Enter link"
            />
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col gap-1 w-full">
            <label htmlFor="" className="text-md font-normal text-black">
              Recipient Label
            </label>
            <input
              type="text"
              name="recipentLabel"
              value={recipentLabel}
              onChange={handleChange}
              required
              className="border border-gray-300 px-4 py-2 rounded-lg w-full focus:outline-1 focus:outline-[#96c94b]"
              placeholder="Enter recipient label"
            />
          </div>
          <div className="flex flex-col gap-1 w-full">
            <label htmlFor="" className="text-md font-normal text-black">
              Recipient Emails
            </label>
            <div className="flex flex-wrap gap-2 border border-gray-300 px-2 py-2 rounded-lg">
              {partner.recipent.map((email, index) => (
                <span
                  key={index}
                  className="bg-[#96c94b] text-white px-2 py-1 rounded-md text-sm flex items-center gap-1"
                >
                  {email}
                  <button
                    type="button"
                    onClick={() =>
                      setPartner((prev) => ({
                        ...prev,
                        recipent: prev.recipent.filter((_, i) => i !== index),
                      }))
                    }
                  >
                    ✕
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const email = emailInput.trim();
                    if (!email) return;
                    if (!/^\S+@\S+\.\S+$/.test(email)) {
                      return;
                    }
                    if (partner.recipent.includes(email)) {
                      setEmailInput("");
                      return;
                    }
                    setPartner((prev) => ({
                      ...prev,
                      recipent: [...prev.recipent, email],
                    }));
                    setEmailInput("");
                  }
                }}
                className="flex-1 outline-none px-1"
                placeholder="Type email and press Enter"
              />
            </div>
          </div>
        </>
      )}
      <div className="flex gap-3 items-center">
        <button
          type="button"
          onClick={() => setShowTab(false)}
          className="bg-slate-200 cursor-pointer px-5 justify-center py-3 rounded-lg w-fit flex gap-2 items-center"
        >
          Close
        </button>
        <button
          type="submit"
          className="bg-[#96BF4D] cursor-pointer min-w-44 justify-center py-3 rounded-lg w-fit flex gap-2 items-center"
        >
          {upLoad ? (
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
            "Update"
          )}
        </button>
      </div>
    </form>
  );
}

export default PartnerForm;
