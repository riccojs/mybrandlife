import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { ArrowRight } from "lucide-react";
import { useAuth } from "../../hook/useAuth";
import {
  useGetSettingQuery,
  useUpdateMaintenanceMutation,
} from "../../redux/features/auth/authApi";
import WarningPopup from "../popups/Warning.popup";

function ToggleMaintenance() {
  const { user: userData } = useAuth() as {
    user: {
      id: string;
    } | null;
  };
  const [user, setUser] = useState({
    maintenance: false,
  });
  const [open, setOpen] = useState(false);
  const { data } = useGetSettingQuery();
  const [updateMaintenance, { isLoading }] = useUpdateMaintenanceMutation();

  useEffect(() => {
    if (data) {
      setUser((prev) => ({
        ...prev,
        maintenance: data?.setting?.maintenance,
      }));
    }
  }, [data]);

  const handleSubmit = () => {
    updateMaintenance({ user, id: userData?.id })
      .unwrap()
      .then((res) => {
        toast.success(res.message);
        setOpen(false);
      })
      .catch((error) => {
        const err = error as FetchBaseQueryError;
        const errorMessage = (err.data as { message: string }).message;
        toast.error(errorMessage);
      });
  };

  return (
    <div className="bg-white p-10 rounded-3xl border border-gray-200 mt-5">
      <div className="flex flex-col gap-5 justify-start">
        <p className="text-gray-700 text-medium text-xl">Maintenance Mode</p>
        <p className="bg-amber-50 text-black p-3 rounded-lg text-md font-normal w-full sm:w-8/12 lg:w-6/12 border-l-4 border-amber-300">
          When maintenance mode is enabled, your application will be temporarily
          unavailable to users. This is useful during updates, deployments, or
          system improvements. Only authorized administrators will retain access
          during this period.
        </p>
        <div className="flex gap-5 items-center">
          <p className="text-md text-black font-normal">
            Toggle to enable or disable maintenance mode for your application.
          </p>
          <div className="flex justify-center items-center">
            <label className="switch">
              <input
                type="checkbox"
                onChange={(e) =>
                  setUser((prev) => ({
                    ...prev,
                    maintenance: e.target.checked,
                  }))
                }
                checked={user?.maintenance}
              />
              <span className="slider round"></span>
            </label>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            setOpen(true);
          }}
          className="bg-[#BDF188] text-[#000000] flex justify-center items-center gap-1 w-fit border border-[#76c725] px-10 py-4 rounded-2xl cursor-pointer"
        >
          <p>Save</p>
          <ArrowRight />
        </button>
      </div>

      <WarningPopup
        open={open}
        title="Do you want to save the setting?"
        description={`When maintenance mode is enabled, your application will be temporarily unavailable to users. This is useful during updates, deployments, or system improvements. Only authorized administrators will retain access during this period.
. Click "Delete" to continue or "Close" to cancel.`}
        smButton="Save"
        clButton="Close"
        onClose={() => setOpen(false)}
        onConfirm={() => handleSubmit()}
        loading={isLoading}
      />
    </div>
  );
}

export default ToggleMaintenance;
