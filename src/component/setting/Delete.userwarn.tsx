import { type SetStateAction } from "react";
import toast from "react-hot-toast";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useDeleteUserMutation } from "../../redux/features/auth/authApi";

interface DataTypes {
  isShow: boolean;
  setShow: React.Dispatch<SetStateAction<boolean>>;
  id: string;
}
function DeleteUserwarn({ isShow, setShow, id }: DataTypes) {
  const [deleteUser, { isLoading }] = useDeleteUserMutation();

  const handleSubmit = () => {
    deleteUser(id)
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
    <div className="fixed inset-0 flex justify-center items-center w-full min-h-screen z-50 overflow-auto bg-white/20 backdrop-blur-xs">
      <div
        className={`relative p-10 flex flex-col w-11/12 lg:w-8/12 xl:w-7/12 2xl:w-3/12 m-auto justify-center rounded-xl shadow-xl bg-white ${
          isShow ? "zoom-animation" : ""
        }`}
      >
        <div className="flex flex-col gap-5 rounded-2xl">
          <div>
            <h2 className="text-[#3D424B] font-medium text-4xl my-2">
              Are you sure?
            </h2>
            <p className="text-[#3D424B] text-md font-normal mt-5">
              Delete user account will immediately suspend your membership,
              cancel all active bookings, and remove any ongoing echoes or
              onboarding sessions. This action can be reversed upon request. Are
              you sure you wish to proceed?
            </p>
            <div className="flex gap-5 items-center mt-10 justify-center">
              <button
                onClick={() => setShow(false)}
                className="bg-gray-400 py-3 w-full text-center cursor-pointer rounded-lg text-white"
              >
                Cancle
              </button>
              <button
                onClick={handleSubmit}
                className="bg-red-500 text-white py-3 text-center cursor-pointer rounded-lg w-full"
              >
                {isLoading ? (
                  <i className="fa-solid fa-circle-notch animate-spin"></i>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
        <button
          onClick={() => setShow(false)}
          className="text-red-500 text-2xl absolute top-1 right-1 cursor-pointer"
        >
          <i className="fa-solid fa-circle-xmark"></i>
        </button>
      </div>
    </div>
  );
}

export default DeleteUserwarn;
