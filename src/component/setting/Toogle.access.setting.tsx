import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { ArrowRight } from "lucide-react";
import { useToggleAccessSettingMutation } from "../../redux/features/auth/authApi";
import { useAuth } from "../../hook/useAuth";
import WarningPopup from "../popups/Warning.popup";

type ToggleField = "enableQr" | "enableMblLogo";

interface DataType {
  title: string;
  description: string;
  label: string;
  name: ToggleField;
}

function ToggleAccessSetting({ title, description, label, name }: DataType) {
  const { user: userData } = useAuth() as {
    user: {
      enableQr: boolean;
      enableMblLogo: boolean;
      id: string;
    } | null;
  };

  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState(false);

  const [toggleAccessSetting, { isLoading }] = useToggleAccessSettingMutation();

  useEffect(() => {
    if (userData) {
      setChecked(Boolean(userData[name]));
    }
  }, [userData, name]);

  const handleSubmit = async () => {
    toggleAccessSetting({
      user: { enable: checked, type: name },
      id: userData?.id,
    })
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
    <div className="bg-white border border-gray-200 p-10 rounded-2xl shadow my-5">
      <div className="flex flex-col gap-5 justify-start">
        <p className="text-gray-700 text-xl">{title}</p>

        <p className="bg-[#FFFCF0] text-[#7C3E16] border-2 border-[#FCF2C6] p-5 text-sm font-normal rounded-lg w-fit">
          {description}
        </p>

        <div className="flex gap-5 items-center">
          <p className="text-md text-black font-normal">{label}</p>

          <label className="switch">
            <input
              type="checkbox"
              checked={checked}
              disabled={isLoading}
              onChange={(e) => setChecked(e.target.checked)}
            />
            <span className="slider round"></span>
          </label>
        </div>

        <button
          type="button"
          onClick={() => setOpen(true)}
          disabled={isLoading || checked === Boolean(userData?.[name])}
          className="bg-[#96c94b] mt-3 cursor-pointer text-black flex justify-center items-center gap-1 min-w-32 w-32 h-12 rounded-lg disabled:opacity-50"
        >
          <p>Update</p>
          <ArrowRight size={20} />
        </button>
      </div>

      <WarningPopup
        open={open}
        title={title}
        description={description}
        smButton="Update"
        clButton="Close"
        onClose={() => setOpen(false)}
        onConfirm={handleSubmit}
        loading={isLoading}
      />
    </div>
  );
}

export default ToggleAccessSetting;
