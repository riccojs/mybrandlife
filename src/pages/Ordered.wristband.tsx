import React, { useState } from "react";
import { Link, useSearchParams } from "react-router";
import toast from "react-hot-toast";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import {
  useDeleteWristbandItemMutation,
  useGetAllWristbandItemModeQuery,
} from "../redux/features/wristband/wristbandApi";
import WarningPopup from "../component/Warning.popup";
import SearchComponent from "../component/ui/Search.component";
import SelectComponent from "../component/ui/Select.component";
import Pagination from "../component/Pagination";
import type { ExtraWristbandType } from "../utils/wristband.types";
import OrderedWristbandLoader from "../component/loader/Ordered.wristband.loader";

function OrderedWristband() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const mode = searchParams.get("mode") || "";
  const limit = 10;
  const [open, setOpen] = useState(false);

  const [selectId, setSelectedId] = useState<string>("");
  const { data, isFetching, isLoading } = useGetAllWristbandItemModeQuery({
    limit,
    page,
    searchBy: search,
    statusBy: status,
    userId: "",
    modeBy: mode,
  });
  const [deleteWristbandItem, { isLoading: delLoading }] =
    useDeleteWristbandItemMutation();
  const totalItems = data?.data?.totalWristband || 0;
  const wistband = data?.data?.wristband || [];

  const handlePageChange = (value: number) => {
    searchParams.set("page", value.toString());
    setSearchParams(searchParams);
  };

  const handleDelete = (id: string) => {
    setSelectedId(id);
    deleteWristbandItem(id)
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
    content = [...Array(8)].map((_, i) => <OrderedWristbandLoader key={i} />);
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
    content = wistband?.map((item: ExtraWristbandType) => {
      const {
        id,
        title,
        create_at,
        banner,
        color,
        price,
        status,
        subTotal,
        user,
        mode,
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
                className="w-16 min-w-16 h-16 rounded-lg object-cover"
                alt=""
              />
              <Link to={`/ordered-wristband/confirmation/${id}`}>
                <p className="hover:underline">{title}</p>
                <p className="text-gray-500 text-xs font-normal">
                  {formattedDate(create_at)}
                </p>
                <p className="text-gray-500 text-xs font-normal">
                  {user?.domain}/{user?.landerName}
                </p>
              </Link>
            </div>
          </td>
          <td>
            <div>
              <p>{`${user?.firstName} ${user?.lastName}`}</p>

              <p className="text-gray-500 text-xs font-normal">
                Private Domain: {user?.privateDomain}
              </p>
            </div>
          </td>
          <td>${price}</td>
          <td>${subTotal}</td>
          <td>
            {color} - {mode}
          </td>
          <td>
            <p
              className={`w-fit px-3 py-1 rounded-md text-center font-medium text-sm capitalize ${
                status === "OUTOFSTOCK" ||
                status === "PENDING" ||
                status === "DISABLED" ||
                status === "DRAFT"
                  ? "bg-red-100 text-red-500"
                  : "bg-green-100 text-green-500"
              }`}
            >
              {status}
            </p>
          </td>

          <td>
            <div className="flex gap-3">
              <Link
                to={`/ordered-wristband/${id}`}
                className="border border-gray-300 w-8 h-8 flex cursor-pointer justify-center items-center rounded-md"
              >
                <i className="fa-regular fa-eye"></i>
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
    });
  }

  return (
    <React.Fragment>
      <div className="p-3 md:p-5 min-h-screen">
        <div className="flex md:flex-row flex-col justify-between items-start md:items-center">
          <div className="md:w-6/12 w-full">
            <h2 className="text-normal text-2xl md:text-3xl">
              Ordered Wristband
            </h2>
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
            <div className="flex md:flex-row flex-col gap-3 md:gap-5 items-center w-full">
              <div className="w-full md:w-52">
                <SelectComponent
                  value={mode}
                  color="white"
                  handleChange={(item: string) => {
                    if (item) {
                      searchParams.set("mode", item);
                      searchParams.set("page", "1");
                    } else {
                      searchParams.delete("mode");
                      searchParams.delete("page");
                    }
                    setSearchParams(searchParams);
                  }}
                  datas={[
                    { key: "GLOBAL", value: "GLOBAL" },
                    { key: "EXTRA", value: "EXTRA" },
                  ]}
                  label="Select Mode"
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
                    { key: "PENDING", value: "PENDING" },
                    { key: "PAID", value: "PAID" },
                    { key: "INPRODUCTION", value: "INPRODUCTION" },
                    { key: "SHIPPED", value: "SHIPPED" },
                    { key: "DELIVERED", value: "DELIVERED" },
                    { key: "CANCELED", value: "CANCELED" },
                    { key: "REFUNDED", value: "REFUNDED" },
                    { key: "LOST", value: "LOST" },
                    { key: "DISABLED", value: "DISABLED" },
                    { key: "COMPLETE", value: "COMPLETE" },
                  ]}
                  label="Select Status"
                />
              </div>
            </div>
          </div>
          <div className="overflow-x-auto bg-white">
            <table className="my-table table-fixed w-full min-w-325">
              <thead>
                <tr className="border-y border-gray-300">
                  <th className="w-80">Wrinstbnad Info</th>
                  <th className="w-80">User Info</th>
                  <th>Price</th>
                  <th>Subtotal</th>
                  <th>Color/Mode</th>
                  <th>Status</th>
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
        {selectId && (
          <WarningPopup
            open={open}
            title="Do you want delete this ordered wristband?"
            description={`Deleting this ordered wristband will permanently remove all associated data from the database. This action cannot be undone. Click "Delete" to continue or "Close" to cancel.`}
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

export default OrderedWristband;
