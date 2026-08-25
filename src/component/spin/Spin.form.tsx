import React, { useState } from "react";
import { ImSpinner6 } from "react-icons/im";
import SelectComponent from "../ui/Select.component";
import { useUpdateSpiningMutation } from "../../redux/features/spin/spinApi";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import toast from "react-hot-toast";
import type { SpinType } from "../../utils/spin.types";

interface TypeForm {
  data: {
    spining: SpinType;
  };
  onClose: () => void;
  id: string;
}

function SpinForm({ data, onClose, id }: TypeForm) {
  const [spining, setSpining] = useState({
    isEnable: data?.spining?.isEnable || false,
    groupType: data?.spining?.groupType || "",
    title: data?.spining?.title || "",
    url: data?.spining?.url || "",
  });
  const [updateSpining, { isLoading }] = useUpdateSpiningMutation();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateSpining({ id, spining })
      .unwrap()
      .then((res) => {
        toast.success(res.message);
        onClose();
      })
      .catch((error) => {
        const err = error as FetchBaseQueryError;
        const errorMessage = (err.data as { message: string }).message;
        toast.error(errorMessage);
      });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSpining({
      ...spining,
      [name]: value,
    });
  };

  const { title, url, groupType, isEnable } = spining || {};
  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-5">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Group Type <span className="text-red-500 text-xl">*</span>
        </label>
        <div className="w-full">
          <SelectComponent
            value={groupType}
            label="Select Group Type"
            handleChange={(value: string) => {
              setSpining((prev) => ({
                ...prev,
                groupType: value,
              }));
            }}
            datas={[
              { key: "PEOPLE", value: "PEOPLE" },
              { key: "CLUBS", value: "CLUBS" },
              { key: "HOTELS", value: "HOTELS" },
              { key: "RESTAURANTS", value: "RESTAURANTS" },
              { key: "ALL", value: "ALL" },
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
          placeholder="e.g. jhon deo"
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
          {isLoading ? <ImSpinner6 className="animate-spin" /> : "Save"}
        </button>
      </div>
    </form>
  );
}

export default SpinForm;
