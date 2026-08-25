import { type SetStateAction } from "react";

import { useGetOneEventQuery } from "../../redux/features/event/eventApi";
import useBodyScroll from "../../hook/userBodyscroll";
import BrandbookForm from "./Brandbook.form";

interface DataTypes {
  isShow: boolean;
  setShow: React.Dispatch<SetStateAction<boolean>>;
  id: string;
}
function UpdateBrandbook({ isShow, setShow, id }: DataTypes) {
  useBodyScroll(isShow);

  const { data, isLoading } = useGetOneEventQuery(id);

  return (
    <div className="fixed inset-0 flex justify-center items-center w-full min-h-screen z-50 overflow-auto bg-white/20 backdrop-blur-xs">
      <div
        className={`relative p-10 flex flex-col w-11/12 lg:w-8/12 xl:w-7/12 2xl:w-5/12 m-auto justify-center rounded-xl shadow-xl bg-white ${
          isShow ? "zoom-animation" : ""
        }`}
      >
        <div className="flex flex-col gap-5 rounded-2xl">
          <h2 className="text-[#3D424B] font-medium text-3xl">Update Echo</h2>
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center h-[50vh]">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-[#96c94b] border-solid"></div>
          </div>
        ) : (
          <BrandbookForm data={data} setShow={setShow} id={data?.event?.id} />
        )}
      </div>
    </div>
  );
}

export default UpdateBrandbook;
