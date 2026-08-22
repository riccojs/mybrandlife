import { type SetStateAction } from "react";
import { LuCalendarDays, LuClock4 } from "react-icons/lu";
import { useSearchParams } from "react-router";
import useBodyScroll from "../../hook/userBodyscroll";
import { useGetOneEventQuery } from "../../redux/features/event/eventApi";
import ViewBrandbookLoader from "../loader/View.brandbook.loader";

interface DataTypes {
  isShow: boolean;
  setShow: React.Dispatch<SetStateAction<boolean>>;
  id: string;
}

function ViewBrandbook({ isShow, setShow, id }: DataTypes) {
  useBodyScroll(isShow);

  const [searchParams, setSearchParams] = useSearchParams();
  const { data, isLoading } = useGetOneEventQuery(id);
  const { name, email, time, date, note, status } = data?.event || {};
  const formattedDate = (value: string) => {
    const createDate = new Date(value);
    return createDate?.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="inset-0 bg-[#00000039] flex fixed left-0 justify-center items-center w-full h-auto min-h-screen z-50 overflow-auto">
      <div
        className={`relative flex flex-col w-11/12 2xl:w-3/12 xl:w-6/12 m-auto justify-center p-8 rounded-3xl shadow-sm bg-[#ffffff] border border-gray-300 ${
          isShow ? "zoom-animation" : ""
        }`}
      >
        {isLoading ? (
          <ViewBrandbookLoader />
        ) : (
          <div className="flex flex-col gap-5 rounded-2xl">
            <div className="flex flex-col gap-2">
              <h2 className="text-[#3D424B] font-medium text-3xl">
                Booking Details
              </h2>
              <p
                className={`w-fit px-3 py-1 rounded-md text-center font-medium text-sm capitalize ${
                  status === "PENDING" || status === "REJECTED"
                    ? "bg-red-100 text-red-500"
                    : "bg-green-100 text-green-500"
                }`}
              >
                {status}
              </p>
            </div>
            <div>
              <h3 className="text-[#3D424B] font-medium text-lg">Name</h3>
              <p className="text-[#3D424B] font-normal text-md">{name}</p>
            </div>
            <div>
              <h3 className="text-[#3D424B] font-medium text-lg">Email</h3>
              <p className="text-[#3D424B] font-normal text-md">{email}</p>
            </div>
            <div>
              <h3 className="text-[#3D424B] font-medium text-lg">Date</h3>
              <div className="flex gap-2 items-center">
                <LuCalendarDays color="#3D424B" size={20} />
                <p className="text-[#3D424B] font-normal text-md">
                  {formattedDate(date)}
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-[#3D424B] font-medium text-lg">Time</h3>
              <div className="flex gap-2 items-center">
                <LuClock4 color="#3D424B" size={20} />
                <p className="text-[#3D424B] font-normal text-md">{time}</p>
              </div>
            </div>
            <div>
              <h2 className="text-[#3D424B] font-medium text-lg">Note</h2>
              <p className="text-[#3D424B] font-normal text-md">{note}</p>
            </div>
            <div>
              <h2 className="text-[#3D424B] font-medium text-lg">Status</h2>
              <p className="text-[#3D424B] font-normal text-md">{status}</p>
            </div>
          </div>
        )}
        <button
          onClick={() => {
            setShow(false);
            searchParams.delete("view");
            setSearchParams(searchParams);
          }}
          className="text-gray-400 text-2xl absolute top-2 right-2 cursor-pointer"
        >
          <i className="fa-solid fa-circle-xmark"></i>
        </button>
      </div>
    </div>
  );
}

export default ViewBrandbook;
