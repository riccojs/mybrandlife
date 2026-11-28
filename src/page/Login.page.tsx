import { useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router";
import toast from "react-hot-toast";
import AuthShell from "../component/auth/Auth.shell";
import { AuthField, PasswordField, SubmitButton } from "../component/auth/Auth.fields";
import { isEmail } from "../utils/validation";
import { getApiError, getErrorStatus } from "../redux/api/base.api";
import { SignInError, useSignIn } from "../redux/hooks";

const LoginPage = () => {
  const signIn = useSignIn();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  // Prefilled after sign-up verification (Get Started passes it in route state).
  const [form, setForm] = useState(() => {
    const email = (location.state as { email?: unknown } | null)?.email;
    return { email: typeof email === "string" ? email : "", password: "" };
  });
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined, form: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!isEmail(form.email)) next.email = "Enter a valid email address.";
    if (!form.password) next.password = "Enter your password.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    try {
      // GuestRoute then redirects: onboarding if paid, checkout if not.
      const user = await signIn(form.email, form.password);
      toast.success(`Welcome back, ${user.firstName}!`);
    } catch (err) {
      const cause = err instanceof SignInError ? err.cause : err;
      if (err instanceof SignInError && err.stage === "profile") {
        // Login worked but GET /bps/auth/logged didn't: show the server's reason.
        const code = getErrorStatus(cause);
        setErrors({
          form: `Your password was accepted, but we couldn't load your account${code ? ` (${code})` : ""}: ${getApiError(cause)}`,
        });
      } else {
        setErrors({ form: getApiError(cause) });
      }
      setLoading(false);
    }
  };

  const signUpLink = `/get-started${searchParams.toString() ? `?${searchParams}` : ""}`;

  return (
    <AuthShell
      title="Welcome Back!"
      description="Sign in with your MyBrandLife account to manage your BPS setup, approvals, and content requests."
      footer={
        <>
          <span>Don't have an account? </span>
          <Link to={signUpLink} className="font-medium text-[#2A65E9] underline underline-offset-2">
            Sign Up
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
        {errors.form && (
          <p role="alert" className="rounded-xl bg-[#FFF1F1] px-4 py-3 text-sm text-[#C62F31]">
            {errors.form}
          </p>
        )}
        <AuthField id="email" name="email" type="email" label="Email" autoComplete="email" placeholder="you@business.com" value={form.email} onChange={handleChange} error={errors.email} />
        <PasswordField id="password" name="password" label="Password" autoComplete="current-password" value={form.password} onChange={handleChange} error={errors.password} />
        <div className="text-right">
          <Link to="/auth/reset" className="text-xs text-black/55 hover:text-[#2A65E9] hover:underline">
            Forgot password?
          </Link>
        </div>
        <SubmitButton loading={loading}>{loading ? "Signing in…" : "Sign In"}</SubmitButton>
        <p className="text-center text-xs leading-5 text-black/50">
          By signing in, you agree to Brand Pulse Social's{" "}
          <Link to="/terms" className="text-[#2A65E9] underline underline-offset-2">Terms</Link> and{" "}
          <Link to="/privacy" className="text-[#2A65E9] underline underline-offset-2">Privacy Policy</Link>.
        </p>
      </form>
    </AuthShell>
  );
};

export default LoginPage;
