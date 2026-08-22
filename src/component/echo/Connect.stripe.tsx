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
    <>
      <button
        onClick={getLoad ? () => {} : handleConnect}
        disabled={data?.connected && data?.ready ? true : false}
        className={`cursor-pointer w-full min-w-72 px-6 py-3 rounded-lg flex gap-2 items-center justify-center ${
          data?.connected && data?.ready ? "bg-gray-300" : "bg-[#cbf38b]"
        }`}
      >
        {isLoading || getLoad ? (
          <i className="fa-solid fa-circle-notch animate-spin"></i>
        ) : (
          <>
            <BsStripe size={20} />
            <p>
              {data?.connected && data?.ready
                ? "Connected"
                : "Connect Stripe (for Tips)"}
            </p>
          </>
        )}
      </button>
    </>
  );
}

export default ConnectStripe;
