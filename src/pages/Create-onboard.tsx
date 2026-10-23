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
import BuildLanderHeader from "../component/onboard/Build.lander.header";
import { ArrowRightToLine, CircleAlert, LoaderCircle } from "lucide-react";

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
    if (steps === 3 && Object.keys(socialLinks ?? {}).length === 0) {
      toast.error("Please add at least one social platform.");
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
    <section className="p-3 md:p-5 w-full 2xl:w-7/12">
      <div className="flex md:flex-row flex-col justify-between items-start md:items-center">
        <div className="md:w-7/12 w-full">
          <h2 className="text-normal text-xl md:text-3xl">Build your lander</h2>
          <ul className="flex flex-wrap gap-2 items-center py-2">
            <li>
              <Link to="/" className="text-normal text-sm md:text-base">
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
        <div className="bg-[#FEFBED] text-[#764B2E] text-xs px-4 py-2 rounded-lg mt-4 border border-[#F9EAA5] flex gap-2 items-center">
          <CircleAlert color="#C5731E" size={20} />
          <p>
            Your membership is inactive at the moment, and as a result, you
            cannot move forward with this action. Please complete your
            membership activation to continue or contact our support center.
          </p>
        </div>
      )}

      <BuildLanderHeader progress={progress} currentStep={steps} />
      <div className="mt-5 bg-white shadow rounded-2xl flex w-full h-full flex-col gap-5 items-start justify-center p-5 md:p-10">
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
          <div className="bg-[#FEFBED] text-[#764B2E] text-xs px-4 py-2 rounded-lg mt-3 border border-[#F9EAA5] flex gap-2 items-center">
            <CircleAlert color="#C5731E" size={15} />
            <p>
              <span className="font-medium">NOTE:</span> All fields are editable
              after submission.
            </p>
          </div>

          <div className="flex gap-3 items-center mt-5">
            {steps > 1 && (
              <button
                type="button"
                onClick={() => setSteps((prev) => prev - 1)}
                className="cursor-pointer text-sm md:text-md border border-[#96c94b] py-2 px-6 rounded-lg flex gap-2 justify-center items-center"
              >
                Back
              </button>
            )}
            {steps === 4 ? (
              <button
                type="submit"
                className="text-black bg-[#CCEF87] flex gap-2 items-center font-normal text-sm md:text-md min-w-40 justify-center h-10 rounded-lg cursor-pointer"
                disabled={isLoading}
              >
                {isLoading ? (
                  <LoaderCircle className="animate-spin" size={15} />
                ) : wristbands?.length > 0 ? (
                  <p className="flex gap-2 items-center">
                    Submit & Pay <ArrowRightToLine size={15} />
                  </p>
                ) : (
                  <p className="flex gap-2 items-center">
                    Submit <ArrowRightToLine size={15} />
                  </p>
                )}
              </button>
            ) : (
              <button
                type="submit"
                className={`text-black flex gap-2 items-center font-normal text-sm md:text-md px-5 py-2 md:py-3 rounded-lg cursor-pointer ${
                  user?.membership?.status !== "ACTIVATE"
                    ? "bg-gray-200"
                    : "bg-[#CCEF87]"
                }`}
                disabled={user?.membership?.status !== "ACTIVATE"}
              >
                Next <ArrowRightToLine size={15} />
              </button>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}

export default CreateOnboard;
