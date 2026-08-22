import { useEffect } from "react";

interface TypesForm {
  showTab: boolean;
  setShowTab: React.Dispatch<React.SetStateAction<boolean>>;
}

function BrandFormNote({ showTab, setShowTab }: TypesForm) {
  useEffect(() => {
    if (showTab) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showTab]);

  return (
    <div className="inset-0 bg-[#00000053] flex fixed left-0 justify-center items-center w-full min-h-screen z-50 ">
      <div
        className={`relative flex flex-col overflow-auto h-auto max-h-[96vh] w-11/12 md:w-8/12 2xl:w-4/12 m-auto p-4 rounded-lg shadow-sm bg-[#ffffff] border border-gray-300 custom-scroll ${
          showTab ? "zoom-animation" : ""
        }`}
      >
        <div className="p-10 flex flex-col gap-3">
          <div>
            <h2 className="text-2xl font-medium text-black">
              BrandForm – Gold Plan Details
            </h2>
            <p className="text-base italic">
              Capture every opportunity — and turn every submission into action.
            </p>
            <p className="text-lg font-medium mt-5">
              Your BrandForm is fully database-driven, ensuring every submission
              is:
            </p>
            <ul className="list-disc pl-6 mt-2">
              <li className="text-base font-normal text-black">
                Delivered instantly to your registered email address
              </li>
              <li className="text-base font-normal text-black">
                Stored securely in your dashboard for real-time access and
                export
              </li>
              <li className="text-base font-normal text-black">
                Searchable and filterable by date, location, and custom tags
                (Target: Q4 2026)
              </li>
              <li className="text-base font-normal text-black">
                Marketing & Automation Connectivity
              </li>
            </ul>
            <div className="mt-5">
              <p className="text-lg font-medium">
                BrandForm includes powerful marketing integrations:{" "}
              </p>
              <ul className="list-disc pl-6 mt-2">
                <li className="text-base font-normal text-black">
                  CRM and email marketing integration to sync form data with
                  your preferred tools (Target: Q1 2027)
                </li>
                <li className="text-base font-normal text-black">
                  Automated workflows including drip campaigns and
                  autoresponders based on user input (Target: Q2 2027)
                </li>
              </ul>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowTab(false)}
          className="bg-red-400 w-10 h-10 flex justify-center items-center rounded-full text-white absolute top-3 right-3 cursor-pointer"
        >
          <i className="fa-solid fa-xmark text-2xl"></i>
        </button>
      </div>
    </div>
  );
}

export default BrandFormNote;
