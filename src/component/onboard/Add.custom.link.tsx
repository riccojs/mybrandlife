import React, { type SetStateAction } from "react";
import toast from "react-hot-toast";
import type { CustomPlatformItem, OnboardTypes } from "../../utils/user.types";
import { useAuth } from "../../hook/useAuth";

interface DataTypes {
  onboard: OnboardTypes;
  setOnboard: React.Dispatch<SetStateAction<OnboardTypes>>;
}

function AddCustomLink({ setOnboard, onboard }: DataTypes) {
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
    if (onboard.customPlatform.length >= 10) {
      toast.error("Maximum 10 custom links allowed!");
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

  return (
    <div className="border border-gray-300 p-5 rounded-md">
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
              className="bg-[#F3F3F3] border border-gray-300 py-3 px-3 w-full rounded-xl"
              placeholder="Add label"
              required
            />
            <input
              type="url"
              value={item.url}
              onChange={(e) =>
                handleFeatureChange(index, "url", e.target.value)
              }
              className="bg-[#F3F3F3] border border-gray-300 py-3 px-3 w-full rounded-xl"
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
  );
}

export default AddCustomLink;
