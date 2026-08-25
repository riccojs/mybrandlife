import { useGetOneReferralQuery } from "../../redux/features/referral/referralApi";
import useBodyScroll from "../../hook/userBodyscroll";
import BrandshareForm from "./Brandshare.form";

interface TypesForm {
  showTab: boolean;
  setShowTab: React.Dispatch<React.SetStateAction<boolean>>;
  id: string;
}

function UpdateBrandshare({ showTab, setShowTab, id }: TypesForm) {
  useBodyScroll(showTab);
  const { data, isLoading } = useGetOneReferralQuery(id);

  return (
    <div className="inset-0 bg-[#00000053] flex fixed left-0 justify-center items-center w-full min-h-screen z-50 overflow-auto">
      <div
        className={`relative flex flex-col w-11/12 md:w-8/12 lg:w-6/12 2xl:w-5/12 m-auto justify-center p-10 rounded-3xl shadow-sm bg-[#ffffff] border border-gray-300 ${
          showTab ? "zoom-animation" : ""
        }`}
      >
        <h2 className="text-2xl font-medium text-black text-center mt-5 mb-2">
          Update BrandShare
        </h2>
        <p className="text-md font-normal text-black text-center">
          Ensure all mandatory fields are filled in with the correct
          information. Upon completion, you may proceed to establish the
          referral system.
        </p>
        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#96c94b] border-solid"></div>
          </div>
        ) : (
          <BrandshareForm
            data={data}
            setShowTab={setShowTab}
            id={data?.referral?.id}
          />
        )}
      </div>
    </div>
  );
}

export default UpdateBrandshare;
