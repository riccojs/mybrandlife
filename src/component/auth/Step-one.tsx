import type { SetStateAction } from "react";
import domainData from "../../utils/domainData";
import SelectComponent from "../ui/Select.component";
import SelectDomain from "../ui/Select.domain";
import type { UserType } from "../../utils/user.types";
import BillingOption from "./Billing.option";

interface Types {
  notes: string;
  setUser: React.Dispatch<SetStateAction<UserType>>;
  user: {
    domain: string;
    packageType: string;
    frequency: string;
  };
}

type Frequency = {
  key: string;
  planKey: string;
  price: number;
  oldPrice: number;
};

type Package = {
  frequencies: Frequency[];
};

type Packages = {
  bronze: Package;
  silver: Package;
  gold: Package;
};

function StepOne({ notes, user, setUser }: Types) {
  const { domain, packageType, frequency } = user || [];
  const availablePackages =
    domain && domainData[domain as keyof typeof domainData]
      ? Object.keys(domainData[domain as keyof typeof domainData].packages)
      : [];

  const availableFrequencies: Frequency[] =
    domain && packageType
      ? domainData[domain as keyof typeof domainData]?.packages?.[
          packageType as keyof Packages
        ]?.frequencies || []
      : [];

  const domainOptions = Object.keys(domainData).map((key) => ({
    key: key,
    value: key,
  }));

  const packageOptions = availablePackages.map((key) => ({
    key: key,
    value: key,
  }));

  const handleDomainSelect = (value: string) => {
    setUser((prev) => ({
      ...prev,
      domain: value,
      packageType: "",
      frequency: "",
    }));
  };
  const handlePackageSelect = (value: string) => {
    setUser((prev) => ({
      ...prev,
      packageType: value,
      frequency: "",
    }));
  };

  const update = (key: string, value: string) => {
    setUser((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div
      className={`flex flex-col ${user?.packageType !== "gold" ? "gap-5 md:gap-0" : "gap-5"}`}
    >
      <div className="flex md:flex-row flex-col gap-5 w-full">
        <div className="flex flex-col gap-1 w-full">
          <label className="text-sm font-normal text-black">
            Choose Your Domain <span className="text-[#cf3832]">*</span>
          </label>
          <SelectDomain
            value={user.domain}
            label="Select domain"
            handleChange={handleDomainSelect}
            datas={domainOptions}
            color="#ffffff"
          />
        </div>

        {domain && (
          <div className="flex flex-col gap-1 w-full">
            <label className="text-sm font-normal text-black">
              Choose Your Package <span className="text-[#cf3832]">*</span>
            </label>
            <SelectComponent
              value={user.packageType}
              label="Select package"
              handleChange={handlePackageSelect}
              datas={packageOptions}
              color="#ffffff"
            />

            {user?.packageType !== "gold" && (
              <p className="text-xs font-normal text-gray-400 capitalize">
                upgrade to gold for the best value
              </p>
            )}
          </div>
        )}
      </div>
      {packageType && availableFrequencies && (
        <div className="flex flex-col gap-1 w-full">
          <label className="text-sm font-normal text-black">
            Billing Frequency <span className="text-[#cf3832]">*</span>
          </label>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {availableFrequencies.map((freq) => (
              <BillingOption
                title={freq?.key}
                price={freq?.price}
                badge={freq?.key === "yearly" ? "Best Value" : ""}
                selected={frequency === freq?.key}
                onClick={() => update("frequency", freq?.key)}
              />
            ))}
          </div>
          <p className="text-xs font-normal text-gray-400 capitalize">
            {notes}
          </p>
        </div>
      )}
    </div>
  );
}

export default StepOne;
