import { useEffect, useState, type SetStateAction } from "react";
import toast from "react-hot-toast";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useToggleAccountActivationMutation } from "../../redux/features/auth/authApi";
import SelectComponent from "../ui/Select.component";

interface DataTypes {
  isShow: boolean;
  setShow: React.Dispatch<SetStateAction<boolean>>;
  id: string;
  status: string;
}
function DeactivateUser({ isShow, setShow, id, status }: DataTypes) {
  const [user, setUser] = useState({
    status: status || "",
  });

  const [toggleAccountActivation, { isLoading }] =
    useToggleAccountActivationMutation();

  const handleChange = (value: string) => {
    setUser((prev) => ({
      ...prev,
      status: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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

  useEffect(() => {
    if (isShow) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isShow]);

  if (!isShow) return;

  return (
    <div className="inset-0 bg-[#00000039] flex fixed left-0 justify-center items-center w-full h-auto min-h-screen z-50 overflow-auto">
      <div
        className={`relative flex flex-col w-11/12 2xl:w-3/12 xl:w-6/12 m-auto justify-center p-8 rounded-3xl shadow-sm bg-[#ffffff] border border-gray-300 ${
          isShow ? "zoom-animation" : ""
        }`}
      >
        <div className="flex flex-col gap-5">
          <div>
            <h2 className="text-[#3D424B] font-medium text-2xl">
              Do you want to update user account status?
            </h2>
            <h2 className="text-[#636568] font-normal text-base mt-3">
              Update user account status will immediately effect with their
              membership, cancel all active bookings, and remove any ongoing
              echoes or onboarding sessions. This action can be reversed upon
              request. Are you sure you wish to proceed?
            </h2>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-1 mt-3">
            <label htmlFor="" className="text-[#3D424B] font-normal text-md">
              Select Status
            </label>
            <div className="w-full">
              <SelectComponent
                value={user.status}
                label="Select status"
                handleChange={handleChange}
                datas={[
                  { key: "DEACTIVATE", value: "DEACTIVATE" },
                  { key: "SUSPEND", value: "SUSPEND" },
                  { key: "ACTIVATE", value: "ACTIVATE" },
                ]}
                color="#F3F3F3"
              />
            </div>
            <div className="flex gap-3 items-center mt-5">
              <button
                onClick={() => setShow(false)}
                className="bg-slate-200 px-6 py-3 cursor-pointer rounded-lg flex gap-2 items-center w-fit mt-3"
              >
                Close
              </button>
              <button className="bg-[#cbf38b] px-6 py-3 cursor-pointer rounded-lg flex gap-2 items-center w-fit mt-3">
                {isLoading ? (
                  <i className="fa-solid fa-circle-notch animate-spin"></i>
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default DeactivateUser;
