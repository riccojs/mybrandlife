import { type SetStateAction } from "react";
import { FaRegCommentDots } from "react-icons/fa6";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { CiCalendarDate } from "react-icons/ci";
import { useGetOneReportQuery } from "../../redux/features/report/reportApi";
import SingleReportLoader from "../loader/Single.report.loader";
import { X } from "lucide-react";

interface DataTypes {
  isShow: boolean;
  setShow: React.Dispatch<SetStateAction<boolean>>;
  id: string;
}

function SingleReport({ isShow, setShow, id }: DataTypes) {
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
        className={`relative flex flex-col w-11/12 md:w-8/12 lg:w-6/12 2xl:w-3/12 m-auto justify-center p-6 md:p-10 rounded-3xl shadow-sm bg-[#ffffff] border border-gray-300 ${
          isShow ? "zoom-animation" : ""
        }`}
      >
        {isLoading ? (
          <SingleReportLoader />
        ) : (
          <div className="flex flex-col gap-5 rounded-2xl">
            <h2 className="text-[#3D424B] font-medium text-lg md:text-2xl">
              Report Details
            </h2>
            <div>
              <div>
                <h2 className="text-[#3D424B] font-medium text-base md:text-lg">
                  Comment
                </h2>
                <span className="flex gap-2 items-center">
                  <FaRegCommentDots size={20} />
                  <p className="text-[#3D424B] font-normal text-sm md:text-md">
                    {comment}
                  </p>
                </span>
              </div>
              <div className="my-5">
                <h2 className="text-[#3D424B] font-medium text-base md:text-lg">
                  Reason
                </h2>
                <span className="flex gap-2 items-center">
                  <IoMdInformationCircleOutline size={20} />
                  <p className="text-[#3D424B] font-normal text-sm md:text-md">
                    {reason}
                  </p>
                </span>
              </div>
              <div className="my-5">
                <h2 className="text-[#3D424B] font-medium text-base md:text-lg">
                  Create At
                </h2>
                <span className="flex gap-2 items-center">
                  <CiCalendarDate size={20} />
                  <p className="text-[#3D424B] font-normal text-sm md:text-md">
                    {formattedDate(create_at)}
                  </p>
                </span>
              </div>
            </div>
          </div>
        )}
        <button
          onClick={() => setShow(false)}
          className="absolute top-2 right-2 border border-[#E7EBF2] text-[#8C98AE] bg-[#f0f3f8] hover:bg-[#E7EBF2] w-10 h-10 flex justify-center items-center rounded-full cursor-pointer"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
}

export default SingleReport;
