import { Folder, User } from "lucide-react";
import type { OrderWristbandType } from "../../utils/wristband.types";
import useBodyScroll from "../../hook/userBodyscroll";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  wristband: OrderWristbandType;
}

const statusStyles: Record<string, string> = {
  PAID: "bg-emerald-100 text-emerald-700",
  INPRODUCTION: "bg-amber-100 text-amber-700",
  SHIPPED: "bg-blue-100 text-blue-700",
  CANCELED: "bg-red-100 text-red-700",
  REFUNDED: "bg-purple-100 text-purple-700",
  LOST: "bg-rose-100 text-rose-700",
  DISABLED: "bg-slate-200 text-slate-700",
  PENDING: "bg-gray-200 text-gray-600",
  COMPLETE: "bg-green-100 text-green-700",
  DELIVERED: "bg-amber-100 text-amber-700",
};

function ViewOrderWristband({ isOpen, onClose, wristband }: Props) {
  useBodyScroll(isOpen);
  const {
    idPrefix,
    title,
    color,
    quantity,
    price,
    qrCode,
    status,
    subTotal,
    mode,
    create_at,
    delivered_at,
    shipped_at,
    assignedFirstName,
    assignedLastName,
    assignedNickname,
    trackingNumber,
    complete_at,
  } = wristband || {};

  const formattedDate = (value: string) => {
    const createDate = new Date(value);
    return createDate?.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusColor = statusStyles[status];

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div
        className={`w-full max-w-3xl bg-white rounded-2xl shadow-xl overflow-hidden ${
          isOpen ? "zoom-animation" : ""
        }`}
      >
        <div className="bg-[#f6f8fb] ">
          <div className="w-full">
            <div className="flex p-5 bg-slate-100 justify-between items-start border-b border-gray-300">
              <div>
                <h1 className="text-xl font-medium text-gray-900">{title}</h1>
                <p className="text-gray-500 mt-1">Project ID: #{idPrefix}</p>
              </div>
              <span
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${getStatusColor} rounded-full`}
              >
                {status}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 max-h-[70vh] overflow-auto">
              <div className="p-8">
                <div className="flex items-center gap-2 mb-6">
                  <Folder className="text-green-600" size={18} />
                  <h2 className="text-lg font-semibold text-gray-800">
                    Wristband Information
                  </h2>
                </div>
                <div className="space-y-6 text-sm">
                  <div>
                    <p className="text-gray-400 uppercase tracking-wide text-xs">
                      Wristband Name
                    </p>
                    <p className="text-gray-800 mt-1">{title}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 uppercase tracking-wide text-xs">
                      Wristband Color
                    </p>
                    <p className="text-gray-800 mt-1">{color}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 uppercase tracking-wide text-xs">
                      Wristband QTY
                    </p>
                    <p className="text-gray-800 mt-1">{quantity}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 uppercase tracking-wide text-xs">
                      Wristband Price
                    </p>
                    <p className="text-gray-800 mt-1">{price}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 uppercase tracking-wide text-xs">
                      Wristband Subtotal
                    </p>
                    <p className="text-gray-800 mt-1">{subTotal}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 uppercase tracking-wide text-xs">
                      Assign First Name
                    </p>
                    <p className="text-gray-800 mt-1">
                      {assignedFirstName ? assignedFirstName : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 uppercase tracking-wide text-xs">
                      Assign Last Name
                    </p>
                    <p className="text-gray-800 mt-1">
                      {assignedLastName ? assignedLastName : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 uppercase tracking-wide text-xs">
                      Assign Nick Name
                    </p>
                    <p className="text-gray-800 mt-1">
                      {assignedNickname ? assignedNickname : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-8 bg-slate-100">
                <div className="flex items-center gap-2 mb-6">
                  <User className="text-green-600" size={18} />
                  <h2 className="text-lg font-semibold text-gray-800">
                    Order Information
                  </h2>
                </div>
                <div className="space-y-6 text-sm">
                  <div>
                    <p className="text-gray-400 uppercase tracking-wide text-xs">
                      Project Id Prefix
                    </p>
                    <p className="text-gray-800 mt-1">{idPrefix}</p>
                  </div>

                  <div>
                    <p className="text-gray-400 uppercase tracking-wide text-xs">
                      Order At
                    </p>
                    <p className="text-gray-800 mt-1">
                      {formattedDate(create_at)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 uppercase tracking-wide text-xs">
                      Mode
                    </p>
                    <p className="text-gray-800 mt-1">{mode}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 uppercase tracking-wide text-xs">
                      Qr Code
                    </p>
                    <p className="text-gray-800 mt-1 whitespace-pre-wrap break-all">
                      {qrCode}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 uppercase tracking-wide text-xs">
                      Tracking Numnerr
                    </p>
                    <p className="text-gray-800 mt-1">{trackingNumber}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 uppercase tracking-wide text-xs">
                      Shipping At
                    </p>
                    <p className="text-gray-800 mt-1">
                      {shipped_at ? formattedDate(shipped_at) : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 uppercase tracking-wide text-xs">
                      Delivered At
                    </p>
                    <p className="text-gray-800 mt-1">
                      {delivered_at ? formattedDate(delivered_at) : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 uppercase tracking-wide text-xs">
                      Complete At
                    </p>
                    <p className="text-gray-800 mt-1">
                      {complete_at ? formattedDate(complete_at) : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-4 p-5 bg-slate-100 border-t border-gray-300">
              <button
                onClick={() => onClose()}
                className="px-6 py-2 cursor-pointer rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewOrderWristband;
