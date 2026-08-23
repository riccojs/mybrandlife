import { useState } from "react";
import Logo from "../assets/MBL_Logo_CROP.png";
import { Link } from "react-router";
import toast from "react-hot-toast";
import { useLoginMutation } from "../redux/features/auth/authApi";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { LoaderCircle } from "lucide-react";
import InputComponent from "../component/ui/Input.component";
import PasswordComponent from "../component/ui/Password.component";

interface TypesOf {
  email: string;
  password: string;
}

function Login() {
  const redirectUrl = import.meta.env.VITE_APP_REDIRECT_ROUTE;
  const [login, { isLoading }] = useLoginMutation();
  const [user, setUser] = useState<TypesOf>({
    email: "",
    password: "",
  });
  const { email, password } = user || {};

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    login(user)
      .unwrap()
      .then((res) => {
        setUser({
          email: "",
          password: "",
        });
        toast.success(res.message);
        localStorage.removeItem("email");
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
                Welcome Back!
              </h2>
              <p className="mt-1 text-sm leading-5 text-[#171926]/50 text-center">
                Please sign in using the email address and password associated
                with your registered account. Make sure you enter the same
                credentials you used when creating your account. If the
                information provided does not match an existing account in our
                system, you will not be able to sign in.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="mt-10">
              <div className="mt-5">
                <label
                  htmlFor="email"
                  className="mb-1 block text-[13px] font-medium text-[#252525]"
                >
                  Email
                </label>
                <InputComponent
                  placeholder="example@gmail.com"
                  type="email"
                  value={email}
                  handleChange={handleChange}
                  name="email"
                  autoComplete="email"
                  required={true}
                />
              </div>
              <div className="mt-4">
                <label
                  htmlFor="password"
                  className="mb-1 block text-[13px] font-medium text-[#252525]"
                >
                  Password
                </label>
                <PasswordComponent
                  placeholder="XXXXXXXXXX"
                  value={password}
                  handleChange={handleChange}
                  name="password"
                  autoComplete="password"
                  required={true}
                  isError={false}
                />
                <Link
                  to="/auth/reset"
                  className="text-xs font-normal inline-block mt-5 text-black/50 hover:underline"
                >
                  Forget Password
                </Link>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className={`mt-7 h-12 w-full flex justify-center items-center rounded-full  text-sm font-semibold text-black shadow-sm transition duration-200 active:scale-[0.95] ${isLoading ? "bg-[#6fa420] cursor-not-allowed" : "bg-[#96c94b] hover:bg-[#88c133] cursor-pointer"}`}
              >
                {isLoading ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  "Sign In"
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
        </div>
      </div>
    </section>
  );
}

export default Login;
