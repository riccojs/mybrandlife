import { type SetStateAction } from "react";
import { FaRegCommentDots } from "react-icons/fa6";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { CiCalendarDate } from "react-icons/ci";
import SingleNotificationLoader from "../loader/Single.notification.loader";
import { useGetOneReportQuery } from "../../redux/features/report/reportApi";

interface DataTypes {
  isShow: boolean;
  setShow: React.Dispatch<SetStateAction<boolean>>;
  id: string;
}

function SingleNotification({ isShow, setShow, id }: DataTypes) {
  const { data, isLoading } = useGetOneReportQuery(id);
  const { comment, reason, create_at } = data?.report || {};

  const formattedDate = (value: string) => {
    const createDate = new Date(value);
    return createDate?.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };
  return (
    <div className="inset-0 bg-[#00000053] flex fixed left-0 justify-center items-center w-full min-h-screen z-50 overflow-auto">
      <div
        className={`relative flex flex-col w-11/12 md:w-8/12 lg:w-6/12 2xl:w-3/12 m-auto justify-center p-10 rounded-3xl shadow-sm bg-[#ffffff] border border-gray-300 ${
          isShow ? "zoom-animation" : ""
        }`}
      >
        {isLoading ? (
          <SingleNotificationLoader />
        ) : (
          <div className="flex flex-col gap-5 rounded-2xl">
            <h2 className="text-[#3D424B] font-medium text-2xl">
              Report Details
            </h2>
            <div>
              <div>
                <h2 className="text-[#3D424B] font-medium text-lg">Comment</h2>
                <span className="flex gap-2 items-center">
                  <FaRegCommentDots size={20} />
                  <p className="text-[#3D424B] font-normal text-md">
                    {comment}
                  </p>
                </span>
              </div>
              <div className="my-5">
                <h2 className="text-[#3D424B] font-medium text-lg">Reason</h2>
                <span className="flex gap-2 items-center">
                  <IoMdInformationCircleOutline size={20} />
                  <p className="text-[#3D424B] font-normal text-md">{reason}</p>
                </span>
              </div>
              <div className="my-5">
                <h2 className="text-[#3D424B] font-medium text-lg">
                  Create At
                </h2>
                <span className="flex gap-2 items-center">
                  <CiCalendarDate size={20} />
                  <p className="text-[#3D424B] font-normal text-md">
                    {formattedDate(create_at)}
                  </p>
                </span>
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

export default SingleNotification;
