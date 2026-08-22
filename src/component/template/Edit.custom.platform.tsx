import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router";
import { LoaderCircle } from "lucide-react";
import { useUpdateCustomPlatformMutation } from "../../redux/features/onboard/onboardApi";
import useBodyScroll from "../../hook/userBodyscroll";

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

function EditCustomPlatform({
  isShowButton,
  setIsShowButton,
  buttons,
}: TypesForm) {
  useBodyScroll(isShowButton);
  const [onboard, setOnboard] = useState<TypesOfButton[]>(buttons);
  const [updateCustomPlatform, { isLoading }] =
    useUpdateCustomPlatformMutation();
  const params = useParams();
  const id = params.id;

  const handleChange = (id: string, field: "name" | "url", value: string) => {
    setOnboard((prev) =>
      prev.map((btn) => (btn.id === id ? { ...btn, [field]: value } : btn)),
    );
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateCustomPlatform({ id, onboard })
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
        className={`relative flex flex-col w-11/12 3xl:w-6/12 xl:w-4/12 m-auto justify-center rounded-3xl shadow-sm bg-[#ffffff] border border-gray-300 ${
          isShowButton ? "zoom-animation" : ""
        }`}
      >
        <div className="p-8 h-auto max-h-[80vh] overflow-y-auto">
          <div className="flex flex-col border-b border-gray-300 pb-5 mb-5">
            <h2 className="text-xl">Edit custom buttons</h2>
            <p className="text-sm font-normal text-gray-400">
              Update your button here
            </p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-3 mb-5">
              {onboard?.map((item) => {
                const { id, name, url } = item || {};
                return (
                  <div key={id} className="flex md:flex-row flex-col gap-2">
                    <div className="w-full">
                      <label htmlFor="" className="text-black text-sm">
                        Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) =>
                          handleChange(id, "name", e.target.value)
                        }
                        placeholder={`Enter ${name}`}
                        className="bg-[#F3F3F3] border border-gray-300 focus:outline focus:outline-[#96c94b] focus:border py-2 px-3 w-full rounded-lg text-normal"
                      />
                    </div>
                    <div className="w-full">
                      <label htmlFor="" className="text-black text-sm">
                        URL
                      </label>
                      <input
                        type="url"
                        value={url}
                        onChange={(e) =>
                          handleChange(id, "url", e.target.value)
                        }
                        placeholder={`Enter ${url}`}
                        className="bg-[#F3F3F3] border border-gray-300 focus:outline focus:outline-[#96c94b] focus:border py-2 px-3 w-full rounded-lg text-normal"
                      />
                    </div>
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

export default EditCustomPlatform;
