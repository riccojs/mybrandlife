import { Eye, HelpCircle, Pencil } from "lucide-react";
import { Link, useParams } from "react-router";
import { useState } from "react";
import AssignUser from "./Assign.user";
import ViewOrderWristband from "./View.order.wristband";
import { IoPlaySkipBackOutline } from "react-icons/io5";
import type {
  OrderWristbandType,
  WristbandType,
} from "../../utils/wristband.types";
import OrderSummeryLoader from "../loader/Order.summery.loader";
import { useGetOnePulsetrackQuery } from "../../redux/features/pulsetrack/pulsetrackApi";
import type { PulsetrackType } from "../../utils/pulsetrack.types";

const statusStyles: Record<string, string> = {
  PAID: "bg-[#DCFCE7] text-[#22C55E]",
  INPRODUCTION: "bg-[#FEF9C3] text-[#CA8A04]",
  SHIPPED: "bg-[#DBEAFE] text-[#2563EB]",
  DELIVERED: "bg-[#DCFCE7] text-[#16A34A]",
  CANCELED: "bg-[#FEE2E2] text-[#DC2626]",
  REFUNDED: "bg-[#F3E8FF] text-[#9333EA]",
  LOST: "bg-[#E5E7EB] text-[#374151]",
  DISABLED: "bg-[#F1F5F9] text-[#64748B]",
  PENDING: "bg-[#FEF3C7] text-[#D97706]",
  COMPLETE: "bg-[#DCFCE7] text-[#15803D]",
};

export default function OrderSummery() {
  const params = useParams();
  const id = params.id;
  const { data, isFetching, isLoading } = useGetOnePulsetrackQuery(id);
  const [selectData, setSelectData] = useState({
    id: "",
    code: "",
    status: "",
    assignedFirstName: "",
    assignedLastName: "",
    assignedNickname: "",
  });
  const [wristband, setWristband] = useState<OrderWristbandType>({
    idPrefix: "",
    title: "",
    price: 0,
    quantity: 0,
    subTotal: 0,
    color: "",
    assignedFirstName: "",
    assignedLastName: "",
    assignedNickname: "",
    status: "",
    shippingCarrier: "",
    trackingNumber: "",
    shipped_at: "",
    delivered_at: "",
    qrCode: "",
    mode: "",
    complete_at: "",
    stock: 0,
    create_at: "",
  });
  const [show, setShow] = useState(false);
  const [showOrder, setShowOrder] = useState(false);
  const pulsetrack = (data?.pulsetrack as PulsetrackType) || {};
  const {
    sequence,
    create_at,
    wristbands,
    subTotal,
    total,
    expediteProduction,
    expediteShipping,
    active,
    lander,
    address,
    zip,
    city,
    state,
  } = pulsetrack || {};

  const formattedDate = (value: string) => {
    const createDate = new Date(value);
    return createDate?.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  //  decide what to render
  let content;
  if (isFetching || isLoading) {
    content = <OrderSummeryLoader />;
  }
  if (!isFetching && !isLoading && pulsetrack) {
    content = (
      <div className="min-h-screen text-[#0F172A]">
        <div className="w-full mx-auto p-5">
          <p className="text-xs sm:text-sm text-gray-500 mb-4">
            MyBrandLife &gt; <Link to="/pulsetrack/orders">PulseTrack</Link>{" "}
            &gt; <span className="text-gray-700">Order Details</span>
          </p>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold">Order Details</h2>
              <p className="text-gray-500 mt-2 text-xs sm:text-sm">
                Order ID: #{sequence} • Placed on {formattedDate(create_at)}
              </p>
            </div>
            <Link
              to="/pulsetrack/orders"
              className="w-full sm:w-auto bg-[#84CC16] hover:bg-[#65A30D] transition-colors text-white px-5 py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-medium shadow-sm"
            >
              <IoPlaySkipBackOutline />
              Back to order
            </Link>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="px-5 sm:px-6 py-4 sm:py-5 border-b border-gray-200 font-semibold text-base sm:text-lg">
                  Items List
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-250">
                    <thead className="bg-[#F8FAFC] text-xs uppercase text-gray-500 tracking-wider">
                      <tr>
                        <th className="text-left px-6 py-4">Product Name</th>
                        <th className="text-left px-6 py-4">Color</th>
                        <th className="text-left px-6 py-4">idPrefix</th>
                        <th className="text-left px-6 py-4">Status</th>
                        <th className="text-left px-6 py-4">Qty</th>
                        <th className="text-left px-6 py-4">Unit Price</th>
                        <th className="text-left px-6 py-4">Subtotal</th>
                        <th className="text-left px-6 py-4">Action</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {wristbands?.map((item: WristbandType) => {
                        const {
                          id,
                          price,
                          subTotal,
                          title,
                          quantity,
                          color,
                          banner,
                          status,
                          idPrefix,
                          assignedFirstName,
                          assignedLastName,
                          assignedNickname,
                        } = item || {};
                        return (
                          <tr key={id} className="border-t border-gray-100">
                            <td className="px-6 py-5 flex items-center gap-4">
                              <div className="w-12 h-full min-w-12 rounded-md">
                                <img
                                  src={banner}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <p className="font-medium whitespace-nowrap">
                                {title}
                              </p>
                            </td>
                            <td className="px-6 py-5 text-gray-600 whitespace-nowrap">
                              {color}
                            </td>
                            <td className="px-6 py-5 text-gray-600 whitespace-nowrap">
                              #{idPrefix}
                            </td>
                            <td className="px-6 py-5">
                              <p
                                className={`w-fit text-xs px-3 py-1 rounded-full font-medium ${
                                  statusStyles[status] ||
                                  "bg-gray-100 text-gray-500"
                                }`}
                              >
                                {status}
                              </p>
                            </td>
                            <td className="px-6 py-5">{quantity}</td>
                            <td className="px-6 py-5 whitespace-nowrap">
                              ${price}
                            </td>
                            <td className="px-6 py-5 font-semibold whitespace-nowrap">
                              ${subTotal}
                            </td>
                            <td className="px-6 py-5 font-semibold whitespace-nowrap">
                              <div className="flex gap-5 items-center">
                                <Eye
                                  onClick={() => {
                                    setWristband(item);
                                    setShowOrder(true);
                                  }}
                                  size={20}
                                  className="cursor-pointer hover:text-gray-700"
                                />
                                <Pencil
                                  onClick={() => {
                                    setShow(true);
                                    setSelectData({
                                      id: id,
                                      code: idPrefix,
                                      status: status,
                                      assignedFirstName: assignedFirstName,
                                      assignedLastName: assignedLastName,
                                      assignedNickname: assignedNickname,
                                    });
                                  }}
                                  size={18}
                                  className="cursor-pointer hover:text-gray-700"
                                />
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6">
                  <p className="text-xs uppercase text-gray-500 tracking-wider mb-4">
                    Shipping Address
                  </p>
                  <p className="font-medium uppercase">{lander?.landerName}</p>
                  <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                    City: {city} <br />
                    Zip: {zip} <br />
                    Address: {address}
                    <br />
                    State: {state}
                  </p>
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6">
                  <p className="text-xs uppercase text-gray-500 tracking-wider mb-4">
                    user detail
                  </p>
                  <div className="flex flex-col gap-2">
                    <p className="font-medium capitalize text-sm">
                      First Name:{" "}
                      <span className="font-normal">
                        {lander?.firstName}
                      </span>{" "}
                    </p>
                    <p className="font-medium capitalize text-sm">
                      Mid Name:{" "}
                      <span className="font-normal">{lander?.midName}</span>
                    </p>
                    <p className="font-medium capitalize text-sm">
                      Last Name:{" "}
                      <span className="font-normal">{lander?.lastName}</span>
                    </p>
                    <p className="font-medium capitalize text-sm">
                      Landername:{" "}
                      <span className="font-normal">{lander?.landerName}</span>
                    </p>
                    <p className="font-medium capitalize text-sm">
                      Email:{" "}
                      <span className="font-normal">{lander?.email}</span>
                    </p>
                    <p className="font-medium capitalize text-sm">
                      Phone:{" "}
                      <span className="font-normal">{lander?.phone}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6">
                <h3 className="font-semibold text-base sm:text-lg mb-6">
                  Payment Summary
                </h3>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>${subTotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Expedite Shipping</span>
                    <span className="text-gray-600">{expediteShipping}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Expedite Production</span>
                    <span>${expediteProduction}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4 flex justify-between font-bold text-base sm:text-lg">
                    <span>Total</span>
                    <span>${total}</span>
                  </div>
                </div>
                <div className="mt-6 space-y-4 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Payment Status</span>
                    <span className="bg-[#DCFCE7] text-[#22C55E] text-xs px-3 py-1 rounded-full font-medium">
                      {active}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-gray-600">Payment Method</p>
                    <p className="font-medium mt-1">Stripe</p>
                  </div>
                </div>
              </div>
              <div className="bg-[#F0FDF4] border border-[#DCFCE7] rounded-2xl p-5 sm:p-6">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#DCFCE7] flex items-center justify-center shrink-0">
                    <HelpCircle size={18} className="text-[#22C55E]" />
                  </div>
                  <div>
                    <p className="font-semibold mb-2">
                      Need help with your order?
                    </p>
                    <p className="text-sm text-gray-600 mb-4">
                      Our support team is available 24/7 to assist you.
                    </p>
                    <a
                      href="http://mybrandlife.me/contact"
                      target="_blank"
                      className="text-[#22C55E] font-medium text-sm"
                    >
                      Contact Support
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {show && selectData?.id && (
          <AssignUser
            onClose={() => setShow(false)}
            isOpen={show}
            selectData={selectData}
          />
        )}
        {showOrder && wristband?.title && (
          <ViewOrderWristband
            onClose={() => setShowOrder(false)}
            isOpen={showOrder}
            wristband={wristband}
          />
        )}
      </div>
    );
  }

  return content;
}
