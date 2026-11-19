import { useState } from "react";
import DeactivateWarn from "./Deactivate.warn";
import { ArrowRight } from "lucide-react";

function DeactivateAccount() {
  const [isShow, setIsShow] = useState(false);
  return (
    <div className="bg-white p-5 md:p-10 border border-gray-200 rounded-2xl shadow mt-5">
      <div className="flex flex-col gap-5 justify-start">
        <p className="text-gray-700 text-medium text-base md:text-xl">
          Deactivate Your Account?
        </p>
        <p className="bg-[#FFFCF0] text-[#7C3E16] border-2 border-[#FCF2C6] p-5 text-sm font-normal rounded-lg w-fit">
          Deactivating your account will also deactivate your membership and
          onboarding access. Please make sure you want to continue before
          proceeding.
        </p>
        <button
          type="button"
          onClick={() => {
            setIsShow(true);
          }}
          className="bg-[#96c94b] mt-3 cursor-pointer text-[#000000] flex justify-center items-center gap-1 min-w-44 w-44 h-12 rounded-lg"
        >
          <p>Deactivate</p>
          <ArrowRight size={20} />
        </button>
      </div>
      {isShow && <DeactivateWarn isShow={isShow} setShow={setIsShow} />}
    </div>
  );
}

export default DeactivateAccount;
