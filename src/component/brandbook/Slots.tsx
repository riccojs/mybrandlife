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
  const limit = 10;
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
  const totalItems = data?.data?.totalSlot;
  const slots = data?.data?.slot;
  const currentPage = data?.data?.currentPage || [];
  const start = (currentPage - 1) * limit + 1;
  const end = Math.min(currentPage * limit, totalItems);

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
                <button className="border border-[#E7EBF2] text-[#8C98AE] active:bg-[#E7EBF2] w-10 h-10 flex justify-center items-center rounded-lg cursor-pointer">
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
    <div className="xl:overflow-x-auto overflow-x-scroll bg-white">
      <table className="my-table table-fixed w-full min-w-180">
        <thead className="text-xs uppercase text-gray-500 bg-gray-50">
          <tr className="border-y border-gray-200">
            <th className="font-medium w-32">Date</th>
            <th className="font-medium w-96">Times</th>
            <th className="font-medium w-16">Actions</th>
          </tr>
        </thead>
        <tbody>{content}</tbody>
      </table>

      <div className="flex flex-wrap md:gap-0 gap-3 items-center justify-between p-5 border-t border-gray-200">
        <p className="text-sm text-gray-400">
          Showing <span className="font-medium text-gray-500">{start}</span> to{" "}
          <span className="font-medium text-gray-500">{end}</span> of{" "}
          <span className="font-medium text-gray-700">{totalItems}</span>{" "}
          results
        </p>
        <Pagination
          handlePageChange={handlePageChange}
          page={page}
          totalItems={totalItems}
          itemsPerPage={limit}
        />
      </div>

      {selected && (
        <WarningPopup
          open={open}
          title="Do you want to delete this slot?"
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
