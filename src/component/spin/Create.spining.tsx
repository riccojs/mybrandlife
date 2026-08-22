import { useState } from "react";
import { MdOutlineClose } from "react-icons/md";
import { ImSpinner6 } from "react-icons/im";
import toast from "react-hot-toast";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useAuth } from "../../hook/useAuth";
import useBodyScroll from "../../hook/userBodyscroll";
import { useCreateSpiningMutation } from "../../redux/features/spin/spinApi";
import SelectComponent from "../ui/Select.component";

interface Type {
  isOpen: boolean;
  onClose: () => void;
}

function CreateSpining({ isOpen, onClose }: Type) {
  useBodyScroll(isOpen);
  const { user } = useAuth() as { user: { id: string } | null };
  const [spining, setSpining] = useState({
    landerId: user?.id,
    isEnable: true,
    groupType: "",
    title: "",
    url: "",
  });
  const [createSpining, { isLoading }] = useCreateSpiningMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSpining({
      ...spining,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (groupType?.length === 0) {
      toast.error("Select group type!");
      return;
    }
    createSpining(spining)
      .unwrap()
      .then((res) => {
        toast.success(res.message);
        setSpining((prev) => ({
          ...prev,
          isEnable: false,
          groupType: "",
          url: "",
          title: "",
        }));
        onClose();
      })
      .catch((error) => {
        const err = error as FetchBaseQueryError;
        const errorMessage = (err.data as { message: string }).message;
        toast.error(errorMessage);
      });
  };

  const { title, url, groupType, isEnable } = spining || {};

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div
        className={`w-full max-w-xl bg-white rounded-2xl shadow-xl  ${
          isOpen ? "zoom-animation" : ""
        }`}
      >
        <div className="relative w-full max-w-full rounded-xl bg-white p-6 shadow-2xl sm:p-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">
              Create New Group
            </h2>
            <button
              onClick={onClose}
              className="rounded-md p-1 text-slate-400 transition hover:text-slate-600"
              aria-label="Close modal"
            >
              <MdOutlineClose size={25} />
            </button>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Fill in the details below to start your new SPIN features.
          </p>
          <p className="mt-1 text-sm text-amber-500">
            Fun SPIN works best with 10 or more links.
          </p>
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Group Type <span className="text-red-500 text-xl">*</span>
              </label>

              <div className="w-full">
                <SelectComponent
                  label="All Groups"
                  handleChange={(value: string) => {
                    setSpining((prev) => ({
                      ...prev,
                      groupType: value,
                    }));
                  }}
                  value={spining?.groupType}
                  datas={[
                    { key: "PEOPLE", value: "PEOPLE" },
                    { key: "CLUBS", value: "CLUBS" },
                    { key: "HOTELS", value: "HOTELS" },
                    { key: "RESTAURANTS", value: "RESTAURANTS" },
                    { key: "OTHER", value: "OTHER" },
                  ]}
                  color="#F3F3F3"
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Title <span className="text-red-500 text-xl">*</span>
              </label>

              <input
                type="text"
                name="title"
                value={title}
                maxLength={16}
                onChange={handleChange}
                required
                placeholder="Fun SPIN works best with 10 or more links."
                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-[#8CC63F] focus:outline-none focus:ring-2 focus:ring-[#8CC63F]/30"
              />
              <p className="text-gray-400 text-xs mt-1">Max 16 Character</p>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                URL <span className="text-red-500 text-xl">*</span>
              </label>

              <input
                type="url"
                name="url"
                value={url}
                onChange={handleChange}
                required
                placeholder="https://example.com"
                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-[#8CC63F] focus:outline-none focus:ring-2 focus:ring-[#8CC63F]/30"
              />
            </div>

            <div className="flex gap-5 items-center">
              <p className="text-md text-black font-normal">Enable Link</p>
              <div className="flex justify-center items-center">
                <label className="switch">
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      setSpining((prev) => ({
                        ...prev,
                        isEnable: e.target.checked,
                      }))
                    }
                    checked={isEnable}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-end gap-3">
              <button
                onClick={onClose}
                type="button"
                className="rounded-lg cursor-pointer px-4 py-2 text-sm font-medium text-slate-600 transition bg-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg cursor-pointer bg-[#8CC63F] px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#7AB535] focus:outline-none focus:ring-2 focus:ring-[#8CC63F]/40"
              >
                {isLoading ? (
                  <ImSpinner6 className="animate-spin" />
                ) : (
                  "Create Link"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateSpining;
