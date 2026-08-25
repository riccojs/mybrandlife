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
      className={`relative bg-[#F3F3F3] border text-base border-gray-300 focus-within:border-[#96c94b] focus-within:border py-3 px-3 w-full rounded-xl ${
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
        className="text-normal text-base outline-none w-full"
      />
      {showPass ? (
        <i
          className="fa-regular fa-eye absolute top-4 right-3 cursor-pointer"
          onClick={() => setShowPass(false)}
        ></i>
      ) : (
        <i
          className="fa-regular fa-eye-slash absolute top-4 right-3 cursor-pointer"
          onClick={() => setShowPass(true)}
        ></i>
      )}
    </div>
  );
}

export default PasswordComponent;
