import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router";
import toast from "react-hot-toast";
import { ArrowRight, Check, CircleCheck, Crown, Loader2, MailCheck, ShieldCheck } from "lucide-react";
import { socialPlans } from "../utils/pricing.data";
import { isPlanCode, type BillingCycle, type PlanCode } from "../utils/plan.config";
import { AuthField, AuthSelect, PasswordField, SubmitButton } from "../component/auth/Auth.fields";
import { isEmail, passwordError } from "../utils/validation";
import PhoneField from "../component/common/Phone.field";
import OtpInput from "../component/auth/Otp.input";
import PageLoader from "../component/common/Page.loader";
import { detectCountry, getCountry, phoneError } from "../utils/countries";
import { buildCheckoutPayload } from "../utils/bps.checkout";
import { DOMAINS } from "../utils/domains";
import { useAuth } from "../redux/hooks";
import { isMembershipActive } from "../redux/slice/auth.slice";
import { getApiError } from "../redux/api/base.api";
import {
  useCheckoutBpsUserMutation,
  useRegisterBpsUserMutation,
  useResendBpsOtpMutation,
  useVerifyBpsUserMutation,
} from "../redux/api/bps.auth.api";

const RESEND_COOLDOWN = 30;
const CODE_LENGTH = 6;
/** Seconds the "Email verified" screen shows before going to sign in. */
const REDIRECT_DELAY = 3;

const initialForm = {
  firstName: "",
  midName: "",
  lastName: "",
  email: "",
  phone: "",
  phoneCountry: "US",
  landerName: "",
  domain: "",
  password: "",
  confirmPassword: "",
  referralCode: "",
  aggreement: false,
};
type Form = typeof initialForm;
type Errors = Partial<Record<keyof Form | "form", string>>;

/** Account created, waiting for the emailed 6-digit code. */
interface PendingAccount {
  email: string;
}

const alertClass = "rounded-xl bg-[#FFF1F1] px-4 py-3 text-sm text-[#C62F31]";

const GetStartedPage = () => {
  const { user, status, logout } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [form, setForm] = useState<Form>(() => ({
    ...initialForm,
    phoneCountry: detectCountry(),
    referralCode: searchParams.get("ref") ?? "",
  }));
  const [errors, setErrors] = useState<Errors>({});
  const [pending, setPending] = useState<PendingAccount | null>(null);
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [verifyBusy, setVerifyBusy] = useState(false);
  const verifyingRef = useRef(false);
  const [verified, setVerified] = useState(false);
  const [redirectIn, setRedirectIn] = useState(REDIRECT_DELAY);
  const navigate = useNavigate();
  const [cooldown, setCooldown] = useState(0);
  const [checkoutError, setCheckoutError] = useState("");

  const [registerUser, { isLoading: registering }] = useRegisterBpsUserMutation();
  const [verifyUser] = useVerifyBpsUserMutation();
  const [resendOtp, { isLoading: resending }] = useResendBpsOtpMutation();
  const [checkout, { isLoading: checkingOut, isSuccess: redirecting }] = useCheckoutBpsUserMutation();

  const rawPlan = searchParams.get("plan_code");
  const planCode: PlanCode = isPlanCode(rawPlan) ? rawPlan : "growth";
  const billingCycle: BillingCycle =
    searchParams.get("billing_cycle") === "monthly" ? "monthly" : "annual";
  const plan = socialPlans.find((p) => p.id === planCode) ?? socialPlans[2];
  const signInLink = `/auth/sign-in?${new URLSearchParams({ plan_code: planCode, billing_cycle: billingCycle, source: "BPS" })}`;

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const updateParams = (next: { plan_code?: string; billing_cycle?: string }) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(next).forEach(([key, value]) => value && params.set(key, value));
    params.set("source", "BPS");
    setSearchParams(params, { replace: true });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target;
    const { name } = target;
    const value =
      target instanceof HTMLInputElement && target.type === "checkbox" ? target.checked : target.value;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined, form: undefined }));
  };

  const validate = () => {
    const next: Errors = {};
    if (!form.firstName.trim()) next.firstName = "Enter your first name.";
    if (!form.midName.trim()) next.midName = "Enter your middle name.";
    if (!form.lastName.trim()) next.lastName = "Enter your last name.";
    if (!isEmail(form.email)) next.email = "Enter a valid email address.";
    const phoneErr = phoneError(form.phone, form.phoneCountry);
    if (phoneErr) next.phone = phoneErr;
    if (!/^[a-z0-9-]{3,30}$/i.test(form.landerName.trim()))
      next.landerName = "3–30 letters, numbers or dashes.";
    if (!DOMAINS.includes(form.domain)) next.domain = "Choose a domain for your page.";
    const pw = passwordError(form.password);
    if (pw) next.password = pw;
    if (form.password !== form.confirmPassword) next.confirmPassword = "Passwords don't match.";
    if (!form.aggreement) next.aggreement = "Please accept the Terms and Privacy Policy.";
    return next;
  };

  /** POST /bps/auth/checkout/:id, then leave for Stripe Checkout. */
  const startCheckout = async (userId: string) => {
    setCheckoutError("");
    try {
      const { pageUrl } = await checkout({
        userId,
        body: buildCheckoutPayload(planCode, billingCycle),
      }).unwrap();
      window.location.assign(pageUrl);
    } catch (err) {
      setCheckoutError(getApiError(err, "We couldn't start checkout. Try again."));
    }
  };

  // Step 1: create the account. The backend emails a 6-digit code.
  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length) {
      toast.error("Please fix the highlighted fields.");
      return;
    }
    const email = form.email.trim().toLowerCase();
    try {
      await registerUser({
        email,
        firstName: form.firstName.trim(),
        midName: form.midName.trim(),
        lastName: form.lastName.trim(),
        password: form.password,
        phone: form.phone.trim(),
        phoneCode: getCountry(form.phoneCountry).dial,
        landerName: form.landerName.trim(),
        domain: form.domain,
        aggreement: form.aggreement,
      }).unwrap();
      setPending({ email });
      setCooldown(RESEND_COOLDOWN);
      toast.success(`We sent a 6-digit code to ${email}.`);
    } catch (err) {
      setErrors({ form: getApiError(err) });
    }
  };

  // Step 2: confirm the code. Then show "verified" and send them to sign in;
  // after signing in, unpaid accounts land back here on the checkout panel.
  const verifyCode = async (value: string) => {
    if (!pending || verifyingRef.current) return;
    if (!new RegExp(`^\\d{${CODE_LENGTH}}$`).test(value)) {
      setCodeError(`Enter the ${CODE_LENGTH}-digit code from your email.`);
      return;
    }
    verifyingRef.current = true;
    setVerifyBusy(true);
    try {
      await verifyUser({ code: value }).unwrap();
      setVerified(true);
    } catch (err) {
      setCodeError(getApiError(err, "That code didn't work. Try again."));
      setCode("");
    } finally {
      verifyingRef.current = false;
      setVerifyBusy(false);
    }
  };

  const pendingEmail = pending?.email;
  // The sign-in page prefills this email.
  const goToSignIn = () => navigate(signInLink, { replace: true, state: { email: pendingEmail } });

  // "Email verified" countdown, then sign in.
  useEffect(() => {
    if (!verified) return;
    if (redirectIn <= 0) {
      navigate(signInLink, { replace: true, state: { email: pendingEmail } });
      return;
    }
    const t = setTimeout(() => setRedirectIn((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [verified, redirectIn, navigate, signInLink, pendingEmail]);

  const handleResend = async () => {
    if (!pending || cooldown > 0) return;
    try {
      await resendOtp({ email: pending.email }).unwrap();
      setCooldown(RESEND_COOLDOWN);
      setCodeError("");
      toast.success("A new code is on its way.");
    } catch (err) {
      toast.error(getApiError(err, "We couldn't resend the code. Try again."));
    }
  };

  if (status === "checking") return <PageLoader label="Checking your session…" />;
  if (user && isMembershipActive(user)) return <Navigate to="/onboard" replace />;

  const price = billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
  const setupFee = billingCycle === "monthly" ? plan.monthlySetupFee : plan.yearlySetupFee;

  let panel: React.ReactNode;

  if (user || redirecting) {
    // Signed in but not paid yet (new sign-up, abandoned or cancelled checkout).
    panel = (
      <div>
        <h2 className="text-xl font-semibold text-[#161B2B]">Finish your checkout</h2>
        <p className="mt-2 text-sm leading-6 text-[#161B2B]/60">
          {user ? (
            <>Signed in as <strong className="text-[#161B2B]">{user.email}</strong>. </>
          ) : null}
          Review your plan on the left, then pay securely with Stripe to start onboarding.
        </p>
        <div className="mt-6 space-y-4">
          {checkoutError && <p role="alert" className={alertClass}>{checkoutError}</p>}
          <button
            type="button"
            disabled={checkingOut || redirecting || !user}
            onClick={() => user && startCheckout(user.id)}
            className="inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#2A65E9] text-sm font-semibold text-white shadow-sm transition hover:bg-[#2058D0] disabled:cursor-wait disabled:opacity-75"
          >
            <ShieldCheck className="size-4" />
            {checkingOut || redirecting ? "Opening secure checkout…" : `Pay for ${plan.name} with Stripe`}
          </button>
          {user?.membershipStatus === "PENDING" && (
            <p className="text-center text-xs text-black/55">
              Already paid?{" "}
              <Link to="/auth/verify" className="font-medium text-[#2A65E9] underline underline-offset-2">
                Check payment status
              </Link>
            </p>
          )}
          {user && (
            <p className="text-center text-xs text-black/45">
              Not you?{" "}
              <button type="button" onClick={() => logout()} className="cursor-pointer font-medium text-[#2A65E9] underline underline-offset-2">
                Sign out
              </button>
            </p>
          )}
        </div>
      </div>
    );
  } else if (pending && verified) {
    panel = (
      <div role="status" className="flex flex-col items-center py-6 text-center">
        <span className="relative grid size-20 place-items-center">
          <span className="absolute inset-0 animate-ping rounded-full bg-[#16A34A]/15 [animation-iteration-count:2]" />
          <span className="relative grid size-20 place-items-center rounded-full bg-[#E8F7EE] text-[#16A34A]">
            <CircleCheck className="size-10" />
          </span>
        </span>
        <h2 className="mt-6 text-2xl font-semibold tracking-[-0.02em] text-[#161B2B]">Email verified!</h2>
        <p className="mt-2 max-w-sm text-sm leading-6 text-[#161B2B]/60">
          <strong className="text-[#161B2B]">{pending.email}</strong> is confirmed. Sign in to
          finish checkout and start onboarding.
        </p>
        <p className="mt-6 inline-flex items-center gap-2 text-xs text-black/50">
          <Loader2 className="size-3.5 animate-spin text-[#2A65E9]" />
          Redirecting to sign in in {Math.max(redirectIn, 0)}s…
        </p>
        <button
          type="button"
          onClick={goToSignIn}
          className="mt-4 inline-flex h-11 w-full max-w-xs cursor-pointer items-center justify-center gap-2 rounded-full bg-[#2A65E9] text-sm font-semibold text-white shadow-sm transition hover:bg-[#2058D0]"
        >
          Sign in now <ArrowRight className="size-4" />
        </button>
      </div>
    );
  } else if (pending) {
    panel = (
      <div>
        <div className="flex flex-col items-center text-center">
          <span className="grid size-14 place-items-center rounded-full bg-[#EAF1FF] text-[#2A65E9]">
            <MailCheck className="size-7" />
          </span>
          <h2 className="mt-4 text-xl font-semibold text-[#161B2B]">Verify your email</h2>
          <p className="mt-2 text-sm leading-6 text-[#161B2B]/60">
            Enter the {CODE_LENGTH}-digit code we sent to{" "}
            <strong className="text-[#161B2B]">{pending.email}</strong>. It expires in 5 minutes.
          </p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            verifyCode(code);
          }}
          noValidate
          className="mt-7 space-y-5"
        >
          <div>
            <OtpInput
              value={code}
              length={CODE_LENGTH}
              autoFocus
              disabled={verifyBusy}
              invalid={!!codeError}
              describedBy={codeError ? "code-error" : undefined}
              onChange={(v) => {
                setCode(v);
                setCodeError("");
              }}
              onComplete={verifyCode}
            />
            {codeError && (
              <p id="code-error" role="alert" className="mt-3 text-center text-xs text-[#E53F41]">
                {codeError}
              </p>
            )}
            <p className="mt-3 text-center text-xs text-black/45">Tip: you can paste the whole code.</p>
          </div>
          <SubmitButton loading={verifyBusy}>{verifyBusy ? "Verifying…" : "Verify email"}</SubmitButton>
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-black/5 pt-4 text-xs">
            <span className="text-black/55">
              Didn't get it?{" "}
              <button
                type="button"
                onClick={handleResend}
                disabled={cooldown > 0 || resending}
                className="cursor-pointer font-medium text-[#2A65E9] underline underline-offset-2 disabled:cursor-not-allowed disabled:text-black/35 disabled:no-underline"
              >
                {cooldown > 0 ? `Resend in ${cooldown}s` : resending ? "Sending…" : "Resend code"}
              </button>
            </span>
            <Link to={signInLink} className="font-medium text-black/55 hover:text-[#2A65E9] hover:underline">
              Already verified? Sign in
            </Link>
          </div>
        </form>
      </div>
    );
  } else {
    panel = (
      <>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xl font-semibold text-[#161B2B]">Create your MyBrandLife account</h2>
          <Link to={signInLink} className="text-xs font-medium text-[#2A65E9] underline underline-offset-2">
            Already have an account? Sign in
          </Link>
        </div>

        <form onSubmit={handleRegister} noValidate className="mt-6 space-y-4">
          {errors.form && <p role="alert" className={alertClass}>{errors.form}</p>}
          <div className="grid gap-4 sm:grid-cols-3">
            <AuthField id="firstName" name="firstName" label="First name" autoComplete="given-name" value={form.firstName} onChange={handleChange} error={errors.firstName} />
            <AuthField id="midName" name="midName" label="Middle name" autoComplete="additional-name" value={form.midName} onChange={handleChange} error={errors.midName} />
            <AuthField id="lastName" name="lastName" label="Last name" autoComplete="family-name" value={form.lastName} onChange={handleChange} error={errors.lastName} />
          </div>
          <AuthField id="email" name="email" type="email" label="Email" autoComplete="email" placeholder="you@business.com" value={form.email} onChange={handleChange} error={errors.email} />
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="phone" className="mb-1 block text-[13px] font-medium text-[#252525]">Phone</label>
              <PhoneField
                id="phone"
                country={form.phoneCountry}
                phone={form.phone}
                invalid={!!errors.phone}
                onChange={({ country, phone }) => {
                  setForm((prev) => ({ ...prev, phoneCountry: country, phone }));
                  setErrors((prev) => ({ ...prev, phone: undefined, form: undefined }));
                }}
              />
              {errors.phone && <p className="mt-1 pl-3 text-xs text-[#E53F41]">{errors.phone}</p>}
            </div>
            <AuthSelect id="domain" name="domain" label="MyBrandLife domain" value={form.domain} onChange={handleChange} error={errors.domain}>
              <option value="" disabled>Choose a domain</option>
              {DOMAINS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </AuthSelect>
          </div>
          <div>
            <AuthField id="landerName" name="landerName" label="MyBrandLife page name" placeholder="yourbrand" value={form.landerName} onChange={handleChange} error={errors.landerName} />
            {form.domain && form.landerName.trim() && !errors.landerName && (
              <p className="mt-1 truncate pl-3 text-xs text-black/50">
                Your page: <span className="font-medium text-[#2A65E9]">{form.domain}/{form.landerName.trim()}</span>
              </p>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <PasswordField id="password" name="password" label="Password" autoComplete="new-password" value={form.password} onChange={handleChange} error={errors.password} />
            <PasswordField id="confirmPassword" name="confirmPassword" label="Confirm password" autoComplete="new-password" value={form.confirmPassword} onChange={handleChange} error={errors.confirmPassword} />
          </div>
          <AuthField id="referralCode" name="referralCode" label="Discount or referral code (optional)" value={form.referralCode} onChange={handleChange} />

          <div>
            <label className="flex items-start gap-2.5 pt-1 text-xs leading-5 text-black/60">
              <input type="checkbox" name="aggreement" checked={form.aggreement} onChange={handleChange} className="mt-0.5 size-4 shrink-0 accent-[#2A65E9]" />
              <span>
                I agree to the{" "}
                <Link to="/terms" className="text-[#2A65E9] underline underline-offset-2">Terms</Link> and{" "}
                <Link to="/privacy" className="text-[#2A65E9] underline underline-offset-2">Privacy Policy</Link>.
              </span>
            </label>
            {errors.aggreement && <p className="mt-1 text-xs text-[#E53F41]">{errors.aggreement}</p>}
          </div>

          <div className="pt-2">
            <SubmitButton loading={registering}>
              {registering ? "Creating your account…" : "Create account"}
            </SubmitButton>
          </div>
          <p className="text-center text-xs text-black/45">
            Next, we'll email you a code to verify your address, then you'll pay securely through Stripe.
          </p>
        </form>
      </>
    );
  }

  return (
    <section className="py-10 md:py-16">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#2A65E9]">Get started</p>
        <h1 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-[#161B2B] sm:text-4xl">
          Start your Brand Pulse Social plan
        </h1>
        <p className="mt-3 text-sm leading-6 text-[#161B2B]/60 sm:text-base">
          BPS uses your MyBrandLife account. Create one below, or sign in if you
          already have one. You'll pay securely through Stripe, then go straight
          into onboarding.
        </p>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        <aside className="h-fit rounded-2xl border border-[#161B2B]/8 bg-[#F8FAFF] p-5 sm:p-8">
          <p className="text-sm font-semibold text-[#161B2B]">Your plan</p>
          <div className="mt-4 inline-flex rounded-full bg-[#E9EBEF] p-1">
            {(["monthly", "annual"] as BillingCycle[]).map((cycle) => (
              <button
                key={cycle}
                type="button"
                onClick={() => updateParams({ billing_cycle: cycle })}
                className={`cursor-pointer rounded-full px-4 py-2 text-xs font-bold capitalize transition-all ${billingCycle === cycle ? "bg-white text-[#161B2B] shadow-sm" : "text-[#667085]"}`}
              >
                {cycle}
              </button>
            ))}
          </div>
          <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {socialPlans.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => updateParams({ plan_code: p.id })}
                className={`cursor-pointer rounded-xl border px-3 py-2.5 text-left text-sm font-semibold transition-all ${p.id === planCode ? "border-[#2A65E9] bg-white text-[#2A65E9] shadow-sm" : "border-[#161B2B]/8 bg-white/60 text-[#161B2B]/70 hover:border-[#2A65E9]/30"}`}
              >
                {p.name}
              </button>
            ))}
          </div>
          <div className="mt-6 rounded-xl bg-white p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <h2 className="text-xl font-bold text-[#161B2B]">{plan.name}</h2>
              <span className="text-lg font-bold text-[#2A65E9]">{price}</span>
            </div>
            <p className="mt-1 text-sm text-[#161B2B]/60">{plan.description}</p>
            {setupFee && (
              <p className="mt-3 text-xs text-[#161B2B]/60">
                Activation fee: <strong>{setupFee}</strong>
              </p>
            )}
            <ul className="mt-5 space-y-2.5">
              {plan.features.slice(0, 5).map((feature) => (
                <li key={feature} className="flex gap-2.5 text-sm text-[#161B2B]/75">
                  <Check className="mt-0.5 size-4 shrink-0 text-[#2A65E9]" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-4 flex gap-3 rounded-xl border border-[#2A65E9]/20 bg-[#EAF1FF] p-4">
            <Crown className="size-5 shrink-0 text-[#2A65E9]" />
            <p className="text-xs leading-5 text-[#3F4654]">
              <strong>MyBrandLife Gold is included</strong> with every BPS plan.
            </p>
          </div>
          <Link to="/pricing" className="mt-5 inline-block text-xs font-medium text-[#2A65E9] underline underline-offset-2">
            Compare all plans
          </Link>
        </aside>

        <div className="rounded-[22px] bg-white px-5 py-7 shadow-[0_15px_50px_rgba(0,0,0,0.08)] sm:px-10 sm:py-8">
          {panel}
        </div>
      </div>
    </section>
  );
};

export default GetStartedPage;
