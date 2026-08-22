interface TypesForm {
  goldTab: boolean;
  setGoldTab: React.Dispatch<React.SetStateAction<boolean>>;
}

function GoldAccTab({ goldTab, setGoldTab }: TypesForm) {
  return (
    <div className="inset-0 bg-[#00000053] flex fixed left-0 justify-center items-center w-full min-h-screen z-50 overflow-auto">
      <div
        className={`relative flex flex-col w-11/12 md:w-8/12 2xl:w-4/12 m-auto justify-center p-4 rounded-lg shadow-sm bg-[#ffffff] border border-gray-300 ${
          goldTab ? "zoom-animation" : ""
        }`}
      >
        <div className="p-10 flex flex-col gap-3 items-center justify-center">
          <h2 className="text-2xl font-medium text-black">
            5 Gold Accounts Details
          </h2>
          <p className="text-md font-normal text-black text-center">
            When you purchase this package you get 5 Gold accounts for your
            team, plus one account for your own business lander. keep in mind
            your staff can signup under a different lander doamin as youres.
            here’s how it works:
          </p>
          <ul className="list-disc px-5 py-3">
            <li className="text-md font-normal text-black">
              Each staff member signs up using your affiliate code and the
              special <span className="font-bold">BUS</span> code.
            </li>
            <li className="text-md font-normal text-black">
              Their accounts will automatically link back to your business
              profile.
            </li>
            <li className="text-md font-normal text-black">
              They can fully customize their own lander page—adding any info
              they like—and get one link back to your business lander page.
            </li>
            <li className="text-md font-normal text-black">
              Each staff user can view and manage signups under their individual
              page.
            </li>
            <li className="text-md font-normal text-black">
              Your business has full access to all signup data for marketing
              purposes.
            </li>
          </ul>

          <p className="text-md font-normal text-black text-center">
            <span className="font-bold">Data Ownership:</span> You own all the
            collected data, though we reserve the right to contact anyone in the
            database as needed.
          </p>
        </div>

        <button
          onClick={() => setGoldTab(false)}
          className="bg-red-400 w-10 h-10 flex justify-center items-center rounded-full text-white absolute top-3 right-3 cursor-pointer"
        >
          <i className="fa-solid fa-xmark text-2xl"></i>
        </button>
      </div>
    </div>
  );
}

export default GoldAccTab;
