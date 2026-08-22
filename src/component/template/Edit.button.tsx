import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router";
import { LoaderCircle } from "lucide-react";
import useBodyScroll from "../../hook/userBodyscroll";
import { useUpdateSocialsMutation } from "../../redux/features/onboard/onboardApi";

interface TypesForm {
  isShowButton: boolean;
  setIsShowButton: React.Dispatch<React.SetStateAction<boolean>>;
  buttons: TypesOfButton[];
}

interface TypesOfButton {
  id: string;
  name: string;
  url: string;
  templateId: string;
}

function EditButton({ isShowButton, setIsShowButton, buttons }: TypesForm) {
  useBodyScroll(isShowButton);

  const [onboard, setOnboard] = useState<TypesOfButton[]>(buttons);
  const [updateSocials, { isLoading }] = useUpdateSocialsMutation();
  const params = useParams();
  const id = params.id;

  const handleChange = (id: string, value: string) => {
    setOnboard((prev) =>
      prev.map((btn) => (btn.id === id ? { ...btn, url: value } : btn)),
    );
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateSocials({ id, onboard })
      .unwrap()
      .then((res) => {
        toast.success(res.message);
        setIsShowButton(false);
      })
      .catch((error) => {
        const err = error as FetchBaseQueryError;
        const errorMessage = (err.data as { message: string }).message;
        toast.error(errorMessage);
      });
  };

  return (
    <div className="inset-0 bg-[#00000039] flex fixed left-0 justify-center items-center w-full min-h-screen z-50 overflow-auto">
      <div
        className={`relative flex flex-col w-11/12 2xl:w-4/12 xl:w-6/12 m-auto justify-center rounded-3xl shadow-sm bg-[#ffffff] border border-gray-300 ${
          isShowButton ? "zoom-animation" : ""
        }`}
      >
        <div className="p-8 max-h-[95vh] h-auto overflow-y-auto custom-scroll">
          <div className="flex flex-col border-b border-gray-300 pb-5 mb-5">
            <h2 className="text-xl">Edit All Buttons</h2>
            <p className="text-sm font-normal text-gray-400">
              Update your button here
            </p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-5 mb-5">
              {onboard?.map((item) => {
                const { id, name, url } = item || {};
                return (
                  <div key={id} className="flex flex-col gap-1">
                    <label
                      htmlFor=""
                      className="text-md font-normal text-black"
                    >
                      {name}
                    </label>
                    {name === "EMAIL" ? (
                      <input
                        type="email"
                        value={url}
                        required
                        onChange={(e) => handleChange(id, e.target.value)}
                        placeholder={`Enter ${name}`}
                        className="bg-[#F3F3F3] border border-gray-300 focus:outline focus:outline-[#96c94b] focus:border py-3 px-3 w-full rounded-xl text-normal"
                      />
                    ) : name === "PHONE" || name === "WHATSAPP" ? (
                      <input
                        type="number"
                        value={url}
                        required
                        onChange={(e) => handleChange(id, e.target.value)}
                        placeholder={`Enter ${name}`}
                        className="bg-[#F3F3F3] border border-gray-300 focus:outline focus:outline-[#96c94b] focus:border py-3 px-3 w-full rounded-xl text-normal"
                      />
                    ) : (
                      <input
                        type="url"
                        value={url}
                        required
                        onChange={(e) => handleChange(id, e.target.value)}
                        placeholder={`Enter ${name}`}
                        className="bg-[#F3F3F3] border border-gray-300 focus:outline focus:outline-[#96c94b] focus:border py-3 px-3 w-full rounded-xl text-normal"
                      />
                    )}
                  </div>
                );
              })}
            </div>
            <div className="flex gap-3 items-center">
              <button
                onClick={() => setIsShowButton(false)}
                className="bg-slate-200 text-[#000000] flex justify-center items-center gap-1 w-fit border border-gray-200 px-10 py-3 rounded-2xl cursor-pointer"
              >
                Close
              </button>
              <button
                disabled={isLoading}
                type="submit"
                className="bg-[#BDF188] text-[#000000] flex justify-center items-center gap-1 w-fit border border-[#76c725] px-10 py-3 rounded-2xl cursor-pointer"
              >
                {isLoading ? <LoaderCircle className="animate-spin" /> : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditButton;
