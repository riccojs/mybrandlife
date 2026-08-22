import React, { useEffect, useState, type ChangeEvent } from "react";
import toast from "react-hot-toast";
import type { UserSettingType } from "../../utils/user.types";

interface Props {
  setUser: React.Dispatch<React.SetStateAction<UserSettingType>>;
  user: UserSettingType;
}

type CountryType = {
  name: string;
  code: string;
  flag: string;
};

const countries: CountryType[] = [
  { name: "USA", code: "+1", flag: "🇺🇸" },
  { name: "CANADA", code: "+1", flag: "🇨🇦" },
];

function UpdatePhone({ setUser, user }: Props) {
  const [country, setCountry] = useState<CountryType | null>(null);
  const [isShow, setIsShow] = useState(false);

  useEffect(() => {
    if (user.phoneCode) {
      const selected = countries.find((c) => c.code === user.phoneCode);
      if (selected) {
        setCountry(selected);
      }
    }
  }, [user.phoneCode]);

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 10);

    if (digits.length <= 3) return digits;

    if (digits.length <= 6) {
      return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    }

    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  };

  const handleCountrySelect = (c: CountryType) => {
    setCountry(c);
    setIsShow(false);

    setUser((prev) => ({
      ...prev,
      phoneCode: c.code,
      phone: "",
    }));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!country) {
      toast.error("Select country first!");
      return;
    }

    const formatted = formatPhone(e.target.value);

    setUser((prev) => ({
      ...prev,
      phone: formatted,
    }));
  };
  return (
    <div className="relative flex flex-col gap-1">
      <label className="text-md font-normal">Phone Number</label>

      <div className="relative">
        <input
          type="tel"
          placeholder="XXX-XXX-XXXX"
          className="w-full bg-[#F1F1F1] border border-gray-200 pl-16 h-13 rounded-xl outline-none focus:outline-4 focus:outline-[#C3DEED] "
          value={user.phone}
          onChange={handleChange}
        />
        <div
          className="flex items-center gap-1 bg-white w-14 px-2 justify-center absolute top-0 left-0 h-full cursor-pointer rounded-xl border border-gray-200"
          onClick={() => setIsShow(!isShow)}
        >
          {country ? (
            <span>{country.flag}</span>
          ) : (
            <span className="text-xs text-gray-500">XX</span>
          )}
          <i
            className={`text-[10px] fa-solid ${
              isShow ? "fa-caret-down" : "fa-caret-up"
            }`}
          />
        </div>
        {isShow && (
          <div className="absolute top-12.5 bg-white w-full rounded-lg shadow-md z-10">
            <ul>
              {countries.map((c) => (
                <li
                  key={c.name}
                  onClick={() => handleCountrySelect(c)}
                  className="flex gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  <span>{c.flag}</span>
                  <span>{c.name}</span>
                  <span className="text-gray-400">{c.code}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <p className="text-black bg-amber-50 px-3 py-2 text-sm mt-1 rounded-xl">
        Country code must be selected before entering the phone number.
      </p>
    </div>
  );
}

export default UpdatePhone;
