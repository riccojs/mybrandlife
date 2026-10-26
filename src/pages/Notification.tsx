import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import toast from "react-hot-toast";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import {
  useDeleteNotificationMutation,
  useGetAllNotificationQuery,
  useSeenNotificationMutation,
} from "../redux/features/notification/notificationApi";
import NotificationLoader from "../component/loader/Notification.loader";
import type { NotificationType } from "../utils/notification.type";
import SelectComponent from "../component/ui/Select.component";
import Pagination from "../component/Pagination";
import WarningPopup from "../component/Warning.popup";
import SingleNotification from "../component/notification/Single.notification";
import SearchComponent from "../component/ui/Search.component";

function Notification() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectId, setSelectedId] = useState<string>("");
  const searchBy = searchParams.get("search") || "";
  const seenBy = searchParams.get("status") || "";
  const [showTab, setShowTab] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const page = Number(searchParams.get("page")) || 1;
  const [seenNotification] = useSeenNotificationMutation();
  const [deleteNotification, { isLoading: delLoading }] =
    useDeleteNotificationMutation();
  const limit = 14;
  const { data, isLoading, isFetching } = useGetAllNotificationQuery({
    page,
    limit,
    searchBy,
    seenBy,
  });

  const totalItem = data?.data?.totalNotification;
  const notifications = data?.data?.notification;
  const currentPage = data?.data?.currentPage || [];
  const start = (currentPage - 1) * limit + 1;
  const end = Math.min(currentPage * limit, totalItem);

  const handlePageChange = (value: number) => {
    searchParams.set("page", value.toString());
    setSearchParams(searchParams);
  };

  const handleDelete = (id: string) => {
    setSelectedId(id);
    deleteNotification(id)
      .unwrap()
      .then((res) => {
        toast.success(res.message);
        setOpen(false);
        setSelectedId("");
      })
      .catch((error) => {
        const err = error as FetchBaseQueryError;
        const errorMessage = (err.data as { message: string }).message;
        toast.error(errorMessage);
      });
  };

  useEffect(() => {
    if (showTab) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showTab]);

  const formattedDate = (value: string) => {
    const createDate = new Date(value);
    return createDate?.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleClick = (id: string, redirectUrl: string) => {
    navigate(redirectUrl);
    const infoData = { seen: true };
    seenNotification({ id, infoData });
  };

  // decide what to render
  let content;
  if (isLoading) {
    content = [...Array(12)].map((_, i) => <NotificationLoader key={i} />);
  }
  if (isFetching) {
    content = [...Array(12)].map((_, i) => <NotificationLoader key={i} />);
  }
  if (!isLoading && !isFetching && notifications?.length === 0) {
    content = (
      <tr>
        <td colSpan={5} className="p-0!">
          <p className="bg-[#FEFBED] text-center text-[#643315] text-md font-normal py-5 rounded-md">
            Data not found!
          </p>
        </td>
      </tr>
    );
  }
  if (!isLoading && !isFetching && notifications?.length > 0) {
    content = notifications?.map((item: NotificationType) => {
      const { id, title, redirectUrl, userId, seen, profile, create_at } =
        item || {};

      return (
        <tr key={id} className="hover:bg-gray-50">
          <td>
            <div className="flex gap-2 items-center">
              {profile ? (
                <img
                  src={profile}
                  alt=""
                  className="w-10 min-w-10 h-10 mn-h-10 rounded-full object-cover"
                />
              ) : (
                <p className="capitalize w-10 min-w-10 h-10 mn-h-10 bg-gray-100 text-black text-xl font-medium rounded-full flex justify-center items-center">
                  {title?.slice(0, 1)}
                </p>
              )}
              <span>
                <h2 className="text-md text-medium jost">{title}</h2>
                <p className="text-xs text-gray-400">
                  Join: {formattedDate(create_at)}
                </p>
              </span>
            </div>
          </td>
          <td className="text-sm text-gray-500">{userId ? userId : "-"}</td>
          <td className="max-w-full break-all text-sm text-gray-500">
            {redirectUrl}
          </td>
          <td>
            <p
              className={`w-fit px-3 py-1 rounded-md text-center font-medium text-xs ${
                seen ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}
            >
              {seen ? "READ" : "UNREAD"}
            </p>
          </td>
          <td>
            <div className="flex gap-2">
              <button
                onClick={() => handleClick(id, redirectUrl)}
                className="border border-[#E7EBF2] text-[#8C98AE] active:bg-[#E7EBF2] w-10 h-10 flex justify-center items-center rounded-lg cursor-pointer"
              >
                <i className="fa-regular fa-eye"></i>
              </button>
              <button
                onClick={() => {
                  setOpen(true);
                  setSelectedId(id);
                }}
                className="border border-[#E7EBF2] text-[#8C98AE] active:bg-[#E7EBF2] w-10 h-10 flex justify-center items-center rounded-lg cursor-pointer"
              >
                <i className="fa-regular fa-trash-can"></i>
              </button>
            </div>
          </td>
        </tr>
      );
    });
  }

  return (
    <React.Fragment>
      <div className="p-3 md:p-5 min-h-screen">
        <div className="flex md:flex-row flex-col justify-between items-start md:items-center">
          <div className="md:w-6/12 w-full">
            <h2 className="text-normal text-xl md:text-3xl">Notifications</h2>
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
                  Notification List
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
                placeholder="Seach by user id"
                required={false}
                autoComplete="text"
                value={searchBy}
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
            <div className="flex gap-5">
              <div className="w-full md:w-52">
                <SelectComponent
                  value={seenBy}
                  color="white"
                  handleChange={(value: string) => {
                    if (value) {
                      searchParams.set("status", value);
                      searchParams.set("page", "1");
                    } else {
                      searchParams.delete("status");
                      searchParams.delete("page");
                    }
                    setSearchParams(searchParams);
                  }}
                  datas={[
                    { key: "READ", value: "READ" },
                    { key: "UNREAD", value: "UNREAD" },
                  ]}
                  label="Select Status"
                />
              </div>
            </div>
          </div>
          <div className="xl:overflow-x-auto overflow-x-scroll custom-scroll bg-white">
            <table className="my-table table-fixed w-full min-w-350">
              <thead className="text-xs uppercase text-gray-500 bg-gray-50">
                <tr className="border-y border-gray-200">
                  <th>INFOS</th>
                  <th>USER ID</th>
                  <th>REDIRECT URL</th>
                  <th>STATUS</th>
                  <th>ACTION</th>
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
      </div>
      {showTab && (
        <SingleNotification
          setShow={setShowTab}
          id={selectId}
          isShow={showTab}
        />
      )}
      {selectId && (
        <WarningPopup
          open={open}
          title="Do you want to delete this notification?"
          description={`Deleting notification will permanently remove all associated data from the database. This action cannot be undone. Click "Delete" to continue or "Close" to cancel.`}
          smButton="Delete"
          clButton="Close"
          onClose={() => setOpen(false)}
          onConfirm={() => handleDelete(selectId)}
          loading={delLoading}
        />
      )}
    </React.Fragment>
  );
}

export default Notification;
