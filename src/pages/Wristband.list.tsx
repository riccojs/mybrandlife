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
import WristbandIcon from "../assets/menu-icons/ristband.svg";

function WistbandList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const limit = 10;
  const [showTab, setShowTab] = useState(false);
  const [selectId, setSelectedId] = useState<string>("");
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
  const totalItem = data?.data?.totalWristband || 0;
  const wistband = data?.data?.wristband || [];
  const currentPage = data?.data?.currentPage || [];
  const start = (currentPage - 1) * limit + 1;
  const end = Math.min(currentPage * limit, totalItem);

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
        <td colSpan={7} className="p-0!">
          <p className="bg-[#FEFBED] text-center text-[#643315] text-md font-normal py-5 rounded-md">
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
        <tr key={id} className="hover:bg-gray-50">
          <td>
            <div className="flex gap-2 items-center">
              {banner ? (
                <img
                  src={banner}
                  alt=""
                  className="w-10 min-w-10 h-10 mn-h-10 rounded-full object-cover"
                />
              ) : (
                <p className="capitalize w-10 min-w-10 h-10 mn-h-10 bg-gray-100 text-black text-xl font-medium rounded-full flex justify-center items-center">
                  {title?.slice(0, 1)}
                </p>
              )}
              <span>
                <h2 className="text-md text-medium jost">{title}</h2>
                <p className="text-xs text-gray-400">
                  Join: {formattedDate(create_at)}
                </p>
              </span>
            </div>
          </td>
          <td className="text-gray-500 text-sm break-all">{description}</td>
          <td>{color}</td>
          <td>${price}</td>
          <td>
            <p
              className={`w-fit px-3 py-1 rounded-md text-center font-medium text-xs ${
                status === "OUTOFSTOCK" ||
                status === "PENDING" ||
                status === "DRAFT"
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {status}
            </p>
          </td>
          <td>{stock} QTY</td>

          <td>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setView(true);
                  setSelectedId(id);
                }}
                className="border border-[#E7EBF2] text-[#8C98AE] active:bg-[#E7EBF2] w-10 h-10 flex justify-center items-center rounded-lg cursor-pointer"
              >
                <i className="fa-regular fa-eye"></i>
              </button>
              <button
                onClick={() => {
                  setIsShow(true);
                  setSelectedId(id);
                }}
                className="border border-[#E7EBF2] text-[#8C98AE] active:bg-[#E7EBF2] w-10 h-10 flex justify-center items-center rounded-lg cursor-pointer"
              >
                <i className="fa-regular fa-pen-to-square"></i>
              </button>
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
            <h2 className="text-normal text-xl md:text-3xl">Wristbands</h2>
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
                  Wristband List
                </p>
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

            <div className="flex w-full gap-3 justify-end">
              <div className="w-full md:w-44">
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
              <button
                onClick={() => setShowTab(true)}
                className="w-12 min-w-12 h-12 flex justify-center items-center p-2 cursor-pointer bg-[#82C24E] text-md font-medium rounded-lg"
              >
                <img
                  src={WristbandIcon}
                  alt={WristbandIcon}
                  className="w-full h-full"
                />
              </button>
            </div>
          </div>
          <div className="xl:overflow-x-auto overflow-x-scroll custom-scroll bg-white">
            <table className="my-table table-fixed w-full min-w-350">
              <thead className="text-xs uppercase text-gray-500 bg-gray-50">
                <tr className="border-y border-gray-200">
                  <th>Wrinstbnad Info</th>
                  <th>Description</th>
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
            title="Do you want to delete this wristband?"
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
