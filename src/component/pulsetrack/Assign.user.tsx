import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { ImSpinner10 } from "react-icons/im";
import useBodyScroll from "../../hook/userBodyscroll";
import { useAssignPulsetrackUserMutation } from "../../redux/features/pulsetrack/pulsetrackApi";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selectData: {
    id: string;
    code: string;
    status: string;
    assignedFirstName: string;
    assignedLastName: string;
    assignedNickname: string;
  };
}

export default function AssignUser({ isOpen, onClose, selectData }: Props) {
  useBodyScroll(isOpen);
  const {
    id,
    code,
    status,
    assignedFirstName,
    assignedLastName,
    assignedNickname,
  } = selectData;
  const [assignPulsetrackUser, { isLoading }] =
    useAssignPulsetrackUserMutation();
  const [wristband, setWristband] = useState({
    firstname: "",
    lastname: "",
    nickname: "",
  });

  const [errors, setErrors] = useState({
    firstnameError: false,
    lastnameError: false,
    nicknameError: false,
  });

  const { firstnameError, lastnameError, nicknameError } = errors || {};
  const { firstname, lastname, nickname } = wristband || {};

  useEffect(() => {
    setWristband((prev) => ({
      ...prev,
      firstname: assignedFirstName || "",
      lastname: assignedLastName || "",
      nickname: assignedNickname || "",
    }));
  }, [assignedFirstName, assignedLastName, assignedNickname]);

  const handlePaymentCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      firstname?.length === 0 ||
      lastname?.length === 0 ||
      nickname?.length === 0
    ) {
      setErrors((prev) => ({
        ...prev,
        firstnameError: true,
        lastnameError: true,
        nicknameError: true,
      }));
      return;
    }
    assignPulsetrackUser({ id, wristband })
      .unwrap()
      .then((res) => {
        toast.success(res.message);
        onClose();
      })
      .catch((error) => {
        const err = error as FetchBaseQueryError;
        const errorMessage = (err.data as { message: string }).message;
        toast.error(errorMessage);
      });
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div
        className={`w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden ${
          isOpen ? "zoom-animation" : ""
        }`}
      >
        <div className="h-full max-h-[60vh] overflow-auto">
          <form onSubmit={handlePaymentCreate} className="flex flex-col gap-4">
            <div className="p-5 bg-gray-50 border-b border-gray-300 flex justify-between items-center">
              <div>
                <h2 className="text-gray-500 text-lg font-medium uppercase">
                  Assign User
                </h2>
                <p className="text-gray-500 text-sm font-medium uppercase">
                  Project Id: #{code}
                </p>
              </div>
              <span className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-green-700 bg-green-100 rounded-full">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                {status}
              </span>
            </div>
            <div className="px-5 py-3 flex flex-col gap-5">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  First Name <span className="text-red-500 text-sm">*</span>
                </label>
                <input
                  type="text"
                  name="firstname"
                  value={firstname}
                  onChange={(e) => {
                    setWristband((prev) => ({
                      ...prev,
                      firstname: e.target.value,
                    }));
                    if (e.target.value.trim()?.length > 3) {
                      setErrors((prev) => ({
                        ...prev,
                        firstnameError: false,
                      }));
                    }
                  }}
                  placeholder="e.g. Jhon"
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400
                              focus:outline-none focus:ring-2 ${firstnameError ? "border-red-500 focus:ring-red-200" : firstname ? "border-green-500 focus:ring-green-200" : "border-slate-200 focus:ring-[#8CC63F]/30"}`}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Last Name <span className="text-red-500 text-sm">*</span>
                </label>
                <input
                  type="text"
                  name="lastname"
                  value={lastname}
                  onChange={(e) => {
                    setWristband((prev) => ({
                      ...prev,
                      lastname: e.target.value,
                    }));
                    if (e.target.value.trim()?.length > 3) {
                      setErrors((prev) => ({
                        ...prev,
                        lastnameError: false,
                      }));
                    }
                  }}
                  placeholder="e.g. Deo"
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400
                              focus:outline-none focus:ring-2 ${lastnameError ? "border-red-500 focus:ring-red-200" : lastname ? "border-green-500 focus:ring-green-200" : "border-slate-200 focus:ring-[#8CC63F]/30"}`}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Nick Name <span className="text-red-500 text-sm">*</span>
                </label>
                <input
                  type="text"
                  name="nickname"
                  value={nickname}
                  onChange={(e) => {
                    setWristband((prev) => ({
                      ...prev,
                      nickname: e.target.value,
                    }));
                    if (e.target.value.trim()?.length > 3) {
                      setErrors((prev) => ({
                        ...prev,
                        nicknameError: false,
                      }));
                    }
                  }}
                  placeholder="e.g. Anton"
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400
                              focus:outline-none focus:ring-2 ${nicknameError ? "border-red-500 focus:ring-red-200" : nickname ? "border-green-500 focus:ring-green-200" : "border-slate-200 focus:ring-[#8CC63F]/30"}`}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 items-center bg-gray-50 border-t border-gray-300 p-5">
              <button
                onClick={() => onClose()}
                type="button"
                className="px-4 cursor-pointer py-2 border border-gray-300 rounded-xl text-black"
              >
                Close
              </button>
              <button
                type="submit"
                className="flex cursor-pointer w-fit items-center justify-center gap-2 rounded-xl bg-lime-500 px-4 py-2 font-semibold text-white hover:bg-lime-600"
              >
                {isLoading ? <ImSpinner10 className="animate-spin" /> : "SAVE"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
