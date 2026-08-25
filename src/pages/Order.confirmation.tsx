import {
  Check,
  RefreshCw,
  ArrowRight,
  CalendarArrowUp,
  SquareUser,
} from "lucide-react";
import { Link, useParams } from "react-router";
import { useGetAllOrderedWristbandItemQuery } from "../redux/features/wristband/wristbandApi";
import { useAuth } from "../hook/useAuth";
import type { ExtraWristbandType } from "../utils/wristband.types";
import WristbandConfirmationLoader from "../component/loader/Wristband.confirmation.loader";
export default function OrderConfirmation() {
  const params = useParams();
  const id = params?.id;
  const { data, isLoading } = useGetAllOrderedWristbandItemQuery(id);
  const wristband = data?.wristband as ExtraWristbandType[];
  const { user } = useAuth();

  const getTotal = () =>
    wristband?.reduce((total, item) => total + item.subTotal, 0) ?? 0;

  const getOrderDate = () => {
    const order = wristband?.find((item) => item.create_at);

    if (!order?.create_at) return "";

    return new Date(order.create_at).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const { firstName, midName, lastName, email, phone, landerName } = user as {
    firstName: string;
    midName: string;
    lastName: string;
    email: string;
    phone: string;
    landerName: string;
  };

  //   decide what to render
  let content;
  if (isLoading) {
    content = <WristbandConfirmationLoader />;
  }
  if (!isLoading && wristband) {
    content = (
      <div className="min-h-screen bg-[#f8f9fa] text-slate-800 font-sans p-5 flex justify-center items-center">
        <div className="w-full max-w-5xl flex flex-col items-center">
          <div className="w-16 h-16 bg-[#1a56db] rounded-full flex items-center justify-center shadow-md mb-5">
            <Check className="text-white w-8 h-8 stroke-3" />
          </div>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Thank you for your order!
            </h1>
            <p className="mx-auto mt-2 w-full text-center text-sm text-slate-600 xl:w-8/12">
              Your order{" "}
              <span className="font-bold text-slate-900 break-all">#{id}</span>{" "}
              has been placed successfully.
            </p>
            <p className="text-xs text-slate-500 mt-1">
              A confirmation email is on its way to your inbox.
            </p>
          </div>
          <div className="w-full bg-white border border-slate-100 rounded-xl shadow-sm p-4 mb-6">
            <div className="relative flex items-center justify-between px-2 sm:px-12">
              <div className="absolute top-4 left-12 right-8 sm:right-20 h-1 bg-slate-100 z-0" />
              <div className="absolute top-4 left-8 sm:left-20 w-[40%] h-1 bg-[#1a56db] z-0" />
              <div className="flex flex-col items-center z-10">
                <div className="w-8 h-8 rounded-full bg-[#1a56db] flex items-center justify-center shadow-sm">
                  <Check className="text-white w-4 h-4 stroke-3" />
                </div>
                <span className="text-xs font-bold text-slate-900 mt-2">
                  Ordered
                </span>
              </div>
              <div className="flex flex-col items-center z-10">
                <div className="w-8 h-8 rounded-full bg-[#1a56db] flex items-center justify-center shadow-sm">
                  <Check className="text-white w-4 h-4 stroke-3" />
                </div>
                <span className="text-xs font-bold text-[#1a56db] mt-2">
                  Paid
                </span>
              </div>
              <div className="flex flex-col items-center z-10">
                <div className="w-8 h-8 rounded-full bg-white border-2 border-[#1a56db] flex items-center justify-center shadow-sm">
                  <RefreshCw className="text-[#1a56db] w-3.5 h-3.5 animate-spin-slow stroke-[2.5]" />
                </div>
                <span className="text-xs font-medium text-slate-500 mt-2">
                  Processing
                </span>
              </div>
            </div>
          </div>

          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            <div className="md:col-span-2 bg-white border border-slate-100 rounded-xl shadow-sm p-6 space-y-6">
              <h2 className="text-lg font-bold text-slate-900">
                Order Summary
              </h2>
              <div className="divide-y divide-slate-100">
                {wristband?.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={item.banner}
                        className="w-14 h-14 rounded-md object-cover"
                        alt=""
                      />
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900 leading-tight">
                          {item.title}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">
                          Quantity: {item.quantity}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          ${item.price}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-slate-900">
                      ${item.subTotal}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-2 text-sm">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span className="font-medium text-slate-800">
                    ${getTotal()?.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Shipping</span>
                  <span className="font-bold text-orange-600">FREE</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Estimated Tax</span>
                  <span className="font-medium text-slate-800">$0</span>
                </div>
                <div className="flex justify-between items-baseline pt-3 border-t border-slate-100">
                  <span className="text-base font-bold text-slate-900">
                    Total
                  </span>
                  <span className="text-lg font-black text-slate-900">
                    ${getTotal()?.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white border border-slate-100 rounded-xl shadow-sm p-5">
                <div className="flex items-center gap-2 text-[#1a56db] text-[10px] tracking-wider font-bold uppercase">
                  <CalendarArrowUp size={14} className="stroke-[2.5]" />
                  <span>Ordered</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-2">
                  {getOrderDate()}
                </h3>
                <p className="text-xs text-slate-500">ORDER CREATED</p>
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <span className="inline-block bg-blue-50 text-[#1a56db] text-[10px] font-extrabold px-2.5 py-1 rounded uppercase tracking-wide">
                    EXTRA WRISTBAND ORDER
                  </span>
                </div>
              </div>

              <div className="bg-white border border-slate-100 rounded-xl shadow-sm p-5 space-y-3">
                <div className="flex items-center gap-2 text-[#1a56db] text-[10px] tracking-wider font-bold uppercase">
                  <SquareUser size={14} className="stroke-[2.5]" />
                  <span>USER INFORMAION</span>
                </div>
                <div className="text-xs text-slate-600 space-y-0.5 leading-relaxed">
                  <p className="font-bold text-slate-900">{`${firstName} ${midName} ${lastName}`}</p>
                  <p>{email}</p>
                  <p>{phone}</p>
                  <p>Lander Name: {landerName}</p>
                </div>

                <div className="w-full h-24 bg-[#7a9b9b]/50 border border-slate-100 rounded-lg overflow-hidden flex items-center justify-center mt-2 relative">
                  <div className="absolute inset-2 bg-white/40 border border-slate-200/50 rounded transform -skew-x-12 skew-y-6 flex flex-col justify-between p-1.5 shadow-sm">
                    <div className="w-full h-1 bg-slate-300/40 rounded" />
                    <div className="w-2/3 h-1 bg-slate-300/40 rounded" />
                    <div className="w-full h-1 bg-[#1a56db]/30 rounded" />
                  </div>
                </div>
              </div>

              <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-5 space-y-2">
                <p className="text-xs font-bold text-[#1a56db]">Need help?</p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Our support team is available 24/7 for any questions regarding
                  your order.
                </p>
                <Link
                  to="/contact"
                  className="flex items-center gap-1 text-xs font-bold text-[#1a56db] hover:underline pt-1"
                >
                  <span>Contact Support</span>
                  <ArrowRight size={12} className="stroke-[2.5]" />
                </Link>
              </div>
            </div>
          </div>

          <div className="w-full flex flex-col sm:flex-row items-center gap-3 mt-8 max-w-2xl">
            <a
              href="https://mybrandlife.me/wistband/tracking"
              target="_blank"
              className="w-full text-center sm:w-1/2 bg-[#1a56db] hover:bg-blue-700 text-white font-semibold text-xs py-3 px-4 rounded-lg shadow-sm transition-colors duration-150"
            >
              Track Your Order
            </a>
            <Link
              to="/ordered-wristband"
              className="w-full text-center sm:w-1/2 bg-white hover:bg-slate-50 text-[#1a56db] border border-blue-200 font-semibold text-xs py-3 px-4 rounded-lg transition-colors duration-150"
            >
              Back to wristband
            </Link>
          </div>
        </div>
      </div>
    );
  }
  return content;
}
