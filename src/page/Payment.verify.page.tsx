import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router";
import toast from "react-hot-toast";
import { CircleCheck, Clock, Loader2 } from "lucide-react";
import AuthShell from "../component/auth/Auth.shell";
import PageLoader from "../component/common/Page.loader";
import { useGetLoggedBpsUserQuery } from "../redux/api/bps.auth.api";
import { useAuth } from "../redux/hooks";
import { isMembershipActive } from "../redux/slice/auth.slice";

const POLL_MS = 3000;
const MAX_WAIT_MS = 60_000;

/**
 * Stripe Checkout `success_url`. The membership is switched to ACTIVATE by the
 * Stripe webhook, which can land a few seconds after the redirect, so this page
 * re-reads /bps/auth/logged until it's active, then opens onboarding.
 */
const PaymentVerifyPage = () => {
  const { user, status } = useAuth();
  const active = isMembershipActive(user);
  const [timedOut, setTimedOut] = useState(false);

  const { refetch, isFetching } = useGetLoggedBpsUserQuery(undefined, {
    skip: !user,
    pollingInterval: user && !active && !timedOut ? POLL_MS : 0,
  });

  useEffect(() => {
    if (!user || active || timedOut) return;
    const t = setTimeout(() => setTimedOut(true), MAX_WAIT_MS);
    return () => clearTimeout(t);
  }, [user, active, timedOut]);

  useEffect(() => {
    if (active) toast.success("Payment confirmed. Welcome to Brand Pulse Social!", { id: "bps-payment-confirmed" });
  }, [active]);

  if (status === "checking") return <PageLoader label="Checking your session…" />;
  if (active) return <Navigate to="/onboard" replace />;

  if (!user) {
    return (
      <AuthShell
        title="Sign in to continue"
        description="Your session ended during checkout. Sign in and we'll pick up where you left off."
      >
        <Link
          to="/auth/sign-in"
          className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-full bg-[#2A65E9] text-sm font-semibold text-white hover:bg-[#2058D0]"
        >
          Sign in
        </Link>
      </AuthShell>
    );
  }

  if (timedOut) {
    return (
      <AuthShell
        title="Still confirming your payment"
        description=""
        footer={
          <Link to="/support" className="font-medium text-[#2A65E9] underline underline-offset-2">
            Contact support
          </Link>
        }
      >
        <div className="mt-4 flex flex-col items-center text-center">
          <span className="grid size-14 place-items-center rounded-full bg-[#FFF4E5] text-[#C77700]">
            <Clock className="size-7" />
          </span>
          <p className="mt-4 text-sm leading-6 text-[#171926]/70">
            Stripe hasn't confirmed your payment yet. This usually takes a few
            seconds but can take longer. If you were charged, your plan will
            activate automatically.
          </p>
          <button
            type="button"
            disabled={isFetching}
            onClick={() => {
              setTimedOut(false);
              refetch();
            }}
            className="mt-6 inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#2A65E9] text-sm font-semibold text-white hover:bg-[#2058D0] disabled:cursor-wait disabled:opacity-75"
          >
            {isFetching && <Loader2 className="size-4 animate-spin" />}
            Check again
          </button>
          <Link to="/get-started" className="mt-4 text-xs font-medium text-black/55 hover:text-[#2A65E9] hover:underline">
            Back to checkout
          </Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Confirming your payment" description="">
      <div className="mt-4 flex flex-col items-center text-center">
        <span className="grid size-14 place-items-center rounded-full bg-[#EAF1FF] text-[#2A65E9]">
          <CircleCheck className="size-7" />
        </span>
        <p className="mt-4 text-sm leading-6 text-[#171926]/70">
          Thanks, <strong>{user.firstName}</strong>! We're activating your Brand
          Pulse Social plan. You'll go to onboarding as soon as it's ready.
        </p>
        <Loader2 className="mt-6 size-6 animate-spin text-[#2A65E9]" />
      </div>
    </AuthShell>
  );
};

export default PaymentVerifyPage;
