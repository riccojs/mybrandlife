import { Link } from "react-router";
import Logo from "../assets/MBL_Logo_CROP.png";
import { useState } from "react";
import StepOne from "../component/auth/Step-one";
import StepTow from "../component/auth/Step-tow";
import StepThree from "../component/auth/Step.three";
import StepFour from "../component/auth/Step-four";
import toast from "react-hot-toast";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useRegisterMutation } from "../redux/features/auth/authApi";
import type store from "../redux/app/store";
import { useSelector } from "react-redux";
import type { UserType } from "../utils/user.types";
import SummaryCard from "../component/auth/Summary.card";
import { FiCalendar, FiGlobe } from "react-icons/fi";
import { LoaderCircle } from "lucide-react";

type RootState = ReturnType<typeof store.getState>;

function Register() {
  const [register, { isLoading }] = useRegisterMutation();
  const [notes, setNotes] = useState<string>("");
  const [isError, setError] = useState(false);
  const [conPassword, setConPassword] = useState<string>("");
  const state = useSelector((state: RootState) => state.onboard);
  const { domain, pkgType, frequencie, planKey, planPrice, planOldPrice } =
    state || {};
  const [user, setUser] = useState<UserType>({
    domain: domain ?? "",
    packageType: pkgType ?? "",
    planKey: planKey ?? "",
    planPrice: planPrice ?? 0,
    planOldPrice: planOldPrice ?? 0,
    frequency: frequencie ?? "",
    email: "",
    password: "",
    landerName: "",
    midName: "",
    firstName: "",
    lastName: "",
    phone: "",
    aggreement: false,
    discount: 0,
    discountType: "",
    referalCode: "",
    phoneCode: "",
    privateDomain: "",
    username: "",
    profile: null,
    primaryAddress: {
      state: "",
      city: "",
      country: "",
      zip: "",
      streetOne: "",
      streetTow: "",
      type: "PRIMARY",
    },
    shippingAddress: {
      state: "",
      city: "",
      country: "",
      zip: "",
      streetOne: "",
      streetTow: "",
      type: "SHIPPING",
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    const regex = /^[a-zA-Z0-9]*$/;

    const isChecked =
      e.target instanceof HTMLInputElement && type === "checkbox"
        ? e.target.checked
        : undefined;
    if (value === "yearly") {
      setNotes(
        "Thank you for choosing the yearly plan. Receive 2 additional months at no extra cost when a valid referral code is used.",
      );
    }
    if (value === "monthly") {
      setNotes("Subscribe yearly and receive 2 additional months free.");
    }
    if (value === "request_a_domain_not_listed") {
      return;
    }
    if (name === "landerName" && !regex.test(value)) {
      toast.error("Spaces or special characters are not allowed.");
      return;
    }

    if (name === "domain") {
      setUser((prev) => ({
        ...prev,
        frequency: "",
        packageType: "",
      }));
    }
    if (name === "packageType") {
      setUser((prev) => ({
        ...prev,
        frequency: "",
        planKey: "",
        planPrice: 0,
        planOldPrice: 0,
      }));
    }
    let planKey = user.planKey;
    let planPrice = user.planPrice;
    let planOldPrice = user.planOldPrice;
    if (name === "frequency" && e.target instanceof HTMLInputElement) {
      planKey = e.target.getAttribute("data-plan-key") || planKey;
      planPrice = Number(e.target.getAttribute("data-plan-price")) || planPrice;
      planOldPrice =
        Number(e.target.getAttribute("data-plan-old-price")) || planOldPrice;
    }
    setUser({
      ...user,
      [name]: type === "checkbox" ? isChecked : value,
      planKey,
      planPrice,
      planOldPrice,
    });
  };

  const { phone, phoneCode, password } = user || {};

  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const isAddressValid = (address: {
    state: string;
    city: string;
    country: string;
    zip: string;
    streetOne: string;
  }) => {
    return Object.values(address).every((value) => {
      if (typeof value === "string") {
        return value.trim().length > 0;
      }
      return true;
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isError) {
      toast.error("Fix Password Error!");
      return;
    }
    if (phone?.length === 0 || phoneCode?.length === 0) {
      toast.error("Phone number required!");
      return;
    }
    if (password?.length < 8) {
      toast.error("Please fix the errors.");
      return;
    }
    if (!hasSpecialChar) {
      toast.error("Please fix the errors.");
      return;
    }
    const isPrimaryValid = isAddressValid({
      state: user?.primaryAddress?.state,
      city: user?.primaryAddress?.city,
      country: user?.primaryAddress?.country,
      zip: user?.primaryAddress?.zip,
      streetOne: user?.primaryAddress?.streetOne,
    });
    const isShippingValid = isAddressValid({
      state: user?.shippingAddress?.state,
      city: user?.shippingAddress?.city,
      country: user?.shippingAddress?.country,
      zip: user?.shippingAddress?.zip,
      streetOne: user?.shippingAddress?.streetOne,
    });

    if (!isPrimaryValid) {
      toast.error("Primary address is incomplete!");
      return;
    }

    if (!isShippingValid) {
      toast.error("Shipping address is incomplete!");
      return;
    }
    const userData = {
      ...user,
      domain: domain,
      packageType: pkgType,
      frequency: frequencie,
      planKey: planKey,
      planPrice: planPrice,
      planOldPrice: planOldPrice,
    };
    register(userData)
      .unwrap()
      .then((res) => {
        toast.success(res.message);
        setUser({
          domain: "",
          packageType: "",
          planKey: "",
          planPrice: 0,
          planOldPrice: 0,
          frequency: "",
          username: "",
          email: "",
          password: "",
          landerName: "",
          midName: "",
          firstName: "",
          lastName: "",
          nickName: "",
          phone: "",
          secondEmail: "",
          aggreement: false,
          profile: null,
          discount: 0,
          discountType: "",
          referalCode: "",
          phoneCode: "",
          privateDomain: "",
          primaryAddress: {
            state: "",
            city: "",
            country: "",
            zip: "",
            streetOne: "",
            streetTow: "",
            type: "PRIMARY",
          },
          shippingAddress: {
            state: "",
            city: "",
            country: "",
            zip: "",
            streetOne: "",
            streetTow: "",
            type: "SHIPPING",
          },
        });
        localStorage.setItem("email", JSON.stringify(res?.user?.email));
        setConPassword("");
        if (res.pageUrl) {
          window.location.href = res.pageUrl;
        }
      })
      .catch((error) => {
        const err = error as FetchBaseQueryError;
        const errorMessage = (err.data as { message: string }).message;
        toast.error(errorMessage);
      });
  };

  const { packageType, frequency, discountType, discount } = user || {};

  return (
    <section>
      <div className="flex flex-col justify-center items-center w-full h-full py-10 md:px-0 px-3">
        <div className="flex w-full h-full flex-col gap-2 items-center justify-center">
          <Link to="/">
            <img src={Logo} alt="" className="w-24" />
          </Link>
          <h2 className="text-lg md:text-2xl font-bold text-black text-center">
            Your Brand, Your Life, Your Way.
          </h2>
          <p className="text-md md:text-lg font-medium text-black text-center">
            Thanks for choosing a lander domain!{" "}
          </p>
          <div className="mx-auto flex flex-col gap-3 sm:flex-row w-full md:w-152">
            <SummaryCard
              icon={<FiGlobe size={19} />}
              label="Domain:"
              value={user?.domain ? user?.domain : "Not Selected"}
              valueClassName="text-[#182039]"
            />

            <SummaryCard
              icon={<span className="text-3xl">♛</span>}
              label="Package:"
              value={packageType ? packageType : "Not Selected"}
              valueClassName="text-[#f28a00]"
            />

            <SummaryCard
              icon={<FiCalendar size={19} />}
              label="Billing:"
              value={
                frequency
                  ? frequency.charAt(0).toUpperCase() + frequency.slice(1)
                  : "Not Selected"
              }
              valueClassName="text-[#57a914]"
            />
          </div>
        </div>
        <div className="w-full mt-5 md:mt-10 border border-gray-200 rounded-3xl shadow-lg lg:w-8/12 xl:w-6/12 h-full flex flex-col items-start justify-center p-5 md:p-14">
          <div className="flex flex-col gap-3">
            <h2 className="md:text-xl text-lg font-medium capitalize">
              Select Your Domain, Plan & Billing
            </h2>
            <p className="text-black bg-amber-50 p-3 text-[13px] rounded-xl">
              Note: Certain features may only be available when connected to a
              Stripe Express account and a Google Calendar account.
            </p>

            <p className="text-sm text-black/60">
              At MyBrandLife, our mission is to empower individuals and
              businesses by providing tailored, industry-specific landing pages
              that enhance their online presence and engagement.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col gap-5 mt-5"
          >
            <StepOne notes={notes} user={user} setUser={setUser} />

            <StepTow
              user={user}
              setConPassword={setConPassword}
              conPassword={conPassword}
              handleChange={handleChange}
              setError={setError}
              isError={isError}
              setUser={setUser}
            />
            <StepThree
              user={user}
              handleChange={handleChange}
              setUser={setUser}
            />
            <StepFour
              handleChange={handleChange}
              user={user}
              setUser={setUser}
            />
            <div className="flex gap-3 items-center">
              <button
                type="submit"
                className={`h-12 w-full flex justify-center items-center rounded-full  text-sm font-semibold text-black shadow-sm transition duration-200 active:scale-[0.95] ${isLoading ? "bg-[#6fa420] cursor-not-allowed" : "bg-[#96c94b] hover:bg-[#88c133] cursor-pointer"}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  <p>
                    {discountType === "LIFETIME"
                      ? "Build Fully Free"
                      : discountType === "MONTHLY"
                        ? `Build & Get Extra ${discount} Months`
                        : discountType === "PERCENT"
                          ? `Build & Get ${discount}% Discount`
                          : "Build & Pay"}
                  </p>
                )}
              </button>
            </div>
            <p className="text-sm font-normal text-black">
              Already have an account?{" "}
              <Link
                to="/auth/login"
                className="underline font-medium text-[#cf3832]"
              >
                Sing In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Register;
