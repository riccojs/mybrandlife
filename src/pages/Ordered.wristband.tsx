import React, { useState } from "react";
import { Link, useSearchParams } from "react-router";
import toast from "react-hot-toast";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import WarningPopup from "../component/popups/Warning.popup";
import { useAuth } from "../hook/useAuth";
import {
  useDeleteWristbandItemMutation,
  useGetAllWristbandItemModeQuery,
} from "../redux/features/wristband/wristbandApi";
import OrderedWristbandLoader from "../component/loader/Ordered.wristband.loader";
import type { ExtraWristbandType } from "../utils/wristband.types";
import SearchComponent from "../component/ui/Search.component";
import SelectComponent from "../component/ui/Select.component";
import Pagination from "../component/Pagination";

function OrderedWristband() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const mode = searchParams.get("mode") || "";
  const limit = 10;
  const { user: userData } = useAuth();
  const [open, setOpen] = useState(false);
  const userId = userData?.role === "ADMIN" ? "" : userData?.id;
  const [selectId, setSelectedId] = useState<string>("");
  const { data, isFetching, isLoading } = useGetAllWristbandItemModeQuery({
    limit,
    page,
    searchBy: search,
    statusBy: status,
    userId: userId,
    modeBy: mode,
  });
  const [deleteWristbandItem, { isLoading: delLoading }] =
    useDeleteWristbandItemMutation();
  const totalItems = data?.data?.totalWristband || 0;
  const wistband = data?.data?.wristband || [];
  const currentPage = data?.data?.currentPage || [];
  const start = (currentPage - 1) * limit + 1;
  const end = Math.min(currentPage * limit, totalItems);

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
        <td colSpan={7} className="p-0!">
          <p className="bg-[#FEFBED] text-center text-[#643315] text-md font-normal py-5 rounded-md">
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
        <tr key={id} className="hover:bg-gray-50">
          <td>
            <div className="flex gap-2 items-center">
              <img
                src={banner}
                className="w-16 min-w-16 h-16 rounded-lg object-cover"
                alt=""
              />
              <div>
                <p>{title}</p>
                <p className="text-gray-500 text-sm font-normal">
                  {formattedDate(create_at)}
                </p>
              </div>
            </div>
          </td>
          <td>
            <div>
              <p>{`${user?.firstName} ${user?.lastName}`}</p>

              <p className="text-gray-500 text-sm font-normal">
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
              className={`w-fit px-6 py-1 rounded-md text-center font-medium text-xs capitalize ${
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
                to={`/wristband/${id}`}
                className="border border-[#E7EBF2] text-[#8C98AE] active:bg-[#E7EBF2] w-10 h-10 flex justify-center items-center rounded-lg cursor-pointer"
              >
                <i className="fa-regular fa-eye"></i>
              </Link>
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
            <h2 className="text-normal flex-wrap text-2xl md:text-3xl">
              Ordered Wristband
            </h2>
            <ul className="flex gap-2 items-center py-2">
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
          <div className="w-full 2xl:flex-row flex-col gap-5 flex justify-between items-center p-6">
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
            <table className="my-table table-fixed w-full min-w-350">
              <thead className="text-xs uppercase text-gray-500 bg-gray-50">
                <tr className="border-y border-gray-200">
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
          <div className="flex flex-wrap md:gap-0 gap-3 items-center justify-between px-6 py-5 border-t border-gray-200">
            <p className="text-sm text-gray-400">
              Showing <span className="font-medium text-gray-500">{start}</span>{" "}
              to <span className="font-medium text-gray-500">{end}</span> of{" "}
              <span className="font-medium text-gray-700">{totalItems}</span>{" "}
              results
            </p>

            <Pagination
              handlePageChange={handlePageChange}
              page={page}
              totalItems={totalItems}
              itemsPerPage={limit}
            />
          </div>
        </div>

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
