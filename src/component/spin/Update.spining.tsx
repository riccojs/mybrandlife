import { MdOutlineClose } from "react-icons/md";
import { useGetOneSpiningQuery } from "../../redux/features/spin/spinApi";
import SpinForm from "./Spin.form";
import useBodyScroll from "../../hook/userBodyscroll";

interface Type {
  isOpen: boolean;
  onClose: () => void;
  id: string;
}

function UpdateSpining({ isOpen, onClose, id }: Type) {
  useBodyScroll(isOpen);

  const { data, isLoading: getLoader } = useGetOneSpiningQuery(id);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div
        className={`w-full max-w-xl bg-white rounded-2xl shadow-xl  ${
          isOpen ? "zoom-animation" : ""
        }`}
      >
        <div className="relative w-full max-w-full rounded-xl bg-white p-6 shadow-2xl sm:p-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">
              Update Group
            </h2>
            <button
              onClick={onClose}
              className="rounded-md p-1 text-slate-400 transition hover:text-slate-600"
              aria-label="Close modal"
            >
              <MdOutlineClose size={25} />
            </button>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Fill in the details below to start your new SPIN features.
          </p>
          {getLoader ? (
            <div className="flex items-center justify-center min-h-68">
              <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-[#96c94b] border-solid"></div>
            </div>
          ) : (
            <SpinForm onClose={onClose} data={data} id={data?.spining?.id} />
          )}
        </div>
      </div>
    </div>
  );
}

export default UpdateSpining;
