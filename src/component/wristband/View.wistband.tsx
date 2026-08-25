import { type SetStateAction } from "react";
import type { WristbandType } from "../../utils/wristband.types";
import { useGetOneWristbandQuery } from "../../redux/features/wristband/wristbandApi";
import useBodyScroll from "../../hook/userBodyscroll";
import SingleEventLader from "../loader/Single.event.lader";

interface DataTypes {
  isShow: boolean;
  setShow: React.Dispatch<SetStateAction<boolean>>;
  id: string;
}

function ViewWistband({ isShow, setShow, id }: DataTypes) {
  useBodyScroll(isShow);
  const { data, isLoading } = useGetOneWristbandQuery(id);
  const { title, description, price, banner, stock, color, create_at, status } =
    (data?.wristband as WristbandType) || {};

  const formattedDate = (value: string) => {
    const createDate = new Date(value);
    return createDate?.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };
  return (
    <div className="fixed inset-0 flex justify-center items-center w-full min-h-screen z-50 overflow-auto bg-black/20 backdrop-blur-xs">
      <div
        className={`relative p-10 flex flex-col w-11/12 lg:w-8/12 xl:w-7/12 2xl:w-3/12 m-auto justify-center rounded-3xl shadow-xl bg-white ${
          isShow ? "zoom-animation" : ""
        }`}
      >
        {isLoading ? (
          <SingleEventLader />
        ) : (
          <div className="flex flex-col gap-5 rounded-2xl">
            <h2 className="text-[#3D424B] font-medium text-xl">
              Wristband Detail Info
            </h2>
            <div className="mt-2">
              <div>
                <h2 className="text-[#3D424B] font-medium text-md">Title</h2>
                <p className="text-[#3D424B] font-normal text-md">{title}</p>
              </div>
              <div className="my-5">
                <h2 className="text-[#3D424B] font-medium text-md">Banner</h2>
                <img
                  src={banner}
                  className="w-full h-48 max-h-48 rounded-xl object-cover"
                  alt=""
                />
              </div>
              <div className="my-5">
                <h2 className="text-[#3D424B] font-medium text-md">
                  Create At
                </h2>
                <span className="flex gap-2 items-center">
                  <i className="fa-regular fa-clock"></i>
                  <p className="text-[#3D424B] font-normal text-md">
                    {formattedDate(create_at)}
                  </p>
                </span>
              </div>
              <div className="my-5">
                <h2 className="text-[#3D424B] font-medium text-md">Status</h2>
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
              </div>
              <div>
                <h2 className="text-[#3D424B] font-medium text-md">
                  Description
                </h2>
                <p className="text-[#3D424B] font-normal text-md">
                  {description}
                </p>
              </div>
              <div className="flex justify-between">
                <div className="my-5">
                  <h2 className="text-[#3D424B] font-medium text-md">Price</h2>
                  <p className="text-[#3D424B] font-normal text-md">${price}</p>
                </div>
                <div className="my-5">
                  <h2 className="text-[#3D424B] font-medium text-md">Color</h2>
                  <p className="text-[#3D424B] font-normal text-md">{color}</p>
                </div>
                <div className="my-5">
                  <h2 className="text-[#3D424B] font-medium text-md">Stock</h2>
                  <p className="text-[#3D424B] font-normal text-md">{stock}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        <button
          onClick={() => setShow(false)}
          className="text-gray-400 text-2xl absolute top-2 right-2 cursor-pointer"
        >
          <i className="fa-solid fa-circle-xmark"></i>
        </button>
      </div>
    </div>
  );
}

export default ViewWistband;
