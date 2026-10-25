import { type SetStateAction } from "react";
import { useSearchParams } from "react-router";
import ViewdomainLoader from "../loader/View.domain.loader";
import useBodyScroll from "../../hook/userBodyscroll";
import { useGetOneDomainQuery } from "../../redux/features/domain/domainApi";
import { X } from "lucide-react";

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
          <div className="flex flex-col gap-5 rounded-lg p-6 md:p-10">
            <h2 className="text-[#3D424B] font-medium text-xl md:text-2xl">
              Domain Request
            </h2>
            <div className="flex flex-col gap-5">
              <div>
                <h2 className="text-[#3D424B] font-medium text-base">
                  Domain ID
                </h2>
                <p className="text-[#464a51] font-normal text-sm">{id}</p>
              </div>
              <div>
                <h2 className="text-[#3D424B] font-medium text-base">Domain</h2>
                <p className="text-[#464a51] font-normal text-sm">{domain}</p>
              </div>
              <div>
                <h2 className="text-[#3D424B] font-medium text-base">Email</h2>
                <p className="text-[#464a51] font-normal text-sm">{email}</p>
              </div>
              <div>
                <h2 className="text-[#3D424B] font-medium text-base">
                  Create At
                </h2>
                <p className="text-[#464a51] font-normal text-sm">
                  {formattedDate(create_at)}
                </p>
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
          className="absolute top-2 right-2 border border-[#E7EBF2] text-[#8C98AE] bg-[#f0f3f8] hover:bg-[#E7EBF2] w-10 h-10 flex justify-center items-center rounded-full cursor-pointer"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
}

export default ViewDomain;
