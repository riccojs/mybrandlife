import React, { useState } from "react";
import { Link, useSearchParams } from "react-router";
import toast from "react-hot-toast";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import WarningPopup from "../component/Warning.popup";
import Pagination from "../component/Pagination";
import SelectComponent from "../component/ui/Select.component";
import ActivityLoader from "../component/loader/Activity.loader";
import {
  useDeleteActivitiesMutation,
  useGetAllActivitiesQuery,
} from "../redux/features/activities/activitiesApi";
import type { ActivitiesType } from "../utils/activities.type";
import SearchComponent from "../component/ui/Search.component";

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

  const totalItem = data?.data?.totalActivities;
  const activities = data?.data?.activities;
  const currentPage = data?.data?.currentPage || [];
  const start = (currentPage - 1) * limit + 1;
  const end = Math.min(currentPage * limit, totalItem);

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
        <td colSpan={6} className="p-0!">
          <p className="bg-[#FEFBED] text-center text-[#643315] text-md font-normal py-5 rounded-md">
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
        <tr key={id} className="hover:bg-gray-50">
          <td className="text-sm text-gray-500">{id}</td>
          <td className="text-sm text-gray-500">{userId ? userId : "-"}</td>
          <td>{method}</td>
          <td>{action}</td>
          <td>
            <p
              className={`w-fit px-3 py-1 rounded-md text-center font-medium text-xs ${
                status === "SUCCESS"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {status}
            </p>
          </td>
          <td>
            <div className="flex gap-2">
              <Link
                to={`/activity/${id}`}
                className="border border-[#E7EBF2] text-[#8C98AE] active:bg-[#E7EBF2] w-10 h-10 flex justify-center items-center rounded-lg cursor-pointer"
              >
                <i className="fa-regular fa-eye"></i>
              </Link>
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
            <h2 className="text-normal text-2xl md:text-3xl">Acitvity Log</h2>
            <ul className="flex flex-wrap gap-2 items-center py-2">
              <li>
                <Link to="/" className="text-normal text-sm md:text-base">
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
          <div className="xl:overflow-x-auto overflow-x-scroll custom-scroll bg-white">
            <table className="my-table table-fixed w-full min-w-350">
              <thead className="text-xs uppercase text-gray-500 bg-gray-50">
                <tr className="border-y border-gray-200">
                  <th>LOG ID</th>
                  <th>USER ID</th>
                  <th>METHOD</th>
                  <th>LOG ACTION</th>
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

      {selectId && (
        <WarningPopup
          open={open}
          title="Do you want to delete this log?"
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
