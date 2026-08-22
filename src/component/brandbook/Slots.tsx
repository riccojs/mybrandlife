import { RiDeleteBin5Line } from "react-icons/ri";

import { useState } from "react";
import toast from "react-hot-toast";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import {
  useDeleteSlotMutation,
  useGetAllSlotQuery,
} from "../../redux/features/event/eventApi";
import SlotsLoader from "../loader/Slots.loader";
import { useAuth } from "../../hook/useAuth";
import Pagination from "../Pagination";
import WarningPopup from "../popups/Warning.popup";

function Slots() {
  const [page, setPage] = useState(1);
  const limit = 14;
  const [selected, setSelected] = useState("");
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const { data, isFetching, isLoading } = useGetAllSlotQuery({
    page,
    limit,
    userId: user?.id,
  });
  const [deleteSlot, { isLoading: delLoad }] = useDeleteSlotMutation();
  const handlePageChange = (no: number) => {
    setPage(no);
  };
  const totalItems = data?.data?.slot;
  const slots = data?.data?.slot;

  const handleDelete = (id: string) => {
    setSelected(id);
    deleteSlot(id)
      .unwrap()
      .then((res) => {
        toast.success(res.message);
        setOpen(false);
        setSelected("");
      })
      .catch((error) => {
        const err = error as FetchBaseQueryError;
        const errorMessage = (err.data as { message: string }).message;
        toast.error(errorMessage);
      });
  };

  // decide what to render
  let content;
  if (isFetching || isLoading) {
    content = (
      <>
        <SlotsLoader />
        <SlotsLoader />
        <SlotsLoader />
        <SlotsLoader />
        <SlotsLoader />
        <SlotsLoader />
        <SlotsLoader />
      </>
    );
  }
  if (!isFetching && !isLoading && slots?.length === 0) {
    content = (
      <tr>
        <td colSpan={7}>
          <p className="bg-amber-100 text-md font-normal p-3 rounded-md">
            Data not found!
          </p>
        </td>
      </tr>
    );
  }
  if (!isFetching && !isLoading && slots?.length > 0) {
    content = slots?.map(
      (item: {
        id: string;
        date: string;
        times: string[];
        create_at: string;
      }) => {
        const { id, date, times } = item || {};

        const formattedDate = (value: string) => {
          const createDate = new Date(value);
          return createDate?.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          });
        };
        return (
          <tr key={id}>
            <td>{formattedDate(date)}</td>
            <td w-52>
              <div className="flex flex-wrap gap-2">
                {times?.map((item, index) => (
                  <p
                    key={index}
                    className="px-2 border border-gray-200 w-fit text-sm py-1 rounded-md bg-[#F3F3F3]"
                  >
                    {item}
                  </p>
                ))}
              </div>
            </td>
            <td>
              <div
                onClick={() => {
                  setOpen(true);
                  setSelected(id);
                }}
                className="flex gap-3"
              >
                <button className="border border-gray-300 w-10 h-10 flex justify-center items-center rounded-md cursor-pointer">
                  <RiDeleteBin5Line size={20} />
                </button>
              </div>
            </td>
          </tr>
        );
      },
    );
  }
  return (
    <div className="xl:overflow-x-auto overflow-x-scroll bg-white mt-5">
      <table className="my-table table-fixed w-full min-w-150">
        <thead>
          <tr className="border-b border-gray-300">
            <th className="font-medium w-32">Date</th>
            <th className="font-medium w-96">Times</th>
            <th className="font-medium w-16">Actions</th>
          </tr>
        </thead>
        <tbody>{content}</tbody>
      </table>
      {totalItems > limit && (
        <Pagination
          handlePageChange={handlePageChange}
          page={page}
          totalItems={totalItems}
          itemsPerPage={limit}
        />
      )}
      {selected && (
        <WarningPopup
          open={open}
          title="Do you want delete this slot?"
          description={`Deleting this slot will permanently remove all associated data from the database. This action cannot be undone. Click "Delete" to continue or "Close" to cancel.`}
          smButton="Delete"
          clButton="Close"
          onClose={() => setOpen(false)}
          onConfirm={() => handleDelete(selected)}
          loading={delLoad}
        />
      )}
    </div>
  );
}

export default Slots;
