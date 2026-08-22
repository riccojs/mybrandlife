import { useState } from "react";
import { useRequestDomainMutation } from "../../redux/features/onboard/onboardApi";
import toast from "react-hot-toast";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { LoaderCircle } from "lucide-react";
import InputComponent from "../ui/Input.component";
import useBodyScroll from "../../hook/userBodyscroll";

interface TypesForm {
  reqTab: boolean;
  setReqTab: React.Dispatch<React.SetStateAction<boolean>>;
}

function ReqestDomainTab({ reqTab, setReqTab }: TypesForm) {
  useBodyScroll(reqTab);

  const [user, setUser] = useState<{ domain: string; email: string }>({
    domain: "",
    email: "",
  });
  const [requestDomain, { isLoading }] = useRequestDomainMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    requestDomain(user)
      .unwrap()
      .then((res) => {
        toast.success(res.message);
        setUser({
          email: "",
          domain: "",
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
        className={`flex flex-col w-11/12 md:w-8/12 lg:w-6/12 2xl:w-4/12 m-auto justify-center p-10 rounded-2xl shadow-sm bg-[#ffffff] border border-gray-300 ${
          reqTab ? "zoom-animation" : ""
        }`}
      >
        <h2 className="text-2xl font-medium text-black text-center mt-5 mb-2">
          Request A Domain
        </h2>
        <p className="text-md font-normal text-black text-center">
          Fill the form and submit it. We will notify shortly.
        </p>
        <form
          onSubmit={handleSubmit}
          className="w-full my-5 flex flex-col gap-5"
        >
          <div>
            <div className="flex flex-col w-full gap-1">
              <label htmlFor="" className="text-sm font-normal text-black">
                Niche / Brand / Business
              </label>
              <InputComponent
                placeholder="e.g: mybrandlife"
                type="text"
                value={user?.domain}
                handleChange={handleChange}
                name="domain"
                autoComplete="domain"
                required={true}
              />
            </div>
            {user.domain && (
              <p className="text-sm font-normal italic text-gray-500 mt-1">
                {user.domain}
              </p>
            )}
          </div>
          <div className="flex flex-col w-full gap-1">
            <label htmlFor="" className="text-sm font-normal text-black">
              Email Address
            </label>
            <InputComponent
              placeholder="example@gmail.com"
              type="email"
              value={user.email}
              handleChange={handleChange}
              name="email"
              autoComplete="email"
              required={true}
            />
          </div>
          <div className="flex gap-2 items-center max-w-96">
            <button
              type="button"
              onClick={() => setReqTab(false)}
              className="h-12 w-full flex justify-center items-center rounded-full text-sm font-semibold text-black shadow-sm transition duration-200 active:scale-[1.01] bg-slate-200 hover:bg-slate-300 cursor-pointer border border-gray-300"
            >
              Close
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`h-12 w-full flex justify-center items-center rounded-full  text-sm font-semibold text-black shadow-sm transition duration-200 active:scale-[1.01] ${isLoading ? "bg-[#6fa420] cursor-not-allowed" : "bg-[#96c94b] hover:bg-[#88c133] cursor-pointer"}`}
            >
              {isLoading ? <LoaderCircle className="animate-spin" /> : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ReqestDomainTab;
