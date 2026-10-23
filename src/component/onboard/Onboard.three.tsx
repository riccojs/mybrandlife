import { useRef, useState, type SetStateAction } from "react";
import PersonalCollaps from "./Personal.collaps";
import SocialCollaps from "./Social.collaps";
import CustomCollaps from "./Custom.collaps";
import type { OnboardTypes } from "../../utils/user.types";
import { useAuth } from "../../hook/useAuth";
import MerchOnboardNote from "../popups/Merch.onboard.note";

interface DataTypes {
  onboard: OnboardTypes;
  setOnboard: React.Dispatch<SetStateAction<OnboardTypes>>;
}
interface UserType {
  package?: string;
  landerName: string;
  id: string;
  domain: string;
  firstName: string;
  lastName: string;
}
function OneboardThree({ setOnboard, onboard }: DataTypes) {
  const { user } = useAuth() as { user: UserType | null };
  const [showTab, setShowTab] = useState(false);
  const [showSocial, setShowSocial] = useState(false);
  const tabRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="w-full">
      <div className="flex md:flex-row flex-col w-full justify-between items-start md:items-center gap-1">
        <div>
          <h2 className="text-lg md:text-xl font-medium text-black mt-5">
            Step 2: Available Platforms and Information
          </h2>
          <p className="text-[#64748b] text-xs font-normal">
            Select the platforms included in your plan and add the correct URLs
            for each one.
          </p>
        </div>
        <div className="bg-[#F0F3F8] flex gap-1 items-center rounded-lg px-3">
          <p className="text-[#D84D3E] text-md md:text-xl mt-2">*</p>
          <p className="text-xs text-[#41495A]">Required Fields</p>
        </div>
      </div>
      <PersonalCollaps user={user} />
      <SocialCollaps
        user={user}
        setShowSocial={setShowSocial}
        showSocial={showSocial}
        tabRef={tabRef}
        setOnboard={setOnboard}
        onboard={onboard}
      />
      <CustomCollaps
        user={user}
        onboard={onboard}
        setOnboard={setOnboard}
        setShowSocial={setShowSocial}
        setShowTab={setShowTab}
        showSocial={showSocial}
        tabRef={tabRef}
      />
      {showTab && (
        <MerchOnboardNote setShowTab={setShowTab} showTab={showTab} />
      )}
    </div>
  );
}

export default OneboardThree;
