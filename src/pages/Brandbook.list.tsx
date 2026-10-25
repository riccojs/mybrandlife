import React, { useState } from "react";
import { Link, useSearchParams } from "react-router";
import { RiDeleteBin5Line } from "react-icons/ri";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import toast from "react-hot-toast";
import WarningPopup from "../component/Warning.popup";
import Pagination from "../component/Pagination";
import SelectComponent from "../component/ui/Select.component";
import SearchComponent from "../component/ui/Search.component";
import {
  useDeleteEventMutation,
  useGetAllEventQuery,
} from "../redux/features/event/eventApi";
import { useAuth } from "../hook/useAuth";
import ViewBrandbook from "../component/brandbook/View.brandbook";
import BrandbookLoader from "../component/loader/Brandbook.loader";
import BrandbookAgreement from "../component/brandbook/Brandbook.agreement";
import UpdateBrandbook from "../component/brandbook/Update.brandbook";

interface UserType {
  package?: string;
  id: string;
  userTemplete: { enableEvent: boolean }[];
  membership: { status: string }[];
}

function BrandbookList() {
  const { user } = useAuth() as { user: UserType | null };
  const templete = user?.userTemplete?.[0];
  const { enableEvent } = templete || {};
  const [isShow, setIsShow] = useState(false);
  const [viewEvent, setViewEvent] = useState(false);
  const [updateEvent, setUpdateEvent] = useState(false);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const view = searchParams.get("view") || "";
  const limit = 14;
  const [deleteEvent, { isLoading: delLoad }] = useDeleteEventMutation();
  const { data, isLoading, isFetching } = useGetAllEventQuery({
    page: page,
    limit: limit,
    searchBy: search,
    statusBy: status,
    userId: "",
  });
  const events = data?.data?.event;
  const totalItem = data?.data?.totalEvent;
  const brandbookId = view ? view : selected;
  const currentPage = data?.data?.currentPage || [];
  const start = (currentPage - 1) * limit + 1;
  const end = Math.min(currentPage * limit, totalItem);

  const handlePageChange = (value: number) => {
    searchParams.set("page", value.toString());
    setSearchParams(searchParams);
  };

  const formattedDate = (value: string) => {
    const createDate = new Date(value);
    return createDate?.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleDelete = (id: string) => {
    setSelected(id);
    deleteEvent(id)
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
  if (isLoading || isFetching) {
    content = [...Array(8)].map((_, i) => <BrandbookLoader key={i} />);
  }
  if (!isLoading && !isFetching && events?.length === 0) {
    content = (
      <tr>
        <td colSpan={7} className="p-0!">
          <p className="bg-[#FEFBED] text-center text-[#643315] text-md font-normal py-5 rounded-md">
            Data not found!
          </p>
        </td>
      </tr>
    );
  }
  if (!isLoading && !isFetching && events?.length > 0) {
    content = events?.map(
      (item: {
        id: string;
        name: string;
        email: string;
        date: string;
        time: string;
        note: string;
        status: string;
      }) => {
        const { id, name, email, date, time, note, status } = item || {};

        return (
          <tr key={id} className="hover:bg-gray-50">
            <td>{name}</td>
            <td className="text-sm">{email?.slice(0, 20)}..</td>
            <td>{formattedDate(date)}</td>
            <td>{time}</td>
            <td>{note}</td>
            <td>
              <p
                className={`w-fit px-3 py-1 rounded-md text-center font-medium text-xs ${
                  status === "PENDING" || status === "REJECTED"
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {status}
              </p>
            </td>
            <td>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelected(id);
                    setViewEvent(true);
                  }}
                  className="border border-[#E7EBF2] text-[#8C98AE] active:bg-[#E7EBF2] w-10 h-10 flex justify-center items-center rounded-lg cursor-pointer"
                >
                  <i className="fa-regular fa-eye"></i>
                </button>
                <button
                  onClick={() => {
                    setSelected(id);
                    setUpdateEvent(true);
                  }}
                  className="border border-[#E7EBF2] text-[#8C98AE] active:bg-[#E7EBF2] w-10 h-10 flex justify-center items-center rounded-lg cursor-pointer"
                >
                  <i className="fa-regular fa-pen-to-square"></i>
                </button>
                <button
                  onClick={() => {
                    setOpen(true);
                    setSelected(id);
                  }}
                  className="border border-[#E7EBF2] text-[#8C98AE] active:bg-[#E7EBF2] w-10 h-10 flex justify-center items-center rounded-lg cursor-pointer"
                >
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
    <React.Fragment>
      <div className="p-3 md:p-5 min-h-screen">
        <div className="flex md:flex-row flex-col justify-between items-start md:items-center">
          <div className="md:w-6/12 w-full">
            <h2 className="text-normal text-2xl md:text-3xl">BrandBook</h2>
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
                <p className="text-normal text-sm md:text-base">
                  BrandBook List
                </p>
              </li>
            </ul>
          </div>
        </div>

        <div className="w-full mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm mt-3">
          <div className="flex md:flex-row flex-col gap-3 md:gap-0 items-center w-full justify-between p-6">
            <div className="w-full md:w-96">
              <SearchComponent
                name="search"
                color="white"
                placeholder="Seach by name"
                required={false}
                autoComplete="text"
                value={search}
                handleChange={(e) => {
                  const value = e.target.value;
                  if (value) {
                    searchParams.set("search", value);
                    searchParams.set("page", "1");
                  } else {
                    searchParams.delete("search");
                    searchParams.delete("page");
                  }
                  setSearchParams(searchParams);
                }}
              />
            </div>
            <div className="w-full md:w-52">
              <SelectComponent
                value={status}
                color="white"
                handleChange={(item: string) => {
                  if (item) {
                    searchParams.set("status", item);
                    searchParams.set("page", "1");
                  } else {
                    searchParams.delete("status");
                    searchParams.delete("page");
                  }
                  setSearchParams(searchParams);
                }}
                datas={[
                  { key: "Pending", value: "PENDING" },
                  { key: "Confirmed", value: "CONFIRMED" },
                  { key: "Rejected", value: "REJECTED" },
                  { key: "Canceled", value: "CANCELED" },
                  { key: "Expired", value: "EXPIRED" },
                ]}
                label="Select Status"
              />
            </div>
          </div>
          <div className="xl:overflow-x-auto overflow-x-scroll custom-scroll bg-white">
            <table className="my-table table-fixed w-full min-w-350">
              <thead className="text-xs uppercase text-gray-500 bg-gray-50">
                <tr className="border-y border-gray-200">
                  <th>Name</th>
                  <th>Email</th>
                  <th>Selected Date</th>
                  <th>Selected Time</th>
                  <th>Note</th>
                  <th>Status</th>
                  <th>Actions</th>
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

        {isShow && enableEvent && (
          <BrandbookAgreement
            setShow={setIsShow}
            isShow={isShow}
            body="Are you sure you want to disable the brandbook booking feature? You will stop receiving all upcoming booking."
            status={false}
          />
        )}
        {isShow && !enableEvent && (
          <BrandbookAgreement
            setShow={setIsShow}
            isShow={isShow}
            body="Are you sure you want to enable the brandbook booking feature? You'll start receiving new booking requests from customers."
            status={true}
          />
        )}
        {(viewEvent && selected) || view ? (
          <ViewBrandbook
            isShow={viewEvent}
            setShow={setViewEvent}
            id={brandbookId}
          />
        ) : null}
        {updateEvent && selected ? (
          <UpdateBrandbook
            isShow={updateEvent}
            setShow={setUpdateEvent}
            id={selected}
          />
        ) : null}
        {selected && (
          <WarningPopup
            open={open}
            title="Do you want to delete this BrandBook Request?"
            description={`Deleting this BrandBook Request will permanently remove all associated data from the database. This action cannot be undone. Click "Delete" to continue or "Close" to cancel.`}
            smButton="Delete"
            clButton="Close"
            onClose={() => setOpen(false)}
            onConfirm={() => handleDelete(selected)}
            loading={delLoad}
          />
        )}
      </div>
    </React.Fragment>
  );
}

export default BrandbookList;
