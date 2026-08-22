import { useState } from "react";
import toast from "react-hot-toast";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useParams } from "react-router";
import { LoaderCircle } from "lucide-react";
import useBodyScroll from "../../hook/userBodyscroll";
import type { CustomPlatformItem } from "../../utils/user.types";
import { useAuth } from "../../hook/useAuth";
import { useCreateCustomsMutation } from "../../redux/features/onboard/onboardApi";

interface TypesForm {
  isShowButton: boolean;
  setIsShowButton: React.Dispatch<React.SetStateAction<boolean>>;
  customPlatfrom: TypesOfButton[];
}

interface TypesOfButton {
  id: string;
  name: string;
  url: string;
  templateId: string;
}

interface OnboardType {
  customPlatform: CustomPlatformItem[];
}

function AddCustomButton({
  isShowButton,
  setIsShowButton,
  customPlatfrom,
}: TypesForm) {
  useBodyScroll(isShowButton);
  const params = useParams();
  const id = params.id;
  const [onboard, setOnboard] = useState<OnboardType>({
    customPlatform: [],
  });
  const [createCustoms, { isLoading }] = useCreateCustomsMutation();
  const { user } = useAuth() as { user: { package: string } | null };
  const handleFeatureChange = (
    index: number,
    field: keyof CustomPlatformItem,
    value: string,
  ) => {
    setOnboard((prev) => {
      const updated = [...prev.customPlatform];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, customPlatform: updated };
    });
  };

  const handleAddFeature = () => {
    const totalButton =
      customPlatfrom?.length + onboard?.customPlatform?.length;
    if (totalButton >= 5) {
      toast.error("Maximum 5 custom links allowed!");
      return;
    }
    setOnboard((prev) => ({
      ...prev,
      customPlatform: [...prev.customPlatform, { name: "", url: "" }],
    }));
  };

  const handleRemoveFeature = (index: number) => {
    setOnboard((prev) => ({
      ...prev,
      customPlatform: prev.customPlatform.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createCustoms({ id, onboard })
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
        className={`relative flex flex-col w-11/12 overflow-hidden 2xl:w-4/12 xl:w-6/12 m-auto justify-center rounded-3xl shadow-sm bg-[#ffffff] border border-gray-300 ${
          isShowButton ? "zoom-animation" : ""
        }`}
      >
        <div className="p-8 custom-scroll max-h-[90vh] overflow-auto flex flex-col h-full justify-between">
          <div>
            <div className="mb-5 flex items-start justify-between border-b border-gray-200 pb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Add Custom Platforms
                </h2>
                <p className="text-sm text-gray-500">
                  Add button label and link to create custom platform.
                </p>
              </div>
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="bg-slate-100 border border-gray-200 rounded-xl p-5">
              <div className="w-full flex justify-between items-center">
                <h2 className="text-md font-normal capitalize">
                  Add Custom Link{" "}
                  {user?.package !== "gold" && (
                    <span className="text-red-500 text-xs font-normal">
                      (Gold Only)
                    </span>
                  )}
                </h2>
                <button
                  type="button"
                  onClick={handleAddFeature}
                  disabled={user?.package !== "gold"}
                  className="dark-gold cursor-pointer"
                >
                  <i className="fa-solid fa-plus text-xl" />
                </button>
              </div>
              <div
                className={`flex flex-col gap-5 ${
                  onboard.customPlatform.length > 0 ? "mt-5" : "mt-0"
                }`}
              >
                {onboard.customPlatform.map((item, index) => (
                  <div key={index} className="flex w-full gap-3 items-center">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) =>
                        handleFeatureChange(index, "name", e.target.value)
                      }
                      className="bg-white border border-gray-300 py-3 px-3 w-full rounded-xl"
                      placeholder="Add label"
                      required
                    />
                    <input
                      type="url"
                      value={item.url}
                      onChange={(e) =>
                        handleFeatureChange(index, "url", e.target.value)
                      }
                      className="bg-white border border-gray-300 py-3 px-3 w-full rounded-xl"
                      placeholder="https://example.com"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(index)}
                      className="dark-gold cursor-pointer"
                    >
                      <i className="fa-solid fa-xmark text-xl" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-3 items-center justify-end pt-5">
              <button
                type="button"
                onClick={() => setIsShowButton(false)}
                className="bg-slate-200 text-[#000000] flex justify-center items-center gap-1 w-fit border border-gray-200 px-10 py-3 rounded-2xl cursor-pointer"
              >
                Close
              </button>
              <button
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

export default AddCustomButton;
