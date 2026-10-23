import { type SetStateAction } from "react";
import OnboardServices from "./Onboard.services";
import type { OnboardTypes } from "../../utils/user.types";
import { CircleAlert } from "lucide-react";

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
      <div className="flex md:flex-row flex-col w-full justify-between items-start md:items-center gap-1">
        <div>
          <h2 className="text-lg md:text-xl font-medium text-black mt-5">
            Step 1: Affiliate Code, Short Bio & Links
          </h2>
          <p className="text-[#64748b] text-xs font-normal">
            Provide key storytelling snippets for your custom landing page hero
            and about sections.
          </p>
        </div>
        <div className="bg-[#F0F3F8] flex gap-1 items-center rounded-lg px-3">
          <p className="text-[#D84D3E] text-md md:text-xl mt-2">*</p>
          <p className="text-xs text-[#41495A]">Required Fields</p>
        </div>
      </div>
      <div className="flex flex-col gap-5 mt-5 md:mt-10">
        <div className="flex flex-col gap-1 w-full">
          <label
            htmlFor="bio"
            className="text-sm md:text-md font-medium text-[#1F2534]"
          >
            Short Bio{" "}
            <span className="text-md md:text-lg text-[#D84D3E]">*</span>
          </label>
          <textarea
            rows={4}
            name="bio"
            value={bio}
            required
            onChange={handleChange}
            maxLength={300}
            placeholder="Add your Bio, it is located centered bottom of your lander"
            className="bg-[#FBFCFD] border border-[#C6CFDC] focus:outline focus:outline-[#96c94b] focus:border py-3 px-3 w-full rounded-xl text-sm md:text-base"
          ></textarea>
          <div className="bg-[#FEFBED] text-[#764B2E] text-xs px-4 py-2 rounded-lg mt-1 border border-[#F9EAA5] flex gap-2 items-center">
            <CircleAlert color="#C5731E" size={15} />
            <p>
              <span className="font-medium">NOTE:</span> A short story about you
              or your niche max 300 characters.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-1 w-full">
          <label
            htmlFor="tagLine"
            className="text-sm md:text-md font-medium text-[#1F2534]"
          >
            Tag Line / Mission{" "}
            <span className="text-md md:text-lg text-[#D84D3E]">*</span>
          </label>
          <input
            type="text"
            value={tagLine}
            onChange={handleChange}
            placeholder="Add your Tag Line, it is located page center above your Niche on the lander"
            name="tagLine"
            required
            maxLength={100}
            className="bg-[#FBFCFD] border border-[#C6CFDC] focus:outline focus:outline-[#96c94b] focus:border py-3 px-3 w-full rounded-xl text-sm md:text-base"
          />
          <div className="bg-[#FEFBED] text-[#764B2E] text-xs px-4 py-2 rounded-lg mt-1 border border-[#F9EAA5] flex gap-2 items-center">
            <CircleAlert color="#C5731E" size={15} />
            <p>
              <span className="font-medium">NOTE:</span> Your catch phrase or
              niche mission max 100 characters.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-1 w-full">
          <label
            htmlFor="offerings"
            className="text-sm md:text-md font-medium text-[#1F2534]"
          >
            Business / Niche Offerings{" "}
            <span className="text-md md:text-lg text-[#D84D3E]">*</span>
          </label>

          <input
            type="text"
            value={offerings}
            onChange={handleChange}
            placeholder="Add your Business / Niche Offerings, it is located page center on the lander"
            name="offerings"
            required
            maxLength={60}
            className="bg-[#FBFCFD] border border-[#C6CFDC] focus:outline focus:outline-[#96c94b] focus:border py-3 px-3 w-full rounded-xl text-sm md:text-base"
          />
          <div className="bg-[#FEFBED] text-[#764B2E] text-xs px-4 py-2 rounded-lg mt-1 border border-[#F9EAA5] flex gap-2 items-center">
            <CircleAlert color="#C5731E" size={15} />
            <p>
              <span className="font-medium">NOTE:</span> Your offerings, a short
              note of who you are max 60 characters.
            </p>
          </div>
        </div>

        {offerings?.length > 0 && (
          <div className="flex flex-col gap-1 w-full">
            <label
              htmlFor=""
              className="text-sm md:text-md font-medium text-[#1F2534]"
            >
              Business / Areas Serviced{" "}
              <span className="text-md md:text-lg text-[#D84D3E]">*</span>
            </label>
            <OnboardServices onboard={onboard} setOnboard={setOnboard} />
          </div>
        )}
      </div>
    </div>
  );
}

export default OneboardOne;
