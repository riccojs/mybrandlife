import { useState } from "react";
import DeactivateWarn from "./Deactivate.warn";
import { ArrowRight } from "lucide-react";

function DeactivateAccount() {
  const [isShow, setIsShow] = useState(false);
  return (
    <div className="bg-white p-10 border border-gray-200 rounded-xl mt-5">
      <div className="flex flex-col gap-5 justify-start">
        <p className="text-gray-700 text-medium text-xl">
          Deactivate Your Account?
        </p>
        <p className="bg-amber-50 text-black p-3 rounded-lg text-md font-normal w-full sm:w-8/12 lg:w-6/12 border-l-4 border-amber-300">
          Deactivating your account will also deactivate your membership and
          onboarding access. Please make sure you want to continue before
          proceeding.
        </p>
        <button
          type="button"
          onClick={() => {
            setIsShow(true);
          }}
          className="bg-[#BDF188] text-[#000000] flex justify-center items-center gap-1 w-fit border border-[#76c725] px-10 py-4 rounded-2xl cursor-pointer"
        >
          <p>Deactivate</p>
          <ArrowRight />
        </button>
      </div>
      {isShow && <DeactivateWarn isShow={isShow} setShow={setIsShow} />}
    </div>
  );
}

export default DeactivateAccount;
