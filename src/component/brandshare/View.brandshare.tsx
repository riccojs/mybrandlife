import { type SetStateAction } from "react";
import { BsSignpost2 } from "react-icons/bs";
import SingleBrandshareLader from "../loader/Single.brandshare.loader";
import { useGetOneReferralQuery } from "../../redux/features/referral/referralApi";

interface DataTypes {
  isShow: boolean;
  setShow: React.Dispatch<SetStateAction<boolean>>;
  id: string;
}

function ViewBrandshare({ isShow, setShow, id }: DataTypes) {
  const { data, isLoading } = useGetOneReferralQuery(id);
  const { code, label, link, create_at, logo, type, value, active, joined } =
    data?.referral || {};

  const formattedDate = (value: string) => {
    const createDate = new Date(value);
    return createDate?.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };
  return (
    <div className="fixed inset-0 flex justify-center items-center w-full min-h-screen z-50 overflow-auto bg-white/20 backdrop-blur-xs">
      <div
        className={`relative p-10 flex flex-col w-11/12 lg:w-8/12 xl:w-7/12 2xl:w-96 m-auto justify-center bg-white rounded-2xl shadow-xl ${
          isShow ? "zoom-animation" : ""
        }`}
      >
        {isLoading ? (
          <SingleBrandshareLader />
        ) : (
          <div className="flex flex-col gap-5 rounded-2xl">
            <h2 className="text-[#3D424B] font-medium text-xl">
              BrandShare Details
            </h2>
            <div className="flex flex-col gap-5">
              <div>
                <h2 className="text-[#3D424B] font-medium text-md">
                  BrandShare Code
                </h2>
                <span className="flex gap-2 items-center">
                  <i className="fa-solid fa-receipt"></i>
                  <p className="text-[#3D424B] font-normal text-md">{code}</p>
                </span>
              </div>
              <div>
                <h2 className="text-[#3D424B] font-medium text-md">
                  BrandShare Type
                </h2>
                <span className="flex gap-2 items-center">
                  <i className="fa-regular fa-font-awesome"></i>
                  <p className="text-[#3D424B] font-normal text-md">{type}</p>
                </span>
              </div>
              <div>
                <h2 className="text-[#3D424B] font-medium text-md">
                  BrandShare Value
                </h2>
                <span className="flex gap-2 items-center">
                  <i className="fa-brands fa-steam"></i>
                  <p className="text-[#3D424B] font-normal text-md">{value}</p>
                </span>
              </div>
              <div>
                <h2 className="text-[#3D424B] font-medium text-md">
                  BrandShare Status
                </h2>
                <span className="flex gap-2 items-center">
                  <i className="fa-solid fa-bars-progress"></i>
                  <p className="text-[#3D424B] font-normal text-md">
                    {active ? "Active" : "Expired"}
                  </p>
                </span>
              </div>
              <div>
                <h2 className="text-[#3D424B] font-medium text-md">
                  BrandShare Label
                </h2>
                <span className="flex gap-2 items-center">
                  <i className="fa-solid fa-tags"></i>
                  <p className="text-[#3D424B] font-normal text-md">{label}</p>
                </span>
              </div>
              <div>
                <h2 className="text-[#3D424B] font-medium text-md">
                  BrandShare Link
                </h2>
                <span className="flex gap-2 items-center">
                  <i className="fa-solid fa-link"></i>
                  <p className="text-[#3D424B] font-normal text-md">{link}</p>
                </span>
              </div>
              <div>
                <h2 className="text-[#3D424B] font-medium text-md">
                  BrandShare Logo
                </h2>
                {logo ? (
                  <img
                    src={logo}
                    className="w-10 h-10 object-cover rounded-full"
                    alt=""
                  />
                ) : (
                  <p className="w-10 h-10 min-w-10 bg-slate-200 flex justify-center items-center uppercase rounded-full">
                    {code?.slice(0, 1)}
                  </p>
                )}
              </div>
              <div>
                <h2 className="text-[#3D424B] font-medium text-md">
                  Create At
                </h2>
                <span className="flex gap-2 items-center">
                  <BsSignpost2 size={20} />
                  <p className="text-[#3D424B] font-normal text-md">
                    {formattedDate(create_at)}
                  </p>
                </span>
              </div>
              <div>
                <h2 className="text-[#3D424B] font-medium text-md">
                  Total Joined
                </h2>
                <span className="flex gap-2 items-center">
                  <i className="fa-solid fa-handshake-angle"></i>
                  <p className="text-[#3D424B] font-normal text-md">
                    {joined ? joined : 0}
                  </p>
                </span>
              </div>
            </div>
          </div>
        )}
        <button
          onClick={() => setShow(false)}
          className="text-red-500 text-2xl absolute top-1 right-1 cursor-pointer"
        >
          <i className="fa-solid fa-circle-xmark"></i>
        </button>
      </div>
    </div>
  );
}

export default ViewBrandshare;
