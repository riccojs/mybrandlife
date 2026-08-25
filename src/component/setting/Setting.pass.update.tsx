import { useState } from "react";
import toast from "react-hot-toast";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { ArrowRight } from "lucide-react";
import WarningPopup from "../Warning.popup";
import PasswordComponent from "../ui/Password.component";
import { useUpdatePasswordMutation } from "../../redux/features/auth/authApi";

function SettingPassUpdate({ id }: { id: string | null }) {
  const [password, setPassword] = useState<string>("");
  const [conPassword, setConPassword] = useState<string>("");
  const [oldPassword, setOldPassword] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [updatePassword, { isLoading }] = useUpdatePasswordMutation();

  const handleSubmit = () => {
    if (password !== conPassword) {
      toast.error("Password not match");
    } else if (password?.length <= 8) {
      toast.error("Password lenth more then 8 character");
    }
    const user = { password, oldPassword };
    updatePassword({ user, id })
      .unwrap()
      .then((res) => {
        toast.success(res.message);
        setPassword("");
        setConPassword("");
        setOldPassword("");
        setOpen(false);
      })
      .catch((error) => {
        const err = error as FetchBaseQueryError;
        const errorMessage = (err.data as { message: string }).message;
        toast.error(errorMessage);
      });
  };

  return (
    <form>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 my-5">
        <div className="flex flex-col gap-2 w-full">
          <label>Old Password</label>
          <PasswordComponent
            placeholder="Enter password"
            value={oldPassword}
            handleChange={(e) => setOldPassword(e.target.value)}
            name="password"
            autoComplete="password"
            required={true}
            isError={false}
          />
        </div>
        <div className="flex flex-col gap-2 w-full">
          <label>New Password</label>
          <PasswordComponent
            placeholder="Enter password"
            value={password}
            handleChange={(e) => setPassword(e.target.value)}
            name="password"
            autoComplete="password"
            required={true}
            isError={false}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:col-span-2">
          <label>Confirm Password</label>
          <PasswordComponent
            placeholder="Enter password"
            value={conPassword}
            handleChange={(e) => setConPassword(e.target.value)}
            name="password"
            autoComplete="password"
            required={true}
            isError={false}
          />
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
      <WarningPopup
        open={open}
        title="Do you want update Password?"
        description={`To update your password, click "Save". If you decide not to proceed, click "Close" to exit without saving your changes.`}
        smButton="Save"
        clButton="Close"
        onClose={() => setOpen(false)}
        onConfirm={handleSubmit}
        loading={isLoading}
      />
    </form>
  );
}

export default SettingPassUpdate;
