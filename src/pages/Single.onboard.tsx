import { Link, useParams } from "react-router";
import React, { useState } from "react";
import { ArrowLeft, Download, FilePenLine } from "lucide-react";
import EditInfo from "../component/template/Edit.info";
import EditFiles from "../component/template/Edit.files";
import { useGetOneOnboardQuery } from "../redux/features/onboard/onboardApi";
import SingleSocialButtons from "../component/template/Single.social.buttons";
import SingleCustomButtons from "../component/template/Single.custom.buttons";
import SingleLoadder from "../component/loader/Single.loadder";
import OnboardProfileLoader from "../component/loader/Onboard.profile.loader";
import RequestList from "../component/template/Reqest.list";
import { useAuth } from "../hook/useAuth";

interface UserType {
  package?: string;
  id: string;
  userTemplete: [];
  membership: { status: string }[];
  domain: string;
}

function SIngleOnboard() {
  const { user } = useAuth() as { user: UserType | null };
  const [isShowInfo, setIsShowInfo] = useState<boolean>(false);
  const [isShowFile, setIsShowFiles] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const params = useParams();
  const id = params.id;
  const { data, isError, isLoading } = useGetOneOnboardQuery(id);
  const onboard = !isError && data?.onboard ? data.onboard : null;
  const {
    layout,
    bio,
    tagLine,
    offerings,
    funnySaying,
    headerImage,
    logoImage,
    bodyImage,
    epkFile,
    services,
    merchendiseUrl,
    vcfFile,
    merchendiseLogo,
    about_label,
    services_label,
  } = onboard || {};
  const {
    domain,
    frequency,
    package: packageType,
    planPrice,
    landerName,
    midName,
    discount,
    email,
    lastName,
    firstName,
    privateDomain,
    enablePrivateDomain,
    enablevcf,
  } = onboard?.user ?? {};

  return (
    <React.Fragment>
      <section>
        <div className="w-full p-3 lg:p-5">
          <div className="w-full flex md:flex-row flex-col justify-between items-center mb-2 md:mb-5">
            <div className="flex flex-col gap-1">
              <h2 className="text-normal text-lg md:text-2xl font-medium">
                Onboard Details
              </h2>
              <ul className="flex gap-1 md:gap-2 md:flex-nowrap flex-wrap items-center text-[#626D83]">
                <li>
                  <Link to="/" className="text-normal text-sm hover:underline">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <i className="fa-solid fa-angles-right text-xs"></i>
                </li>
                <li>
                  <p className="text-normal text-sm">{user?.domain}</p>
                </li>
                <li>
                  <i className="fa-solid fa-angles-right text-sm"></i>
                </li>
                <li>
                  <Link
                    to="/onboard"
                    className="text-normal text-sm hover:underline"
                  >
                    Onboard
                  </Link>
                </li>
              </ul>
            </div>
            <div className="flex gap-2 items-center py-2 w-full md:w-fit">
              <Link
                to="/onboard"
                className="bg-[#88C22F] text-white md:w-fit w-full justify-center flex gap-2 items-center px-6 py-2 md:py-3 rounded-lg text-normal text-md"
              >
                <ArrowLeft size={20} />
                <span>Back</span>
              </Link>
            </div>
          </div>
          <div className="flex gap-5 2xl:flex-row flex-col">
            <div className="w-full 2xl:w-7/12">
              <div className="jost border border-gray-200 py-5 px-3 md:p-10 rounded-3xl shadow bg-white">
                <div className="border-b border-gray-200 pb-3 md:pb-8 flex justify-between w-full items-center">
                  <div className="flex flex-col gap-1">
                    <p className="text-lg md:text-xl text-[#121625] font-medium">
                      Onboard General Info
                    </p>
                    <p className="text-[#9FA9BB] text-xs md:text-sm font-normal">
                      View and update general info
                    </p>
                  </div>
                  <button
                    onClick={() => setIsShowInfo(true)}
                    className="border border-[#E7EBF2] active:bg-[#E7EBF2] w-10 h-10 flex justify-center items-center rounded-lg cursor-pointer"
                  >
                    <FilePenLine color="#8C98AE" size={20} />
                  </button>
                </div>
                <div className="mt-3 md:mt-8 grid grid-cols-1 lg:grid-cols-2 gap-2 md:gap-5">
                  <div className="flex gap-1 border-2 border-[#F2F5F9] flex-col bg-[#F7F9FB] p-5 rounded-2xl">
                    <p className="text-sm md:text-base uppercase font-medium text-[#5C687F]">
                      Email Address
                    </p>
                    <div className="text-sm md:text-md font-normal text-[#202431]">
                      {isLoading ? <SingleLoadder /> : email}
                    </div>
                  </div>
                  <div className="flex gap-1 border-2 border-[#F2F5F9] flex-col bg-[#F7F9FB] p-5 rounded-2xl">
                    <p className="text-sm md:text-base uppercase font-medium text-[#5C687F]">
                      Domain
                    </p>
                    <div className="text-sm md:text-md font-normal text-[#202431]">
                      {isLoading ? <SingleLoadder /> : domain}
                    </div>
                  </div>
                  <div className="flex gap-1 border-2 border-[#F2F5F9] flex-col bg-[#F7F9FB] p-5 rounded-2xl">
                    <p className="text-sm md:text-base uppercase font-medium text-[#5C687F]">
                      Lander Name
                    </p>
                    <div className="text-sm md:text-md font-normal text-[#202431]">
                      {isLoading ? <SingleLoadder /> : landerName}
                    </div>
                  </div>
                  <div className="flex gap-1 border-2 border-[#F2F5F9] flex-col bg-[#F7F9FB] p-5 rounded-2xl">
                    <p className="text-sm md:text-base uppercase font-medium text-[#5C687F]">
                      First Name
                    </p>
                    <div className="text-sm md:text-md font-normal text-[#202431]">
                      {isLoading ? <SingleLoadder /> : firstName}
                    </div>
                  </div>
                  <div className="flex gap-1 border-2 border-[#F2F5F9] flex-col bg-[#F7F9FB] p-5 rounded-2xl">
                    <p className="text-sm md:text-base uppercase font-medium text-[#5C687F]">
                      Mid Name
                    </p>
                    <div className="text-sm md:text-md font-normal text-[#202431]">
                      {isLoading ? <SingleLoadder /> : midName}
                    </div>
                  </div>
                  <div className="flex gap-1 border-2 border-[#F2F5F9] flex-col bg-[#F7F9FB] p-5 rounded-2xl">
                    <p className="text-sm md:text-base uppercase font-medium text-[#5C687F]">
                      Last Name
                    </p>
                    <div className="text-sm md:text-md font-normal text-[#202431]">
                      {isLoading ? <SingleLoadder /> : lastName}
                    </div>
                  </div>

                  {merchendiseUrl && (
                    <div className="flex gap-1 border-2 border-[#F2F5F9] flex-col bg-[#F7F9FB] p-5 rounded-2xl">
                      <p className="text-sm md:text-base uppercase font-medium text-[#5C687F]">
                        Merchandise URL
                      </p>
                      <div className="text-sm font-normal text-gray-500 break-all">
                        {isLoading ? <SingleLoadder /> : merchendiseUrl}
                      </div>
                    </div>
                  )}
                  {vcfFile && (
                    <div className="flex gap-1 border-2 border-[#F2F5F9] flex-col bg-[#F7F9FB] p-5 rounded-2xl">
                      <p className="text-sm md:text-base uppercase font-medium text-[#5C687F]">
                        VFC FIle URL{" "}
                        <span
                          className={`w-fit px-3 py-1 uppercase rounded-lg text-xs ${enablevcf ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
                        >
                          {enablevcf ? "Active" : "Deactivate"}
                        </span>
                      </p>
                      <div className="text-sm font-normal text-gray-500 whitespace-pre-line wrap-break-word">
                        {isLoading ? (
                          <SingleLoadder />
                        ) : (
                          <a
                            target="_blank"
                            className="text-blue-500"
                            download
                            href={`${vcfFile}`}
                          >
                            Download VFC File
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                  {discount > 0 && (
                    <div className="flex gap-1 border-2 border-[#F2F5F9] flex-col bg-[#F7F9FB] p-5 rounded-2xl">
                      <p className="text-sm md:text-base uppercase font-medium text-[#5C687F]">
                        Discount
                      </p>
                      <div className="text-sm md:text-md font-normal text-[#202431]">
                        {isLoading ? <SingleLoadder /> : discount}
                      </div>
                    </div>
                  )}
                  <div className="flex gap-1 border-2 border-[#F2F5F9] flex-col bg-[#F7F9FB] p-5 rounded-2xl">
                    <p className="text-sm md:text-base uppercase font-medium text-[#5C687F]">
                      Frequency
                    </p>
                    <div className="text-sm md:text-md font-normal text-[#202431]">
                      {isLoading ? <SingleLoadder /> : frequency}
                    </div>
                  </div>
                  <div className="flex gap-1 border-2 border-[#F2F5F9] flex-col bg-[#F7F9FB] p-5 rounded-2xl">
                    <p className="text-sm md:text-base uppercase font-medium text-[#5C687F]">
                      Package
                    </p>
                    <div className="text-sm md:text-md font-normal text-[#202431]">
                      {isLoading ? <SingleLoadder /> : packageType}
                    </div>
                  </div>

                  <div className="flex gap-1 border-2 border-[#F2F5F9] flex-col bg-[#F7F9FB] p-5 rounded-2xl">
                    <p className="text-sm md:text-base uppercase font-medium text-[#5C687F]">
                      Selected Plan Price
                    </p>
                    <div className="text-sm md:text-md font-normal text-[#202431]">
                      {isLoading ? <SingleLoadder /> : `$${planPrice}`}
                    </div>
                  </div>
                  <div className="flex gap-1 border-2 border-[#F2F5F9] flex-col bg-[#F7F9FB] p-5 rounded-2xl">
                    <p className="text-sm md:text-base uppercase font-medium text-[#5C687F]">
                      Onboard Layout
                    </p>
                    <div className="text-sm md:text-md font-normal text-[#202431]">
                      {isLoading ? <SingleLoadder /> : layout}
                    </div>
                  </div>
                  <div className="flex gap-1 border-2 border-[#F2F5F9] flex-col bg-[#F7F9FB] p-5 rounded-2xl">
                    <p className="text-sm md:text-base uppercase font-medium text-[#5C687F]">
                      Your Bio
                    </p>
                    <div className="text-sm md:text-md font-normal text-[#202431]">
                      {isLoading ? <SingleLoadder /> : bio}
                    </div>
                  </div>
                  <div className="flex gap-1 border-2 border-[#F2F5F9] flex-col bg-[#F7F9FB] p-5 rounded-2xl">
                    <p className="text-sm md:text-base uppercase font-medium text-[#5C687F]">
                      Tag Line
                    </p>
                    <div className="text-sm md:text-md font-normal text-[#202431]">
                      {isLoading ? <SingleLoadder /> : tagLine}
                    </div>
                  </div>
                  <div className="flex gap-1 border-2 border-[#F2F5F9] flex-col bg-[#F7F9FB] p-5 rounded-2xl">
                    <p className="text-sm md:text-base uppercase font-medium text-[#5C687F]">
                      Business offerings
                    </p>
                    <div className="text-sm md:text-md font-normal text-[#202431]">
                      {isLoading ? <SingleLoadder /> : offerings}
                    </div>
                  </div>
                  <div className="flex gap-1 border-2 border-[#F2F5F9] flex-col bg-[#F7F9FB] p-5 rounded-2xl">
                    <p className="text-sm md:text-base uppercase font-medium text-[#5C687F]">
                      Services Offered Label
                    </p>
                    <div className="text-sm md:text-md font-normal text-[#202431]">
                      {isLoading ? (
                        <SingleLoadder />
                      ) : services_label ? (
                        services_label
                      ) : (
                        "N/A"
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1 border-2 border-[#F2F5F9] flex-col bg-[#F7F9FB] p-5 rounded-2xl">
                    <p className="text-sm md:text-base uppercase font-medium text-[#5C687F]">
                      About Label
                    </p>
                    <div className="text-sm md:text-md font-normal text-[#202431]">
                      {isLoading ? (
                        <SingleLoadder />
                      ) : about_label ? (
                        about_label
                      ) : (
                        "N/A"
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1 border-2 border-[#F2F5F9] flex-col bg-[#F7F9FB] p-5 rounded-2xl">
                    <label
                      htmlFor=""
                      className="text-sm md:text-base uppercase font-medium text-[#5C687F]"
                    >
                      Merchandise Logo
                    </label>
                    {merchendiseLogo ? (
                      <div className="relative w-20 min-w-24">
                        <img
                          className="w-full cursor-pointer rounded-xl"
                          src={merchendiseLogo}
                          alt="Merchandise logo"
                          onClick={() => setSelectedImage(merchendiseLogo)}
                        />
                      </div>
                    ) : (
                      "N/A"
                    )}
                  </div>
                  <div className="flex gap-1 border-2 border-[#F2F5F9] flex-col bg-[#F7F9FB] p-5 rounded-2xl">
                    <p className="text-sm md:text-base uppercase font-medium text-[#5C687F]">
                      Services Offered
                    </p>
                    <div className="text-sm md:text-md font-normal text-[#202431]">
                      {isLoading ? (
                        <SingleLoadder />
                      ) : (
                        services
                          ?.map((item: { title: string }) => item.title)
                          .join(", ")
                      )}
                    </div>
                  </div>
                  {funnySaying && (
                    <div className="flex gap-1 border-2 border-[#F2F5F9] flex-col bg-[#F7F9FB] p-5 rounded-2xl">
                      <p className="text-sm md:text-base uppercase font-medium text-[#5C687F]">
                        Funny Sayting
                      </p>
                      <div className="text-sm md:text-md font-normal text-[#202431]">
                        {isLoading ? <SingleLoadder /> : funnySaying}
                      </div>
                    </div>
                  )}
                  {privateDomain && (
                    <div className="flex gap-1 border-2 border-[#F2F5F9] flex-col bg-[#F7F9FB] p-5 rounded-2xl">
                      <p className="text-sm md:text-base uppercase font-medium text-[#5C687F]">
                        Private Domain{" "}
                        <span
                          className={`w-fit px-3 py-1 uppercase rounded-lg text-xs ${enablePrivateDomain ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
                        >
                          {enablePrivateDomain ? "Active" : "Deactivate"}
                        </span>
                      </p>
                      <div className="text-sm md:text-md font-normal text-[#202431]">
                        {isLoading ? <SingleLoadder /> : privateDomain}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="w-full 2xl:w-5/12 flex flex-col gap-5">
              <div className="jost border border-gray-200 p-5 md:p-10 rounded-3xl shadow bg-white">
                <div className="border-b border-gray-200 pb-2 md:pb-5 flex justify-between w-full items-center mb-2 md:mb-5">
                  <div className="flex flex-col gap-1">
                    <p className="text-lg md:text-xl text-[#121625] font-medium">
                      Onboard All Files
                    </p>
                    <p className="text-[#9FA9BB] text-xs md:text-sm font-normal">
                      Update your file settings here
                    </p>
                  </div>
                  <button
                    onClick={() => setIsShowFiles(true)}
                    className="border border-[#E7EBF2] active:bg-[#E7EBF2] w-10 h-10 flex justify-center items-center rounded-lg cursor-pointer"
                  >
                    <FilePenLine color="#8C98AE" size={20} />
                  </button>
                </div>
                <p className="bg-[#FFFCF0] w-full text-[#7C3E16] border-2 border-[#FCF2C6] p-5 text-sm font-normal rounded-lg">
                  Note: If you upload no files and pick no colors, the default
                  background is black.
                </p>

                {isLoading ? (
                  <OnboardProfileLoader />
                ) : logoImage || headerImage || bodyImage || epkFile ? (
                  <div className="mt-5 md:mt-10 gap-3 grid grid-cols-2 lg:grid-cols-3">
                    {logoImage && (
                      <div className="flex flex-col gap-2">
                        <p className="text-sm text-medium text-[#414B5D] uppercase">
                          Logo / Portrait
                        </p>
                        <div
                          className="w-32 min-w-32 min-h-32 h-32 cursor-pointer"
                          onClick={() => setSelectedImage(logoImage)}
                        >
                          <img
                            src={logoImage}
                            alt=""
                            className="w-full h-full object-cover rounded-2xl"
                          />
                        </div>
                      </div>
                    )}
                    {headerImage && (
                      <div className="flex flex-col gap-2">
                        <p className="text-sm text-medium text-[#414B5D] uppercase">
                          Header Image
                        </p>
                        <div
                          className="w-32 min-w-32 min-h-32 h-32 cursor-pointer"
                          onClick={() => setSelectedImage(headerImage)}
                        >
                          <img
                            src={headerImage}
                            alt=""
                            className="w-full h-full object-cover rounded-2xl"
                          />
                        </div>
                      </div>
                    )}
                    {bodyImage && (
                      <div className="flex flex-col gap-2">
                        <p className="text-sm text-medium text-[#414B5D] uppercase">
                          Body Image
                        </p>
                        <div
                          className="w-32 min-w-32 min-h-32 h-32 cursor-pointer"
                          onClick={() => setSelectedImage(bodyImage)}
                        >
                          <img
                            src={bodyImage}
                            alt=""
                            className="w-full h-full object-cover rounded-2xl"
                          />
                        </div>
                      </div>
                    )}

                    {epkFile && (
                      <div className="flex flex-col md:col-span-3 md:mt-3">
                        <p className="text-xs md:text-sm text-[#414B5D] uppercase">
                          Download EPK File
                        </p>
                        <div className="border-dashed bg-[#FFFEFB] border-2 mt-2 border-yellow-200 rounded-lg flex justify-center items-center py-10 w-full h-full">
                          <a
                            target="_blank"
                            href={`${epkFile}`}
                            className="bg-yellow-100 text-yellow-700 w-12 h-12 min-w-12 rounded-full flex justify-center items-center"
                          >
                            <Download />
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="bg-[#FFFCF0] w-full text-[#7C3E16] border-2 border-[#FCF2C6] p-5 text-sm font-normal rounded-lg">
                    Uploading no files, the default background is Black. No
                    files have been added yet. Please upload a new file to
                    continue.
                  </p>
                )}
              </div>
              <SingleSocialButtons />
              <SingleCustomButtons />
            </div>
          </div>
        </div>
      </section>
      <RequestList />
      {isShowInfo && (
        <EditInfo isShowInfo={isShowInfo} setIsShowInfo={setIsShowInfo} />
      )}
      {isShowFile && (
        <EditFiles isShowFile={isShowFile} setIsShowFiles={setIsShowFiles} />
      )}

      {selectedImage && (
        <div
          className="fixed inset-0 z-9999 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            type="button"
            onClick={() => setSelectedImage(null)}
            className="absolute top-5 right-5 text-white text-3xl cursor-pointer"
            aria-label="Close image preview"
          >
            &times;
          </button>

          <img
            src={selectedImage}
            alt="Full-size preview"
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </React.Fragment>
  );
}

export default SIngleOnboard;
