import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { ArrowRight } from "lucide-react";
import { useAuth } from "../../hook/useAuth";
import { useToggleDirectoryStatusMutation } from "../../redux/features/auth/authApi";
import WarningPopup from "../popups/Warning.popup";

function UpdateDirectoryStatus() {
  const { user: userData } = useAuth() as {
    user: { enableDirectory: boolean; id: string } | null;
  };
  const [user, setUser] = useState({
    directory: false,
  });
  const [open, setOpen] = useState(false);
  const [toggleDirectoryStatus, { isLoading }] =
    useToggleDirectoryStatusMutation();

  useEffect(() => {
    if (userData) {
      setUser((prev) => ({
        ...prev,
        directory: userData?.enableDirectory,
      }));
    }
  }, [userData]);

  const handleSubmit = () => {
    toggleDirectoryStatus({ user, id: userData?.id })
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
    <div className="bg-white p-10 rounded-xl border border-gray-200">
      <div className="flex flex-col gap-5 justify-start">
        <p className="text-gray-700 text-medium text-xl">
          Disable Your Account from the Directory?
        </p>
        <p className="bg-amber-50 text-black p-3 rounded-lg text-md font-normal w-full sm:w-8/12 lg:w-6/12 border-l-4 border-amber-300">
          Disabling your account will remove your profile from the public
          directory. Other users will no longer be able to find or connect with
          you through search.
        </p>
        <div className="flex gap-5 items-center">
          <p className="text-md text-black font-normal">
            Show or hide from directory
          </p>
          <div className="flex justify-center items-center">
            <label className="switch">
              <input
                type="checkbox"
                onChange={(e) =>
                  setUser((prev) => ({ ...prev, directory: e.target.checked }))
                }
                checked={user?.directory}
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
        title="Do you want update Directory Status?"
        description={`Disabling your account will remove your profile from the public
          directory. Other users will no longer be able to find or connect with
          you through search.`}
        smButton="Save"
        clButton="Close"
        onClose={() => setOpen(false)}
        onConfirm={handleSubmit}
        loading={isLoading}
      />
    </div>
  );
}

export default UpdateDirectoryStatus;
