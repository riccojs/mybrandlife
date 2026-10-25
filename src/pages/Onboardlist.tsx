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
  profile: string;
  firstName: string;
  lastName: string;
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
  const totalItem = data?.data?.totalOnboard || 0;
  const currentPage = data?.data?.currentPage || [];
  const start = (currentPage - 1) * limit + 1;
  const end = Math.min(currentPage * limit, totalItem);

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
        <td colSpan={7} className="p-0!">
          <p className="bg-[#FEFBED] text-center text-[#643315] text-md font-normal py-5 rounded-md">
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
        const { id, status, user, create_at } = item || {};
        const { domain, landerName, profile, firstName, lastName } = user;
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
            <td>{user?.domain}</td>
            <td>{user?.package}</td>
            <td>{user?.planPrice}</td>
            <td>{user?.frequency}</td>
            <td>
              <p
                className={`w-fit px-3 py-1 rounded-md text-center font-medium text-xs ${
                  status === "ACTIVATE"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {status}
              </p>
            </td>
            <td>
              <div className="flex gap-2">
                {status === "DEACTIVATE" && (
                  <button
                    onClick={() => {
                      setVerified(true);
                      setSelectedId(id);
                    }}
                    className="border border-[#E7EBF2] text-[#8C98AE] active:bg-[#E7EBF2] w-10 h-10 flex justify-center items-center rounded-lg cursor-pointer"
                  >
                    <ShieldCheck size={20} />
                  </button>
                )}

                <Link
                  target="_blank"
                  to={`https://${domain}/${landerName}`}
                  className="border border-[#E7EBF2] text-[#8C98AE] active:bg-[#E7EBF2] w-10 h-10 flex justify-center items-center rounded-lg cursor-pointer"
                >
                  <i className="fa-regular fa-eye"></i>
                </Link>
                <Link
                  to={`/onboard/update/${id}`}
                  className="border border-[#E7EBF2] text-[#8C98AE] active:bg-[#E7EBF2] w-10 h-10 flex justify-center items-center rounded-lg cursor-pointer"
                >
                  <i className="fa-regular fa-pen-to-square"></i>
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
      },
    );
  }

  return (
    <React.Fragment>
      <div className="p-3 md:p-5 min-h-screen">
        <div className="md:w-6/12 w-full">
          <h2 className="text-normal text-xl md:text-3xl">Onboard</h2>
          <ul className="flex gap-1 md:gap-2 md:flex-nowrap flex-wrap items-center py-2">
            <li>
              <Link
                to="/"
                className="text-normal text-sm md:text-base hover:underline"
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
                  <th>Lander Info</th>
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
          title="Do you want delete to this onboard?"
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
          title="Do you want to verify this onboard?"
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
