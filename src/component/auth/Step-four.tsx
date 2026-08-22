import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useCheckDiscountMutation } from "../../redux/features/onboard/onboardApi";
import AffiliateThanks from "../popups/Affiliate.thanks";
import { useSelector } from "react-redux";
import type store from "../../redux/app/store";
import type { UserType } from "../../utils/user.types";
import { LoaderCircle } from "lucide-react";

type RootState = ReturnType<typeof store.getState>;

interface Types {
  setUser: React.Dispatch<React.SetStateAction<UserType>>;
  user: UserType;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
}

function StepFour({ user, handleChange, setUser }: Types) {
  const [checkDiscount, { isLoading }] = useCheckDiscountMutation();
  const [discountCode, setDiscountCode] = useState<string>("");
  const state = useSelector((state: RootState) => state.onboard);
  const hasAffiliateCode = Boolean(state.affiliateCode?.length);
  const [isShow, setIsShow] = useState(hasAffiliateCode);
  const { aggreement, packageType, frequency } = user || {};

  const handleCheck = () => {
    if (!discountCode) {
      return;
    }
    if (isLoading) {
      return;
    }
    const data = { code: discountCode };
    checkDiscount(data)
      .unwrap()
      .then((res) => {
        toast.success(res.message);
        setDiscountCode("");
        setUser((prev) => ({
          ...prev,
          discount: res.discount,
          referalCode: res.discountCode,
          discountType: res.discountType,
        }));
        setIsShow(true);
      })
      .catch((error) => {
        const err = error as FetchBaseQueryError;
        const errorMessage = (err.data as { message: string }).message;
        toast.error(errorMessage);
      });
  };

  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDiscountCode(e.target.value);
  };

  useEffect(() => {
    if (state.affiliateCode?.length > 0) {
      setUser((prev) => ({
        ...prev,
        referalCode: state.affiliateCode,
        discountType: "MONTHLY",
        discount: 2,
      }));
    }
  }, [state, setUser]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <label htmlFor="" className="text-sm font-normal text-black">
              BrandShare Code (Optional)
            </label>
            <input
              type="text"
              placeholder="Enter affiliate discount code"
              disabled={packageType !== "gold" || frequency !== "yearly"}
              value={discountCode}
              onChange={handleDiscountChange}
              name="discountCode"
              autoComplete="discountCode"
              required={false}
              className="bg-white border border-gray-300 text-sm focus:outline focus:outline-[#96c94b] focus:border py-3 px-3 w-full rounded-xl text-normal"
            />
          </div>
          {packageType === "gold" && frequency === "yearly" && (
            <p className="text-black text-sm rounded-lg font-normal bg-amber-100 p-2 border-l-2 border-amber-400">
              NOTE: BrandShare codes are case-sensitive. Please enter the code
              exactly as provided.
            </p>
          )}
          {packageType === "gold" && frequency === "yearly" && (
            <p
              onClick={handleCheck}
              className={`h-12 w-60 flex justify-center items-center rounded-full  text-sm font-semibold text-black shadow-sm transition duration-200 active:scale-[1.01] ${isLoading ? "bg-[#6fa420] cursor-not-allowed" : "bg-[#96c94b] hover:bg-[#88c133] cursor-pointer"}`}
            >
              {isLoading ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                "Activate BrandShare"
              )}
            </p>
          )}
        </div>
        {(user?.packageType !== "gold" || user?.frequency !== "yearly") && (
          <p className="text-sm font-normal text-black italic mt-2 bg-green-100 p-3 rounded-md border-l-4 border-green-200">
            Enjoy 2 complimentary months through our BrandShare program —
            applicable only to the yearly Gold plans. Would you like to upgrade
            to the annual Gold plan to benefit from this? Change your plan
            <span
              onClick={() =>
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                })
              }
              className="font-semibold cursor-pointer underline ml-1"
            >
              Change your plan
            </span>
          </p>
        )}
      </div>

      <div className="flex gap-2 items-center w-full">
        <input
          type="checkbox"
          id="aggrement"
          required
          checked={aggreement}
          name="aggreement"
          onChange={handleChange}
        />
        <label
          htmlFor="aggrement"
          className="text-sm font-normal text-black cursor-pointer"
        >
          Accept{" "}
          <a
            target="_blank"
            className="hover:text-[#96c94b] hover:underline"
            href="http://mybrandlife.me/terms-condition"
          >
            Terms & Conditions
          </a>{" "}
          and{" "}
          <a
            target="_blank"
            className="hover:text-[#96c94b] hover:underline"
            href="http://mybrandlife.me/privacy-policy"
          >
            Privacy Policy
          </a>
        </label>
      </div>
      {isShow && (
        <AffiliateThanks
          showTab={isShow}
          setShowTab={setIsShow}
          code={user?.referalCode}
        />
      )}
    </div>
  );
}

export default StepFour;
