import { type SetStateAction } from "react";
import { GrDomain } from "react-icons/gr";
import { HiOutlineMailOpen } from "react-icons/hi";
import { BsSignpost2 } from "react-icons/bs";
import { useSearchParams } from "react-router";
import ViewdomainLoader from "../loader/View.domain.loader";
import useBodyScroll from "../../hook/userBodyscroll";
import { useGetOneDomainQuery } from "../../redux/features/domain/domainApi";

interface DataTypes {
  isShow: boolean;
  setShow: React.Dispatch<SetStateAction<boolean>>;
  id: string;
}

function ViewDomain({ isShow, setShow, id }: DataTypes) {
  useBodyScroll(isShow);
  const { data, isLoading } = useGetOneDomainQuery(id);
  const [searchParams, setSearchParams] = useSearchParams();
  const { domain, email, create_at } = data?.domain || {};

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
        className={`relative flex flex-col w-11/12 2xl:w-3/12 xl:w-6/12 m-auto justify-center rounded-3xl shadow-sm bg-[#ffffff] border border-gray-300 ${
          isShow ? "zoom-animation" : ""
        }`}
      >
        {isLoading ? (
          <ViewdomainLoader />
        ) : (
          <div className="flex flex-col gap-5 rounded-2xl p-8">
            <h2 className="text-[#3D424B] font-medium text-2xl">
              Domain Request
            </h2>
            <div>
              <div>
                <h2 className="text-[#3D424B] font-medium text-lg">Domain</h2>
                <span className="flex gap-2 items-center">
                  <GrDomain size={20} />
                  <p className="text-[#3D424B] font-normal text-md">{domain}</p>
                </span>
              </div>
              <div className="my-5">
                <h2 className="text-[#3D424B] font-medium text-lg">Email</h2>
                <span className="flex gap-2 items-center">
                  <HiOutlineMailOpen size={20} />
                  <p className="text-[#3D424B] font-normal text-md">{email}</p>
                </span>
              </div>
              <div className="my-5">
                <h2 className="text-[#3D424B] font-medium text-lg">
                  Create At
                </h2>
                <span className="flex gap-2 items-center">
                  <BsSignpost2 size={20} />
                  <p className="text-[#3D424B] font-normal text-md">
                    {formattedDate(create_at)}
                  </p>
                </span>
              </div>
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

export default ViewDomain;
