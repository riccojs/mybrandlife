import { type SetStateAction } from "react";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import toast from "react-hot-toast";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import useBodyScroll from "../../hook/userBodyscroll";
import { useToggleEventMutation } from "../../redux/features/event/eventApi";
import { useAuth } from "../../hook/useAuth";
import { LoaderCircle } from "lucide-react";

interface DataTypes {
  isShow: boolean;
  setShow: React.Dispatch<SetStateAction<boolean>>;
  status: boolean;
  body: string;
}

function BrandbookAgreement({ isShow, setShow, status, body }: DataTypes) {
  useBodyScroll(isShow);
  const { user } = useAuth();
  const id = user?.id;
  const [toggleEvent, { isLoading }] = useToggleEventMutation();

  const handleSubmit = () => {
    const event = { status: status };
    toggleEvent({ id, event })
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
          <h2 className="text-[#3D424B] font-medium text-2xl">Are You Sure?</h2>
          <p className="text-[#3D424B] font-normal text-md text-center">
            {body}
          </p>
          <div className="flex gap-5 items-center">
            <button
              onClick={() => setShow(false)}
              disabled={isLoading}
              className="bg-slate-200 text-[#000000] min-w-32 w-32 h-12 flex justify-center items-center gap-1 border border-gray-200 rounded-lg cursor-pointer"
            >
              Close
            </button>
            <button
              disabled={isLoading}
              onClick={handleSubmit}
              type="submit"
              className={`${isLoading ? "bg-[#77a630] cursor-not-allowed" : "bg-[#96c94b] cursor-pointer"}  text-[#000000] flex justify-center items-center gap-1 min-w-32 w-32 h-12 rounded-lg`}
            >
              {isLoading ? <LoaderCircle className="animate-spin" /> : "Accept"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BrandbookAgreement;
