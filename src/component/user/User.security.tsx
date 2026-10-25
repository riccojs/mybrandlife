import { useParams } from "react-router";
import toast from "react-hot-toast";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useState } from "react";
import { useDeleteUserMutation } from "../../redux/features/auth/authApi";
import UserpassUpdate from "./Userpass.update";
import WarningPopup from "../Warning.popup";

function UserSecurity() {
  const params = useParams();
  const id = params.id;
  const [open, setOpen] = useState(false);
  const [deleteUser, { isLoading }] = useDeleteUserMutation();

  const handleSubmit = () => {
    deleteUser(id)
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
    <section>
      <UserpassUpdate />
      <div className="mt-10 border-t border-gray-300 py-5 md:py-10">
        <div className="flex flex-col gap-5 justify-start">
          <p className="text-gray-700 text-medium text-md md:text-xl">
            Deactivate User Account?
          </p>
          <p className="bg-[#FFFCF0] mt-2 w-full text-[#7C3E16] border-2 border-[#FCF2C6] p-5 text-sm font-normal rounded-lg">
            Delect user account will also delete user membership and onboarding
            access. Please make sure you want to continue before proceeding.
          </p>
          <button
            onClick={() => setOpen(true)}
            className="text-white bg-red-600 justify-center min-w-44 h-10 w-44 rounded-lg text-md font-normal cursor-pointer flex gap-2 items-center"
          >
            Delete Account
          </button>
        </div>
      </div>
      <WarningPopup
        open={open}
        title="Do you want to delete user account?"
        description={`Delect user account will also delete user membership and onboarding access. Please make sure you want to continue before proceeding. Click "Delete" to proceed or "Close" to cancel.`}
        smButton="Delete"
        clButton="Close"
        onClose={() => setOpen(false)}
        onConfirm={() => handleSubmit()}
        loading={isLoading}
      />
    </section>
  );
}

export default UserSecurity;
