import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { CreatePartnerType } from "../../utils/partner.types";
import { useCreatePartnerMutation } from "../../redux/features/partner/partnerApi";
import SelectDomain from "../ui/Select.domain";
import { LoaderCircle } from "lucide-react";

interface TypesForm {
  showTab: boolean;
  setShowTab: React.Dispatch<React.SetStateAction<boolean>>;
}

function CreatePartner({ showTab, setShowTab }: TypesForm) {
  const [partner, setPartner] = useState<CreatePartnerType>({
    title: "",
    description: "",
    linkText: "",
    link: "",
    profile: null,
    type: "",
    recipent: [],
    recipentLabel: "",
  });
  const [emailInput, setEmailInput] = useState("");

  const [createPartner, { isLoading }] = useCreatePartnerMutation();
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
    if (type?.length === 0) {
      toast.error("Please select type");
      return;
    }
    if (type === "FORMTYPE" && recipent?.length === 0) {
      toast.error("Please add at least one email");
      return;
    }

    const formData = new FormData();
    formData.append("title", title ? title : "");
    formData.append("description", description ? description : "");
    formData.append("linkText", linkText ? linkText : "");
    formData.append("link", link ? link : "");
    formData.append("recipent", JSON.stringify(partner.recipent));
    formData.append("type", type ? type : "");
    formData.append("recipentLabel", recipentLabel ? recipentLabel : "");
    if (profile && profile instanceof File) {
      formData.append("profile", profile);
    }
    createPartner(formData)
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

  useEffect(() => {
    if (showTab) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showTab]);

  return (
    <div className="inset-0 bg-[#00000039] flex fixed left-0 justify-center items-center w-full h-auto min-h-screen z-50">
      <div
        className={`relative max-h-[96vh] h-auto overflow-y-auto custom-scroll flex flex-col w-11/12 2xl:w-4/12 xl:w-6/12 m-auto justify-center p-5 md:p-8 rounded-xl shadow-sm bg-[#ffffff] border border-gray-300 ${
          showTab ? "zoom-animation" : ""
        }`}
      >
        <h2 className="text-base md:text-xl font-medium text-gray-500 text-center mt-5 mb-2">
          Create Partner
        </h2>
        <p className="bg-[#FEFBED] text-center text-[#643315] border-2 border-[#feeda0] text-xs md:text-sm font-normal px-2 py-3 rounded-lg">
          Ensure all mandatory fields are filled in with the correct
          information.
        </p>
        <form
          onSubmit={handleSubmit}
          className="w-full my-5 flex flex-col gap-5"
        >
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
                placeholder="Enter title"
              />
              <p className="text-xs mt-1 font-normal text-gray-400">
                Maximum length 65 characters
              </p>
            </div>
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
                placeholder="Enter description"
                className="border border-gray-300 px-4 py-2 rounded-lg w-full focus:outline-1 focus:outline-[#96c94b]"
              ></textarea>
              <p className="text-xs mt-1 font-normal text-gray-400">
                Maximum length 230 characters
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-1 w-full">
            <label htmlFor="" className="text-md font-normal text-black">
              Link Type
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
              Logo
            </label>
            <input
              name="profile"
              ref={logoRef}
              accept="image/jpeg,image/jpg,image/png,image/svg+xml"
              onChange={handleFileChange}
              type="file"
              id="image"
              required
              className="border border-gray-300 px-4 py-2 rounded-lg w-full focus:outline-1 focus:outline-[#96c94b]"
            />
          </div>

          {partner.type === "LINKTYPE" ? (
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
          ) : partner.type === "FORMTYPE" ? (
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
                      className="bg-[#96c94b] text-white px-2 py-1 rounded-md text-xs flex items-center gap-1"
                    >
                      {email}
                      <button
                        type="button"
                        onClick={() =>
                          setPartner((prev) => ({
                            ...prev,
                            recipent: prev.recipent.filter(
                              (_, i) => i !== index,
                            ),
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
          ) : null}

          <div className="flex gap-3 items-center">
            <button
              onClick={() => setShowTab(false)}
              disabled={isLoading}
              className="bg-slate-200 text-[#000000] flex justify-center items-center gap-1 w-fit border border-gray-200 px-10 h-12 rounded-lg cursor-pointer"
            >
              Close
            </button>
            <button
              disabled={isLoading}
              type="submit"
              className={`${isLoading ? "bg-[#77a630] cursor-not-allowed" : "bg-[#96c94b] cursor-pointer"}  text-[#000000] flex justify-center items-center gap-1 min-w-32 w-32 h-12 rounded-lg`}
            >
              {isLoading ? <LoaderCircle className="animate-spin" /> : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreatePartner;
