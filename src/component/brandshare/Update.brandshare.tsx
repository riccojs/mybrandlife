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
        className={`relative max-h-[95vh] h-auto overflow-y-auto custom-scroll w-11/12 md:w-8/12 lg:w-6/12 2xl:w-5/12 m-auto p-5 md:p-10 rounded-3xl shadow-sm bg-[#ffffff] border border-gray-300 ${
          showTab ? "zoom-animation" : ""
        }`}
      >
        <h2 className="text-base md:text-xl font-medium text-gray-500 text-center">
          Update BrandShare
        </h2>
        <p className="bg-[#FEFBED] text-center text-[#643315] border-2 border-[#feeda0] text-xs md:text-sm px-2 font-normal py-3 rounded-lg">
          You can edit any info on this BrandShare form section.
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
