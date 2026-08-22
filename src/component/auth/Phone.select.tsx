import React, { useState, type ChangeEvent } from "react";
import toast from "react-hot-toast";
import type { UserType } from "../../utils/user.types";

interface Props {
  setUser: React.Dispatch<React.SetStateAction<UserType>>;
}

type CountryType = {
  name: string;
  code: string;
  flag: string;
};

function PhoneSelect({ setUser }: Props) {
  const [country, setCountry] = useState<CountryType | null>(null);
  const [tel, setTel] = useState("");
  const [isShow, setIsShow] = useState(false);

  const countries: CountryType[] = [
    { name: "USA", code: "+1", flag: "🇺🇸" },
    { name: "CANADA", code: "+1", flag: "🇨🇦" },
  ];

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
      phone: "",
      phoneCode: c.code,
    }));
    setTel("");
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!country) {
      toast.error("Select country first!");
      return;
    }
    const raw = e.target.value.replace(/\D/g, "");
    const formatted = formatPhone(raw);
    setTel(formatted);
    setUser((prev) => ({
      ...prev,
      phone: formatted,
    }));
  };

  return (
    <div className="relative flex flex-col gap-1">
      <label className="text-sm font-normal">
        Enter your phone Number <span className="text-[#cf3832]">*</span>
      </label>

      <div className="relative">
        <input
          type="tel"
          placeholder="XXX-XXX-XXXX"
          className="w-full bg-[#F1F1F1] border border-gray-200 pl-16 h-12 text-sm rounded-xl outline-none focus:outline-4 focus:outline-[#C3DEED] "
          value={tel}
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
          <div className="absolute top-12.5 bg-white w-full rounded-lg overflow-hidden shadow-md z-10">
            <ul>
              {countries.map((c) => (
                <li
                  key={c.name}
                  onClick={() => handleCountrySelect(c)}
                  className="flex gap-2 p-3 text-sm hover:bg-[#F1F1F1] cursor-pointer"
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

export default PhoneSelect;
