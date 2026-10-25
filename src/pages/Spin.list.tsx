import { Pencil, Eye, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import toast from "react-hot-toast";
import WarningPopup from "../component/Warning.popup";
import Pagination from "../component/Pagination";
import SelectComponent from "../component/ui/Select.component";
import type { SpinType } from "../utils/spin.types";
import {
  useDeleteSpiningMutation,
  useGetAllSpiningQuery,
} from "../redux/features/spin/spinApi";
import UpdateSpining from "../component/spin/Update.spining";
import SpiningLoader from "../component/loader/Spining.loader";
import ViewSpining from "../component/spin/View.spining";

const statusStyles: Record<string, string> = {
  PEOPLE: "bg-emerald-100 text-emerald-700",
  CLUBS: "bg-orange-100 text-orange-700",
  HOTELS: "bg-blue-100 text-blue-700",
  RESTAURANTS: "bg-yellow-100 text-yellow-700",
  ALL: "bg-red-100 text-red-700",
};

const SpinList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [show, setShow] = useState(false);
  const searchBy = searchParams.get("search") || "";
  const [view, setView] = useState(false);
  const [open, setOpen] = useState(false);
  const [deleteSpining, { isLoading: delLoad }] = useDeleteSpiningMutation();
  const page = Number(searchParams.get("page")) || 1;
  const [selectId, setSelectedId] = useState<string>("");
  const limit = 14;
  const { data, isFetching, isLoading } = useGetAllSpiningQuery({
    page,
    limit,
    searchBy: searchBy,
    landerId: "",
  });
  const handlePageChange = (value: number) => {
    searchParams.set("page", value.toString());
    setSearchParams(searchParams);
  };
  const group = data?.data?.spining || [];
  const currentPage = data?.data?.currentPage || [];
  const totalItem = data?.data?.totalSpining || 0;
  const start = (currentPage - 1) * limit + 1;
  const end = Math.min(currentPage * limit, totalItem);

  const handleDelete = (id: string) => {
    setSelectedId(id);
    deleteSpining(id)
      .unwrap()
      .then((res) => {
        toast.success(res.message);
        setSelectedId("");
        setOpen(false);
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
    content = [...Array(8)].map((_, i) => <SpiningLoader key={i} />);
  }
  if (!isFetching && !isLoading && group?.length === 0) {
    content = (
      <tr>
        <td colSpan={6} className="p-0!">
          <p className="bg-[#FEFBED] text-center text-[#643315] text-md font-normal py-5 rounded-md">
            Data not found!
          </p>
        </td>
      </tr>
    );
  }
  if (!isFetching && !isLoading && group?.length > 0) {
    content = group?.map((item: SpinType) => {
      const { id, groupType, title, url, create_at, isEnable } = item;
      const formattedDate = (value: string) => {
        const createDate = new Date(value);
        return createDate?.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
      };
      return (
        <tr key={id} className="hover:bg-gray-50">
          <td className="text-sm text-gray-600">{formattedDate(create_at)}</td>
          <td>{title}</td>
          <td className="text-sm text-gray-500">{url?.slice(0, 50)}..</td>
          <td>
            <span
              className={`px-3 py-1 text-xs font-medium rounded-full ${statusStyles[groupType]}`}
            >
              {groupType}
            </span>
          </td>
          <td>
            <span
              className={`px-3 py-1 text-xs font-medium rounded-full ${isEnable ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
            >
              {isEnable ? "ACTIVE" : "DEACTIVATE"}
            </span>
          </td>
          <td>
            <div className="flex gap-2 text-gray-500">
              <button
                onClick={() => {
                  setShow(true);
                  setSelectedId(id);
                }}
                className="border border-[#E7EBF2] text-[#8C98AE] active:bg-[#E7EBF2] w-10 h-10 flex justify-center items-center rounded-lg cursor-pointer"
              >
                <Pencil size={20} />
              </button>

              <button
                onClick={() => {
                  setView(true);
                  setSelectedId(id);
                }}
                className="border border-[#E7EBF2] text-[#8C98AE] active:bg-[#E7EBF2] w-10 h-10 flex justify-center items-center rounded-lg cursor-pointer"
              >
                <Eye size={20} />
              </button>
              <button
                onClick={() => {
                  setSelectedId(id);
                  setOpen(true);
                }}
                className="border border-[#E7EBF2] text-[#8C98AE] active:bg-[#E7EBF2] w-10 h-10 flex justify-center items-center rounded-lg cursor-pointer"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </td>
        </tr>
      );
    });
  }

  return (
    <section className="min-h-screen p-3 md:p-5">
      <div className="md:w-6/12 w-full">
        <h2 className="text-normal text-2xl md:text-3xl">SPIN</h2>
        <ul className="flex gap-2 flex-wrap items-center py-2">
          <li>
            <Link to="/" className="text-normal text-sm md:text-base">
              Dashboard
            </Link>
          </li>
          <li>
            <i className="fa-solid fa-angles-right text-xs"></i>
          </li>
          <li>
            <p className="text-normal text-sm md:text-base">SPIN List</p>
          </li>
        </ul>
      </div>
      <div className="w-full mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm mt-3">
        <div className="flex md:flex-row flex-col gap-3 md:gap-0 items-center w-full justify-between p-6">
          <div className="w-full md:w-96">
            <SelectComponent
              value={searchBy}
              label="Select group type"
              handleChange={(value: string) => {
                if (value) {
                  searchParams.set("search", value);
                  searchParams.set("page", "1");
                } else {
                  searchParams.delete("search");
                  searchParams.delete("page");
                }
                setSearchParams(searchParams);
              }}
              datas={[
                { key: "PEOPLE", value: "PEOPLE" },
                { key: "CLUBS", value: "CLUBS" },
                { key: "HOTELS", value: "HOTELS" },
                { key: "RESTAURANTS", value: "RESTAURANTS" },
                { key: "ALL", value: "ALL" },
              ]}
              color="#F3F3F3"
            />
          </div>
        </div>
        <div className="xl:overflow-x-auto overflow-x-scroll custom-scroll bg-white">
          <table className="my-table table-fixed w-full min-w-350">
            <thead className="text-xs uppercase text-gray-500 bg-gray-50">
              <tr className="border-y border-gray-200">
                <th className="text-left px-6 py-4">Create at</th>
                <th className="text-left px-6 py-4">Name</th>
                <th className="text-left px-6 py-4">URL</th>
                <th className="text-left px-6 py-4">Group Type</th>
                <th className="text-left px-6 py-4">Status</th>
                <th className="text-left px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>{content}</tbody>
          </table>
        </div>
        <div className="flex flex-wrap md:gap-0 gap-3 items-center justify-between px-6 py-5 border-t border-gray-200">
          <p className="text-sm text-gray-400">
            Showing <span className="font-medium text-gray-500">{start}</span>{" "}
            to <span className="font-medium text-gray-500">{end}</span> of{" "}
            <span className="font-medium text-gray-700">{totalItem}</span>{" "}
            results
          </p>
          <Pagination
            handlePageChange={handlePageChange}
            page={page}
            totalItems={totalItem}
            itemsPerPage={limit}
          />
        </div>
      </div>
      {view && selectId ? (
        <ViewSpining
          isOpen={view}
          onClose={() => setView(false)}
          id={selectId}
        />
      ) : null}
      {show && (
        <UpdateSpining
          isOpen={show}
          onClose={() => setShow(false)}
          id={selectId}
        />
      )}
      {selectId && (
        <WarningPopup
          open={open}
          title="Do you want to delete this SPIN?"
          description={`Deleting this spin will permanently remove all associated data from the database. This action cannot be undone. Click "Delete" to continue or "Close" to cancel.`}
          smButton="Delete"
          clButton="Close"
          onClose={() => setOpen(false)}
          onConfirm={() => handleDelete(selectId)}
          loading={delLoad}
        />
      )}
    </section>
  );
};

export default SpinList;
