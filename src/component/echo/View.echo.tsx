import { type SetStateAction } from "react";
import { LuMessageSquareMore } from "react-icons/lu";
import { SlLocationPin } from "react-icons/sl";
import { IoFlashOutline } from "react-icons/io5";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { useSearchParams } from "react-router";
import ViewEchoLoader from "../loader/View.echo.loader";
import { useGetOneEchoQuery } from "../../redux/features/echo/echoApi";
import useBodyScroll from "../../hook/userBodyscroll";

interface DataTypes {
  isShow: boolean;
  setShow: React.Dispatch<SetStateAction<boolean>>;
  id: string;
}

function ViewEcho({ isShow, setShow, id }: DataTypes) {
  useBodyScroll(isShow);
  const [searchParams, setSearchParams] = useSearchParams();
  const { data, isLoading } = useGetOneEchoQuery(id);
  const { name, email, message, tip, status, shoutOut, city } =
    data?.echo || {};

  return (
    <div className="inset-0 bg-[#00000039] flex fixed left-0 justify-center items-center w-full h-auto min-h-screen z-50 overflow-auto">
      <div
        className={`relative flex flex-col w-11/12 2xl:w-3/12 xl:w-6/12 m-auto justify-center p-8 rounded-3xl shadow-sm bg-[#ffffff] border border-gray-300 ${
          isShow ? "zoom-animation" : ""
        }`}
      >
        {isLoading ? (
          <ViewEchoLoader />
        ) : (
          <div className="flex flex-col gap-5">
            <h2 className="text-[#3D424B] font-medium text-2xl">
              Echo Request
            </h2>
            <div>
              <h3 className="text-[#3D424B] font-medium text-lg">Name</h3>
              <p className="text-[#3D424B] font-normal text-md">{name}</p>
            </div>
            <div>
              <h3 className="text-[#3D424B] font-medium text-lg">Email</h3>
              <p className="text-[#3D424B] font-normal text-md">{email}</p>
            </div>
            <div>
              <div>
                <h2 className="text-[#3D424B] font-medium text-lg">Message</h2>
                <span className="flex gap-2 items-center">
                  <LuMessageSquareMore size={20} />
                  <p className="text-[#3D424B] font-normal text-md">
                    {message}
                  </p>
                </span>
              </div>
              <div className="my-5">
                <h2 className="text-[#3D424B] font-medium text-lg">City</h2>
                <span className="flex gap-2 items-center">
                  <SlLocationPin size={20} />
                  <p className="text-[#3D424B] font-normal text-md">{city}</p>
                </span>
              </div>
              <div className="my-5">
                <h2 className="text-[#3D424B] font-medium text-lg">Shoutout</h2>
                <span className="flex gap-2 items-center">
                  <IoFlashOutline size={20} />
                  <p className="text-[#3D424B] font-normal text-md">
                    {shoutOut}
                  </p>
                </span>
              </div>
              <div className="my-5">
                <h2 className="text-[#3D424B] font-medium text-lg">Tip</h2>
                <span className="flex gap-2 items-center">
                  <RiMoneyDollarCircleLine size={20} />
                  <p className="text-[#3D424B] font-normal text-md">{tip}</p>
                </span>
              </div>
              <div>
                <h2 className="text-[#3D424B] font-medium text-lg">Status</h2>
                <p className="text-[#3D424B] font-normal text-md">{status}</p>
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

export default ViewEcho;
