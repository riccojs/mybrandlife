import React, { useState } from "react";
import { useUpdateMembershipMutation } from "../../redux/features/auth/authApi";
import WarningPopup from "../Warning.popup";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import toast from "react-hot-toast";
import SelectComponent from "../ui/Select.component";
import { planData } from "../../utils/domains";
import type { MembershipType } from "../../utils/user.types";

interface TypeForm {
  data: {
    user: {
      membership: MembershipType;
    };
  };
  id: string;
}

function MembershipForm({ data, id }: TypeForm) {
  const [open, setOpen] = useState(false);
  const [updateMembership, { isLoading: updateLoad }] =
    useUpdateMembershipMutation();
  const [membership, setMembership] = useState({
    plan: data?.user?.membership?.plan || "",
    price: data?.user?.membership?.price || "",
    duration: data?.user?.membership?.duration || "",
    activate_at: data?.user?.membership?.activate_at || "",
    oldPrice: data?.user?.membership?.oldPrice || "",
    status: data?.user?.membership?.status || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setMembership({
      ...membership,
      [name]: value,
    });
  };
  const { plan, price, duration, activate_at, oldPrice, status } =
    membership || {};

  const handleSubmit = () => {
    updateMembership({ membership, id })
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
    <div className="mt-5">
      <div className="my-5">
        <p className="text-gray-700 text-medium text-xl pb-5">
          Update User Membership
        </p>
      </div>
      <form>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="flex flex-col gap-1 w-full">
            <label htmlFor="" className="text-md font-normal text-[#737373]">
              Plan
            </label>
            <SelectComponent
              value={plan}
              label="Select Plan"
              handleChange={(item: string) =>
                setMembership((prev) => ({ ...prev, plan: item }))
              }
              datas={planData}
              color="#F3F3F3"
            />
          </div>
          <div className="flex flex-col gap-1 w-full">
            <label htmlFor="" className="text-md font-normal text-[#737373]">
              Price
            </label>
            <input
              type="text"
              name="price"
              value={price}
              onChange={handleChange}
              className="bg-[#f5f5f5] text-[#262626] border border-gray-300 text-base px-4 py-3 rounded-xl w-full focus:outline-[#96c94b]"
              placeholder="Update firstname"
            />
          </div>
          <div className="flex flex-col gap-1 w-full">
            <label htmlFor="" className="text-md font-normal text-[#737373]">
              Duration
            </label>
            <SelectComponent
              value={duration}
              label="Select Package"
              handleChange={(item: string) =>
                setMembership((prev) => ({ ...prev, duration: item }))
              }
              datas={[
                { key: "Monthly", value: "monthly" },
                { key: "Yearly", value: "yearly" },
              ]}
              color="#F3F3F3"
            />
          </div>
          <div className="flex flex-col gap-1 w-full">
            <label htmlFor="" className="text-md font-normal text-[#737373]">
              Status
            </label>
            <SelectComponent
              value={status}
              label="Select Status"
              handleChange={(item: string) =>
                setMembership((prev) => ({ ...prev, status: item }))
              }
              datas={[
                { key: "Pending", value: "PENDING" },
                { key: "Activate", value: "ACTIVATE" },
                { key: "Deactivate", value: "DEACTIVATE" },
                { key: "Suspend", value: "SUSPEND" },
              ]}
              color="#F3F3F3"
            />
          </div>
          <div className="flex flex-col gap-1 w-full">
            <label htmlFor="" className="text-md font-normal text-[#737373]">
              Expired In
            </label>
            <input
              type="date"
              name="activate_at"
              value={activate_at ? activate_at.split("T")[0] : ""}
              onChange={handleChange}
              className="bg-[#f5f5f5] text-[#262626] border border-gray-300 text-base px-4 py-3 rounded-xl w-full focus:outline-[#96c94b]"
            />
          </div>
          <div className="flex flex-col gap-1 w-full">
            <label htmlFor="" className="text-md font-normal text-[#737373]">
              Old Price
            </label>
            <input
              type="text"
              name="oldPrice"
              value={oldPrice}
              onChange={handleChange}
              className="bg-[#f5f5f5] text-[#262626] border border-gray-300 text-base px-4 py-3 rounded-xl w-full focus:outline-[#96c94b]"
              placeholder="Update firstname"
            />
          </div>
        </div>
        <div className="w-full flex justify-end mt-5">
          <button
            className="bg-[#cbf38b] px-6 py-3 rounded-lg cursor-pointer text-md font-normal text-black"
            type="button"
            onClick={() => setOpen(true)}
          >
            Save
          </button>
        </div>
      </form>
      <WarningPopup
        open={open}
        title="Do you want update user membership?"
        description={`The changes you are about to save will be applied to all associated items in the database. This action may impact existing records and related functionality. Please confirm that you wish to continue. Click "Save" to proceed or "Close" to cancel.`}
        smButton="Save"
        clButton="Close"
        onClose={() => setOpen(false)}
        onConfirm={() => handleSubmit()}
        loading={updateLoad}
      />
    </div>
  );
}

export default MembershipForm;
