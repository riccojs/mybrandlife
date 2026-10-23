import React, { type SetStateAction } from "react";
import toast from "react-hot-toast";
import type { OnboardTypes } from "../../utils/user.types";
import { CircleAlert } from "lucide-react";

interface DataTypes {
  onboard: OnboardTypes;
  setOnboard: React.Dispatch<SetStateAction<OnboardTypes>>;
}

function OnboardServices({ setOnboard, onboard }: DataTypes) {
  const handleFeatureChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const { value } = e.target;
    setOnboard((prev) => {
      const updated = [...prev.services];
      updated[index] = value;
      return { ...prev, services: updated };
    });
  };

  const handleAddFeature = () => {
    if (onboard?.services?.length >= 5) {
      toast.error("Maximum 5 box allow!");
      return;
    }
    setOnboard((prev) => ({ ...prev, services: [...prev.services, ""] }));
  };

  const handleRemoveFeature = (index: number) => {
    setOnboard((prev) => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="border border-gray-200 p-3 md:p-5 rounded-xl">
      <div className="w-full flex justify-between items-center">
        <h2 className="text-sm md:text-md font-medium text-[#1F2534] capitalize">
          Add your services
        </h2>
        <div
          onClick={handleAddFeature}
          className="dark-gold cursor-pointer border active:bg-gray-50 border-gray-200 text-gray-400 w-10 min-w-10 h-10 flex justify-center items-center rounded-lg"
        >
          <i className="fa-solid fa-plus text-xl"></i>
        </div>
      </div>
      <div
        className={`w-full flex flex-col gap-5 ${
          onboard?.services?.length > 0 ? "mt-5" : "mt-0"
        }`}
      >
        {onboard?.services.map((feature, index) => (
          <div key={index} className="flex w-full gap-3 items-center">
            <input
              type="text"
              value={feature ?? ""}
              required={onboard?.offerings?.length > 0}
              maxLength={30}
              onChange={(e) => handleFeatureChange(e, index)}
              className="bg-[#FBFCFD] border border-[#C6CFDC] focus:outline focus:outline-[#96c94b] focus:border py-3 px-3 w-full rounded-xl text-sm md:text-base"
              placeholder="Add your Services, it a list located top of page, left, center, or right depending on your domain"
            />
            <div
              onClick={() => handleRemoveFeature(index)}
              className="dark-gold cursor-pointer active:bg-gray-50 border border-gray-200 text-gray-400 w-12 min-w-12 h-12 flex justify-center items-center rounded-lg"
            >
              <i className="fa-solid fa-xmark text-xl"></i>
            </div>
          </div>
        ))}
        <div className="bg-[#FEFBED] text-[#764B2E] text-xs px-4 py-2 rounded-lg mt-3 border border-[#F9EAA5] flex gap-2 items-center">
          <CircleAlert color="#C5731E" size={15} />
          <p>
            <span className="font-medium">NOTE:</span> This is a list of your
            services using the plus sign add a max of 5 services offered with
            each service max 30 characters.
          </p>
        </div>
      </div>
    </div>
  );
}

export default OnboardServices;
