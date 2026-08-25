import { useGetOnePartnerQuery } from "../../redux/features/partner/partnerApi";
import PartnerForm from "./Partner.form";

interface TypesForm {
  showTab: boolean;
  setShowTab: React.Dispatch<React.SetStateAction<boolean>>;
  id: string;
}

function UpdatePartner({ showTab, setShowTab, id }: TypesForm) {
  const { data, isLoading } = useGetOnePartnerQuery(id);

  return (
    <div className="inset-0 bg-[#00000053] flex fixed left-0 justify-center items-center w-full min-h-screen z-50">
      <div
        className={`flex flex-col w-11/12 md:w-8/12 lg:w-6/12 2xl:w-4/12 m-auto justify-center rounded-3xl overflow-hidden shadow-sm bg-[#ffffff] border border-gray-300 ${
          showTab ? "zoom-animation" : ""
        }`}
      >
        <div className="max-h-[95vh] h-auto overflow-y-auto p-8 custom-scroll">
          <h2 className="text-2xl font-medium text-black text-center mt-5 mb-2">
            Update Partner Info
          </h2>
          <p className="text-md font-normal text-black text-center">
            Ensure all mandatory fields are filled in with the correct
            information. Upon completion, you may proceed to establish the
            partner profile.
          </p>
          {isLoading ? (
            <div className="flex items-center justify-center h-[50vh]">
              <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-[#96c94b] border-solid"></div>
            </div>
          ) : (
            <PartnerForm
              setShowTab={setShowTab}
              data={data}
              id={data?.partner?.id}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default UpdatePartner;
