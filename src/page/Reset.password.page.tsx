import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import toast from "react-hot-toast";
import { TriangleAlert } from "lucide-react";
import AuthShell from "../component/auth/Auth.shell";
import { PasswordField, SubmitButton } from "../component/auth/Auth.fields";
import { passwordError } from "../utils/validation";
import { getApiError } from "../redux/api/base.api";
import { useResetPasswordMutation } from "../redux/api/bps.auth.api";

const ResetPasswordPage = () => {
  const { token = "" } = useParams();
  const navigate = useNavigate();
  // The API has no "check token" call, so an invalid/expired link shows up on submit.
  const [tokenValid, setTokenValid] = useState(Boolean(token));
  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string; form?: string }>({});
  const [resetPassword, { isLoading: loading }] = useResetPasswordMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined, form: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const next: typeof errors = {};
    const pwError = passwordError(form.password);
    if (pwError) next.password = pwError;
    if (form.password !== form.confirmPassword) next.confirmPassword = "Passwords don't match.";
    setErrors(next);
    if (Object.keys(next).length) return;

    try {
      // POST /auth/reset — the token is single-use.
      await resetPassword({ token, password: form.password }).unwrap();
      toast.success("Password updated. Sign in with your new password.");
      navigate("/auth/sign-in", { replace: true });
    } catch (err) {
      if (err && typeof err === "object" && "status" in err && err.status === 404) {
        setTokenValid(false);
        return;
      }
      setErrors({ form: getApiError(err) });
    }
  };

  const footer = (
    <>
      <span>Back to </span>
      <Link to="/auth/sign-in" className="font-medium text-[#2A65E9] underline underline-offset-2">
        Sign In
      </Link>
    </>
  );

  if (!tokenValid) {
    return (
      <AuthShell title="Link expired" description="" footer={footer}>
        <div className="mt-4 flex flex-col items-center text-center">
          <span className="grid size-14 place-items-center rounded-full bg-[#FFF4E5] text-[#C77700]">
            <TriangleAlert className="size-7" />
          </span>
          <p className="mt-4 text-sm leading-6 text-[#171926]/70">
            This password reset link is invalid or has already been used.
            Reset links work once and expire after 15 minutes.
          </p>
          <Link
            to="/auth/reset"
            className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-full bg-[#2A65E9] text-sm font-semibold text-white hover:bg-[#2058D0]"
          >
            Request a new link
          </Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Change Password"
      description="Choose a new password with at least 8 characters, including a letter and a number."
      footer={footer}
    >
      <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-4">
        {errors.form && (
          <p role="alert" className="rounded-xl bg-[#FFF1F1] px-4 py-3 text-sm text-[#C62F31]">
            {errors.form}
          </p>
        )}
        <PasswordField id="password" name="password" label="New Password" autoComplete="new-password" value={form.password} onChange={handleChange} error={errors.password} />
        <PasswordField id="confirmPassword" name="confirmPassword" label="Confirm Password" autoComplete="new-password" value={form.confirmPassword} onChange={handleChange} error={errors.confirmPassword} />
        <div className="pt-2">
          <SubmitButton loading={loading}>{loading ? "Updating…" : "Change Password"}</SubmitButton>
        </div>
      </form>
    </AuthShell>
  );
};

export default ResetPasswordPage;
