import { useState } from "react";
import toast from "react-hot-toast";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useSendAskForHelpEmailMutation } from "../../redux/features/partner/partnerApi";

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
        className={`relative flex flex-col w-11/12 md:w-8/12 lg:w-6/12 2xl:w-4/12 m-auto justify-center p-10 rounded-lg shadow-sm bg-[#ffffff] border border-gray-300 ${
          showTab ? "zoom-animation" : ""
        }`}
      >
        <h2 className="text-2xl font-medium text-black text-center mt-5 mb-2">
          Ask for help
        </h2>
        <p className="text-md font-normal text-black text-center">
          Fill the form and submit it. We will notify shortly.
        </p>
        <form
          onSubmit={handleSubmit}
          className="w-full my-5 flex flex-col gap-5"
        >
          <div>
            <div className="flex flex-col w-full">
              <label htmlFor="" className="text-md font-normal text-black">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={handleChange}
                required
                className="border border-gray-300 px-4 py-2 rounded-lg w-full focus:outline-1 focus:outline-[#96c94b]"
                placeholder="Enter email"
              />
            </div>
          </div>
          <div className="flex flex-col w-full">
            <label htmlFor="" className="text-md font-normal text-black">
              Phone
            </label>
            <input
              type="number"
              name="phone"
              value={phone}
              onChange={handleChange}
              required
              className="border border-gray-300 px-4 py-2 rounded-lg w-full focus:outline-1 focus:outline-[#96c94b]"
              placeholder="Enter phone"
            />
          </div>
          <div className="flex flex-col w-full">
            <label htmlFor="" className="text-md font-normal text-black">
              Note
            </label>
            <input
              type="text"
              name="note"
              value={note}
              onChange={handleChange}
              required
              className="border border-gray-300 px-4 py-2 rounded-lg w-full focus:outline-1 focus:outline-[#96c94b]"
              placeholder="Enter note"
            />
          </div>
          <div className="flex flex-col w-full">
            <label htmlFor="" className="text-md font-normal text-black">
              Domain <span className="text-xs">(Optional)</span>
            </label>
            <input
              type="text"
              name="domain"
              value={domain}
              onChange={handleChange}
              className="border border-gray-300 px-4 py-2 rounded-lg w-full focus:outline-1 focus:outline-[#96c94b]"
              placeholder="Enter domain"
            />
          </div>
          <div className="flex flex-col w-full">
            <label htmlFor="" className="text-md font-normal text-black">
              Lander <span className="text-xs">(Optional)</span>
            </label>
            <input
              type="text"
              name="lander"
              value={lander}
              onChange={handleChange}
              className="border border-gray-300 px-4 py-2 rounded-lg w-full focus:outline-1 focus:outline-[#96c94b]"
              placeholder="Enter lander"
            />
          </div>
          <div className="flex flex-col w-full">
            <label htmlFor="" className="text-md font-normal text-black">
              Location <span className="text-xs">(Optional)</span>
            </label>
            <input
              type="text"
              name="location"
              value={location}
              onChange={handleChange}
              className="border border-gray-300 px-4 py-2 rounded-lg w-full focus:outline-1 focus:outline-[#96c94b]"
              placeholder="Enter location"
            />
          </div>
          <button
            type="submit"
            className="primary-btn w-fit px-6! flex gap-2 items-center"
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
              "Submit Request"
            )}
          </button>
        </form>
        <button
          onClick={() => setShowTab(false)}
          className="bg-red-400 w-10 h-10 flex justify-center items-center rounded-full text-white absolute top-3 right-3 cursor-pointer"
        >
          <i className="fa-solid fa-xmark text-2xl"></i>
        </button>
      </div>
    </div>
  );
}

export default AskForhelp;
