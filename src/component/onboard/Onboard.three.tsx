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
      <p className="text-2xl font-medium text-black mt-5">
        Step 3: Available Platforms and Information
      </p>
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
