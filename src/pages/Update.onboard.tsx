import { useEffect, useRef, useState } from "react";
import OneboardTow from "../component/onboard/Onboard.tow";
import OneboardThree from "../component/onboard/Onboard.three";
import OnboardFour from "../component/onboard/Onboard.four";
import toast from "react-hot-toast";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useParams } from "react-router";
import type { OnboardTypes } from "../utils/user.types";
import {
  useGetOneOnboardQuery,
  useOnboardUserMutation,
} from "../redux/features/onboard/onboardApi";
import { useAuth } from "../hook/useAuth";
import UpdateOneboardOne from "../component/onboard/Update.onboard.one";

interface UserType {
  package?: string;
  id: string;
  userTemplete: OnboardTypes[];
}

function UpdateOnboard() {
  const [steps, setSteps] = useState<number>(1);
  const params = useParams();
  const id = params.id;
  const { user } = useAuth() as { user: UserType | null };
  const [onboardUser, { isLoading }] = useOnboardUserMutation();
  const { data } = useGetOneOnboardQuery(id);
  const customerId = (user?.id ?? null) as string | null;
  const headerImageRef = useRef<HTMLInputElement>(null);
  const logoImageRef = useRef<HTMLInputElement>(null);
  const bodyImageRef = useRef<HTMLInputElement>(null);
  const epkFileRef = useRef<HTMLInputElement>(null);
  const [onboard, setOnboard] = useState<OnboardTypes>({
    referalCode: "",
    bio: "",
    tagLine: "",
    offerings: "",
    services: [],
    vfrCreate: "",
    funnySaying: "",
    userId: customerId,
    socialLinks: {},
    logoImage: null,
    headerImage: null,
    bodyImage: null,
    epkFile: null,
    merchendiseUrl: "",
    customPlatform: [],
    wristbands: [],
  });
  const {
    referalCode,
    bio,
    tagLine,
    offerings,
    funnySaying,
    socialLinks,
    logoImage,
    headerImage,
    bodyImage,
    epkFile,
    userId,
  } = onboard || {};

  useEffect(() => {
    if (data) {
      setOnboard(data);
    }
  }, [data]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (steps === 1) {
      if (referalCode?.length === 0) {
        toast.error("Please add affiliate code!");
        return;
      }
    }
    if (steps === 2) {
      if (!funnySaying || !logoImage || !bodyImage || !headerImage) {
        toast.error("Please select require fields!");
        return;
      }
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
      formData.append("tagLine", tagLine ? tagLine : "");
      formData.append("offerings", offerings ? offerings : "");
      formData.append("funnySaying", funnySaying ? funnySaying : "");
      formData.append("logoImage", logoImage ? logoImage : "");
      formData.append("headerImage", headerImage ? headerImage : "");
      formData.append("bodyImage", bodyImage ? bodyImage : "");
      formData.append("epkFile", epkFile ? epkFile : "");
      Object.entries(socialLinks).forEach(([key, value]) => {
        formData.append(key, value);
      });
      onboardUser(formData)
        .unwrap()
        .then((res) => {
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
            vfrCreate: "",
            funnySaying: "",
            userId: customerId,
            socialLinks: {},
            logoImage: null,
            headerImage: null,
            bodyImage: null,
            epkFile: null,
            merchendiseUrl: "",
            customPlatform: [],
            wristbands: [],
          });
          window.location.href = res.pageUrl;
          setTimeout(() => {}, 1000);
        })
        .catch((error) => {
          const err = error as FetchBaseQueryError;
          const errorMessage = (err.data as { message: string }).message;
          toast.error(errorMessage);
        });
    }
  };

  return (
    <section className="p-5 w-full lg:w-9/12 2xl:w-6/12">
      <p className="text-black bg-amber-100 p-3 rounded-md border-l-4 border-amber-300">
        Your onboarding isn't complete yet! You have only one onboarding
        opportunity in your subscription tier, so be sure to submit and pay to
        secure it.
      </p>

      <div className="mt-5 bg-white border border-gray-300 rounded-md flex w-full h-full flex-col gap-5 items-start justify-center p-10 xl:p-20">
        <div className="flex flex-col gap-5 items-center w-full">
          <h2 className="text-2xl md:text-4xl font-xl font-medium uppercase text-center">
            Complete Your Profile
          </h2>
          <p className="text-[#96c94b] text-xl font-medium text-center">
            Your Package: {user?.package || "No package selected"}
          </p>
          <p className="bg-[#96c94b] w-24 h-2 rounded-full m-auto"></p>
        </div>

        <form onSubmit={handleSubmit} className="w-full">
          <div
            className={`transition-opacity duration-500 ease-in-out ${
              steps === 1 ? "opacity-100" : "opacity-0"
            }`}
          >
            {steps === 1 && (
              <UpdateOneboardOne onboard={onboard} setOnboard={setOnboard} />
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
                  <>
                    <i className="fa-regular fa-paper-plane"></i>
                    <p>Submit & Pay</p>
                  </>
                )}
              </button>
            ) : (
              <button
                type="submit"
                className="primary-btn flex gap-2 items-center"
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

export default UpdateOnboard;
