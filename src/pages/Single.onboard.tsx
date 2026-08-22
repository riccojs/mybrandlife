import { Link, useParams } from "react-router";
import React, { useState } from "react";
import { Download } from "lucide-react";
import EditInfo from "../component/template/Edit.info";
import EditFiles from "../component/template/Edit.files";
import { useGetOneOnboardQuery } from "../redux/features/onboard/onboardApi";
import SingleSocialButtons from "../component/template/Single.social.buttons";
import SingleCustomButtons from "../component/template/Single.custom.buttons";
import SingleLoadder from "../component/loader/Single.loadder";
import OnboardProfileLoader from "../component/loader/Onboard.profile.loader";
import { useAuth } from "../hook/useAuth";
import RequestList from "../component/template/Reqest.list";

function SIngleOnboard() {
  const [isShowInfo, setIsShowInfo] = useState<boolean>(false);
  const [isShowFile, setIsShowFiles] = useState<boolean>(false);
  const params = useParams();
  const id = params.id;
  const { user } = useAuth();
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
    nickName,
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
          <div className="w-full flex justify-between items-center mb-5">
            <h2 className="text-normal text-2xl md:text-3xl">
              Onboard Details
            </h2>
            <ul className="flex gap-2 items-center py-2">
              <li>
                <Link
                  to={user?.role === "ADMIN" ? "/admin/onboard" : "/onboard"}
                  className="bg-[#96c94b] px-6 py-2 rounded-lg text-normal text-md"
                >
                  Back
                </Link>
              </li>
            </ul>
          </div>
          <div className="flex gap-5 2xl:flex-row flex-col">
            <div className="w-full 2xl:w-7/12">
              <div className="jost border border-gray-300 p-5 md:p-10 rounded-lg bg-white">
                <div className="border-b border-gray-300 pb-5 flex justify-between w-full items-center">
                  <div className="flex flex-col">
                    <p className="text-xl text-medium">Onboard General Info</p>
                    <p className="text-gray-400 text-sm font-normal">
                      View and update general info
                    </p>
                  </div>
                  <button
                    onClick={() => setIsShowInfo(true)}
                    className="border border-gray-300 w-10 h-10 flex justify-center items-center rounded-md shadow cursor-pointer"
                  >
                    <i className="fa-regular fa-pen-to-square"></i>
                  </button>
                </div>
                <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="flex flex-col bg-[#F0F0F0] py-2 px-4 rounded-xl">
                    <p className="text-lg font-medium text-black">
                      Email Address
                    </p>
                    <div className="text-md font-normal text-gray-500">
                      {isLoading ? <SingleLoadder /> : email}
                    </div>
                  </div>
                  <div className="flex flex-col bg-[#F0F0F0] py-2 px-4 rounded-xl">
                    <p className="text-lg font-medium text-black">Domain</p>
                    <div className="text-md font-normal text-gray-500">
                      {isLoading ? <SingleLoadder /> : domain}
                    </div>
                  </div>
                  <div className="flex flex-col bg-[#F0F0F0] py-2 px-4 rounded-xl">
                    <p className="text-lg font-medium text-black">
                      Lander Name
                    </p>
                    <div className="text-md font-normal text-gray-500">
                      {isLoading ? <SingleLoadder /> : landerName}
                    </div>
                  </div>
                  <div className="flex flex-col bg-[#F0F0F0] py-2 px-4 rounded-xl">
                    <p className="text-lg font-medium text-black">First Name</p>
                    <div className="text-md font-normal text-gray-500">
                      {isLoading ? <SingleLoadder /> : firstName}
                    </div>
                  </div>
                  <div className="flex flex-col bg-[#F0F0F0] py-2 px-4 rounded-xl">
                    <p className="text-lg font-medium text-black">Mid Name</p>
                    <div className="text-md font-normal text-gray-500">
                      {isLoading ? <SingleLoadder /> : midName}
                    </div>
                  </div>
                  <div className="flex flex-col bg-[#F0F0F0] py-2 px-4 rounded-xl">
                    <p className="text-lg font-medium text-black">Last Name</p>
                    <div className="text-md font-normal text-gray-500">
                      {isLoading ? <SingleLoadder /> : lastName}
                    </div>
                  </div>
                  <div className="flex flex-col bg-[#F0F0F0] py-2 px-4 rounded-xl">
                    <p className="text-lg font-medium text-black">Nick Name</p>
                    <div className="text-md font-normal text-gray-500">
                      {isLoading ? (
                        <SingleLoadder />
                      ) : nickName ? (
                        nickName
                      ) : (
                        "not-available"
                      )}
                    </div>
                  </div>

                  {merchendiseUrl && (
                    <div className="flex flex-col bg-[#F0F0F0] py-2 px-4 rounded-xl">
                      <p className="text-lg font-medium text-black">
                        Merchandise URL
                      </p>
                      <div className="text-sm font-normal text-gray-500">
                        {isLoading ? <SingleLoadder /> : merchendiseUrl}
                      </div>
                    </div>
                  )}
                  {vcfFile && (
                    <div className="flex flex-col bg-[#F0F0F0] py-2 px-4 rounded-xl">
                      <p className="text-lg font-medium text-black">
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
                    <div className="flex flex-col bg-[#F0F0F0] py-2 px-4 rounded-xl">
                      <p className="text-lg font-medium text-black">Discount</p>
                      <div className="text-md font-normal text-gray-500">
                        {isLoading ? <SingleLoadder /> : discount}
                      </div>
                    </div>
                  )}
                  <div className="flex flex-col bg-[#F0F0F0] py-2 px-4 rounded-xl">
                    <p className="text-lg font-medium text-black">Frequency</p>
                    <div className="text-md font-normal text-gray-500">
                      {isLoading ? <SingleLoadder /> : frequency}
                    </div>
                  </div>
                  <div className="flex flex-col bg-[#F0F0F0] py-2 px-4 rounded-xl">
                    <p className="text-lg font-medium text-black">Package</p>
                    <div className="text-md font-normal text-gray-500">
                      {isLoading ? <SingleLoadder /> : packageType}
                    </div>
                  </div>

                  <div className="flex flex-col bg-[#F0F0F0] py-2 px-4 rounded-xl">
                    <p className="text-lg font-medium text-black">
                      Selected Plan Price
                    </p>
                    <div className="text-md font-normal text-gray-500">
                      {isLoading ? <SingleLoadder /> : `$${planPrice}`}
                    </div>
                  </div>
                  <div className="flex flex-col bg-[#F0F0F0] py-2 px-4 rounded-xl">
                    <p className="text-lg font-medium text-black">
                      Onboard Layout
                    </p>
                    <div className="text-md font-normal text-gray-500">
                      {isLoading ? <SingleLoadder /> : layout}
                    </div>
                  </div>
                  <div className="flex flex-col bg-[#F0F0F0] py-2 px-4 rounded-xl">
                    <p className="text-lg font-medium text-black">Your Bio</p>
                    <div className="text-md font-normal text-gray-500">
                      {isLoading ? <SingleLoadder /> : bio}
                    </div>
                  </div>
                  <div className="flex flex-col bg-[#F0F0F0] py-2 px-4 rounded-xl">
                    <p className="text-lg font-medium text-black">Tag Line</p>
                    <div className="text-md font-normal text-gray-500">
                      {isLoading ? <SingleLoadder /> : tagLine}
                    </div>
                  </div>
                  <div className="flex flex-col bg-[#F0F0F0] py-2 px-4 rounded-xl">
                    <p className="text-lg font-medium text-black">
                      Business offerings
                    </p>
                    <div className="text-md font-normal text-gray-500">
                      {isLoading ? <SingleLoadder /> : offerings}
                    </div>
                  </div>
                  <div className="flex flex-col bg-[#F0F0F0] py-2 px-4 rounded-xl">
                    <p className="text-lg font-medium text-black">
                      Services Offered Label
                    </p>
                    <div className="text-md font-normal text-gray-500">
                      {isLoading ? (
                        <SingleLoadder />
                      ) : services_label ? (
                        services_label
                      ) : (
                        "N/A"
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col bg-[#F0F0F0] py-2 px-4 rounded-xl">
                    <p className="text-lg font-medium text-black">
                      About Label
                    </p>
                    <div className="text-md font-normal text-gray-500">
                      {isLoading ? (
                        <SingleLoadder />
                      ) : about_label ? (
                        about_label
                      ) : (
                        "N/A"
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col bg-[#F0F0F0] py-2 px-4 rounded-xl">
                    <label
                      htmlFor=""
                      className="text-lg font-medium text-black"
                    >
                      Merchandise Logo
                    </label>
                    {merchendiseLogo ? (
                      <div className="relative w-20 min-w-24">
                        <img className="w-full" src={merchendiseLogo} alt="" />
                        {merchendiseLogo && (
                          <a
                            target="_blank"
                            href={`${merchendiseLogo}`}
                            className="text-green-500 flex justify-center items-center bg-white w-6 min-w-6 h-6 rounded-full absolute bottom-3 right-3"
                          >
                            <i className="fa-regular fa-circle-down"></i>
                          </a>
                        )}
                      </div>
                    ) : (
                      "N/A"
                    )}
                  </div>
                  <div className="flex flex-col bg-[#F0F0F0] py-2 px-4 rounded-xl">
                    <p className="text-lg font-medium text-black">
                      Services Offered
                    </p>
                    <div className="text-md font-normal text-gray-500">
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
                    <div className="flex flex-col bg-[#F0F0F0] py-2 px-4 rounded-xl">
                      <p className="text-lg font-medium text-black">
                        Funny Sayting
                      </p>
                      <div className="text-md font-normal text-gray-500">
                        {isLoading ? <SingleLoadder /> : funnySaying}
                      </div>
                    </div>
                  )}
                  {privateDomain && (
                    <div className="flex flex-col bg-[#F0F0F0] py-2 px-4 rounded-xl">
                      <p className="text-lg font-medium text-black">
                        Private Domain{" "}
                        <span
                          className={`w-fit px-3 py-1 uppercase rounded-lg text-xs ${enablePrivateDomain ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
                        >
                          {enablePrivateDomain ? "Active" : "Deactivate"}
                        </span>
                      </p>
                      <div className="text-md font-normal text-gray-500">
                        {isLoading ? <SingleLoadder /> : privateDomain}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="w-full 2xl:w-5/12 flex flex-col gap-5">
              <div className="jost border border-gray-300 p-5 md:p-10 rounded-lg bg-white">
                <div className="border-b border-gray-300 pb-5 flex justify-between w-full items-center mb-5">
                  <div className="flex flex-col gap-1">
                    <p className="text-xl text-medium">Onboard All Files </p>
                    <p className="text-gray-400 text-sm font-normal">
                      Update your files settings here
                    </p>
                    <p className="bg-amber-100 p-2 text-xs font-normal rounded-lg">
                      Uploading no files and picking no colors, the default
                      background is Black.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsShowFiles(true)}
                    className="border border-gray-300 w-10 h-10 flex justify-center items-center rounded-md shadow cursor-pointer"
                  >
                    <i className="fa-regular fa-pen-to-square"></i>
                  </button>
                </div>
                {isLoading ? (
                  <OnboardProfileLoader />
                ) : logoImage || headerImage || bodyImage || epkFile ? (
                  <div className="mt-3 gap-5 grid grid-cols-2 lg:grid-cols-3">
                    {logoImage && (
                      <div className="flex flex-col gap-2">
                        <p className="text-md text-medium">Logo / Portrait</p>
                        <div className="w-full min-h-24 h-24 rounded-md">
                          <img
                            src={logoImage}
                            alt=""
                            className="w-full h-full object-cover rounded-md"
                          />
                        </div>
                      </div>
                    )}
                    {headerImage && (
                      <div className="flex flex-col gap-2">
                        <p className="text-md text-medium">Header Image</p>
                        <div className="w-full min-h-24 h-24 rounded-md">
                          <img
                            src={headerImage}
                            alt=""
                            className="w-full h-full object-cover rounded-md"
                          />
                        </div>
                      </div>
                    )}
                    {bodyImage && (
                      <div className="flex flex-col gap-2">
                        <p className="text-md text-medium">Body Image</p>
                        <div className="w-full min-h-24 h-24 rounded-md">
                          <img
                            src={bodyImage}
                            alt=""
                            className="w-full h-full object-cover rounded-md"
                          />
                        </div>
                      </div>
                    )}

                    {epkFile && (
                      <div className="flex flex-col">
                        <p className="text-sm text-medium">Download EPK File</p>
                        <div className="border-dashed border-2 mt-2 border-yellow-200 hover:bg-yellow-50 rounded-lg flex justify-center items-center p-5">
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
                  <p className="bg-amber-100 text-normal px-4 py-2 rounded-lg">
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
    </React.Fragment>
  );
}

export default SIngleOnboard;
