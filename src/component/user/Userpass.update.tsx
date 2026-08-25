import { useState } from "react";

import toast from "react-hot-toast";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useParams } from "react-router";
import { useUpdatePasswordByAdminMutation } from "../../redux/features/auth/authApi";
import WarningPopup from "../Warning.popup";
import PasswordComponent from "../ui/Password.component";

function UserpassUpdate() {
  const params = useParams();
  const id = params.id;
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState<string>("");
  const [conPassword, setConPassword] = useState<string>("");
  const [updatePasswordByAdmin, { isLoading }] =
    useUpdatePasswordByAdminMutation();

  const handleSubmit = () => {
    const user = { password };
    updatePasswordByAdmin({ user, id })
      .unwrap()
      .then((res) => {
        toast.success(res.message);
        setPassword("");
        setConPassword("");
        setOpen(false);
      })
      .catch((error) => {
        const err = error as FetchBaseQueryError;
        const errorMessage = (err.data as { message: string }).message;
        toast.error(errorMessage);
      });
  };

  return (
    <div className="mt-5">
      <div className="my-5">
        <p className="text-gray-700 text-medium text-xl pb-5">
          Update your password
        </p>
      </div>
      <form>
        <div className="grid grid-cols-1 gap-5 my-5">
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
          <div className="flex flex-col gap-2 w-full">
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
          className="primary-btn max-w-fit flex gap-2 items-center"
          type="button"
          onClick={() => {
            if (password?.length === 0) {
              return toast.error("Enter password");
            }
            if (password !== conPassword) {
              return toast.error("Password not match");
            }
            if (password?.length <= 8) {
              return toast.error("Password lenth more then 8 character");
            }

            setOpen(true);
          }}
        >
          Save
        </button>
      </form>
      <WarningPopup
        open={open}
        title="Do you want update user password?"
        description={`The changes you are about to save will be applied to all associated items in the database. This action may impact existing records and related functionality. Please confirm that you wish to continue. Click "Save" to proceed or "Close" to cancel.`}
        smButton="Save"
        clButton="Close"
        onClose={() => setOpen(false)}
        onConfirm={() => handleSubmit()}
        loading={isLoading}
      />
    </div>
  );
}

export default UserpassUpdate;
