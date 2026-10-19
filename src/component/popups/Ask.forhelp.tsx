import { useState } from "react";
import toast from "react-hot-toast";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useSendAskForHelpEmailMutation } from "../../redux/features/partner/partnerApi";
import { LoaderCircle } from "lucide-react";

interface TypesForm {
  showTab: boolean;
  setShowTab: React.Dispatch<React.SetStateAction<boolean>>;
}

interface UserDataType {
  email: string;
  phone: string;
  note: string;
  domain: string;
  lander: string;
  location: string;
}

function AskForhelp({ showTab, setShowTab }: TypesForm) {
  const [user, setUser] = useState<UserDataType>({
    email: "",
    phone: "",
    note: "",
    domain: "",
    lander: "",
    location: "",
  });
  const [sendAskForHelpEmail, { isLoading }] = useSendAskForHelpEmailMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const { email, phone, note, domain, lander, location } = user || {};

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendAskForHelpEmail(user)
      .unwrap()
      .then((res) => {
        toast.success(res.message);
        setUser({
          email: "",
          phone: "",
          note: "",
          domain: "",
          lander: "",
          location: "",
        });
      })
      .catch((error) => {
        const err = error as FetchBaseQueryError;
        const errorMessage = (err.data as { message: string }).message;
        toast.error(errorMessage);
      });
  };

  return (
    <div className="inset-0 bg-[#00000053] flex fixed left-0 justify-center items-center w-full min-h-screen z-50 overflow-auto">
      <div
        className={`relative flex flex-col w-11/12 md:w-8/12 lg:w-6/12 2xl:w-4/12 m-auto justify-center p-5 md:p-10 rounded-4xl shadow-sm bg-[#ffffff] border border-gray-300 ${
          showTab ? "zoom-animation" : ""
        }`}
      >
        <h2 className="text-lg md:text-2xl font-medium text-black text-center mt-5 mb-2">
          Ask for help
        </h2>
        <p className="text-xs md:text-md font-normal text-black text-center">
          Fill the form and submit it. We will notify shortly.
        </p>
        <form
          onSubmit={handleSubmit}
          className="w-full my-5 flex flex-col gap-4 md:gap-5"
        >
          <div>
            <div className="flex flex-col w-full">
              <label
                htmlFor=""
                className="text-sm md:text-md font-normal text-black"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={handleChange}
                required
                className="border text-sm md:text-md border-gray-300 px-4 py-2 rounded-lg w-full focus:outline-1 focus:outline-[#96c94b]"
                placeholder="Enter email"
              />
            </div>
          </div>
          <div className="flex flex-col w-full">
            <label
              htmlFor=""
              className="text-sm md:text-md font-normal text-black"
            >
              Phone
            </label>
            <input
              type="number"
              name="phone"
              value={phone}
              onChange={handleChange}
              required
              className="border text-sm md:text-md border-gray-300 px-4 py-2 rounded-lg w-full focus:outline-1 focus:outline-[#96c94b]"
              placeholder="Enter phone"
            />
          </div>
          <div className="flex flex-col w-full">
            <label
              htmlFor=""
              className="text-sm md:text-md font-normal text-black"
            >
              Note
            </label>
            <input
              type="text"
              name="note"
              value={note}
              onChange={handleChange}
              required
              className="border text-sm md:text-md border-gray-300 px-4 py-2 rounded-lg w-full focus:outline-1 focus:outline-[#96c94b]"
              placeholder="Enter note"
            />
          </div>
          <div className="flex flex-col w-full">
            <label
              htmlFor=""
              className="text-sm md:text-md font-normal text-black"
            >
              Domain <span className="text-xs">(Optional)</span>
            </label>
            <input
              type="text"
              name="domain"
              value={domain}
              onChange={handleChange}
              className="border text-sm md:text-md border-gray-300 px-4 py-2 rounded-lg w-full focus:outline-1 focus:outline-[#96c94b]"
              placeholder="Enter domain"
            />
          </div>
          <div className="flex flex-col w-full">
            <label
              htmlFor=""
              className="text-sm md:text-md font-normal text-black"
            >
              Lander <span className="text-xs">(Optional)</span>
            </label>
            <input
              type="text"
              name="lander"
              value={lander}
              onChange={handleChange}
              className="border text-sm md:text-md border-gray-300 px-4 py-2 rounded-lg w-full focus:outline-1 focus:outline-[#96c94b]"
              placeholder="Enter lander"
            />
          </div>
          <div className="flex flex-col w-full">
            <label
              htmlFor=""
              className="text-sm md:text-md font-normal text-black"
            >
              Location <span className="text-xs">(Optional)</span>
            </label>
            <input
              type="text"
              name="location"
              value={location}
              onChange={handleChange}
              className="border text-sm md:text-md border-gray-300 px-4 py-2 rounded-lg w-full focus:outline-1 focus:outline-[#96c94b]"
              placeholder="Enter location"
            />
          </div>
          <div className="flex gap-3 items-center w-full md:w-6/12 mt-2">
            <button
              onClick={() => {
                if (isLoading) {
                  return;
                }
                setShowTab(false);
              }}
              className="bg-[#E6E6E6] cursor-pointer px-5 py-2 rounded-lg text-xs md:text-sm w-full"
              type="button"
            >
              Close
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`flex justify-center items-center px-5 py-2 rounded-lg text-xs md:text-sm w-full ${isLoading ? "bg-[#4e8527] cursor-not-allowed" : "bg-[#65B32E] cursor-pointer"}`}
            >
              {isLoading ? (
                <LoaderCircle size={20} className="animate-spin" />
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AskForhelp;
