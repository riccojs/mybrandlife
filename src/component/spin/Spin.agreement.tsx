import { type SetStateAction } from "react";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import toast from "react-hot-toast";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import useBodyScroll from "../../hook/userBodyscroll";
import { useAuth } from "../../hook/useAuth";
import { useToggleSpinMutation } from "../../redux/features/spin/spinApi";

interface DataTypes {
  isShow: boolean;
  setShow: React.Dispatch<SetStateAction<boolean>>;
  status: boolean;
  body: string;
}

function SpinAgreement({ isShow, setShow, status, body }: DataTypes) {
  useBodyScroll(isShow);

  const { user } = useAuth();
  const id = user?.id;
  const [toggleSpin, { isLoading }] = useToggleSpinMutation();

  const handleSubmit = () => {
    const spin = { status: status };
    toggleSpin({ id, spin })
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
        className={`relative flex flex-col w-11/12 2xl:w-3/12 xl:w-6/12 m-auto justify-center p-8 rounded-3xl shadow-sm bg-[#ffffff] border border-gray-300 ${
          isShow ? "zoom-animation" : ""
        }`}
      >
        <div className="flex flex-col items-center justify-center gap-5 rounded-2xl">
          <AiOutlineQuestionCircle color="#52C372" size={100} />
          <h2 className="text-[#3D424B] font-medium text-2xl">Are you Sure?</h2>
          <p className="text-[#3D424B] font-normal text-md text-center">
            {body}
          </p>
          <div className="flex gap-5 items-center">
            <button
              onClick={() => setShow(false)}
              className="cursor-pointer bg-gray-300 w-fit text-normal px-6 py-2 rounded-md flex justify-center items-center gap-2"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="bg-[#cbf38b] w-fit text-normal px-6 py-2 rounded-md flex cursor-pointer justify-center items-center gap-2"
            >
              {isLoading ? (
                <i className="fa-solid fa-circle-notch animate-spin"></i>
              ) : (
                "Accept"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SpinAgreement;
