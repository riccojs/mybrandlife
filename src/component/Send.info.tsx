import { useState } from "react";
import toast from "react-hot-toast";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useRequestInfoMutation } from "../redux/features/onboard/onboardApi";
import LocationShare from "./Location.share";
import { track } from "@plausible-analytics/tracker";
import { useOnboard } from "../hook/useOnboard";

interface TypesForm {
  isShowInfo: boolean;
  setIsShowInfo: React.Dispatch<React.SetStateAction<boolean>>;
  id: string;
}

interface OnboardType {
  name: string;
  email: string;
  phone: string;
  note: string;
  templateId: string;
}

function SendInfo({ isShowInfo, setIsShowInfo, id }: TypesForm) {
  const [requestInfo, { isLoading }] = useRequestInfoMutation();
  const { onboard } = useOnboard();
  const [steps, setSteps] = useState<number>(1);
  const [user, setUser] = useState<OnboardType>({
    name: "",
    email: "",
    phone: "",
    note: "",
    templateId: id,
  });
  const [requestId, setRequestId] = useState<string>("");

  const { name, email, phone, note } = user || {};

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    track("ButtonClick", {
      props: {
        buttonName: "Send info request",
        lander: onboard?.user?.landerName,
        currentDomain: window.location.hostname,
      },
    });
    requestInfo(user)
      .unwrap()
      .then((res) => {
        toast.success(res.message);
        setSteps(2);
        setRequestId(res.request.id);
      })
      .catch((error) => {
        const err = error as FetchBaseQueryError;
        const errorMessage = (err.data as { message: string }).message;
        toast.error(errorMessage);
      });
  };

  return (
    <div className="inset-0 bg-[#00000039] flex fixed left-0 justify-center items-center w-full h-auto min-h-screen z-50 overflow-auto">
      <div
        className={`relative flex flex-col w-11/12 2xl:w-3/12 xl:w-6/12 m-auto justify-center p-4 rounded-lg shadow-sm bg-[#ffffff] border border-gray-300 ${
          isShowInfo ? "zoom-animation" : ""
        }`}
      >
        {" "}
        {steps === 1 && (
          <div className="p-5 min-h-full overflow-y-auto">
            <div className="flex flex-col gap-2 pb-5 mb-5">
              <h2 className="text-2xl font-bold text-center">
                Let me get your info and I'll give you mine 😉
              </h2>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-2 mb-5">
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={handleChange}
                  required
                  placeholder="Your name"
                  className="flex gap-2 items-center border border-gray-300 px-4 py-2 rounded-md outline-[#96c94b]"
                />
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  required
                  placeholder="Your email"
                  className="flex gap-2 items-center border border-gray-300 px-4 py-2 rounded-md outline-[#96c94b]"
                />
                <input
                  type="text"
                  name="phone"
                  value={phone}
                  onChange={handleChange}
                  required
                  placeholder="Your phone"
                  className="flex gap-2 items-center border border-gray-300 px-4 py-2 rounded-md outline-[#96c94b]"
                />
                <textarea
                  name="note"
                  value={note}
                  onChange={handleChange}
                  required
                  className="flex gap-2 items-center border border-gray-300 px-4 py-2 rounded-md outline-[#96c94b]"
                  placeholder="Enter notes"
                  id=""
                ></textarea>
              </div>

              <button
                type="submit"
                className="py-2 bg-linear-to-r from-[#E73B14] to-[#EF9C25] flex justify-center gap-2 items-center w-full rounded-md mb-2 cursor-pointer hover:scale-102 duration-300 transition-all"
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
                    <p>SUBMIT REQUEST</p>
                  </>
                )}
              </button>
              <button
                className="bg-gradient-to-r from-[#2f2e2e] to-[#888787] w-full text-white text-md text-center py-2 rounded-md cursor-pointer hover:scale-102 duration-300 transition-all"
                onClick={() => setIsShowInfo(false)}
              >
                CLOSE
              </button>
            </form>
          </div>
        )}
        {steps === 2 && (
          <LocationShare
            setIsShowInfo={setIsShowInfo}
            user={user}
            setUser={setUser}
            requestId={requestId}
          />
        )}
      </div>
    </div>
  );
}

export default SendInfo;
