import React, { useState } from "react";
import { Link, useSearchParams } from "react-router";
import { RiCalendarEventFill } from "react-icons/ri";
import { RiDeleteBin5Line } from "react-icons/ri";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import toast from "react-hot-toast";
import Pagination from "../component/Pagination";
import { useAuth } from "../hook/useAuth";
import SearchComponent from "../component/ui/Search.component";
import SelectComponent from "../component/ui/Select.component";
import {
  useDeleteEventMutation,
  useGetAllEventQuery,
} from "../redux/features/event/eventApi";
import ConnectGoogle from "../component/brandbook/Connect.google";
import ViewBrandbook from "../component/brandbook/View.brandbook";
import BrandbookLoader from "../component/loader/Brandbook.loader";
import BrandbookAgreement from "../component/brandbook/Brandbook.agreement";
import UpdateBrandbook from "../component/brandbook/Update.brandbook";
import WarningPopup from "../component/popups/Warning.popup";

interface UserType {
  package?: string;
  id: string;
  userTemplete: { enableEvent: boolean }[];
  membership: { status: string }[];
  domain: string;
  calendarId: string;
}

function Brandbook() {
  const { user } = useAuth() as { user: UserType | null };
  const templete = user?.userTemplete?.[0];
  const { enableEvent } = templete || {};
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page") || 1;
  const search = searchParams.get("search") || "";
  const statusBy = searchParams.get("status") || "";
  const [eventStatus, setEventStatus] = useState("");
  const [isShow, setIsShow] = useState(false);
  const [viewEvent, setViewEvent] = useState(false);
  const [updateEvent, setUpdateEvent] = useState(false);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("");
  const limit = 14;
  const [deleteEvent, { isLoading: delLoad }] = useDeleteEventMutation();
  const { data, isLoading, isFetching } = useGetAllEventQuery({
    page: page,
    limit: limit,
    searchBy: search,
    statusBy: statusBy,
    userId: user?.id,
  });
  const events = data?.data?.event;
  const totalItems = data?.data?.totalEvent;
  const existTemplate = user && user?.userTemplete?.length > 0 ? true : false;
  const handlePageChange = (newPage: number) => {
    searchParams.set("page", newPage.toString());
    setSearchParams(searchParams);
  };

  const handleChange = (value: string) => {
    if (value) {
      searchParams.set("status", value);
      searchParams.set("page", "1");
    } else {
      searchParams.delete("status");
      searchParams.delete("page");
    }
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
        <td colSpan={7}>
          <p className="bg-amber-100 text-md font-normal p-3 rounded-md">
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
          <tr key={id}>
            <td>{name}</td>
            <td>{email?.slice(0, 16)}...</td>
            <td>{formattedDate(date)}</td>
            <td>{time}</td>
            <td>{note}</td>
            <td>
              <p
                className={`w-fit px-3 py-1 rounded-md text-center font-medium text-sm capitalize ${
                  status === "PENDING" || status === "REJECTED"
                    ? "bg-red-100 text-red-500"
                    : "bg-green-100 text-green-500"
                }`}
              >
                {status}
              </p>
            </td>
            <td>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setSelected(id);
                    setViewEvent(true);
                  }}
                  className="border border-gray-300 min-w-8 w-8 h-8 flex justify-center items-center rounded-md cursor-pointer"
                >
                  <i className="fa-regular fa-eye"></i>
                </button>
                <button
                  onClick={() => {
                    setSelected(id);
                    setUpdateEvent(true);
                    setEventStatus(status);
                  }}
                  className="border border-gray-300 min-w-8 w-8 h-8 flex justify-center items-center rounded-md cursor-pointer"
                >
                  <i className="fa-regular fa-pen-to-square"></i>
                </button>
                <button
                  onClick={() => {
                    setSelected(id);
                    setOpen(true);
                  }}
                  className="border border-gray-300 min-w-8 w-8 h-8 flex justify-center items-center rounded-md cursor-pointer"
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
            <ul className="flex gap-2 items-center py-2">
              <li>
                <Link
                  to="/dashboard"
                  className="text-normal text-sm md:text-base"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <i className="fa-solid fa-angles-right text-xs"></i>
              </li>
              <li>
                <p className="text-normal text-sm md:text-base">
                  {user?.domain}
                </p>
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
        {!existTemplate && (
          <div>
            <p className="text-black bg-amber-100 border-l-3 border-amber-400 p-3 rounded-lg text-sm">
              Build your brand to unlock Brandbook and start engaging your
              audience.
            </p>
          </div>
        )}
        <div className="flex flex-col gap-5 mt-5">
          <div className="w-full 2xl:flex-row flex-col gap-5 flex justify-between items-center">
            <div className="flex md:w-auto w-full sm:flex-row flex-col justify-between items-start gap-3 md:items-center">
              <div className="w-full md:w-96">
                <SearchComponent
                  name="search"
                  color="white"
                  value={search}
                  placeholder="Seach by name"
                  required={false}
                  autoComplete="text"
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
                  handleChange={handleChange}
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
            {existTemplate && (
              <div className="flex w-full sm:w-auto sm:flex-row flex-col gap-5 items-center">
                {enableEvent ? (
                  <button
                    onClick={() => {
                      if (user?.calendarId) {
                        setIsShow(true);
                      } else {
                        return;
                      }
                    }}
                    className={`min-w-52 w-full px-6 py-3 rounded-lg flex gap-2 items-center justify-center ${user?.calendarId ? "bg-gray-200 cursor-pointer" : "bg-gray-300 cursor-not-allowed"}`}
                  >
                    Hide Brandbook
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      if (user?.calendarId) {
                        setIsShow(true);
                      } else {
                        return;
                      }
                    }}
                    className={`min-w-52 w-full px-6 py-3 rounded-lg flex gap-2 items-center justify-center ${user?.calendarId ? "bg-[#cbf38b] cursor-pointer" : "bg-gray-300 cursor-not-allowed"}`}
                  >
                    Show Brandbook
                  </button>
                )}
                <ConnectGoogle />
                <Link
                  to="/brandbook/slot"
                  className="bg-[#cbf38b] min-w-44 w-full px-6 py-3 rounded-lg flex gap-2 items-center justify-center"
                >
                  <RiCalendarEventFill size={20} />
                  <p>Configure Dates</p>
                </Link>
              </div>
            )}
          </div>
          <div className="overflow-x-auto bg-white">
            <table className="my-table table-fixed w-full min-w-300">
              <thead>
                <tr className="border-y border-gray-300">
                  <th>Name</th>
                  <th className="w-52">Email</th>
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
        </div>
        {totalItems > limit && (
          <Pagination
            handlePageChange={handlePageChange}
            page={Number(page)}
            totalItems={totalItems}
            itemsPerPage={limit}
          />
        )}
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
        {viewEvent && selected ? (
          <ViewBrandbook
            isShow={viewEvent}
            setShow={setViewEvent}
            id={selected}
          />
        ) : null}
        {updateEvent && selected ? (
          <UpdateBrandbook
            isShow={updateEvent}
            setShow={setUpdateEvent}
            id={selected}
            status={eventStatus}
          />
        ) : null}
        {selected && (
          <WarningPopup
            open={open}
            title="Do you want delete this BrandBook request?"
            description={`Deleting this BrandBook request will permanently remove all associated data from the database. This action cannot be undone. Click "Delete" to continue or "Close" to cancel.`}
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

export default Brandbook;
