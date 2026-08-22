import { useEffect, useRef, useState } from "react";
import { FiCheck, FiHeadphones, FiAlertTriangle } from "react-icons/fi";
import {
  useSendOtpCodeMutation,
  useVerifyUserMutation,
} from "../redux/features/auth/authApi";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router";
import { LoaderCircle } from "lucide-react";

const VerifyEmail = () => {
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const [hasResent, setHasResent] = useState(false);
  const [timeLeft, setTimeLeft] = useState(2);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const formattedTime = `${String(Math.floor(timeLeft / 60)).padStart(
    2,
    "0",
  )}:${String(timeLeft % 60).padStart(2, "0")}`;
  const [verifyUser, { isLoading }] = useVerifyUserMutation();
  const [sendOtpCode, { isLoading: isSendLoad }] = useSendOtpCodeMutation();
  const auth = localStorage.getItem("email");
  const email = auth ? JSON?.parse(auth) : "";
  const navigate = useNavigate();

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleVerify = async (verificationCode: string) => {
    const user = { code: verificationCode };
    verifyUser(user)
      .unwrap()
      .then((res) => {
        toast.success(res.message);
        setCode(["", "", "", "", "", ""]);
        localStorage.removeItem("email");
        navigate("/dashboard");
      })
      .catch((error) => {
        const err = error as FetchBaseQueryError;
        const errorMessage = (err.data as { message: string }).message;
        toast.error(errorMessage);
        setCode(["", "", "", "", "", ""]);
      });
  };

  const handleChange = (index: number, value: string) => {
    const numericValue = value.replace(/\D/g, "");
    if (!numericValue) {
      setCode((prev) => {
        const newCode = [...prev];
        newCode[index] = "";
        return newCode;
      });
      return;
    }
    const digit = numericValue.slice(-1);
    const newCode = [...code];
    newCode[index] = digit;
    setCode(newCode);
    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
    if (index === 5 && newCode.every(Boolean)) {
      handleVerify(newCode.join(""));
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (!pasted) return;
    const newCode = [...code];
    pasted.split("").forEach((digit, index) => {
      newCode[index] = digit;
    });
    setCode(newCode);
    const nextIndex = Math.min(pasted.length, 5);
    inputRefs.current[nextIndex]?.focus();
    if (pasted.length === 6) {
      handleVerify(pasted);
    }
  };

  const handleResend = () => {
    if (timeLeft > 0 || hasResent) return;
    setCode(["", "", "", "", "", ""]);
    const user = { email: email };
    if (email) {
      sendOtpCode(user)
        .unwrap()
        .then((res) => {
          toast.success(res.message);
          setHasResent(true);
          setTimeLeft(0);
        })
        .catch((error) => {
          const err = error as FetchBaseQueryError;
          const errorMessage = (err.data as { message: string }).message;
          toast.error(errorMessage);
          setTimeLeft(0);
        });
    } else {
      toast.error("Email invalid!");
    }
  };

  useEffect(() => {
    if (!email) {
      navigate("/auth/login");
    }
  }, [email, navigate]);

  return (
    <section className="min-h-screen bg-white px-4 py-8 sm:px-6 lg:px-8">
      <div className="z-10 mx-auto w-full max-w-200">
        <section className="rounded-xl border border-gray-200 bg-white px-5 py-8 shadow-lg sm:px-10 sm:py-10 lg:px-14">
          <div className="mb-1 flex justify-center px-2 sm:mb-2">
            <div className="relative flex h-32 w-full max-w-55 items-center justify-center sm:h-36 sm:max-w-65">
              <span className="absolute left-4 top-12 h-1.5 w-1.5 rounded-full bg-[#73c43e] sm:left-5 sm:top-13 sm:h-2 sm:w-2" />
              <span className="absolute left-10 top-6 h-1 w-1 rounded-full bg-[#8bd45c] sm:left-12 sm:top-7 sm:h-1.5 sm:w-1.5" />
              <span className="absolute right-9 top-8 h-1.5 w-1.5 rounded-full bg-[#8ccf50] sm:right-10 sm:top-9 sm:h-2 sm:w-2" />
              <span className="absolute right-5 top-18 h-1 w-1 rounded-full bg-[#f6b51d] sm:right-6 sm:top-20 sm:h-1.5 sm:w-1.5" />
              <span className="absolute bottom-7 left-11 h-1.5 w-1.5 rounded-full bg-[#a4d85e] sm:bottom-8 sm:left-13 sm:h-2 sm:w-2" />
              <div className="relative z-10 mt-3">
                <div className="relative h-16 w-28 rounded-lg bg-linear-to-b from-[#d7f5c5] to-[#9ce17b] shadow-[0_8px_20px_rgba(90,180,50,0.18)] sm:h-18 sm:w-32">
                  <div className="absolute left-1/2 -top-6 h-13 w-18 -translate-x-1/2 rounded-md bg-white shadow-sm sm:-top-7 sm:h-14 sm:w-20">
                    <div className="px-3 pt-3 sm:px-4 sm:pt-3.5">
                      <div className="mb-1.5 h-1 w-9 rounded-full bg-[#dce2e6] sm:w-10" />
                      <div className="mb-1.5 h-1 w-12 rounded-full bg-[#e4e8eb] sm:w-14" />
                      <div className="h-1 w-8 rounded-full bg-[#e4e8eb] sm:w-9" />
                    </div>
                  </div>
                  <div className="absolute left-0 top-0 h-10 w-full overflow-hidden sm:h-11">
                    <div className="absolute left-1/2 -top-6 h-14 w-14 -translate-x-1/2 rotate-45 rounded-md bg-[#b7eba0] sm:-top-7 sm:h-16 sm:w-16" />
                  </div>
                  <div className="absolute left-1/2 top-1/2 z-20 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#65bd27] text-white shadow-[0_5px_12px_rgba(80,170,30,0.3)] sm:h-11 sm:w-11">
                    <FiCheck
                      size={22}
                      strokeWidth={3}
                      className="sm:h-6 sm:w-6"
                    />
                  </div>
                </div>
                <div className="absolute -right-19 top-2 rotate-[-8deg] sm:-right-21 sm:top-2">
                  <div className="h-0 w-0 border-b-14 border-l-38 border-b-transparent border-l-[#96c94b] sm:border-b-16 sm:border-l-42" />
                </div>
                <div className="absolute -right-22 top-11 h-9 w-17 rounded-full border-b-2 border-dashed border-[#96c94b] sm:-right-25 sm:top-12 sm:h-10 sm:w-19" />
              </div>
            </div>
          </div>
          <h1 className="text-center text-[30px] font-semibold tracking-[-1px] text-[#172039] sm:text-[24px]">
            Check your <span className="text-[#54a928]">email inbox.</span>
          </h1>
          <div className="mt-3 flex items-center gap-4 rounded-[9px] border-l-[3px] border-amber-300 bg-amber-100 p-3">
            <div className="text-[#f2ad00]">
              <FiAlertTriangle size={21} strokeWidth={2.5} />
            </div>
            <p className="text-sm font-medium leading-5 text-[#20252c]">
              If the verification code is not visible in your primary inbox,
              please check your junk or spam folder.
            </p>
          </div>
          <div className="mx-auto mt-5 max-w-165 text-center">
            <p className="text-sm leading-6 text-[#283144] sm:text-[15px]">
              Verify your account. A 6-digit verification code has been sent to{" "}
              <strong className="font-semibold text-[#4b9e25]">{email}</strong>.
              Please enter the code below to proceed. If you did not receive the
              code, you can resend it after 2:00 min.
            </p>
            <p className="text-sm leading-6 text-[#283144] sm:text-[15px]">
              Note: You have only one opportunity to request a new code.
            </p>
          </div>

          <div className="text-center mt-10">
            <label className="text-[15px] font-semibold text-[#252d3d]">
              Enter 6-digit verification code
            </label>
            <div className="mt-5 flex justify-center gap-2 sm:gap-3">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className={`h-13.5 w-10.5 rounded-lg border bg-white text-center text-[22px] font-semibold text-[#182033] outline-none transition-all sm:h-14.5 sm:w-13 ${
                    digit
                      ? "border-[#76bd4d] shadow-[0_0_0_3px_rgba(118,189,77,0.08)]"
                      : "border-[#d8dee5]"
                  } focus:border-[#69b83c] focus:ring-[3px] focus:ring-[#69b83c]/10`}
                  aria-label={`Verification digit ${index + 1}`}
                />
              ))}
            </div>
          </div>
          <div className="flex justify-center items-center w-full mt-5">
            {isLoading && <LoaderCircle className="animate-spin" size={30} />}
          </div>
          <div className="mt-6 flex items-center justify-center gap-2 text-[14px] sm:text-[15px]">
            <span className="text-[#283144]">Didn't receive the code?</span>
            <button
              type="button"
              disabled={timeLeft > 0}
              onClick={handleResend}
              className={`font-semibold transition ${
                timeLeft > 0
                  ? "cursor-not-allowed text-[#a5acb7]"
                  : "cursor-pointer text-[#4b9e25] hover:text-[#39851a] hover:underline"
              }`}
            >
              {isSendLoad ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : hasResent ? (
                "Resend limit reached"
              ) : (
                "Resend code"
              )}
            </button>
            {timeLeft > 0 && (
              <span className="text-[#7b8492]">{formattedTime}</span>
            )}
          </div>
          <div className="mt-7 flex items-center gap-4 rounded-[10px] bg-[#eef8e8] px-5 py-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e0f4d6] text-[#54a928]">
              <FiHeadphones size={21} />
            </div>
            <div>
              <p className="text-sm leading-5 text-[#343b46] sm:text-[14px]">
                If you still do not receive a code after resending, please
                contact our support team.
              </p>
              <a
                href="mailto:support@mybrandlife.me"
                className="mt-0.5 inline-block text-sm font-semibold text-[#4b9e25] hover:underline sm:text-[15px]"
              >
                info@mybrandlife.me
              </a>
            </div>
          </div>
        </section>
        <div className="mt-12 text-center text-[13px]">
          <span>Already Verified OTP? </span>
          <Link
            to="/auth/login"
            className="font-medium text-[#cf3832] underline underline-offset-2"
          >
            Sign In
          </Link>
        </div>
      </div>
    </section>
  );
};

export default VerifyEmail;
