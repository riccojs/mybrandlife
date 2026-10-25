import { type SetStateAction } from "react";
import { useSearchParams } from "react-router";
import ViewEchoLoader from "../loader/View.echo.loader";
import { useGetOneEchoQuery } from "../../redux/features/echo/echoApi";
import useBodyScroll from "../../hook/userBodyscroll";
import { X } from "lucide-react";

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
            <h2 className="text-[#3D424B] font-medium text-lg md:text-2xl">
              Echo Request
            </h2>
            <div>
              <h3 className="text-[#3D424B] font-medium text-md md:text-lg">
                Name
              </h3>
              <p className="text-[#3D424B] font-normal text-sm md:text-md">
                {name}
              </p>
            </div>
            <div>
              <h3 className="text-[#3D424B] font-medium text-md md:text-lg">
                Email
              </h3>
              <p className="text-[#3D424B] font-normal text-sm md:text-md">
                {email}
              </p>
            </div>
            <div>
              <div>
                <h2 className="text-[#3D424B] font-medium text-md md:text-lg">
                  Message
                </h2>
                <p className="text-[#3D424B] font-normal text-sm md:text-md">
                  {message}
                </p>
              </div>
              <div className="my-5">
                <h2 className="text-[#3D424B] font-medium text-md md:text-lg">
                  City
                </h2>
                <p className="text-[#3D424B] font-normal text-sm md:text-md">
                  {city}
                </p>
              </div>
              <div className="my-5">
                <h2 className="text-[#3D424B] font-medium text-md md:text-lg">
                  Shoutout
                </h2>
                <p className="text-[#3D424B] font-normal text-sm md:text-md">
                  {shoutOut}
                </p>
              </div>
              <div className="my-5">
                <h2 className="text-[#3D424B] font-medium text-md md:text-lg">
                  Tip
                </h2>
                <p className="text-[#3D424B] font-normal text-sm md:text-md">
                  {tip}
                </p>
              </div>
              <div>
                <h2 className="text-[#3D424B] font-medium text-md md:text-lg">
                  Status
                </h2>
                <p className="text-[#3D424B] font-normal text-sm md:text-md">
                  {status}
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

export default ViewEcho;
