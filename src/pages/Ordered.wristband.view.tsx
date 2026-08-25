import { Receipt } from "lucide-react";
import { Link, useParams } from "react-router";
import QRCode from "react-qr-code";
import toast from "react-hot-toast";
import { useState } from "react";
import { useGetOneWristbandItemByIdQuery } from "../redux/features/wristband/wristbandApi";
import type { ExtraWristbandType } from "../utils/wristband.types";
import UpdateWristbandStatus from "../component/wristband/Update.wristband.status";
import OrderedwristbandViewLoader from "../component/loader/Ordered.wristband.view.loader";

const steps = [
  "CREATED",
  "PAID",
  "IN PRODUCTION",
  "SHIPPED",
  "DELIVERED",
  "COMPLETED",
];

export default function OrderedWristbandView() {
  const params = useParams();
  const id = params.id;
  const [isShow, setIsShow] = useState(false);
  const { data, isLoading, isFetching } = useGetOneWristbandItemByIdQuery(id);
  const wristband = data?.wristband as ExtraWristbandType;

  const {
    title,
    banner,
    price,
    color,
    quantity,
    trackingNumber,
    status,
    subTotal,
    wristbandId,
    create_at,
    delivered_at,
    shipped_at,
    complete_at,
    disable_at,
    refund_at,
    cancel_at,
    inproduction_at,
    transactionId,
    user,
    mode,
    paid_at,
  } = wristband || {};

  const currentStep = (() => {
    switch (status) {
      case "PENDING":
        return 0;

      case "INPRODUCTION":
        return 2;

      case "SHIPPED":
        return 3;

      case "DELIVERED":
        return 4;

      case "COMPLETE":
        return 5;

      case "CANCELED":
      case "REFUNDED":
      case "DISABLED":
        return 0;

      default:
        return 1;
    }
  })();

  const statusSteps = steps.map((label, index) => ({
    label,
    status:
      index < currentStep
        ? "completed"
        : index === currentStep
          ? "active"
          : "upcoming",
  }));

  const telemetryLogs = [
    {
      timestamp: create_at,
      event: "Order Created",
      id: id,
      status: "CREATED",
      title: title,
    },
    {
      timestamp: shipped_at,
      event: "Order Shipped Processing",
      id: id,
      status: "SHIPPED",
      title: title,
    },
    {
      timestamp: delivered_at,
      event: "Order Deliverd",
      id: id,
      status: "DELIVERED",
      title: title,
    },
    {
      timestamp: complete_at,
      event: "Order Completed",
      id: id,
      status: "COMPLETE",
      title: title,
    },
    {
      timestamp: disable_at,
      event: "Order Disabled",
      id: id,
      status: "DISABLED",
      title: title,
    },
    {
      timestamp: refund_at,
      event: "Order Refunded",
      id: id,
      status: "REFUNDED",
      title: title,
    },
    {
      timestamp: cancel_at,
      event: "Order Canceled",
      id: id,
      status: "CANCELED",
      title: title,
    },
    {
      timestamp: inproduction_at,
      event: "Order In-production",
      id: id,
      status: "INPRODUCTION",
      title: title,
    },
    {
      timestamp: paid_at,
      event: "Order Paid",
      id: id,
      status: "PAID",
      title: title,
    },
  ];

  const formattedDate = (value: string) => {
    const createDate = new Date(value);
    return createDate?.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleCopy = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
      toast.success("Selected copied.");
    } catch {
      toast.error("Failed to copy.");
    }
  };

  //   decide what to render
  let content;
  if (isLoading || isFetching) {
    content = <OrderedwristbandViewLoader />;
  }
  if (!isLoading && !isFetching && wristband) {
    content = (
      <div className="w-full p-5 space-y-6">
        <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <p className="text-sm tracking-widest text-slate-500 font-bold uppercase">
              Wristband Status
            </p>
            <h2 className="text-2xl mb-2 font-extrabold text-lime-600 mt-0.5 tracking-wide">
              Production Phase
            </h2>
            <Link
              to="/ordered-wristband"
              className="border border-gray-200 px-5 py-1 rounded-lg bg-gray-100"
            >
              Back
            </Link>
          </div>
          <div className="flex items-center py-2 md:py-0 justify-between gap-2 md:gap-1 flex-wrap">
            {statusSteps.map((step, idx) => (
              <div key={idx} className="flex items-center flex-1 md:flex-none">
                <div className="flex flex-col items-center relative px-2 md:px-4">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      step.status === "completed"
                        ? "bg-lime-500 shadow-[0_0_8px_rgba(132,204,22,0.6)]"
                        : step.status === "active"
                          ? "bg-lime-500 shadow-[0_0_8px_rgba(132,204,22,0.6)]"
                          : "border-2 border-slate-300 bg-white"
                    }`}
                  />
                  <div
                    className={`${step.status === "active" && "w-3 h-3 absolute rounded-full bg-lime-500 shadow-[0_0_8px_rgba(132,204,22,0.6)] animate-ping"}`}
                  />
                  <span
                    className={`text-xs font-bold tracking-wider mt-2 whitespace-nowrap ${
                      step.status === "active"
                        ? "text-lime-600"
                        : "text-slate-400"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {idx < statusSteps.length - 1 && (
                  <div
                    className={`h-0.5 w-8 sm:w-12 md:w-16 -mt-5 ${
                      statusSteps[idx + 1].status !== "upcoming"
                        ? "bg-lime-500"
                        : "bg-slate-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="md:col-span-2 bg-white p-5 rounded-xl border border-gray-200">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-lime-500/5 rounded-full blur-3xl pointer-events-none" />
            <div>
              <div className="flex justify-between gap-4 mt-4 w-full">
                <div className="flex flex-col gap-1">
                  <h1 className="text-3xl font-medium text-black leading-tight tracking-tight max-w-sm">
                    {title}
                  </h1>
                  <p className="text-lime-600 font-medium text-2xl">${price}</p>
                  <p>
                    {color} - {mode}
                  </p>
                  <p>Quantity: {quantity}</p>
                  <p className="text-sm tracking-widest text-slate-400 font-bold uppercase">
                    Tracking id: {trackingNumber}
                  </p>
                  <div className="border border-gray-200 py-2 px-4 rounded-md">
                    <p>
                      User Full Name:{" "}
                      {`${user?.firstName} ${user?.midName} ${user?.lastName}`}
                    </p>
                    <p className="text-xs text-slate-400 font-medium uppercase">
                      User id: {user?.id}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsShow(true)}
                    className="border border-gray-200 w-fit flex gap-2 items-center uppercase text-sm px-6 mt-2 py-2 rounded-xl font-bold cursor-pointer"
                  >
                    <i className="fa-regular fa-pen-to-square"></i>{" "}
                    <p>Update</p>
                  </button>
                </div>
                <img
                  src={banner}
                  alt=""
                  className="w-44 rounded-2xl object-cover h-40"
                />
              </div>
            </div>

            <div className="self-end flex flex-col gap-1 items-end mt-6">
              <p className="text-[9px] tracking-widest text-slate-400 font-bold uppercase">
                Sub total price
              </p>
              <p className="text-4xl md:text-5xl font-black text-lime-600 tracking-tight">
                ${subTotal}
              </p>
              <p className="bg-green-200 text-green-600 text-sm px-10 py-1 rounded-md font-bold">
                {status}
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-between text-center">
            <p className="text-xs tracking-widest text-slate-500 font-bold uppercase">
              Scan Wristband Track id
            </p>
            <div className="w-44 h-44 bg-white rounded-xl p-3 flex items-center justify-center border border-slate-200 shadow-md my-3">
              <QRCode value={`${user?.domain}/${user?.landerName}`} />
            </div>
            <p className="text-[11px] leading-relaxed text-slate-500 px-4 max-w-xs">
              Scan the QR code to verify your order status on the tracking page.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm tracking-widest text-slate-500 font-bold uppercase">
                Financial Summary
              </p>
              <Receipt size={25} className="text-slate-400" />
            </div>
            <div className="space-y-2 text-sm font-medium">
              <div className="flex justify-between">
                <span className="text-slate-500">Wristband Price</span>
                <span className="font-mono text-slate-700">${price}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Wristband Sub Total</span>
                <span className="font-mono text-slate-700">${subTotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Wristband Tax</span>
                <span className="font-mono text-slate-700">$0</span>
              </div>

              <div className="flex justify-between items-baseline pt-2 border-t border-slate-200">
                <span className="text-sm font-bold text-slate-800">Total</span>
                <span className="font-mono text-lg font-black text-lime-600">
                  ${subTotal}
                </span>
              </div>
            </div>

            <div className="xl:my-0 my-3 bg-white border border-slate-200 rounded-lg p-2.5 shadow-sm">
              <p className="text-[10px] tracking-widest text-slate-400 font-bold uppercase">
                Wristband Id
              </p>
              <p className="text-[10px] font-mono font-bold text-slate-700 tracking-wide">
                {wristbandId}
              </p>
            </div>

            <div className="mt-2">
              <h3 className="text-[10px] tracking-widest text-slate-400 font-bold uppercase">
                Landing Page
              </h3>
              <div className="flex mt-1 justify-between items-center bg-lime-500/10 border border-lime-500/30 text-lime-700 text-[10px] tracking-widest font-extrabold p-2 rounded-md overflow-hidden">
                <p>{`https://${user?.domain}/${user?.landerName}`}</p>
                <button
                  type="button"
                  onClick={() =>
                    handleCopy(`https://${user?.domain}/${user?.landerName}`)
                  }
                  className="cursor-pointer"
                >
                  <i className="fa-regular fa-copy text-base"></i>
                </button>
              </div>
            </div>

            {user?.privateDomain && (
              <div className="mt-2">
                <h3 className="text-[10px] tracking-widest text-slate-400 font-bold uppercase">
                  Private Domain
                </h3>
                <div className="flex mt-1 justify-between items-center bg-lime-500/10 border border-lime-500/30 text-lime-700 text-[10px] tracking-widest font-extrabold p-2 rounded-md overflow-hidden">
                  <p>{user?.privateDomain}</p>
                  <button
                    type="button"
                    onClick={() => handleCopy(user?.privateDomain ?? "")}
                    className="cursor-pointer"
                  >
                    <i className="fa-regular fa-copy text-base"></i>
                  </button>
                </div>
              </div>
            )}
            {transactionId && (
              <div className="mt-2">
                <h3 className="text-[10px] tracking-widest text-slate-400 font-bold uppercase">
                  Transaction ID
                </h3>
                <div className="flex mt-1 justify-between items-center bg-lime-500/10 border border-lime-500/30 text-lime-700 text-[10px] tracking-widest font-extrabold p-2 rounded-md overflow-hidden">
                  <p>{transactionId?.slice(0, 40)}..</p>
                  <button
                    type="button"
                    onClick={() => handleCopy(transactionId ?? "")}
                    className="cursor-pointer"
                  >
                    <i className="fa-regular fa-copy text-base"></i>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className=" bg-white p-10 rounded-xl border border-gray-200">
          <h3 className="text-md tracking-widest text-slate-500 font-bold uppercase">
            Wristband Activity
          </h3>
          <div className="overflow-x-auto mt-5">
            <table className="w-full text-left border-collapse min-w-225">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-bold tracking-widest text-slate-400 uppercase">
                  <th className="pb-3 font-semibold">Order Id</th>
                  <th className="pb-3 font-semibold">Order Title</th>
                  <th className="pb-3 font-semibold">Order Timestam</th>
                  <th className="pb-3 font-semibold">Order Event</th>
                  <th className="pb-3 font-semibold">Order Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium">
                {telemetryLogs?.map((item, index) => {
                  const { id, title, timestamp, event, status } = item || {};
                  if (!timestamp) return;
                  return (
                    <tr
                      key={index}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="py-3.5 font-mono text-slate-400">{id}</td>
                      <td className="py-3.5 font-mono text-slate-400">
                        {title}
                      </td>
                      <td className="py-3.5 text-slate-800 font-semibold">
                        {formattedDate(timestamp)}
                      </td>
                      <td className="py-3.5 text-slate-500">{event}</td>
                      <td className="py-3.5">
                        <p className="bg-green-100 text-green-600 px-3 p-1 rounded-lg w-fit">
                          {status}
                        </p>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        {isShow ? (
          <UpdateWristbandStatus
            setShowTab={setIsShow}
            showTab={isShow}
            id={id ?? ""}
            wristbandStatus={status}
          />
        ) : null}
      </div>
    );
  }

  return content;
}
