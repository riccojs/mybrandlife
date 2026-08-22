import { EyeIcon, EyeOffIcon } from "lucide-react";
import React, { useState } from "react";

interface Types {
  value: string;
  placeholder: string;
  name: string;
  autoComplete: string;
  required: boolean;
  isError: boolean;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

function PasswordComponent({
  value,
  handleChange,
  placeholder,
  name,
  autoComplete,
  required,
  isError,
}: Types) {
  const [showPass, setShowPass] = useState<boolean>(false);
  return (
    <div
      tabIndex={0}
      className={`relative bg-white text-sm border border-gray-300 focus-within:border-[#96c94b] focus-within:border py-3 px-3 w-full rounded-xl ${
        isError ? "border-red-500" : ""
      }`}
    >
      <input
        type={showPass ? "text" : "password"}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        required={required}
        autoComplete={autoComplete}
        className="text-normal text-sm outline-none w-full"
      />
      {showPass ? (
        <EyeOffIcon
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#777] cursor-pointer"
          onClick={() => setShowPass(false)}
          size={20}
        />
      ) : (
        <EyeIcon
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#777] cursor-pointer"
          onClick={() => setShowPass(true)}
          size={20}
        />
      )}
    </div>
  );
}

export default PasswordComponent;
