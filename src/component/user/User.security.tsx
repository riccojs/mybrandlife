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
      <div className="mt-10 border-t border-gray-300 py-10">
        <div className="flex flex-col gap-5 justify-start">
          <p className="text-gray-700 text-medium text-xl">
            Deactivate User Account?
          </p>
          <p className="bg-amber-50 text-black p-3 rounded-lg text-md font-normal w-full md:w-8/12 border-l-4 border-amber-300">
            Delect user account will also delete user membership and onboarding
            access. Please make sure you want to continue before proceeding.
          </p>
          <button
            onClick={() => setOpen(true)}
            className="text-white bg-red-500 px-6 py-3 rounded-lg text-md font-normal w-fit cursor-pointer flex gap-2 items-center"
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
