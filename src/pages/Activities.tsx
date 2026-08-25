import React, { useState } from "react";
import { Link, useSearchParams } from "react-router";
import toast from "react-hot-toast";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { Search } from "lucide-react";
import WarningPopup from "../component/Warning.popup";
import Pagination from "../component/Pagination";
import SelectComponent from "../component/ui/Select.component";
import ActivityLoader from "../component/loader/Activity.loader";
import {
  useDeleteActivitiesMutation,
  useGetAllActivitiesQuery,
} from "../redux/features/activities/activitiesApi";
import type { ActivitiesType } from "../utils/activities.type";

function Activities() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectId, setSelectedId] = useState<string>("");
  const searchBy = searchParams.get("search") || "";
  const statusBy = searchParams.get("status") || "";
  const methodBy = searchParams.get("method") || "";
  const [open, setOpen] = useState<boolean>(false);
  const page = Number(searchParams.get("page")) || 1;
  const [deleteActivities, { isLoading: delLoading }] =
    useDeleteActivitiesMutation();
  const limit = 14;
  const { data, isLoading, isFetching } = useGetAllActivitiesQuery({
    page,
    limit,
    searchBy,
    statusBy,
    methodBy,
  });

  const totalItems = data?.data?.totalActivities;
  const activities = data?.data?.activities;

  const handlePageChange = (value: number) => {
    searchParams.set("page", value.toString());
    setSearchParams(searchParams);
  };

  const handleDelete = (id: string) => {
    setSelectedId(id);
    deleteActivities(id)
      .unwrap()
      .then((res) => {
        toast.success(res.message);
        setOpen(true);
        setSelectedId("");
      })
      .catch((error) => {
        const err = error as FetchBaseQueryError;
        const errorMessage = (err.data as { message: string }).message;
        toast.error(errorMessage);
      });
  };

  const handleSelectChange = (value: string, type: string) => {
    if (type === "METHOD") {
      if (value) {
        searchParams.set("method", value);
        searchParams.set("page", "1");
      } else {
        searchParams.delete("method");
        searchParams.delete("page");
      }
      setSearchParams(searchParams);
    }
    if (type === "STATUS") {
      if (value) {
        searchParams.set("status", value);
        searchParams.set("page", "1");
      } else {
        searchParams.delete("status");
        searchParams.delete("page");
      }
      setSearchParams(searchParams);
    }
  };

  // decide what to render
  let content;
  if (isLoading) {
    content = [...Array(12)].map((_, i) => <ActivityLoader key={i} />);
  }
  if (isFetching) {
    content = [...Array(12)].map((_, i) => <ActivityLoader key={i} />);
  }
  if (!isLoading && !isFetching && activities?.length === 0) {
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
  if (!isLoading && !isFetching && activities?.length > 0) {
    content = activities?.map((item: ActivitiesType) => {
      const { id, action, method, userId, status } = item || {};

      return (
        <tr key={id}>
          <td>{id}</td>
          <td>{userId ? userId : "N/A"}</td>
          <td>{method}</td>
          <td>{action}</td>
          <td>
            <p
              className={`w-fit px-3 py-1 rounded-md text-center font-medium text-sm ${
                status === "SUCCESS"
                  ? "bg-green-100 text-green-500"
                  : "bg-red-100 text-red-500"
              }`}
            >
              {status}
            </p>
          </td>
          <td>
            <div className="flex gap-3">
              <Link
                to={`/activity/${id}`}
                className="border border-gray-300 min-w-8 w-8 h-8 flex justify-center items-center rounded-md cursor-pointer"
              >
                <i className="fa-regular fa-eye"></i>
              </Link>
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
            <h2 className="text-normal text-2xl md:text-3xl">Acitvity Log</h2>
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
                <p className="text-normal text-sm md:text-base">Log List</p>
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
                  value={statusBy}
                  color="white"
                  handleChange={(value: string) =>
                    handleSelectChange(value, "STATUS")
                  }
                  datas={[
                    { key: "SUCCESS", value: "SUCCESS" },
                    { key: "FAILED", value: "FAILED" },
                  ]}
                  label="Select Status"
                />
              </div>
              <div className="w-full md:w-52">
                <SelectComponent
                  value={methodBy}
                  color="white"
                  handleChange={(value: string) =>
                    handleSelectChange(value, "METHOD")
                  }
                  datas={[
                    { key: "GET", value: "GET" },
                    { key: "POST", value: "POST" },
                    { key: "PATCH", value: "PATCH" },
                    { key: "DELETE", value: "DELETE" },
                  ]}
                  label="Select method"
                />
              </div>
            </div>
          </div>
          <div className="overflow-x-auto bg-white">
            <table className="my-table table-fixed w-full min-w-300">
              <thead>
                <tr className="border-y border-gray-300">
                  <th className="text-md text-gray-500 font-normal">LOG ID</th>
                  <th className="text-md text-gray-500 font-normal">USER ID</th>
                  <th className="text-md text-gray-500 font-normal">METHOD</th>
                  <th className="text-md text-gray-500 font-normal">
                    LOG ACTION
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

      {selectId && (
        <WarningPopup
          open={open}
          title="Do you want delete this log?"
          description={`Deleting this log will permanently remove all associated data from the database. This action cannot be undone. Click "Delete" to continue or "Close" to cancel.`}
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

export default Activities;
