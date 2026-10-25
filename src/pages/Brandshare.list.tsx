import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import toast from "react-hot-toast";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import {
  useDeleteReferralMutation,
  useGetAllReferralQuery,
} from "../redux/features/referral/referralApi";
import SearchComponent from "../component/ui/Search.component";
import Pagination from "../component/Pagination";
import SelectComponent from "../component/ui/Select.component";
import WarningPopup from "../component/Warning.popup";
import BrandshareLoader from "../component/loader/Brandshare.loader";
import ViewBrandshare from "../component/brandshare/View.brandshare";
import UpdateBrandshare from "../component/brandshare/Update.brandshare";
import CreateBrandshare from "../component/brandshare/Create.brandshare";
import BrandshareIcon from "../assets/menu-icons/referralcodes.svg";

function BrandShareList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
  const type = searchParams.get("type") || "";
  const sort = searchParams.get("sort") || "";
  const [selectId, setSelectedId] = useState<string>("");
  const [showTab, setShowTab] = useState<boolean>(false);
  const [viewTab, setViewTab] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [showUpdateTab, setShowUpdateTab] = useState<boolean>(false);
  const [deleteReferral, { isLoading: delLoading }] =
    useDeleteReferralMutation();
  const limit = 14;
  const { data, isLoading, isFetching } = useGetAllReferralQuery({
    page,
    limit,
    searchBy: search,
    type: type,
    sort: sort,
  });

  const totalItem = data?.data?.totalReferral;
  const referral = data?.data?.referral;
  const currentPage = data?.data?.currentPage || [];
  const start = (currentPage - 1) * limit + 1;
  const end = Math.min(currentPage * limit, totalItem);

  const handlePageChange = (value: number) => {
    searchParams.set("page", value.toString());
    setSearchParams(searchParams);
  };

  const handleDelete = (id: string) => {
    setSelectedId(id);
    deleteReferral(id)
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

  // decide what to render
  let content;
  if (isLoading) {
    content = [...Array(8)].map((_, i) => <BrandshareLoader key={i} />);
  }
  if (isFetching) {
    content = [...Array(8)].map((_, i) => <BrandshareLoader key={i} />);
  }
  if (!isLoading && !isFetching && referral?.length === 0) {
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
  if (!isLoading && !isFetching && referral?.length > 0) {
    content = referral?.map(
      (item: {
        id: string;
        code: string;
        value: string;
        type: string;
        joined: string;
        active: string;
        create_at: string;
        logo: string;
        limit: number;
      }) => {
        const {
          id,
          code,
          value,
          type,
          joined,
          active,
          create_at,
          logo,
          limit,
        } = item || {};

        return (
          <tr key={id} className="hover:bg-slate-50">
            <td>
              <div
                onClick={() => {
                  setViewTab(true);
                  setSelectedId(id);
                }}
                className="flex gap-2 items-center cursor-pointer"
              >
                {logo ? (
                  <img
                    src={logo}
                    className="w-10 h-10 object-cover rounded-full"
                    alt=""
                  />
                ) : (
                  <p className="w-10 h-10 min-w-10 bg-slate-200 flex justify-center items-center uppercase rounded-full">
                    {code?.slice(0, 1)}
                  </p>
                )}
                <span>
                  <p>{code}</p>
                  <p className="text-sm text-gray-400">
                    {formattedDate(create_at)}
                  </p>
                </span>
              </div>
            </td>
            <td>{value}</td>
            <td>{type}</td>
            <td>{limit ? limit : 0}</td>
            <td>{active ? "Active" : "Expired"}</td>
            <td>{joined ? joined : 0}</td>

            <td>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowUpdateTab(true);
                    setSelectedId(id);
                  }}
                  className="border border-[#E7EBF2] text-[#8C98AE] active:bg-[#E7EBF2] w-10 h-10 flex justify-center items-center rounded-lg cursor-pointer"
                >
                  <i className="fa-regular fa-pen-to-square"></i>
                </button>
                <Link
                  to={`/brandshare/${code}`}
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
      },
    );
  }

  return (
    <React.Fragment>
      <div className="p-3 md:p-5 min-h-screen">
        <div className="flex md:flex-row flex-col justify-between items-start md:items-center">
          <div className="md:w-6/12 w-full">
            <h2 className="text-normal text-2xl md:text-3xl">BrandShare</h2>
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
                  BrandShare List
                </p>
              </li>
            </ul>
          </div>
        </div>
        <div className="w-full mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm mt-3">
          <div className="flex p-6 2xl:flex-nowrap flex-wrap md:w-auto w-full sm:flex-row flex-col justify-between items-start gap-3 md:items-center">
            <div className="flex gap-5 md:flex-row flex-col w-full items-center">
              <div className="w-full md:w-96">
                <SearchComponent
                  name="search"
                  color="white"
                  placeholder="Seach by code"
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
                  value={type}
                  color="white"
                  handleChange={(item: string) => {
                    if (item) {
                      searchParams.set("type", item);
                      searchParams.set("page", "1");
                    } else {
                      searchParams.delete("type");
                      searchParams.delete("page");
                    }
                    setSearchParams(searchParams);
                  }}
                  datas={[
                    { key: "MONTHLY", value: "MONTHLY" },
                    { key: "PERCENT", value: "PERCENT" },
                    { key: "LIFETIME", value: "LIFETIME" },
                  ]}
                  label="Select type"
                />
              </div>
              <div className="w-full md:w-52">
                <SelectComponent
                  value={sort}
                  color="white"
                  handleChange={(item: string) => {
                    if (item) {
                      searchParams.set("sort", item);
                      searchParams.set("page", "1");
                    } else {
                      searchParams.delete("sort");
                      searchParams.delete("page");
                    }
                    setSearchParams(searchParams);
                  }}
                  datas={[
                    { key: "Newest", value: "new" },
                    { key: "Oldest", value: "old" },
                  ]}
                  label="Sort by"
                />
              </div>
            </div>
            <button
              className="bg-[#96c94b] w-12 min-w-12 h-12 rounded-md p-2 cursor-pointer"
              onClick={() => setShowTab(true)}
            >
              <img
                src={BrandshareIcon}
                alt={BrandshareIcon}
                className="w-full h-full"
              />
            </button>
          </div>
          <div className="xl:overflow-x-auto overflow-x-scroll custom-scroll bg-white">
            <table className="my-table table-fixed w-full min-w-350">
              <thead className="text-xs uppercase text-gray-500 bg-gray-50">
                <tr className="border-y border-gray-200">
                  <th>BrandShare Code</th>
                  <th>BrandShare Value</th>
                  <th>BrandShare Type</th>
                  <th>BrandShare Limit</th>
                  <th>BrandShare Active</th>
                  <th>Total Joined</th>
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
      {showTab && (
        <CreateBrandshare setShowTab={setShowTab} showTab={showTab} />
      )}
      {showUpdateTab && (
        <UpdateBrandshare
          id={selectId}
          setShowTab={setShowUpdateTab}
          showTab={showUpdateTab}
        />
      )}
      {viewTab && selectId ? (
        <ViewBrandshare isShow={viewTab} setShow={setViewTab} id={selectId} />
      ) : null}

      {selectId && (
        <WarningPopup
          open={open}
          title="Do you want to delete this BrandShare request?"
          description={`Deleting this BrandShare request will permanently remove all associated data from the database. This action cannot be undone. Click "Delete" to continue or "Close" to cancel.`}
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

export default BrandShareList;
