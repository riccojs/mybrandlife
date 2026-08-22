import { Folder, Save, User } from "lucide-react";
import useBodyScroll from "../../hook/userBodyscroll";
import { useGetOneSpiningQuery } from "../../redux/features/spin/spinApi";
import type { SpinType } from "../../utils/spin.types";
import PulsetrackProjectLoader from "../loader/Pulsetrack.project.loader";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  id: string;
}

function ViewSpining({ isOpen, onClose, id }: Props) {
  useBodyScroll(isOpen);
  const { data, isLoading, isFetching } = useGetOneSpiningQuery(id);
  const { groupType, title, isEnable, create_at, url, lander } =
    (data?.spining as SpinType) || {};
  const { email, landerName, phone, firstName, lastName } = lander || {};

  const formattedDate = (value: string) => {
    const createDate = new Date(value);
    return createDate?.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // decide what to render
  let content;
  if (isFetching || isLoading) {
    content = <PulsetrackProjectLoader />;
  }
  if (!isFetching && !isLoading && data) {
    content = (
      <div className="bg-[#f6f8fb]">
        <div className="w-full">
          <div className="flex p-5 bg-slate-100 justify-between items-start border-b border-gray-300">
            <div>
              <h1 className="text-xl font-medium text-gray-900">{title}</h1>
              <p className="text-gray-500 mt-1">Lander ID: #{lander?.id}</p>
            </div>
            <span
              className={`px-3 py-1 text-xs font-medium rounded-full ${isEnable ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
            >
              {isEnable ? "ACTIVE" : "DEACTIVATE"}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-8">
              <div className="flex items-center gap-2 mb-6">
                <Folder className="text-green-600" size={18} />
                <h2 className="text-lg font-semibold text-gray-800">
                  Spining Information
                </h2>
              </div>
              <div className="space-y-6 text-sm">
                <div>
                  <p className="text-gray-400 uppercase tracking-wide text-xs">
                    Spin Title
                  </p>
                  <p className="text-gray-800 mt-1">{title}</p>
                </div>
                <div>
                  <p className="text-gray-400 uppercase tracking-wide text-xs">
                    Spin URL
                  </p>
                  <p className="text-gray-800 mt-1">{url}</p>
                </div>
                <div>
                  <p className="text-gray-400 uppercase tracking-wide text-xs">
                    Spin Group Type
                  </p>
                  <p className="text-gray-800 mt-1">{groupType}</p>
                </div>
                <div>
                  <p className="text-gray-400 uppercase tracking-wide text-xs">
                    Post At
                  </p>
                  <p className="text-gray-800 mt-1">
                    {formattedDate(create_at)}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-8 bg-slate-100">
              <div className="flex items-center gap-2 mb-6">
                <User className="text-green-600" size={18} />
                <h2 className="text-lg font-semibold text-gray-800">
                  User Information
                </h2>
              </div>
              <div className="space-y-6 text-sm">
                <div>
                  <p className="text-gray-400 uppercase tracking-wide text-xs">
                    User Fullname
                  </p>
                  <p className="text-gray-800 mt-1">{`${firstName} ${lastName}`}</p>
                </div>
                <div>
                  <p className="text-gray-400 uppercase tracking-wide text-xs">
                    User Email
                  </p>
                  <p className="text-gray-800 mt-1">{email}</p>
                </div>
                <div>
                  <p className="text-gray-400 uppercase tracking-wide text-xs">
                    User Phone
                  </p>
                  <p className="text-gray-800 mt-1">{phone}</p>
                </div>
                <div>
                  <p className="text-gray-400 uppercase tracking-wide text-xs">
                    User Landername
                  </p>
                  <p className="text-gray-800 mt-1">{landerName}</p>
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

            <button
              onClick={() => onClose()}
              className="flex cursor-pointer items-center gap-2 px-6 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600"
            >
              <Save size={16} />
              SaVe
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div
        className={`w-full max-w-3xl bg-white rounded-2xl shadow-xl overflow-hidden ${
          isOpen ? "zoom-animation" : ""
        }`}
      >
        {content}
      </div>
    </div>
  );
}

export default ViewSpining;
