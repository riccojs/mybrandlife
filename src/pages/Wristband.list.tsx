import React, { useState } from "react";

import { Link, useSearchParams } from "react-router";
import toast from "react-hot-toast";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import {
  useDeleteWristbandMutation,
  useGetAllWristbandQuery,
} from "../redux/features/wristband/wristbandApi";
import SearchComponent from "../component/ui/Search.component";
import SelectComponent from "../component/ui/Select.component";
import Pagination from "../component/Pagination";
import ViewWistband from "../component/wristband/View.wistband";
import WarningPopup from "../component/Warning.popup";
import type { WristbandType } from "../utils/wristband.types";
import CreateWristband from "../component/wristband/Create.wristband";
import UpdateWristband from "../component/wristband/Update.wristband";
import WristbandLoader from "../component/loader/Wristband.loader";

function WistbandList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const limit = 10;
  const [showTab, setShowTab] = useState(false);
  const [open, setOpen] = useState(false);
  const [deleteWistband, { isLoading: delLoading }] =
    useDeleteWristbandMutation();

  const [isShow, setIsShow] = useState(false);
  const [view, setView] = useState(false);
  const { data, isFetching, isLoading } = useGetAllWristbandQuery({
    limit,
    page,
    searchBy: search,
    statusBy: status,
  });
  const totalItems = data?.data?.totalWristband || 0;
  const wistband = data?.data?.wristband || [];
  const [selectId, setSelectedId] = useState<string>("");

  const handlePageChange = (value: number) => {
    searchParams.set("page", value.toString());
    setSearchParams(searchParams);
  };

  const handleDelete = (id: string) => {
    setSelectedId(id);
    deleteWistband(id)
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

  // decide what to render
  let content;
  if (isLoading || isFetching) {
    content = [...Array(8)].map((_, i) => <WristbandLoader key={i} />);
  }
  if (!isLoading && !isFetching && wistband?.length === 0) {
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
  if (!isLoading && !isFetching && wistband?.length > 0) {
    content = wistband?.map((item: WristbandType) => {
      const {
        id,
        title,
        create_at,
        banner,
        color,
        price,
        status,
        stock,
        description,
      } = item || {};
      const formattedDate = (value: string) => {
        const createDate = new Date(value);
        return createDate?.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
      };

      return (
        <tr key={id}>
          <td>
            <div className="flex gap-2 items-center">
              <img
                src={banner}
                className="w-16 min-w-16 h-12 rounded-lg object-cover"
                alt=""
              />
              <div>
                <p>{title}</p>
                <p className="text-gray-500 text-xs font-normal">
                  {formattedDate(create_at)}
                </p>
              </div>
            </div>
          </td>
          <td>{description}</td>
          <td>{color}</td>
          <td>${price}</td>
          <td>
            <p
              className={`w-fit px-3 py-1 rounded-md text-center font-medium text-sm capitalize ${
                status === "OUTOFSTOCK" ||
                status === "PENDING" ||
                status === "DRAFT"
                  ? "bg-red-100 text-red-500"
                  : "bg-green-100 text-green-500"
              }`}
            >
              {status}
            </p>
          </td>
          <td>{stock}</td>

          <td>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setView(true);
                  setSelectedId(id);
                }}
                className="border border-gray-300 w-8 h-8 flex cursor-pointer justify-center items-center rounded-md"
              >
                <i className="fa-regular fa-eye"></i>
              </button>
              <button
                onClick={() => {
                  setIsShow(true);
                  setSelectedId(id);
                }}
                className="border border-gray-300 w-8 h-8 cursor-pointer flex justify-center items-center rounded-md"
              >
                <i className="fa-regular fa-pen-to-square"></i>
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
            <h2 className="text-normal text-2xl md:text-3xl">Wristbands</h2>
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
                  Wristband List
                </p>
              </li>
            </ul>
          </div>
          <button
            onClick={() => setShowTab(true)}
            className="px-6 py-3 cursor-pointer bg-[#82C24E] text-md font-medium rounded-lg"
          >
            Create Wristband
          </button>
        </div>
        <div className="flex flex-col gap-5 mt-5">
          <div className="flex md:w-auto w-full sm:flex-row flex-col justify-between items-start gap-3 md:items-center">
            <div className="w-full md:w-96">
              <SearchComponent
                name="search"
                color="white"
                value={search}
                placeholder="Seach by title"
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
                  { key: "DRAFT", value: "DRAFT" },
                  { key: "PENDING", value: "PENDING" },
                  { key: "INSTOCK", value: "INSTOCK" },
                  { key: "OUTOFSTOCK", value: "OUTOFSTOCK" },
                ]}
                label="Select Status"
              />
            </div>
          </div>
          <div className="overflow-x-auto bg-white">
            <table className="my-table table-fixed w-full min-w-300">
              <thead>
                <tr className="border-y border-gray-300">
                  <th className="w-96">Wrinstbnad Info</th>
                  <th className="w-96">Description</th>
                  <th>Color</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Stock</th>
                  <th>Action</th>
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
        {isShow && selectId ? (
          <UpdateWristband
            setShowTab={setIsShow}
            showTab={isShow}
            id={selectId}
          />
        ) : null}
        {view && selectId ? (
          <ViewWistband setShow={setView} isShow={view} id={selectId} />
        ) : null}
        {showTab && (
          <CreateWristband setShowTab={setShowTab} showTab={showTab} />
        )}
        {selectId && (
          <WarningPopup
            open={open}
            title="Do you want delete this wristband?"
            description={`Deleting this wristband will permanently remove all associated data from the database. This action cannot be undone. Click "Delete" to continue or "Close" to cancel.`}
            smButton="Delete"
            clButton="Close"
            onClose={() => setOpen(false)}
            onConfirm={() => handleDelete(selectId)}
            loading={delLoading}
          />
        )}
      </div>
    </React.Fragment>
  );
}

export default WistbandList;
