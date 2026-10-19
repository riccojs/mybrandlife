import { useState } from "react";
import toast from "react-hot-toast";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useRequestInfoMutation } from "../../redux/features/onboard/onboardApi";
import LocationShare from "./Location.share";
import { LoaderCircle } from "lucide-react";

interface TypesForm {
  isShowInfo: boolean;
  setIsShowInfo: React.Dispatch<React.SetStateAction<boolean>>;
}

interface OnboardType {
  name: string;
  email: string;
  phone: string;
  note: string;
}

function SendInfo({ isShowInfo, setIsShowInfo }: TypesForm) {
  const [requestInfo, { isLoading }] = useRequestInfoMutation();
  const [steps, setSteps] = useState<number>(1);
  const [user, setUser] = useState<OnboardType>({
    name: "",
    email: "",
    phone: "",
    note: "",
  });
  const [requestId, setRequestId] = useState<string>("");

  const { name, email, phone, note } = user || {};

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
                Let me get your info and I'll give you mine
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

              <div className="flex gap-3 items-center">
                <button
                  className="bg-[#E6E6E6] cursor-pointer px-5 py-3 rounded-lg text-xs md:text-sm w-full"
                  onClick={() => {
                    if (isLoading) {
                      return;
                    }
                    setIsShowInfo(false);
                  }}
                  disabled={isLoading}
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`flex justify-center items-center px-5 py-3 rounded-lg text-xs md:text-sm w-full ${isLoading ? "bg-[#4e8527] cursor-not-allowed" : "bg-[#65B32E] cursor-pointer"}`}
                >
                  {isLoading ? (
                    <LoaderCircle size={20} className="animate-spin" />
                  ) : (
                    "Submit Request"
                  )}
                </button>
              </div>
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
