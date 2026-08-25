import { useGetOneWristbandQuery } from "../../redux/features/wristband/wristbandApi";
import useBodyScroll from "../../hook/userBodyscroll";
import WristbandForm from "./Wristband.form";
import { Loader } from "lucide-react";

interface TypesForm {
  showTab: boolean;
  setShowTab: React.Dispatch<React.SetStateAction<boolean>>;
  id: string;
}

function UpdateWristband({ showTab, setShowTab, id }: TypesForm) {
  useBodyScroll(showTab);
  const { data, isLoading } = useGetOneWristbandQuery(id);

  return (
    <div className="fixed inset-0 flex justify-center items-center w-full min-h-screen z-50 overflow-auto bg-black/20 backdrop-blur-xs">
      <div
        className={`relative p-10 flex flex-col w-11/12 lg:w-8/12 xl:w-7/12 2xl:w-4/12 m-auto justify-center rounded-3xl shadow-xl bg-white ${
          showTab ? "zoom-animation" : ""
        }`}
      >
        <h2 className="text-2xl font-medium text-black text-center mt-5 mb-2">
          Update Wristband
        </h2>
        <p className="text-md font-normal text-black text-center">
          Ensure all mandatory fields are filled in with the correct
          information. Upon completion, you may proceed to establish the
          referral system.
        </p>
        {isLoading ? (
          <div className="py-5 flex justify-center items-center">
            <Loader className="animate-spin" />
          </div>
        ) : (
          <WristbandForm data={data} setShowTab={setShowTab} />
        )}
      </div>
    </div>
  );
}

export default UpdateWristband;
