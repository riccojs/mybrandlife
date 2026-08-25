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

  const totalItems = data?.data?.totalPartner;
  const partner = data?.data?.partner;

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
        <td colSpan={7}>
          <p className="bg-amber-100 text-md font-normal p-3 rounded-md">
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
        <tr key={id}>
          <td>
            <div className="flex gap-2 items-center">
              {logo ? (
                <img
                  src={logo}
                  alt=""
                  className="w-14 min-w-14 h-14 mn-h-14 rounded-full"
                />
              ) : (
                <p className="capitalize w-14 min-w-14 h-14 mn-h-14 bg-gray-100 text-black text-3xl font-medium rounded-full flex justify-center items-center">
                  {title?.slice(0, 1)}
                </p>
              )}
              <span>
                <h2 className="text-lg text-medium jost">
                  {title?.slice(0, 25)}...
                </h2>
                <p className="text-sm text-gray-400">
                  Posted At: {formattedDate(create_at)}
                </p>
              </span>
            </div>
          </td>
          <td>{description?.slice(0, 80)}...</td>
          <td>{type}</td>
          <td>{linkText ? linkText : recipentLabel}</td>
          <td className="whitespace-pre-line break-all">
            {link ? link : recipent?.join("\n")}
          </td>
          <td>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowUpdateTab(true);
                  setSelectedId(id);
                }}
                className="border border-gray-300 min-w-8 w-8 h-8 flex justify-center items-center rounded-md cursor-pointer"
              >
                <i className="fa-regular fa-pen-to-square"></i>
              </button>
              <button
                onClick={() => {
                  setSelectedId(id);
                  setOpen(true);
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
            <h2 className="text-normal text-2xl md:text-3xl">Partner</h2>
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
                <p className="text-normal text-sm md:text-base">Partner List</p>
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
            <button className="primary-btn" onClick={() => setShowTab(true)}>
              Create Partner
            </button>
          </div>
          <div className="overflow-x-auto bg-white">
            <table className="my-table table-fixed w-full min-w-300">
              <thead>
                <tr className="border-y border-gray-300">
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
          title="Do you want delete this partner?"
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
