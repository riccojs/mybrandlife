import React, { useState } from "react";
import { Link, useSearchParams } from "react-router";
import toast from "react-hot-toast";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import {
  useDeleteUserMutation,
  useGetAllUserQuery,
} from "../redux/features/auth/authApi";
import WarningPopup from "../component/Warning.popup";
import Pagination from "../component/Pagination";
import SelectComponent from "../component/ui/Select.component";
import SearchComponent from "../component/ui/Search.component";
import UserLoader from "../component/loader/User.loader";

function UserList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const [selected, setSelected] = useState<string>("");
  const [name, setName] = useState("");
  const [deleteUser, { isLoading: delLoad }] = useDeleteUserMutation();

  const [showDelTab, setShowDelTab] = useState<boolean>(false);
  const limit = 14;
  const { data, isLoading, isFetching } = useGetAllUserQuery({
    page,
    limit,
    searchBy: search,
    statusBy: status,
  });

  const formattedDate = (value: string) => {
    const createDate = new Date(value);
    return createDate?.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const totalItem = data?.data?.totalUser;
  const users = data?.data?.user;
  const currentPage = data?.data?.currentPage || [];
  const start = (currentPage - 1) * limit + 1;
  const end = Math.min(currentPage * limit, totalItem);

  const handlePageChange = (value: number) => {
    searchParams.set("page", value.toString());
    setSearchParams(searchParams);
  };

  const handleDelete = (id: string) => {
    deleteUser(id)
      .unwrap()
      .then((res) => {
        toast.success(res.message);
        setSelected("");
        setShowDelTab(false);
      })
      .catch((error) => {
        const err = error as FetchBaseQueryError;
        const errorMessage = (err.data as { message: string }).message;
        toast.error(errorMessage);
      });
  };

  // decide what to render
  let content;
  if (isLoading) {
    content = [...Array(10)].map((_, i) => <UserLoader key={i} />);
  }
  if (isFetching) {
    content = [...Array(10)].map((_, i) => <UserLoader key={i} />);
  }
  if (!isLoading && !isFetching && users?.length === 0) {
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
  if (!isLoading && !isFetching && users?.length > 0) {
    content = users?.map(
      (item: {
        id: string;
        midName: string;
        username: string;
        firstName: string;
        email: string;
        create_at: string;
        phone: string;
        status: string;
        profile: string;
        landerName: string;
        domain: string;
        package: string;
        lastName: string;
      }) => {
        const {
          id,
          firstName,
          email,
          create_at,
          status,
          profile,
          landerName,
          domain,
          package: pkgType,
          lastName,
        } = item || {};

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
                    {firstName?.slice(0, 1)}
                  </p>
                )}
                <span>
                  <h2 className="text-md text-medium jost">{`${firstName} ${lastName}`}</h2>
                  <p className="text-xs text-gray-400">
                    Join: {formattedDate(create_at)}
                  </p>
                </span>
              </div>
            </td>
            <td>{landerName}</td>
            <td className="text-sm">{email?.slice(0, 22)}..</td>
            <td>{domain}</td>
            <td className="capitalize">{pkgType}</td>
            <td>
              <p
                className={`${
                  status === "ACTIVATE"
                    ? "bg-green-100 w-fit px-3 py-1 rounded-md text-center text-green-700 font-medium text-xs"
                    : "bg-red-100 w-fit px-3 py-1 rounded-md text-center text-red-700 font-medium text-xs"
                }`}
              >
                {status}
              </p>
            </td>
            <td>
              <div className="flex gap-2">
                <Link
                  to={`/user/${id}`}
                  className="border border-[#E7EBF2] text-[#8C98AE] active:bg-[#E7EBF2] w-10 h-10 flex justify-center items-center rounded-lg cursor-pointer"
                >
                  <i className="fa-regular fa-eye"></i>
                </Link>
                <button
                  onClick={() => {
                    setShowDelTab(true);
                    setSelected(id);
                    setName(`${firstName} ${lastName}`);
                  }}
                  className="border border-[#E7EBF2] text-[#8C98AE] active:bg-[#E7EBF2] w-10 h-10 flex justify-center items-center rounded-lg cursor-pointer"
                >
                  <i className="fa-regular fa-trash-can"></i>
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
            <h2 className="text-normal text-2xl md:text-3xl">Users</h2>
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
                <p className="text-normal text-sm md:text-base">User List</p>
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
                value={search}
                placeholder="Seach by landername"
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
                  { key: "Activate", value: "ACTIVATE" },
                  { key: "Deactivate", value: "DEACTIVATE" },
                  { key: "Suspend", value: "SUSPEND" },
                ]}
                label="Select Status"
              />
            </div>
          </div>
          <div className="xl:overflow-x-auto overflow-x-scroll custom-scroll bg-white">
            <table className="my-table table-fixed w-full min-w-350">
              <thead className="text-xs uppercase text-gray-500 bg-gray-50">
                <tr className="border-y border-gray-200">
                  <th>Info</th>
                  <th>Lander Name</th>
                  <th>Email</th>
                  <th>Domain</th>
                  <th>Package</th>
                  <th>Verify</th>
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
      </div>

      {selected && (
        <WarningPopup
          open={showDelTab}
          title={`Do you want to delete ${name} account?`}
          description={`Deleting ${name} account will permanently remove all associated data from the database. This action cannot be undone. Click "Delete" to continue or "Close" to cancel.`}
          smButton="Delete"
          clButton="Close"
          onClose={() => setShowDelTab(false)}
          onConfirm={() => handleDelete(selected)}
          loading={delLoad}
        />
      )}
    </React.Fragment>
  );
}

export default UserList;
