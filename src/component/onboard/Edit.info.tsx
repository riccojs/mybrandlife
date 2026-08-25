import { useParams } from "react-router";
import { useGetOneOnboardQuery } from "../../redux/features/onboard/onboardApi";
import useBodyScroll from "../../hook/userBodyscroll";
import InfoForm from "./Info.form";
import { Loader } from "lucide-react";

interface TypesForm {
  isShowInfo: boolean;
  setIsShowInfo: React.Dispatch<React.SetStateAction<boolean>>;
}

function EditInfo({ isShowInfo, setIsShowInfo }: TypesForm) {
  useBodyScroll(isShowInfo);
  const params = useParams();
  const id = params.id;

  const { data, isLoading } = useGetOneOnboardQuery(id);

  return (
    <div className="inset-0 bg-[#00000039] flex fixed left-0 justify-center items-center w-full h-auto min-h-screen z-50 overflow-auto">
      <div
        className={`overflow-hidden flex flex-col w-11/12 2xl:w-4/12 xl:w-6/12 m-auto justify-center rounded-3xl shadow-sm bg-[#ffffff] border border-gray-300 ${
          isShowInfo ? "zoom-animation" : ""
        }`}
      >
        <div className="p-8 min-h-[90vh] h-[95vh] overflow-y-auto custom-scroll">
          <div className="flex flex-col border-b border-gray-300 pb-5 mb-5">
            <h2 className="text-xl">Update General Info</h2>
            <p className="text-sm font-normal text-gray-400">
              Update your general info settings here!
            </p>
          </div>
          {isLoading ? (
            <div className="py-5 flex justify-center items-center">
              <Loader className="animate-spin" />
            </div>
          ) : (
            <InfoForm
              id={data?.onboard?.id}
              data={data}
              setIsShowInfo={setIsShowInfo}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default EditInfo;
