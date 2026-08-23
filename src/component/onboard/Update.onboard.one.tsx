import { useState, type SetStateAction } from "react";
import type { OnboardTypes } from "../../utils/user.types";

interface DataTypes {
  onboard: OnboardTypes;
  setOnboard: React.Dispatch<SetStateAction<OnboardTypes>>;
}

function UpdateOneboardOne({ onboard, setOnboard }: DataTypes) {
  const [refCode, setRefCode] = useState<string>("");
  const generatedCodes = new Set<string>();
  const { bio, tagLine, offerings } = onboard || {};
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setOnboard((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const genrateRefferalCode = () => {
    const length = 8;
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    let code = "";
    do {
      code = "";
      for (let i = 0; i < length; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
    } while (generatedCodes.has(code));

    generatedCodes.add(code);

    setOnboard((prev) => ({
      ...prev,
      referalCode: code,
    }));
    setRefCode(code);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col gap-5">
        <p className="text-2xl font-medium text-black mt-5">
          Step 1: Affiliate Code, Short Bio & Links
        </p>
      </div>
      <div className="flex flex-col gap-5 mt-10">
        <div className="flex flex-col gap-1 w-full">
          <label htmlFor="" className="text-lg font-medium text-black">
            Your affiliate code is a unique master key for all your data.{" "}
            <span className="text-2xl text-red-500">*</span>
          </label>
          <div
            onClick={genrateRefferalCode}
            className="cursor-pointer border border-gray-300 px-4 py-2 rounded-lg w-full focus:outline-1 focus:outline-[#96c94b] flex gap-2 items-center justify-center"
          >
            <i className="fa-solid fa-object-ungroup"></i>
            <p>Generate Affiliate Code</p>
          </div>
          <p className="text-lg font-medium text-black">
            Your affiliate code: {refCode}
          </p>
        </div>
        <div className="flex flex-col gap-1 w-full">
          <label htmlFor="" className="text-lg font-medium text-black">
            Short Bio <span className="text-2xl text-red-500">*</span>
          </label>
          <textarea
            rows={3}
            name="bio"
            value={bio}
            required
            onChange={handleChange}
            className="border border-gray-300 px-4 py-2 rounded-lg w-full focus:outline-1 focus:outline-[#96c94b]"
            id=""
          ></textarea>
        </div>
        <div className="flex flex-col gap-1 w-full">
          <label htmlFor="" className="text-lg font-medium text-black">
            Tag Line / Mission <span className="text-2xl text-red-500">*</span>
          </label>
          <input
            type="text"
            name="tagLine"
            value={tagLine}
            required
            onChange={handleChange}
            className="border border-gray-300 px-4 py-2 rounded-lg w-full focus:outline-1 focus:outline-[#96c94b]"
          />
        </div>
        <div className="flex flex-col gap-1 w-full">
          <label htmlFor="" className="text-lg font-medium text-black">
            Offerings <span className="text-2xl text-red-500">*</span>
          </label>
          <input
            type="text"
            name="offerings"
            value={offerings}
            required
            onChange={handleChange}
            className="border border-gray-300 px-4 py-2 rounded-lg w-full focus:outline-1 focus:outline-[#96c94b]"
          />
        </div>
      </div>
    </div>
  );
}

export default UpdateOneboardOne;
