import { useEffect, useState } from "react";
import { useParams } from "react-router";
import toast from "react-hot-toast";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { LoaderCircle, Plus } from "lucide-react";
import useBodyScroll from "../../hook/userBodyscroll";
import {
  useGetOneOnboardQuery,
  useUpdateInfoMutation,
} from "../../redux/features/onboard/onboardApi";
import InputComponent from "../ui/Input.component";
import TextareaComponent from "../ui/Textarea.component";

interface TypesForm {
  isShowInfo: boolean;
  setIsShowInfo: React.Dispatch<React.SetStateAction<boolean>>;
}

interface OnboardType {
  midName: string;
  nickName: string;
  bio: string;
  tagLine: string;
  offerings: string;
  businessServiced: { id?: string; title: string }[];
  funnySaying: string;
  firstName: string;
  lastName: string;
  privateDomain: string;
  services_label: string;
  about_label: string;
  enablePrivateDomain: boolean;
  enablevcf: boolean;
}

function EditInfo({ isShowInfo, setIsShowInfo }: TypesForm) {
  useBodyScroll(isShowInfo);
  const params = useParams();
  const id = params.id;
  const [updateInfo, { isLoading }] = useUpdateInfoMutation();
  const { data } = useGetOneOnboardQuery(id);
  const [onboard, setOnboard] = useState<OnboardType>({
    midName: "",
    nickName: "",
    bio: "",
    tagLine: "",
    offerings: "",
    businessServiced: [],
    funnySaying: "",
    lastName: "",
    firstName: "",
    privateDomain: "",
    services_label: "",
    about_label: "",
    enablePrivateDomain: false,
    enablevcf: false,
  });

  const {
    midName,
    nickName,
    bio,
    tagLine,
    offerings,
    funnySaying,
    firstName,
    lastName,
    privateDomain,
    services_label,
    about_label,
    enablePrivateDomain,
    enablevcf,
  } = onboard || {};

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setOnboard({
      ...onboard,
      [name]: value,
    });
  };

  useEffect(() => {
    if (data) {
      setOnboard({
        ...data?.onboard,
        midName: data?.onboard?.user?.midName,
        firstName: data?.onboard?.user?.firstName,
        lastName: data?.onboard?.user?.lastName,
        enablePrivateDomain: data?.onboard?.user?.enablePrivateDomain,
        enablevcf: data?.onboard?.user?.enablevcf,
        privateDomain: data?.onboard?.user?.privateDomain,
        businessServiced:
          data?.onboard?.services?.map((s: { id: string; title: string }) => ({
            id: s.id,
            title: s.title,
          })) || [],
      });
    }
  }, [data]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateInfo({ id, onboard })
      .unwrap()
      .then((res) => {
        toast.success(res.message);
        setIsShowInfo(false);
      })
      .catch((error) => {
        const err = error as FetchBaseQueryError;
        const errorMessage = (err.data as { message: string }).message;
        toast.error(errorMessage);
      });
  };

  const handleServiceChange = (index: number, value: string) => {
    const updatedServices = [...onboard.businessServiced];
    updatedServices[index].title = value;
    setOnboard({ ...onboard, businessServiced: updatedServices });
  };

  const handleAddService = () => {
    if (onboard.businessServiced.length >= 5) {
      toast.error("Max 5 feild are allow!");
      return;
    }
    setOnboard({
      ...onboard,
      businessServiced: [...onboard.businessServiced, { title: "" }],
    });
  };

  const handleRemoveService = (index: number) => {
    const updated = onboard.businessServiced.filter((_, i) => i !== index);
    setOnboard({ ...onboard, businessServiced: updated });
  };

  return (
    <div className="inset-0 bg-[#00000039] flex fixed left-0 justify-center items-center w-full h-auto min-h-screen z-50 overflow-auto">
      <div
        className={`overflow-hidden flex flex-col w-11/12 2xl:w-4/12 xl:w-6/12 m-auto justify-center rounded-3xl shadow-sm bg-[#ffffff] border border-gray-300 ${
          isShowInfo ? "zoom-animation" : ""
        }`}
      >
        <div className="p-8 min-h-[90vh] h-[95vh] overflow-y-auto custom-scroll">
          <div className="flex flex-col border-b border-gray-300 pb-5 mb-5">
            <h2 className="text-xl">Update General Info</h2>
            <p className="text-sm font-normal text-gray-400">
              Update your general info settings here!
            </p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4 mb-5">
              <div className="flex flex-col">
                <label htmlFor="" className="text-lg font-normal text-black">
                  First Name
                </label>
                <InputComponent
                  type="text"
                  name="firstName"
                  value={firstName}
                  handleChange={handleChange}
                  placeholder="Enter first name"
                  required={false}
                  autoComplete="firstName"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="" className="text-lg font-normal text-black">
                  Mid Name
                </label>
                <InputComponent
                  type="text"
                  name="midName"
                  value={midName}
                  handleChange={handleChange}
                  placeholder="Enter nick name"
                  required={false}
                  autoComplete="midName"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="" className="text-lg font-normal text-black">
                  Last Name
                </label>
                <InputComponent
                  type="text"
                  name="lastName"
                  value={lastName}
                  handleChange={handleChange}
                  placeholder="Enter last name"
                  required={false}
                  autoComplete="lastName"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="" className="text-lg font-normal text-black">
                  Nick Name
                </label>
                <InputComponent
                  type="text"
                  name="nickName"
                  value={nickName}
                  handleChange={handleChange}
                  placeholder="Enter nick name"
                  required={false}
                  autoComplete="nickName"
                />
              </div>
              <div className="flex flex-col">
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
                    disabled={!privateDomain}
                    name="enablePrivateDomain"
                    onChange={(e) =>
                      setOnboard((prev) => ({
                        ...prev,
                        enablePrivateDomain: e.target.checked,
                      }))
                    }
                  />
                  <label
                    htmlFor="enablePrivateDomain"
                    className="text-md font-medium text-black mt-1 cursor-pointer"
                  >
                    Activate or deactivate your private domain.
                  </label>
                </div>
                <p className="bg-amber-50 text-black p-2 border-l-3 rounded-xl border-amber-300 text-xs">
                  Activating now, your QR code will point to your own domain and
                  not take you to your new lander until you have completed
                  forwarding.
                </p>
                <p className="bg-green-100 text-black p-2 border-l-3 rounded-xl border-green-300 text-xs mt-2">
                  Domain Forwarding Help.” The link will take them to{" "}
                  <a
                    href="https://www.google.com/search?q=how+to+forward+a+domain+to+another+website"
                    target="_blank"
                    className="text-red-500 hover:underline hover:text-red-600"
                  >
                    https://www.google.com/search?q=how+to+forward+a+domain+to+another+website
                  </a>{" "}
                  WARNING - setting your page to your own domain will require
                  forwarding that domain to “display full path to the subscriber
                  page.
                </p>
              </div>
              <div className="flex flex-col">
                <p>VCF File</p>
                <p className="bg-[#F3F3F3] border border-gray-300 focus:outline focus:outline-[#96c94b] focus:border py-3 px-3 w-full rounded-xl text-normal">
                  {data?.onboard?.vcfFile?.slice(0, 50)}...
                </p>
                <div className="flex gap-2 mt-1">
                  <input
                    type="checkbox"
                    id="enablevcf"
                    checked={enablevcf}
                    name="enablevcf"
                    onChange={(e) =>
                      setOnboard((prev) => ({
                        ...prev,
                        enablevcf: e.target.checked,
                      }))
                    }
                  />
                  <label
                    htmlFor="enablevcf"
                    className="text-md font-medium text-black my-1 cursor-pointer"
                  >
                    Activate or deactivate your VCF File.
                  </label>
                </div>
                <p className="bg-amber-50 text-black p-2 border-l-3 rounded-xl border-amber-300 text-xs">
                  Activating your VCF File makes it visible on your landing
                  page. Deactivating it hides it from your landing page.
                </p>
              </div>
              <div className="flex flex-col">
                <label htmlFor="" className="text-lg font-normal text-black">
                  Business/Niche Offerings
                </label>
                <TextareaComponent
                  name="offerings"
                  value={offerings}
                  handleChange={handleChange}
                  rows={3}
                  autoComplete="offerings"
                  required={false}
                  placeholder="Update business/niche offerings"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="" className="text-lg font-normal text-black">
                  {about_label ? about_label : "About"}
                </label>
                <TextareaComponent
                  name="bio"
                  value={bio}
                  handleChange={handleChange}
                  rows={3}
                  autoComplete="bio"
                  required={false}
                  placeholder="Update bio"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="" className="text-lg font-normal text-black">
                  Tag Line
                </label>
                <InputComponent
                  type="text"
                  name="tagLine"
                  value={tagLine}
                  handleChange={handleChange}
                  placeholder="Enter tagLine"
                  required={false}
                  autoComplete="tagLine"
                />
              </div>
              <div className="flex flex-col col-span-2">
                <label htmlFor="" className="text-lg font-normal text-black">
                  Funny Saying
                </label>
                <InputComponent
                  type="text"
                  name="funnySaying"
                  value={funnySaying}
                  handleChange={handleChange}
                  placeholder="update funny saying"
                  required={false}
                  autoComplete="funnySaying"
                />
              </div>
              <div className="flex flex-col col-span-2">
                <label htmlFor="" className="text-lg font-normal text-black">
                  Services Offered Label
                </label>
                <InputComponent
                  type="text"
                  name="services_label"
                  value={services_label}
                  handleChange={handleChange}
                  placeholder="update services offered label"
                  required={false}
                  autoComplete="services_label"
                />
              </div>
              <div className="flex flex-col col-span-2">
                <label htmlFor="" className="text-lg font-normal text-black">
                  About Label
                </label>
                <InputComponent
                  type="text"
                  name="about_label"
                  value={about_label}
                  handleChange={handleChange}
                  placeholder="update about label"
                  required={false}
                  autoComplete="about_label"
                />
              </div>
              <div className="flex flex-col gap-2 mt-5 border-t border-gray-300 pt-5">
                <label className="text-lg font-normal text-black">
                  {services_label ? services_label : "Services Offered"}
                </label>

                <div className="flex flex-col gap-5">
                  {onboard.businessServiced.map((service, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 relative"
                    >
                      <InputComponent
                        type="text"
                        name={`service-${index}`}
                        value={service.title}
                        handleChange={(e) =>
                          handleServiceChange(index, e.target.value)
                        }
                        placeholder="Enter service title"
                        required={false}
                        autoComplete={`service-${index}`}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveService(index)}
                        className="bg-red-400 w-6 h-6 flex absolute right-2 justify-center items-center rounded-full text-white cursor-pointer"
                      >
                        <i className="fa-solid fa-xmark text-lg"></i>
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleAddService}
                  className="bg-slate-200 text-[#000000] flex justify-center items-center gap-1 w-fit border border-gray-200 px-5 py-3 rounded-2xl cursor-pointer"
                >
                  <Plus />
                </button>
              </div>
            </div>
            <div className="flex gap-3 items-center">
              <button
                onClick={() => setIsShowInfo(false)}
                className="bg-slate-200 text-[#000000] flex justify-center items-center gap-1 w-fit border border-gray-200 px-10 py-3 rounded-2xl cursor-pointer"
              >
                Close
              </button>
              <button
                disabled={isLoading}
                type="submit"
                className="bg-[#BDF188] text-[#000000] flex justify-center items-center gap-1 w-fit border border-[#76c725] px-10 py-3 rounded-2xl cursor-pointer"
              >
                {isLoading ? <LoaderCircle className="animate-spin" /> : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditInfo;
