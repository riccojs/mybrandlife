import { useEffect, useRef, useState, type SetStateAction } from "react";
import InputComponent from "../ui/Input.component";
import PasswordComponent from "../ui/Password.component";
import type { UserType } from "../../utils/user.types";
import { useFindLandernameMutation } from "../../redux/features/auth/authApi";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { IoCloseCircleSharp } from "react-icons/io5";
import { FaCheckCircle } from "react-icons/fa";

interface UsetTypes {
  user: {
    email: string;
    password: string;
    landerName: string;
    domain: string;
  };
  setUser: React.Dispatch<SetStateAction<UserType>>;
  isError: boolean;
  conPassword: string;
  setConPassword: React.Dispatch<SetStateAction<string>>;
  setError: React.Dispatch<SetStateAction<boolean>>;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
}

function StepTow({
  user,
  setConPassword,
  conPassword,
  setError,
  isError,
  handleChange,
  setUser,
}: UsetTypes) {
  const { email, password, landerName } = user || {};
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [response, setResponse] = useState("");
  const [checking, setChecking] = useState(false);
  const [findLandername] = useFindLandernameMutation();

  const handlPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConPassword(e.target.value);
  };

  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  useEffect(() => {
    if (password?.length > 0 && conPassword.length > 0) {
      if (password !== conPassword) {
        setError(true);
      } else {
        setError(false);
      }
    } else {
      setError(false);
    }
  }, [password, conPassword, setError]);

  useEffect(() => {
    const landerName = user.landerName;

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (!landerName || landerName.length < 3) {
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        setChecking(true);

        const res = await findLandername({ landerName }).unwrap();

        setResponse(res.message);
      } catch (error) {
        const err = error as FetchBaseQueryError;

        const errorMessage =
          (err.data as { message?: string })?.message ??
          "Unable to check lander name";

        setResponse(errorMessage);
      } finally {
        setChecking(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [user.landerName, findLandername]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1 w-full">
        <label className="text-sm font-normal text-black">
          Email <span className="text-[#cf3832]">*</span>
        </label>
        <InputComponent
          placeholder="Enter email"
          type="email"
          value={email}
          handleChange={handleChange}
          name="email"
          autoComplete="email"
          required={true}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-normal text-black">
          Password <span className="text-[#cf3832]">*</span>
        </label>
        <PasswordComponent
          placeholder="Enter password"
          value={password}
          handleChange={handleChange}
          name="password"
          autoComplete="password"
          required={true}
          isError={isError}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-normal text-black">
          Confirm Password <span className="text-[#cf3832]">*</span>
        </label>
        <PasswordComponent
          placeholder="Confirm password"
          value={conPassword}
          handleChange={handlPasswordChange}
          name="password"
          autoComplete="password"
          required={true}
          isError={isError}
        />
        {password?.length > 0 && conPassword?.length > 0 ? (
          isError ? (
            <span className="text-red-500 flex gap-1 text-xs items-center">
              <IoCloseCircleSharp />
              <p>Password did not match!</p>
            </span>
          ) : (
            <span className="text-green-500 flex gap-1 text-xs items-center">
              <FaCheckCircle />
              <p>Password match!</p>
            </span>
          )
        ) : null}
        {password?.length > 0 ? (
          password?.length > 8 ? (
            <span className="text-green-500 flex gap-1 text-xs items-center">
              <FaCheckCircle />
              <p>Password has more then 8 characters.</p>
            </span>
          ) : (
            <span className="text-red-500 flex gap-1 text-xs items-center">
              <IoCloseCircleSharp />
              <p>Password must be at least 8 characters.</p>
            </span>
          )
        ) : null}
        {password?.length > 0 ? (
          hasSpecialChar ? (
            <span className="text-green-500 flex gap-1 text-xs items-center">
              <FaCheckCircle />
              <p>Password secured</p>
            </span>
          ) : (
            <span className="text-red-500 flex gap-1 text-xs items-center">
              <IoCloseCircleSharp />
              <p>Password must include at least one special character.</p>
            </span>
          )
        ) : null}
      </div>

      <div className="flex flex-col gap-1 w-full">
        <label className="text-sm font-normal text-black">
          Lander Name <span className="text-[#cf3832]">*</span>
        </label>
        <span>
          <InputComponent
            placeholder="Chose your name"
            type="text"
            value={landerName}
            handleChange={(e) => {
              const value = e.target.value
                .toLowerCase()
                .replace(/[^a-z0-9-]/g, "");
              if (value?.length >= 20) return;
              setUser((prev) => ({ ...prev, landerName: value }));
            }}
            name="landerName"
            autoComplete="landerName"
            required={true}
          />
          <p className="text-sm font-normal mt-2">
            {user.domain && `https://${user.domain}.me/${user.landerName}`}

            {checking && <span className="ml-2 text-gray-400">Checking…</span>}

            {!checking && response && (
              <span
                className={`ml-2 text-sm ${
                  response === "Lander available"
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                {response === "Lander available" ? (
                  <i className="fa-regular fa-circle-check"></i>
                ) : (
                  <i className="fa-regular fa-circle-xmark"></i>
                )}{" "}
                {response}
              </span>
            )}
          </p>
        </span>
        <p className="text-black bg-amber-50 p-3 text-sm mt-1 rounded-xl">
          Warning: The lander name must be lowercase, contain no spaces or
          special characters, and be fewer than 20 characters. “-“ are allowed.
        </p>
        <p className="text-black bg-amber-50 px-3 py-2 text-sm mt-1 rounded-xl break-all">
          Note: your lander name is your page name and part of BrandShare if
          valid. Your page path will be, for example:
          https://ChoosenDomain.me/nameyoutypein
        </p>
      </div>
    </div>
  );
}

export default StepTow;
