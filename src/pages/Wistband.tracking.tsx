import { useState } from "react";
import { useGetOneWristbandItemQuery } from "../redux/features/wristband/wristbandApi";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { SerializedError } from "@reduxjs/toolkit";
import type { WristbandType } from "../utils/wristband.types";

function WistbandTracking() {
  const [odId, setdId] = useState("");
  const [id, setId] = useState("");

  const { data, error, isLoading, isFetching } = useGetOneWristbandItemQuery(
    id,
    {
      skip: !id,
    },
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setId(odId);
  };

  const getErrorMessage = (error: FetchBaseQueryError | SerializedError) => {
    const err = error as FetchBaseQueryError;
    const errorMessage = (err.data as { message: string }).message;
    return errorMessage;
  };

  const { color, title, price, create_at, subTotal, status } =
    (data?.wistband as WristbandType) || {};

  const formattedDate = (value: string) => {
    const createDate = new Date(value);
    return createDate?.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <section className="min-h-screen">
      <div className="w-11/12 md:w-10/12 xl:w-7/12 2xl:w-5/12 m-auto py-10">
        <p className="min-w-24 m-auto w-24 h-24 flex justify-center items-center bg-[#cbf38b] rounded-full">
          <i className="fa-solid fa-shuffle text-5xl"></i>
        </p>
        <h2 className="text-4xl font-medium text-black text-center mt-5">
          Find Your Wristband and Track Your Order
        </h2>
        <p className="text-center text-md font-normal text-black my-5">
          Use your wristband order ID to quickly access order details and check
          the current shipping status.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="bg-gray-100 border flex gap-2 items-center border-gray-300 rounded-xl pr-2">
            <input
              type="search"
              name="orderId"
              id="OrderId"
              value={odId}
              onChange={(e) => setdId(e.target.value)}
              className="w-full p-4 outline-none text-md font-normal text-black"
              placeholder="Enter your order id"
            />
            <button
              type="submit"
              className="bg-[#cbf38b] px-5 py-3 rounded-xl text-sm font-normal text-black cursor-pointer"
            >
              Search
            </button>
          </div>
        </form>

        {(isLoading || isFetching) && (
          <div className="flex items-center justify-center bg-white-100 mt-10">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#96c94b] border-solid"></div>
          </div>
        )}

        {!isLoading && !isFetching && error && (
          <div className="flex flex-col gap-2 items-center justify-center mt-10">
            <p className="min-w-16 w-16 h-16 flex justify-center items-center text-white bg-[#ff0000] rounded-full">
              <i className="fa-solid fa-triangle-exclamation text-2xl"></i>
            </p>
            <p className="text-3xl text-black font-medium">
              {getErrorMessage(error)}
            </p>
          </div>
        )}

        {!isLoading && !isFetching && !error && data && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 mt-10">
            <div className="flex gap-2 items-center justify-start">
              <p className="min-w-16 w-16 h-16 flex justify-center items-center bg-[#cbf38b] rounded-full">
                <i className="fa-regular fa-hand-back-fist text-3xl"></i>
              </p>
              <div>
                <h2 className="text-black text-xl font-medium">
                  Wristband Name
                </h2>
                <p className="text-md font-medium text-black">{title}</p>
              </div>
            </div>
            <div className="flex gap-2 items-center justify-start">
              <p className="min-w-16 w-16 h-16 flex justify-center items-center bg-[#2EE2B7] rounded-full">
                <i className="fa-solid fa-bandage text-2xl"></i>
              </p>
              <div>
                <h2 className="text-black text-xl font-medium">
                  Wristband Color
                </h2>
                <p className="text-md font-medium text-black">{color}</p>
              </div>
            </div>

            <div className="flex gap-2 items-center">
              <p className="min-w-16 w-16 h-16 flex justify-center text-white items-center bg-[#CC374B] rounded-full">
                <i className="fa-regular fa-clock text-2xl"></i>
              </p>
              <div>
                <h2 className="text-black text-xl font-medium">Order Placed</h2>
                <p className="text-md font-medium text-black">
                  {formattedDate(create_at)}
                </p>
              </div>
            </div>

            <div className="flex gap-2 items-start">
              <p className="min-w-16 w-16 h-16 flex justify-center text-white items-center bg-[#5839DD] rounded-full">
                <i className="fa-solid fa-dollar-sign text-2xl"></i>
              </p>
              <div>
                <h2 className="text-black text-xl font-medium">
                  Wristband Price
                </h2>
                <div className="flex gap-2 flex-wrap">${price}</div>
              </div>
            </div>
            <div className="flex gap-2 items-start">
              <p className="min-w-16 w-16 h-16 flex justify-center text-white items-center bg-[#FFCE49] rounded-full">
                <i className="fa-solid fa-sack-dollar text-2xl"></i>
              </p>
              <div>
                <h2 className="text-black text-xl font-medium">
                  Wristband Sub Total
                </h2>
                <div className="flex gap-2 flex-wrap">${subTotal}</div>
              </div>
            </div>

            <div className="flex gap-2 items-center">
              <p className="min-w-16 w-16 h-16 flex justify-center text-white items-center bg-[#E59D2D] rounded-full">
                <i className="fa-solid fa-truck-fast text-2xl"></i>
              </p>
              <div>
                <h2 className="text-black text-xl font-medium mb-1">
                  Shipping Status
                </h2>
                <p
                  className={`w-fit px-3 py-1 rounded-md text-center font-medium text-sm capitalize ${
                    status === "PENDING" ||
                    status === "REJECTED" ||
                    status === "CANCELED"
                      ? "bg-red-100 text-red-500"
                      : "bg-green-100 text-green-500"
                  }`}
                >
                  {status}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default WistbandTracking;
