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

  const totalItems = data?.data?.totalUser;
  const users = data?.data?.user;

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
        <td colSpan={7}>
          <p className="bg-amber-100 text-md font-normal p-3 rounded-md">
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
          <tr key={id}>
            <td>
              <div className="flex gap-2 items-center">
                {profile ? (
                  <img
                    src={profile}
                    alt=""
                    className="w-14 min-w-14 h-14 mn-h-14 rounded-full object-cover"
                  />
                ) : (
                  <p className="capitalize w-14 min-w-14 h-14 mn-h-14 bg-gray-100 text-black text-3xl font-medium rounded-full flex justify-center items-center">
                    {firstName?.slice(0, 1)}
                  </p>
                )}
                <span>
                  <h2 className="text-lg text-medium jost">{`${firstName} ${lastName}`}</h2>
                  <p className="text-sm text-gray-400">
                    Join: {formattedDate(create_at)}
                  </p>
                </span>
              </div>
            </td>
            <td>{landerName}</td>
            <td>{email?.slice(0, 18)}..</td>
            <td>{domain}</td>
            <td className="capitalize">{pkgType}</td>
            <td>
              <p
                className={`${
                  status === "ACTIVATE"
                    ? "bg-green-100 w-fit px-3 py-1 rounded-md text-center text-green-500 font-medium text-sm capitalize"
                    : "bg-red-100 w-fit px-3 py-1 rounded-md text-center text-red-500 font-medium text-sm capitalize"
                }`}
              >
                {status}
              </p>
            </td>
            <td>
              <div className="flex gap-3">
                <Link
                  to={`/user/${id}`}
                  className="border border-gray-300 w-8 h-8 flex justify-center items-center rounded-md"
                >
                  <i className="fa-regular fa-eye"></i>
                </Link>
                <button
                  onClick={() => {
                    setShowDelTab(true);
                    setSelected(id);
                    setName(`${firstName} ${lastName}`);
                  }}
                  className="border border-gray-300 w-8 h-8 flex justify-center items-center rounded-md cursor-pointer"
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
                <p className="text-normal text-sm md:text-base">User List</p>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col gap-5 mt-5">
          <div className="flex md:w-auto w-full sm:flex-row flex-col justify-between items-start gap-3 md:items-center">
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
          <div className="overflow-x-auto bg-white">
            <table className="my-table table-fixed w-full min-w-300">
              <thead>
                <tr className="border-y border-gray-300">
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

      {selected && (
        <WarningPopup
          open={showDelTab}
          title={`Do you want delete ${name} account?`}
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
