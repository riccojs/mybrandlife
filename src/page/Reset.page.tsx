import { useState } from "react";
import { Link } from "react-router";
import { MailCheck } from "lucide-react";
import AuthShell from "../component/auth/Auth.shell";
import { AuthField, SubmitButton } from "../component/auth/Auth.fields";
import { isEmail } from "../utils/validation";
import { getApiError } from "../redux/api/base.api";
import { useSendResetLinkMutation } from "../redux/api/bps.auth.api";

const ResetPage = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sendResetLink, { isLoading: loading }] = useSendResetLinkMutation();
  const [sent, setSent] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isEmail(email)) {
      setError("Enter a valid email address.");
      return;
    }
    const normalized = email.trim().toLowerCase();
    try {
      // POST /auth/send/code — emails a link to /auth/reset/:token.
      await sendResetLink({ email: normalized }).unwrap();
      setSent(normalized);
    } catch (err) {
      // Don't reveal whether an account exists (the API returns 404 for unknown emails).
      if (err && typeof err === "object" && "status" in err && err.status === 404) {
        setSent(normalized);
        return;
      }
      setError(getApiError(err, "We couldn't send the reset link. Try again."));
    }
  };

  const footer = (
    <>
      <span>Remembered it? </span>
      <Link to="/auth/sign-in" className="font-medium text-[#2A65E9] underline underline-offset-2">
        Sign In
      </Link>
    </>
  );

  if (sent) {
    return (
      <AuthShell title="Check your email" description="" footer={footer}>
        <div className="mt-4 flex flex-col items-center text-center">
          <span className="grid size-14 place-items-center rounded-full bg-[#EAF1FF] text-[#2A65E9]">
            <MailCheck className="size-7" />
          </span>
          <p className="mt-4 text-sm leading-6 text-[#171926]/70">
            If an account exists for <strong>{sent}</strong>, we've sent a
            secure link to reset your password. The link expires in 15 minutes.
          </p>
          <button
            type="button"
            onClick={() => setSent(null)}
            className="mt-5 cursor-pointer text-xs font-medium text-black/55 hover:text-[#2A65E9] hover:underline"
          >
            Use a different email
          </button>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Forgot Password?"
      description="No worries. Enter the email on your account and we'll send you a secure link to reset your password."
      footer={footer}
    >
      <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
        <AuthField
          id="email"
          type="email"
          label="Email"
          autoComplete="email"
          placeholder="you@business.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
          }}
          error={error}
        />
        <SubmitButton loading={loading}>{loading ? "Sending link…" : "Send reset link"}</SubmitButton>
        <p className="text-center text-xs leading-5 text-black/50">
          By continuing, you agree to our{" "}
          <Link to="/terms" className="text-[#2A65E9] underline underline-offset-2">Terms</Link> and{" "}
          <Link to="/privacy" className="text-[#2A65E9] underline underline-offset-2">Privacy Policy</Link>.
        </p>
      </form>
    </AuthShell>
  );
};

export default ResetPage;
