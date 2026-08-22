interface TypesForm {
  whyTab: boolean;
  setWhyTab: React.Dispatch<React.SetStateAction<boolean>>;
}

function WhyPlatTab({ whyTab, setWhyTab }: TypesForm) {
  return (
    <div className="inset-0 bg-[#00000053] flex fixed left-0 justify-center items-center w-full min-h-screen z-50 overflow-auto">
      <div
        className={`relative flex flex-col w-11/12 md:w-8/12 2xl:w-4/12 m-auto justify-center p-4 rounded-lg shadow-sm bg-[#ffffff] border border-gray-300 ${
          whyTab ? "zoom-animation" : ""
        }`}
      >
        <div className="p-10 flex flex-col gap-3 items-center justify-center">
          <h2 className="text-2xl font-medium text-black">
            Why Platinum Is Yearly-Only
          </h2>
          <p className="text-md font-normal text-black text-center">
            Our Platinum tier is available only as an annual subscription to:
          </p>
          <ul className="list-disc px-5 py-3">
            <li className="text-md font-normal text-black">
              Guarantee you the full-year access to premium features.
            </li>
            <li className="text-md font-normal text-black">
              How it affects your gold tier users and accountability.
            </li>
            <li className="text-md font-normal text-black">
              Simplify billing and reduce transaction fees.
            </li>
            <li className="text-md font-normal text-black">
              Enable us to provide dedicated support and updates.
            </li>
          </ul>

          <p className="text-md font-normal text-black text-center">
            Thank you for understanding—this ensures the best experience and
            value.
          </p>
        </div>

        <button
          onClick={() => setWhyTab(false)}
          className="bg-red-400 w-10 h-10 flex justify-center items-center rounded-full text-white absolute top-3 right-3 cursor-pointer"
        >
          <i className="fa-solid fa-xmark text-2xl"></i>
        </button>
      </div>
    </div>
  );
}

export default WhyPlatTab;
