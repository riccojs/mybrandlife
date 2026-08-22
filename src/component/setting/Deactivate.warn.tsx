import { type SetStateAction } from "react";
import toast from "react-hot-toast";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { AlertTriangle, Trash2 } from "lucide-react";
import Logo from "../../assets/canva-cercle-shape.png";
import useBodyScroll from "../../hook/userBodyscroll";
import { useAuth } from "../../hook/useAuth";
import { useToggleAccountActivationMutation } from "../../redux/features/auth/authApi";

interface DataTypes {
  isShow: boolean;
  setShow: React.Dispatch<SetStateAction<boolean>>;
}
function DeactivateWarn({ isShow, setShow }: DataTypes) {
  useBodyScroll(isShow);
  const { user } = useAuth();
  const id = user?.id;
  const [toggleAccountActivation, { isLoading }] =
    useToggleAccountActivationMutation();

  const handleSubmit = () => {
    const user = { status: "DEACTIVATE" };
    toggleAccountActivation({ id, user })
      .unwrap()
      .then((res) => {
        toast.success(res.message);
        setShow(false);
      })
      .catch((error) => {
        const err = error as FetchBaseQueryError;
        const errorMessage = (err.data as { message: string }).message;
        toast.error(errorMessage);
      });
  };
  return (
    <div className="inset-0 bg-[#00000039] flex fixed left-0 justify-center items-center w-full h-auto min-h-screen z-50 overflow-auto">
      <div
        className={`relative flex flex-col w-11/12 2xl:w-3/12 xl:w-6/12 m-auto justify-center p-4 rounded-xl shadow-sm bg-[#ffffff] border border-gray-300 ${
          isShow ? "zoom-animation" : ""
        }`}
      >
        <img src={Logo} alt="" className="absolute top-0 right-0 opacity-15" />
        <div className="px-8 pt-10 pb-8 text-center">
          <div className="relative mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-3xl border border-yellow-200 bg-linear-to-b from-yellow-100 to-yellow-50 shadow-lg">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-400 shadow-md">
              <Trash2 className="h-7 w-7 text-white" />
            </div>
            <div className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-white shadow">
              <AlertTriangle className="h-4 w-4 text-yellow-400" />
            </div>
          </div>
          <h2 className="text-[30px] font-medium leading-tight text-slate-900">
            Are you sure?
          </h2>

          <p className="mt-6 text-[15px] leading-6 text-slate-500">
            Deactivating your account will immediately suspend your membership,
            cancel all active bookings, and remove any ongoing echoes or
            onboarding sessions. This action can be reversed upon request. Are
            you sure you wish to proceed?
          </p>
          <div className="mt-10 flex gap-4">
            <button
              onClick={() => setShow(false)}
              className="flex-1 cursor-pointer rounded-xl border border-slate-200 bg-slate-100 py-3.5 font-medium text-slate-700 transition hover:bg-slate-200"
            >
              Close
            </button>

            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex-1 cursor-pointer rounded-xl bg-yellow-500 py-3.5 font-semibold text-white shadow-lg shadow-yellow-500/30 transition hover:bg-yellow-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? (
                <i className="fa-solid fa-circle-notch animate-spin text-xl"></i>
              ) : (
                "Deactivate"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeactivateWarn;
