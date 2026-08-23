import { type SetStateAction } from "react";
import OnboardServices from "./Onboard.services";
import type { OnboardTypes } from "../../utils/user.types";

interface DataTypes {
  onboard: OnboardTypes;
  setOnboard: React.Dispatch<SetStateAction<OnboardTypes>>;
}

function OneboardOne({ onboard, setOnboard }: DataTypes) {
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
            Short Bio <span className="text-2xl text-red-500">*</span>
          </label>
          <textarea
            rows={3}
            name="bio"
            value={bio}
            required
            onChange={handleChange}
            maxLength={300}
            placeholder="Add your Bio, it is located centered bottom of your lander"
            className="bg-[#F3F3F3] border border-gray-300 focus:outline focus:outline-[#96c94b] focus:border py-3 px-3 w-full rounded-xl text-normal"
          ></textarea>
          <p className="bg-amber-100 text-black text-sm p-2 rounded-lg mt-1">
            <span className="font-medium">NOTE:</span> A short story about you
            or your niche max 300 characters.
          </p>
        </div>
        <div className="flex flex-col gap-1 w-full">
          <label htmlFor="" className="text-lg font-medium text-black">
            Tag Line / Mission <span className="text-2xl text-red-500">*</span>
          </label>
          <input
            type="text"
            value={tagLine}
            onChange={handleChange}
            placeholder="Add your Tag Line, it is located page center above your Niche on the lander"
            name="tagLine"
            required
            maxLength={100}
            className="bg-[#F3F3F3] border border-gray-300 focus:outline focus:outline-[#96c94b] focus:border py-3 px-3 w-full rounded-xl text-normal"
          />
          <p className="bg-amber-100 text-black text-sm p-2 rounded-lg mt-1">
            <span className="font-medium">NOTE:</span> Your catch phrase or
            niche mission max 100 characters.
          </p>
        </div>
        <div className="flex flex-col gap-1 w-full">
          <label htmlFor="" className="text-lg font-medium text-black">
            Business / Niche Offerings{" "}
            <span className="text-2xl text-red-500">*</span>
          </label>

          <input
            type="text"
            value={offerings}
            onChange={handleChange}
            placeholder="Add your Business / Niche Offerings, it is located page center on the lander"
            name="offerings"
            required
            maxLength={60}
            className="bg-[#F3F3F3] border border-gray-300 focus:outline focus:outline-[#96c94b] focus:border py-3 px-3 w-full rounded-xl text-normal"
          />
          <p className="bg-amber-100 text-black text-sm p-2 rounded-lg mt-1">
            <span className="font-medium">NOTE:</span> Your offerings, a short
            note of who you are max 60 characters.
          </p>
        </div>

        {offerings?.length > 0 && (
          <div className="flex flex-col gap-1 w-full">
            <label htmlFor="" className="text-lg font-medium text-black">
              Business / Areas Serviced{" "}
              <span className="text-2xl text-red-500">*</span>
            </label>
            <OnboardServices onboard={onboard} setOnboard={setOnboard} />
          </div>
        )}
      </div>
    </div>
  );
}

export default OneboardOne;
