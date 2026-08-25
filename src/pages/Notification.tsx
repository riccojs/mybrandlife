import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import toast from "react-hot-toast";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { Search } from "lucide-react";
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

  const totalItems = data?.data?.totalNotification;
  const notifications = data?.data?.notification;

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
        <td colSpan={6}>
          <p className="bg-amber-100 text-md font-normal p-3 rounded-md">
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
        <tr key={id}>
          <td>
            <div className="flex gap-2 items-center">
              {profile ? (
                <img
                  src={profile}
                  alt=""
                  className="w-16 h-16 min-w-16 rounded-full object-cover"
                />
              ) : (
                <p className="bg-[#2B7F75] w-16 h-16 min-w-16 flex justify-center items-center rounded-full">
                  <i className="fa-regular fa-bell text-white text-2xl"></i>
                </p>
              )}
              <div>
                <p>{title}</p>
                <p className="text-sm font-normal text-gray-400">
                  {formattedDate(create_at)}
                </p>
              </div>
            </div>
          </td>
          <td>{userId ? userId : "N/A"}</td>
          <td className="max-w-full break-all">{redirectUrl}</td>
          <td>
            <p
              className={`w-fit px-3 py-1 rounded-md text-center font-medium text-sm ${
                seen ? "bg-green-100 text-green-500" : "bg-red-100 text-red-500"
              }`}
            >
              {seen ? "READ" : "UNREAD"}
            </p>
          </td>
          <td>
            <div className="flex gap-3">
              <button
                onClick={() => handleClick(id, redirectUrl)}
                className="border border-gray-300 min-w-8 w-8 h-8 flex justify-center items-center rounded-md cursor-pointer"
              >
                <i className="fa-regular fa-eye"></i>
              </button>
              <button
                onClick={() => {
                  setOpen(true);
                  setSelectedId(id);
                }}
                className="border border-gray-300 w-8 h-8 flex justify-center items-center rounded-md cursor-pointer"
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
            <h2 className="text-normal text-2xl md:text-3xl">Notifications</h2>
            <ul className="flex gap-2 items-center py-2">
              <li>
                <Link
                  to="/admin/dashboard"
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
                  Notification List
                </p>
              </li>
            </ul>
          </div>
        </div>
        <div className="w-full mt-5 mx-auto bg-white rounded-2xl border border-gray-200">
          <div className="flex flex-wrap gap-3 md:gap-0 items-center justify-between p-6">
            <div className="relative w-96">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                onChange={(e) => {
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
                value={searchBy}
                placeholder="Search by user id..."
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
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
          <div className="overflow-x-auto bg-white">
            <table className="my-table table-fixed w-full min-w-300">
              <thead>
                <tr className="border-y border-gray-300">
                  <th className="text-md text-gray-500 font-normal">INFOS</th>
                  <th className="text-md text-gray-500 font-normal">USER ID</th>
                  <th className="text-md text-gray-500 font-normal">
                    REDIRECT URL
                  </th>
                  <th className="text-md text-gray-500 font-normal">STATUS</th>
                  <th className="text-md text-gray-500 font-normal">ACTION</th>
                </tr>
              </thead>
              <tbody>{content}</tbody>
            </table>
          </div>
        </div>
        {totalItems > limit && (
          <Pagination
            handlePageChange={handlePageChange}
            page={page}
            totalItems={totalItems}
            itemsPerPage={limit}
          />
        )}
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
          title="Do you want delete this notification?"
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
