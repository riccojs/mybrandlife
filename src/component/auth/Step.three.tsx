import { useState, type SetStateAction } from "react";
import InputComponent from "../ui/Input.component";
import LocationSelect from "./Location.select";
import type { UserType } from "../../utils/user.types";
import PhoneSelect from "./Phone.select";

interface UsetTypes {
  user: UserType;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  setUser: React.Dispatch<SetStateAction<UserType>>;
}

function StepThree({ user, handleChange, setUser }: UsetTypes) {
  const { midName, firstName, lastName, privateDomain } = user || {};

  const [isShipping, setIsShipping] = useState(false);
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <label htmlFor="" className="text-sm font-normal text-black">
          First Name <span className="text-[#cf3832]">*</span>
        </label>
        <InputComponent
          placeholder="Enter Your First Name"
          type="text"
          value={firstName}
          handleChange={handleChange}
          name="firstName"
          autoComplete="firstName"
          required={true}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="" className="text-sm font-normal text-black">
          Middle Name <span className="text-sm font-normal">(optional)</span>
        </label>
        <InputComponent
          placeholder="Enter Your Middle Name"
          type="text"
          value={midName}
          handleChange={handleChange}
          name="midName"
          autoComplete="midName"
          required={false}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="" className="text-sm font-normal text-black">
          Last Name <span className="text-[#cf3832]">*</span>
        </label>
        <InputComponent
          placeholder="Enter Your Last Name"
          type="text"
          value={lastName}
          handleChange={handleChange}
          name="lastName"
          autoComplete="lastName"
          required={true}
        />
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-1">
          <h2 className="text-sm font-normal text-black">
            Primary Address <span className="text-[#cf3832]">*</span>
          </h2>
          <LocationSelect
            type="PRIMARY"
            onChange={(data) =>
              setUser((prev) => ({
                ...prev,
                primaryAddress: {
                  ...prev.primaryAddress,
                  ...data,
                },
              }))
            }
            value={user.primaryAddress}
          />
          <InputComponent
            placeholder="Enter your Postal Code."
            type="number"
            value={user?.primaryAddress?.zip}
            handleChange={(e) => {
              setUser((prev) => ({
                ...prev,
                primaryAddress: {
                  ...prev.primaryAddress,
                  zip: e.target.value,
                },
              }));
            }}
            name="zip"
            autoComplete="zip"
            required={false}
          />
          <InputComponent
            placeholder="Enter your Street or PO Box."
            type="text"
            value={user?.primaryAddress?.streetOne}
            handleChange={(e) => {
              setUser((prev) => ({
                ...prev,
                primaryAddress: {
                  ...prev.primaryAddress,
                  streetOne: e.target.value,
                },
              }));
            }}
            name="streetOne"
            autoComplete="streetOne"
            required={false}
          />
          <InputComponent
            placeholder="Enter Suite, Unit, Apt, or Leave Blank."
            type="text"
            value={user?.primaryAddress?.streetTow}
            handleChange={(e) => {
              setUser((prev) => ({
                ...prev,
                primaryAddress: {
                  ...prev.primaryAddress,
                  streetTow: e.target.value,
                },
              }));
            }}
            name="streetTow"
            autoComplete="streetTow"
            required={false}
          />
        </div>
        <div className="flex gap-2 items-center mt-5">
          <input
            type="checkbox"
            name=""
            checked={isShipping === true}
            id="address_type"
            disabled={
              !user?.primaryAddress?.country ||
              !user?.primaryAddress?.state ||
              !user?.primaryAddress?.city ||
              !user?.primaryAddress?.zip ||
              !user?.primaryAddress?.streetOne
            }
            onChange={(e) => {
              setIsShipping(e.target.checked);
              if (e.target.checked) {
                setUser((prev) => ({
                  ...prev,
                  shippingAddress: {
                    ...prev.shippingAddress,
                    city: user?.primaryAddress?.city,
                    zip: user?.primaryAddress?.zip,
                    country: user?.primaryAddress?.country,
                    streetOne: user?.primaryAddress?.streetOne,
                    streetTow: user?.primaryAddress?.streetTow,
                    state: user?.primaryAddress?.state,
                    type: "SHIPPING",
                  },
                }));
              } else {
                setUser((prev) => ({
                  ...prev,
                  shippingAddress: {
                    ...prev.shippingAddress,
                    city: "",
                    zip: "",
                    country: "",
                    streetOne: "",
                    streetTow: "",
                    state: "",
                    type: "SHIPPING",
                  },
                }));
              }
            }}
          />
          <label
            htmlFor="address_type"
            className="text-sm font-normal text-black"
          >
            Shipping address is the same as my primary address?
          </label>
        </div>
        <div className="flex flex-col gap-2 mt-5">
          <h2 className="text-sm font-normal text-black">
            Shipping Address <span className="text-[#cf3832]">*</span>
          </h2>
          <LocationSelect
            type="SHIPPING"
            value={isShipping ? user.primaryAddress : user.shippingAddress}
            disabled={isShipping}
            onChange={(data) =>
              setUser((prev) => ({
                ...prev,
                shippingAddress: {
                  ...prev.shippingAddress,
                  ...data,
                },
              }))
            }
          />

          <input
            type="number"
            value={user?.shippingAddress?.zip}
            onChange={(e) => {
              setUser((prev) => ({
                ...prev,
                shippingAddress: {
                  ...prev.shippingAddress,
                  zip: e.target.value,
                },
              }));
            }}
            placeholder="Enter your Postal Code."
            name="zip"
            disabled={isShipping}
            className={`bg-white border text-sm border-gray-300 focus:outline focus:outline-[#96c94b] focus:border py-3 px-3 w-full rounded-xl text-normal ${isShipping ? "text-[#8E8E8E]" : "text-black"}`}
          />
          <input
            type="text"
            value={user?.shippingAddress?.streetOne}
            onChange={(e) => {
              setUser((prev) => ({
                ...prev,
                shippingAddress: {
                  ...prev.shippingAddress,
                  streetOne: e.target.value,
                },
              }));
            }}
            placeholder="Enter your Street or PO Box."
            name="streetOne"
            disabled={isShipping}
            className={`bg-white border text-sm border-gray-300 focus:outline focus:outline-[#96c94b] focus:border py-3 px-3 w-full rounded-xl text-normal ${isShipping ? "text-[#8E8E8E]" : "text-black"}`}
          />
          <input
            type="text"
            value={user?.shippingAddress?.streetTow}
            onChange={(e) => {
              setUser((prev) => ({
                ...prev,
                shippingAddress: {
                  ...prev.shippingAddress,
                  streetTow: e.target.value,
                },
              }));
            }}
            placeholder="Enter Suite, Unit, Apt, or Leave Blank."
            name="streetTow"
            disabled={isShipping}
            className={`bg-white text-sm border border-gray-300 focus:outline focus:outline-[#96c94b] focus:border py-3 px-3 w-full rounded-xl text-normal ${isShipping ? "text-[#8E8E8E]" : "text-black"}`}
          />
        </div>
      </div>

      <PhoneSelect setUser={setUser} />

      <div className="flex flex-col gap-1 w-full">
        <label className="text-sm font-normal text-black">
          Do you own your own domain? Enter it here. (Optional)
        </label>
        <InputComponent
          placeholder="e.g. https://djdeville.com"
          type="url"
          value={privateDomain}
          handleChange={handleChange}
          name="privateDomain"
          autoComplete="privateDomain"
          required={false}
        />
        <p className="text-black bg-amber-50 px-3 py-2 text-sm mt-1 rounded-xl">
          WARNING! - Adding your domain will generate your QR CODE and VCF for
          this domain. Your domain can be edited on your dashboard under
          management → Onboarding. There, you will find links for instructions
          on how to forward your domain and manage your QR code.
        </p>
      </div>
    </div>
  );
}

export default StepThree;
