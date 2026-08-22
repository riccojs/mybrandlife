import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import useBodyScroll from "../hook/userBodyscroll";
import { useUpdateWristbandItemStatusMutation } from "../redux/features/wristband/wristbandApi";
import SelectComponent from "./ui/Select.component";

interface TypesForm {
  showTab: boolean;
  setShowTab: React.Dispatch<React.SetStateAction<boolean>>;
  id: string;
  wristbandStatus: string;
}
interface PartnerType {
  status: string;
}

function AdminUpdateWristbandStatus({
  showTab,
  setShowTab,
  id,
  wristbandStatus,
}: TypesForm) {
  useBodyScroll(showTab);
  const [wristband, setWristband] = useState<PartnerType>({
    status: "",
  });
  const [updateWristbandItemStatus, { isLoading }] =
    useUpdateWristbandItemStatusMutation();

  const { status } = wristband;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateWristbandItemStatus({ id, wristband })
      .unwrap()
      .then((res) => {
        toast.success(res.message);
        setShowTab(false);
      })
      .catch((error) => {
        const err = error as FetchBaseQueryError;
        const errorMessage = (err.data as { message: string }).message;
        toast.error(errorMessage);
      });
  };

  useEffect(() => {
    if (wristbandStatus) {
      setWristband((prev) => ({ ...prev, status: wristbandStatus }));
    }
  }, [wristbandStatus]);

  const handleTypeChange = (value: string) => {
    setWristband((prev) => ({
      ...prev,
      status: value,
    }));
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center w-full min-h-screen z-50 overflow-auto bg-black/20 backdrop-blur-xs">
      <div
        className={`relative p-10 flex flex-col w-11/12 lg:w-8/12 xl:w-7/12 2xl:w-3/12 m-auto justify-center rounded-3xl shadow-xl bg-white ${
          showTab ? "zoom-animation" : ""
        }`}
      >
        <h2 className="text-2xl font-medium text-black text-center mt-5 mb-2">
          Update Wistband Status
        </h2>
        <p className="text-md font-normal text-black text-center">
          Ensure all mandatory fields are filled in with the correct
          information. Upon completion, you may proceed to establish the
          referral system.
        </p>
        <form
          onSubmit={handleSubmit}
          className="w-full my-5 flex flex-col gap-5"
        >
          <div className="flex flex-col gap-1 w-full">
            <label htmlFor="" className="text-md font-normal text-black">
              Wistband Status
            </label>
            <SelectComponent
              value={status}
              label="Select shipping"
              handleChange={handleTypeChange}
              datas={[
                { key: "PAID", value: "PAID" },
                { key: "INPRODUCTION", value: "INPRODUCTION" },
                { key: "SHIPPED", value: "SHIPPED" },
                { key: "DELIVERED", value: "DELIVERED" },
                { key: "CANCELED", value: "CANCELED" },
                { key: "REFUNDED", value: "REFUNDED" },
                { key: "DISABLED", value: "DISABLED" },
                { key: "COMPLETE", value: "COMPLETE" },
              ]}
              color="#F3F3F3"
            />
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setShowTab(false)}
              className="flex-1 cursor-pointer rounded-xl border border-slate-200 bg-slate-100 py-3.5 font-medium text-slate-700 transition hover:bg-slate-200"
            >
              Close
            </button>

            <button
              disabled={isLoading}
              className="flex gap-1 items-center justify-center flex-1 cursor-pointer rounded-xl bg-yellow-500 py-3.5 font-semibold text-white shadow-lg shadow-yellow-500/30 transition hover:bg-yellow-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6 animate-spin"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                    />
                  </svg>
                  <p>Loading...</p>
                </>
              ) : (
                "Update"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminUpdateWristbandStatus;
