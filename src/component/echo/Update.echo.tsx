import { type SetStateAction } from "react";

import { useGetOneEchoQuery } from "../../redux/features/echo/echoApi";
import useBodyScroll from "../../hook/userBodyscroll";
import EchoForm from "./Echo.form";

interface DataTypes {
  isShow: boolean;
  setShow: React.Dispatch<SetStateAction<boolean>>;
  id: string;
}
function UpdateEcho({ isShow, setShow, id }: DataTypes) {
  useBodyScroll(isShow);
  const { data, isLoading } = useGetOneEchoQuery(id);

  return (
    <div className="inset-0 bg-[#00000039] flex fixed left-0 justify-center items-center w-full h-auto min-h-screen z-50 overflow-auto">
      <div
        className={`relative flex flex-col w-11/12 2xl:w-3/12 xl:w-6/12 m-auto justify-center rounded-xl shadow-sm bg-[#ffffff] border border-gray-300 ${
          isShow ? "zoom-animation" : ""
        }`}
      >
        <div className="flex flex-col gap-5 rounded-2xl p-8">
          <h2 className="text-[#3D424B] font-medium text-3xl">Update Echo</h2>
          {isLoading ? (
            <div className="flex items-center justify-center h-[50vh]">
              <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-[#96c94b] border-solid"></div>
            </div>
          ) : (
            <EchoForm data={data} setShow={setShow} id={data?.echo?.id} />
          )}
        </div>
      </div>
    </div>
  );
}

export default UpdateEcho;
