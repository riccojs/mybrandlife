import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { ArrowRight } from "lucide-react";
import { useTogglebrandshareStatusMutation } from "../../redux/features/auth/authApi";
import { useAuth } from "../../hook/useAuth";
import WarningPopup from "../popups/Warning.popup";

function ToggleBrandshare() {
  const { user: userData } = useAuth() as {
    user: { enableBrandshare: boolean; id: string } | null;
  };
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState({
    enableBrandshare: false,
  });
  const [togglebrandshareStatus, { isLoading }] =
    useTogglebrandshareStatusMutation();

  useEffect(() => {
    if (userData) {
      setUser((prev) => ({
        ...prev,
        enableBrandshare: userData?.enableBrandshare,
      }));
    }
  }, [userData]);

  const handleSubmit = () => {
    togglebrandshareStatus({ user, id: userData?.id })
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
    <div className="bg-white border border-gray-200 p-10 rounded-xl my-5">
      <div className="flex flex-col gap-5 justify-start">
        <p className="text-gray-700 text-medium text-xl">
          Do you want hide BrandShare?
        </p>
        <p className="bg-amber-50 text-black p-3 rounded-lg text-md font-normal w-full sm:w-8/12 lg:w-6/12 border-l-4 border-amber-300">
          If BrandShare is hidden, it will be removed from visibility on your
          subscriber page and will not be accessible to subscribers.
        </p>
        <div className="flex gap-5 items-center">
          <p className="text-md text-black font-normal">
            Show or hide from BrandShare
          </p>
          <div className="flex justify-center items-center">
            <label className="switch">
              <input
                type="checkbox"
                onChange={(e) =>
                  setUser((prev) => ({
                    ...prev,
                    enableBrandshare: e.target.checked,
                  }))
                }
                checked={user?.enableBrandshare}
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
          disabled
          className="bg-gray-200 text-[#000000] flex justify-center items-center gap-1 w-fit border border-gray-300 px-10 py-4 rounded-2xl cursor-not-allowed"
        >
          <p>Save</p>
          <ArrowRight />
        </button>
      </div>
      <WarningPopup
        open={open}
        title="Do you want update BrandShare?"
        description="If BrandShare is hidden, it will be removed from visibility on your subscriber page and will not be accessible to subscribers."
        smButton="Update"
        clButton="Close"
        onClose={() => setOpen(false)}
        onConfirm={handleSubmit}
        loading={isLoading}
      />
    </div>
  );
}

export default ToggleBrandshare;
