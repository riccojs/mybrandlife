import { Link, useNavigate, useParams } from "react-router";
import Logo from "../assets/MBL_Logo_CROP.png";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useState } from "react";
import { useResetUserMutation } from "../redux/features/auth/authApi";
import toast from "react-hot-toast";
import PasswordComponent from "../component/ui/Password.component";
import { LoaderCircle } from "lucide-react";
import { FaCheckCircle } from "react-icons/fa";
import { IoCloseCircleSharp } from "react-icons/io5";

interface TypesOf {
  password: string;
  token: string;
}

function ResetPassword() {
  const redirectUrl = import.meta.env.VITE_APP_REDIRECT_ROUTE;
  const params = useParams();
  const token = params.token;
  const [resetUser, { isLoading }] = useResetUserMutation();
  const [user, setUser] = useState<TypesOf>({
    password: "",
    token: token ?? "",
  });
  const [conPassword, setConPassword] = useState<string>("");
  const navigate = useNavigate();
  const { password } = user || {};

  const isError =
    password?.length > 0 && conPassword.length > 0 && password !== conPassword;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== conPassword) {
      toast.error("Password did not match!");
      return;
    }
    if (password?.length < 8) {
      toast.error("Password too short!");
      return;
    }
    if (!hasSpecialChar) {
      toast.error("Please fix the errors.");
      return;
    }
    resetUser(user)
      .unwrap()
      .then((res) => {
        toast.success(res.message);
        setUser({
          password: "",
          token: "",
        });
        setConPassword("");
        navigate("/auth/login");
      })
      .catch((error) => {
        const err = error as FetchBaseQueryError;
        const errorMessage = (err.data as { message: string }).message;
        toast.error(errorMessage);
      });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handlPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConPassword(e.target.value);
  };

  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return (
    <section>
      <div className="z-10 flex justify-center items-center md:min-h-screen py-10 md:py-0">
        <div className="flex flex-1 flex-col items-center p-0 md:p-5">
          <div className="w-full max-w-114.5 rounded-3xl shadow-lg bg-white px-8 py-7 border border-gray-200 sm:px-10 sm:py-8">
            <div className="flex flex-col justify-center items-center gap-2">
              <Link to="/">
                <img src={Logo} alt="" className="w-24" />
              </Link>
              <h2 className="text-3xl font-medium leading-tight tracking-[-0.035em] text-[#171926]">
                Change Password!
              </h2>

              <p className="mt-1 text-sm leading-5 text-[#171926]/50 text-center">
                Please enter a valid email address associated with an existing
                account. Password reset requests can only be processed for
                registered email addresses. If the email is not found in our
                system, you will receive an error message.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="mt-10">
              <div className="flex flex-col gap-1 w-full mt-5">
                <label htmlFor="" className="text-sm font-normal text-black">
                  Password
                </label>
                <PasswordComponent
                  placeholder="Enter password"
                  value={password}
                  handleChange={handleChange}
                  name="password"
                  autoComplete="password"
                  required={true}
                  isError={false}
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
                      <p>
                        Password must include at least one special character.
                      </p>
                    </span>
                  )
                ) : null}
              </div>
              <div className="flex flex-col gap-1 w-full mt-5">
                <label htmlFor="" className="text-sm font-normal text-black">
                  Confirm Password
                </label>
                <PasswordComponent
                  placeholder="Confirm password"
                  value={conPassword}
                  handleChange={handlPasswordChange}
                  name="password"
                  autoComplete="password"
                  required={true}
                  isError={false}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`mt-5 h-12 w-full flex justify-center items-center rounded-full  text-sm font-semibold text-black shadow-sm transition duration-200 active:scale-[0.95] ${isLoading ? "bg-[#6fa420] cursor-not-allowed" : "bg-[#96c94b] hover:bg-[#88c133] cursor-pointer"}`}
              >
                {isLoading ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  "Submit"
                )}
              </button>
              <p className="mt-4 text-center text-xs leading-5 text-black/50">
                By signing up, you acknowledge that you have read and
                understood, and agree to Atlassian's{" "}
                <a
                  href={`${redirectUrl}/terms-condition`}
                  target="_blank"
                  className="text-[#cf3832] underline underline-offset-2"
                >
                  Terms
                </a>{" "}
                and{" "}
                <a
                  href={`${redirectUrl}/privacy-policy`}
                  target="_blank"
                  className="text-[#cf3832] underline underline-offset-2"
                >
                  Privacy Policy
                </a>
                .
              </p>
            </form>
          </div>

          <div className="mt-12 text-center text-[13px]">
            <span>Already change your password? </span>
            <Link
              to="/auth/login"
              className="font-medium text-[#cf3832] underline underline-offset-2"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ResetPassword;
