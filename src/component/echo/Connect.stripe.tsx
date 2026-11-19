import { BsStripe } from "react-icons/bs";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import toast from "react-hot-toast";
import {
  useGetStripeConnectionQuery,
  useStripeConnectEchoMutation,
} from "../../redux/features/echo/echoApi";
import { useAuth } from "../../hook/useAuth";

function ConnectStripe({ id }: { id: string }) {
  const { user } = useAuth();
  const [stripeConnectEcho, { isLoading }] = useStripeConnectEchoMutation();
  const { data, isLoading: getLoad } = useGetStripeConnectionQuery(id);

  const handleConnect = () => {
    const echo = { id: user?.id };
    stripeConnectEcho(echo)
      .unwrap()
      .then((res) => {
        toast.success(res.message);
        window.open(res.url, "_blank", "noopener,noreferrer");
      })
      .catch((error) => {
        const err = error as FetchBaseQueryError;
        const errorMessage = (err.data as { message: string }).message;
        toast.error(errorMessage);
      });
  };

  return (
    <div className="relative inline-flex group">
      <button
        onClick={getLoad ? () => {} : handleConnect}
        disabled={data?.connected && data?.ready ? true : false}
        className={`cursor-pointer min-w-12 w-12 h-12 p-2 rounded-lg flex gap-2 items-center justify-center ${
          data?.connected && data?.ready ? "bg-gray-300" : "bg-[#cbf38b]"
        }`}
      >
        {isLoading || getLoad ? (
          <i className="fa-solid fa-circle-notch animate-spin"></i>
        ) : (
          <BsStripe size={20} />
        )}
      </button>
      <div
        role="tooltip"
        className="absolute top-14 left-0 -translate-x-1/2 w-40 max-w-[calc(100vw-32px)] opacity-0 invisible -translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 ease-out"
      >
        <div className="relative bg-white border border-gray-200 rounded-lg p-3 text-sm leading-5 text-black shadow-lg text-center">
          <div className="absolute -top-2 right-10 -translate-x-1/2 w-3.5 h-3.5 bg-white border-l border-t border-gray-300 rotate-45" />
          <span className="relative z-10">Connect Stripe</span>
        </div>
      </div>
    </div>
  );
}

export default ConnectStripe;
