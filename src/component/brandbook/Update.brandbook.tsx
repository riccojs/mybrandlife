import { useState, type SetStateAction } from "react";
import toast from "react-hot-toast";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import useBodyScroll from "../../hook/userBodyscroll";
import { useUpdateEventStatusMutation } from "../../redux/features/event/eventApi";
import SelectComponent from "../ui/Select.component";

interface DataTypes {
  isShow: boolean;
  setShow: React.Dispatch<SetStateAction<boolean>>;
  id: string;
  status: string;
}
function UpdateBrandbook({ isShow, setShow, id, status }: DataTypes) {
  useBodyScroll(isShow);

  const [event, setEvent] = useState({
    status: status,
  });

  const [updateEventStatus, { isLoading }] = useUpdateEventStatusMutation();

  const handleChange = (value: string) => {
    setEvent((prev) => ({
      ...prev,
      status: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateEventStatus({ id, event })
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
        <div className="flex flex-col gap-5 rounded-2xl">
          <div className="flex flex-col gap-3">
            <h2 className="text-[#3D424B] font-medium text-2xl">
              Update Brandbook Status
            </h2>
            <h2 className="text-[#3D424B] font-normal text-md">
              When you update a booking, a notification email will be
              automatically sent to the customer. Please make sure all details
              are correct before proceeding.
            </h2>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-1 mt-3">
            <label htmlFor="" className="text-[#3D424B] font-normal text-md">
              Select Status
            </label>
            <div className="w-full">
              <SelectComponent
                value={event.status}
                label="Select status"
                handleChange={handleChange}
                datas={[
                  { key: "PENDING", value: "PENDING" },
                  { key: "CONFIRMED", value: "CONFIRMED" },
                  { key: "REJECTED", value: "REJECTED" },
                ]}
                color="#F3F3F3"
              />
            </div>
            <div className="flex gap-3 items-center mt-2">
              <button
                type="button"
                onClick={() => setShow(false)}
                className="bg-slate-200 px-6 py-3 cursor-pointer rounded-lg flex gap-2 items-center w-fit mt-3"
              >
                Close
              </button>
              <button className="bg-[#cbf38b] px-6 py-3 cursor-pointer rounded-lg flex gap-2 items-center w-fit mt-3">
                {isLoading ? (
                  <i className="fa-solid fa-circle-notch animate-spin"></i>
                ) : (
                  "Update"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateBrandbook;
