import { useEffect, useRef, useState } from "react";
import OneboardOne from "../component/onboard/Onboard.one";
import OneboardTow from "../component/onboard/Onboard.tow";
import OneboardThree from "../component/onboard/Onboard.three";
import OnboardFour from "../component/onboard/Onboard.four";
import toast from "react-hot-toast";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { Link, useNavigate } from "react-router";
import { useOnboardUserMutation } from "../redux/features/onboard/onboardApi";
import type { OnboardTypes } from "../utils/user.types";
import { useAuth } from "../hook/useAuth";

interface UserType {
  package?: string;
  id: string;
  userTemplete: [];
  domain: string;
  frequency: string;
  landerName: string;
  membership: {
    status: string;
  };
}

function CreateOnboard() {
  const [steps, setSteps] = useState<number>(1);
  const { user } = useAuth() as { user: UserType | null };
  const packedType = user?.package;
  const [onboardUser, { isLoading }] = useOnboardUserMutation();
  const customerId = (user?.id ?? null) as string | null;
  const headerImageRef = useRef<HTMLInputElement>(null);
  const logoImageRef = useRef<HTMLInputElement>(null);
  const bodyImageRef = useRef<HTMLInputElement>(null);
  const epkFileRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [onboard, setOnboard] = useState<OnboardTypes>({
    referalCode: "",
    bio: "",
    tagLine: "",
    offerings: "",
    services: [],
    funnySaying: "",
    merchendiseUrl: "",
    vfrCreate: "",
    userId: customerId,
    socialLinks: {},
    customPlatform: [],
    headerImage: null,
    logoImage: null,
    bodyImage: null,
    epkFile: null,
    wristbands: [],
    merchendiselogo: null,
  });

  const {
    referalCode,
    bio,
    tagLine,
    offerings,
    funnySaying,
    socialLinks,
    headerImage,
    logoImage,
    bodyImage,
    epkFile,
    userId,
    services,
    vfrCreate,
    merchendiseUrl,
    customPlatform,
    wristbands,
    merchendiselogo,
  } = onboard || {};

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (steps === 1) {
      if (offerings?.length > 0 && services?.length === 0) {
        toast.error("Please add minimum tow services!");
        return;
      }
    }
    if (
      steps === 3 &&
      packedType === "gold" &&
      Object.keys(socialLinks).length === 0
    ) {
      toast.error("Please add at least one link.");
      return;
    }
    if (steps === 3 && merchendiseUrl?.length > 0 && !merchendiselogo) {
      toast.error("Please add logo to continue!");
      return;
    }
    if (!services || services.filter((s) => s.trim() !== "").length === 1) {
      toast.error("Please add more than one service.");
      return;
    }
    if (steps < 4) {
      setSteps((prev) => prev + 1);
      return;
    }
    if (steps === 4) {
      const formData = new FormData();
      formData.append("referalCode", referalCode ? referalCode : "");
      formData.append("bio", bio ? bio : "");
      formData.append("userId", userId ? userId : "");
      formData.append("vfrCreate", vfrCreate ? vfrCreate : "");
      formData.append("merchendiseUrl", merchendiseUrl ? merchendiseUrl : "");
      formData.append("tagLine", tagLine ? tagLine : "");
      formData.append("offerings", offerings ? offerings : "");
      formData.append("funnySaying", funnySaying ? funnySaying : "");
      formData.append("headerImage", headerImage ? headerImage : "");
      formData.append("logoImage", logoImage ? logoImage : "");
      formData.append("bodyImage", bodyImage ? bodyImage : "");
      formData.append("epkFile", epkFile ? epkFile : "");
      formData.append(
        "merchendiselogo",
        merchendiselogo ? merchendiselogo : "",
      );
      formData.append(
        "customPlatform",
        customPlatform?.length > 0 ? JSON.stringify(customPlatform) : "",
      );
      formData.append(
        "wristbands",
        wristbands?.length > 0 ? JSON.stringify(wristbands) : "",
      );
      Object.entries(socialLinks).forEach(([key, value]) => {
        formData.append(key, value);
      });
      services.forEach((item) => {
        formData.append("services", item);
      });
      onboardUser(formData)
        .unwrap()
        .then((res) => {
          toast.success(res.message);
          if (headerImageRef.current) headerImageRef.current.value = "";
          if (logoImageRef.current) logoImageRef.current.value = "";
          if (bodyImageRef.current) bodyImageRef.current.value = "";
          if (epkFileRef.current) epkFileRef.current.value = "";

          setOnboard({
            referalCode: "",
            bio: "",
            tagLine: "",
            offerings: "",
            services: [],
            funnySaying: "",
            merchendiseUrl: "",
            vfrCreate: "",
            userId: userId,
            socialLinks: {},
            customPlatform: [],
            headerImage: null,
            logoImage: null,
            bodyImage: null,
            epkFile: null,
            merchendiselogo: null,
            wristbands: [],
          });
          if (res.pageUrl) {
            window.location.href = res.pageUrl;
          } else {
            navigate("/onboard");
          }
        })
        .catch((error) => {
          const err = error as FetchBaseQueryError;
          const errorMessage = (err.data as { message: string }).message;
          toast.error(errorMessage);
        });
    }
  };

  useEffect(() => {
    setOnboard((prev) => ({
      ...prev,
      referalCode: `${user?.landerName}${Math.floor(Math.random() * 999)}`,
    }));
  }, [user]);

  const progress = (steps / 4) * 100;

  return (
    <section className="p-5 w-full 2xl:w-7/12">
      <div className="flex md:flex-row flex-col justify-between items-start md:items-center">
        <div className="md:w-7/12 w-full">
          <h2 className="text-normal text-2xl md:text-3xl">
            Build your lander
          </h2>
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
                Build your lander
              </p>
            </li>
          </ul>
        </div>
      </div>
      {user?.membership?.status !== "ACTIVATE" && (
        <p className="mt-5 text-black text-sm bg-amber-100 p-3 border-l-3 border-amber-300 rounded-md">
          Your membership is inactive at the moment, and as a result, you cannot
          move forward with this action. Please complete your membership
          activation to continue or contact our support center.
        </p>
      )}
      <div className="mt-5 bg-white border border-gray-300 rounded-md flex w-full h-full flex-col gap-5 items-start justify-center p-10 xl:p-20">
        <div className="flex flex-col gap-5 items-center w-full">
          <h2 className="text-2xl md:text-4xl font-xl font-medium uppercase text-center">
            Complete Your Profile
          </h2>
          <div>
            <p className="text-black text-lg font-medium text-center">
              Package: {user?.package || "No package selected"}
            </p>
            <p className="text-black text-lg font-medium text-center">
              Domain: {user?.domain || "No package selected"}
            </p>
            <p className="text-black text-lg font-medium text-center">
              Billing Frequency: {user?.frequency || "No package selected"}
            </p>
          </div>
          <p className="bg-[#96c94b] w-24 h-2 rounded-full m-auto"></p>
        </div>

        <div className="w-full">
          <div className="relative w-full h-5 rounded-full bg-gray-300 overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-[#cf3832] rounded-full transition-all duration-500 ease-in-out"
              style={{ width: `${progress}%` }}
            ></div>
            <span
              className="absolute top-0.5 text-xs text-white font-medium transition-all duration-500 ease-in-out"
              style={{ left: `${progress - 5}%` }}
            >
              {progress}%
            </span>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="w-full">
          <div
            className={`transition-opacity duration-500 ease-in-out ${
              steps === 1 ? "opacity-100" : "opacity-0"
            }`}
          >
            {steps === 1 && (
              <OneboardOne onboard={onboard} setOnboard={setOnboard} />
            )}
          </div>
          <div
            className={`transition-opacity duration-500 ease-in-out ${
              steps === 2 ? "opacity-100" : "opacity-0"
            }`}
          >
            {steps === 2 && (
              <OneboardTow
                onboard={onboard}
                setOnboard={setOnboard}
                headerImageRef={headerImageRef}
                logoImageRef={logoImageRef}
                bodyImageRef={bodyImageRef}
                epkFileRef={epkFileRef}
              />
            )}
          </div>
          <div
            className={`transition-opacity duration-500 ease-in-out ${
              steps === 3 ? "opacity-100" : "opacity-0"
            }`}
          >
            {steps === 3 && (
              <OneboardThree onboard={onboard} setOnboard={setOnboard} />
            )}
          </div>
          <div
            className={`transition-opacity duration-500 ease-in-out ${
              steps === 4 ? "opacity-100" : "opacity-0"
            }`}
          >
            {steps === 4 && (
              <OnboardFour onboard={onboard} setOnboard={setOnboard} />
            )}
          </div>
          <p className="text-black bg-amber-100 p-2 rounded-lg mt-2">
            All fields are editable after submission.
          </p>
          <div className="flex gap-3 items-center mt-5">
            {steps > 1 && (
              <button
                type="button"
                onClick={() => setSteps((prev) => prev - 1)}
                className="cursor-pointer border border-[#96c94b] py-2 px-6 rounded-md flex gap-2 justify-center items-center"
              >
                Back
              </button>
            )}
            {steps === 4 ? (
              <button
                type="submit"
                className="primary-btn flex gap-2 items-center px-4 justify-center"
                disabled={isLoading}
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
                ) : wristbands?.length > 0 ? (
                  <p>Submit & Pay</p>
                ) : (
                  <p>Submit</p>
                )}
              </button>
            ) : (
              <button
                type="submit"
                className={`text-black font-normal text-md px-5 py-3 rounded-lg cursor-pointer ${
                  user?.membership?.status !== "ACTIVATE"
                    ? "bg-gray-200"
                    : "bg-[#96c94b]"
                }`}
                disabled={user?.membership?.status !== "ACTIVATE"}
              >
                Continue to onboard
              </button>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}

export default CreateOnboard;
