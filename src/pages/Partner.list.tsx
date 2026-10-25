import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";

import toast from "react-hot-toast";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import {
  useDeletePartnerMutation,
  useGetAllPartnerQuery,
} from "../redux/features/partner/partnerApi";
import SearchComponent from "../component/ui/Search.component";
import Pagination from "../component/Pagination";
import WarningPopup from "../component/Warning.popup";
import PartnerLoader from "../component/loader/Partner.loader";
import type { PartnerType } from "../utils/partner.types";
import CreatePartner from "../component/partner/Create.partner";
import UpdatePartner from "../component/partner/Update.partner";
import PartnerIcon from "../assets/menu-icons/partners.svg";

function PartnerList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
  const [selectId, setSelectedId] = useState<string>("");
  const [showTab, setShowTab] = useState<boolean>(false);
  const [showUpdateTab, setShowUpdateTab] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const limit = 14;
  const [deletePartner, { isLoading: delLoad }] = useDeletePartnerMutation();
  const { data, isLoading, isFetching } = useGetAllPartnerQuery({
    page,
    limit,
    searchBy: search,
  });

  const formattedDate = (value: string) => {
    const createDate = new Date(value);
    return createDate?.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const totalItem = data?.data?.totalPartner;
  const partner = data?.data?.partner;
  const currentPage = data?.data?.currentPage || [];
  const start = (currentPage - 1) * limit + 1;
  const end = Math.min(currentPage * limit, totalItem);

  const handlePageChange = (value: number) => {
    searchParams.set("page", value.toString());
    setSearchParams(searchParams);
  };

  const handleDelete = (id: string) => {
    deletePartner(id)
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

  // decide what to render
  let content;
  if (isLoading) {
    content = [...Array(8)].map((_, i) => <PartnerLoader key={i} />);
  }
  if (isFetching) {
    content = [...Array(8)].map((_, i) => <PartnerLoader key={i} />);
  }
  if (!isLoading && !isFetching && partner?.length === 0) {
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
  if (!isLoading && !isFetching && partner?.length > 0) {
    content = partner?.map((item: PartnerType) => {
      const {
        id,
        title,
        description,
        link,
        linkText,
        logo,
        create_at,
        type,
        recipent,
        recipentLabel,
      } = item || {};

      return (
        <tr key={id} className="hover:bg-gray-50">
          <td>
            <div className="flex gap-2 items-center">
              {logo ? (
                <img
                  src={logo}
                  alt=""
                  className="w-10 min-w-10 h-10 mn-h-10 rounded-full object-cover"
                />
              ) : (
                <p className="capitalize w-10 min-w-10 h-10 mn-h-10 bg-gray-100 text-black text-xl font-medium rounded-full flex justify-center items-center">
                  {title?.slice(0, 1)}
                </p>
              )}
              <span>
                <h2 className="text-md text-medium jost">
                  {title?.slice(0, 20)}..
                </h2>
                <p className="text-xs text-gray-400">
                  Join: {formattedDate(create_at)}
                </p>
              </span>
            </div>
          </td>
          <td className="text-sm text-gray-500">
            {description?.slice(0, 50)}...
          </td>
          <td>
            <p
              className={`${
                type === "LINKTYPE"
                  ? "bg-green-100 w-fit px-3 py-1 rounded-md text-center text-green-700 font-medium text-xs"
                  : "bg-red-100 w-fit px-3 py-1 rounded-md text-center text-red-700 font-medium text-xs"
              }`}
            >
              {type}
            </p>
          </td>
          <td>{linkText ? linkText : recipentLabel}</td>
          <td className="whitespace-pre-line break-all text-sm">
            {link ? link : recipent?.join("\n")}
          </td>
          <td>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowUpdateTab(true);
                  setSelectedId(id);
                }}
                className="border border-[#E7EBF2] text-[#8C98AE] active:bg-[#E7EBF2] w-10 h-10 flex justify-center items-center rounded-lg cursor-pointer"
              >
                <i className="fa-regular fa-pen-to-square"></i>
              </button>
              <button
                onClick={() => {
                  setSelectedId(id);
                  setOpen(true);
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
            <h2 className="text-normal text-2xl md:text-3xl">Partner</h2>
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
                <p className="text-normal text-sm md:text-base">Partner List</p>
              </li>
            </ul>
          </div>
        </div>
        <div className="w-full mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm mt-3">
          <div className="flex gap-3 md:gap-0 items-center w-full justify-between p-6">
            <div className="w-full md:w-96">
              <SearchComponent
                name="search"
                color="white"
                placeholder="Seach by title"
                required={false}
                value={search}
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
            <button
              className="bg-[#96c94b] w-12 min-w-12 h-12 rounded-md p-2 cursor-pointer"
              onClick={() => setShowTab(true)}
            >
              <img
                src={PartnerIcon}
                alt={PartnerIcon}
                className="w-full h-full"
              />
            </button>
          </div>
          <div className="xl:overflow-x-auto overflow-x-scroll custom-scroll bg-white">
            <table className="my-table table-fixed w-full min-w-350">
              <thead className="text-xs uppercase text-gray-500 bg-gray-50">
                <tr className="border-y border-gray-200">
                  <th>Partner Info</th>
                  <th>Description</th>
                  <th>Type</th>
                  <th>Label</th>
                  <th>Link/Recipent</th>
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
      {showTab && <CreatePartner setShowTab={setShowTab} showTab={showTab} />}
      {showUpdateTab && (
        <UpdatePartner
          id={selectId}
          setShowTab={setShowUpdateTab}
          showTab={showUpdateTab}
        />
      )}

      {selectId && (
        <WarningPopup
          open={open}
          title="Do you want to delete this partner?"
          description={`Deleting this partner will permanently remove all associated data from the database. This action cannot be undone. Click "Delete" to continue or "Close" to cancel.`}
          smButton="Delete"
          clButton="Close"
          onClose={() => setOpen(false)}
          onConfirm={() => handleDelete(selectId)}
          loading={delLoad}
        />
      )}
    </React.Fragment>
  );
}

export default PartnerList;
