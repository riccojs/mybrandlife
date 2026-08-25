import React, { useState } from "react";
import { Link, useSearchParams } from "react-router";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import toast from "react-hot-toast";
import { ShieldCheck } from "lucide-react";
import WarningPopup from "../component/Warning.popup";
import Pagination from "../component/Pagination";
import SelectComponent from "../component/ui/Select.component";
import SearchComponent from "../component/ui/Search.component";
import {
  useDeleteOnboardMutation,
  useGetAllOnboardByAdminQuery,
  useVerifyOnboardAdminMutation,
} from "../redux/features/onboard/onboardApi";
import OnboardLoader from "../component/loader/Onboard.loader";

interface OnboardUser {
  domain: string;
  landerName: string;
  package: string;
  frequency: string;
  planPrice: string;
}

function OnboardList() {
  const [selectId, setSelectedId] = useState<string>("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [open, setOpen] = useState(false);
  const [verified, setVerified] = useState(false);
  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const limit = 14;
  const [deleteOnboard, { isLoading: delLoading }] = useDeleteOnboardMutation();
  const [verifyOnboardAdmin, { isLoading: verifyLoading }] =
    useVerifyOnboardAdminMutation();

  const { data, isLoading, isFetching } = useGetAllOnboardByAdminQuery({
    page: page,
    limit: limit,
    searchBy: search,
    statusBy: status,
  });
  const onboardLists = data?.data?.onboard;
  const totalItems = data?.data?.totalOnboard;

  const handlePageChange = (value: number) => {
    searchParams.set("page", value.toString());
    setSearchParams(searchParams);
  };

  const handleDelete = (id: string) => {
    setSelectedId(id);
    deleteOnboard(id)
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

  const handleVerify = (id: string) => {
    verifyOnboardAdmin(id)
      .unwrap()
      .then((res) => {
        toast.success(res.message);
        setSelectedId("");
        setVerified(false);
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
    content = [...Array(8)].map((_, i) => <OnboardLoader key={i} />);
  }

  if (isFetching) {
    content = [...Array(8)].map((_, i) => <OnboardLoader key={i} />);
  }
  if (!isLoading && !isFetching && onboardLists?.length === 0) {
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
  if (!isLoading && !isFetching && onboardLists?.length > 0) {
    content = onboardLists?.map(
      (item: {
        id: string;
        domain: string;
        plan: string;
        bio: string;
        create_at: string;
        userId: string;
        status: string;
        user: OnboardUser;
      }) => {
        const { id, status, user } = item || {};
        const { domain, landerName } = user;
        return (
          <tr key={id}>
            <td>{landerName}</td>
            <td>{user?.domain}</td>
            <td>{user?.package}</td>
            <td>{user?.planPrice}</td>
            <td>{user?.frequency}</td>
            <td>
              <p
                className={`w-fit px-3 py-1 rounded-md text-center font-medium text-sm capitalize ${
                  status === "ACTIVATE"
                    ? "bg-green-100 text-green-500"
                    : "bg-red-100 text-red-500"
                }`}
              >
                {status}
              </p>
            </td>
            <td>
              <div className="flex gap-3">
                {status === "DEACTIVATE" && (
                  <button
                    onClick={() => {
                      setVerified(true);
                      setSelectedId(id);
                    }}
                    className="bg-green-100 border border-green-300 text-green-700 w-fit px-3 h-8 flex justify-center items-center rounded-md cursor-pointer"
                  >
                    <ShieldCheck size={20} />
                  </button>
                )}

                <Link
                  target="_blank"
                  to={`https://${domain}/${landerName}`}
                  className="border border-gray-300 w-8 h-8 flex justify-center items-center rounded-md"
                >
                  <i className="fa-regular fa-eye"></i>
                </Link>
                <Link
                  to={`/onboard/update/${id}`}
                  className="border border-gray-300 w-8 h-8 flex justify-center items-center rounded-md"
                >
                  <i className="fa-regular fa-pen-to-square"></i>
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
      },
    );
  }

  return (
    <React.Fragment>
      <div className="p-3 md:p-5 min-h-screen">
        <div className="flex md:flex-row flex-col justify-between items-start md:items-center">
          <div className="md:w-6/12 w-full">
            <h2 className="text-normal text-2xl md:text-3xl">Onboard</h2>
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
                <p className="text-normal text-sm md:text-base">Onboard List</p>
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
                  <th>Lander Name</th>
                  <th>Selected Domain</th>
                  <th>Select Package</th>
                  <th>Package Price</th>
                  <th>Package Duration</th>
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
            page={page}
            totalItems={totalItems}
            itemsPerPage={limit}
          />
        )}
      </div>
      {selectId && (
        <WarningPopup
          open={open}
          title="Do you want delete this onboard?"
          description={`Deleting this onboard will permanently remove all associated data from the database. This action cannot be undone. Click "Delete" to continue or "Close" to cancel.`}
          smButton="Delete"
          clButton="Close"
          onClose={() => setOpen(false)}
          onConfirm={() => handleDelete(selectId)}
          loading={delLoading}
        />
      )}
      {selectId && (
        <WarningPopup
          open={verified}
          title="Do you want verify this onboard?"
          description={`if you want to verify this onboard than Click "Verify" to continue activate onboard or "Close" to cancel.`}
          smButton="Verify"
          clButton="Close"
          onClose={() => setVerified(false)}
          onConfirm={() => handleVerify(selectId)}
          loading={verifyLoading}
        />
      )}
    </React.Fragment>
  );
}

export default OnboardList;
