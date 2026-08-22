interface TypesForm {
  merTab: boolean;
  setMerTab: React.Dispatch<React.SetStateAction<boolean>>;
}

function MerchandiseTab({ merTab, setMerTab }: TypesForm) {
  return (
    <div className="inset-0 bg-[#00000053] flex fixed left-0 justify-center items-center w-full min-h-screen z-50 overflow-auto">
      <div
        className={`relative flex flex-col w-11/12 md:w-8/12 2xl:w-4/12 m-auto justify-center p-4 rounded-lg shadow-sm bg-[#ffffff] border border-gray-300 ${
          merTab ? "zoom-animation" : ""
        }`}
      >
        <div className="p-10 flex flex-col gap-3 items-center justify-center">
          <h2 className="text-2xl font-medium text-black">
            Additional Merchandise Packages
          </h2>
          <p className="text-md font-normal text-black text-center">
            As a Platinum (business) account, you get all the Gold features plus
            the ability to add more merch:
          </p>
          <ul className="list-disc px-5 py-3">
            <li className="text-md font-normal text-black">
              Gold accounts are limited to 5 standard products on the merch
              page.
            </li>
            <li className="text-md font-normal text-black">
              Platinum accounts can purchase non-standard merch packages in
              groups of 5 items.
            </li>
            <li className="text-md font-normal text-black">
              Each additional 5-item package costs $399.90.
            </li>
            <li className="text-md font-normal text-black">
              Browse our full catalog here:{" "}
              <a
                href="https://printify.com/app/products"
                target="_blank"
                className="text-blue-800 underline"
              >
                Printify Catalog.
              </a>
            </li>
            <li className="text-md font-normal text-black">
              These bundles become available in your dashboard after signup.
            </li>
          </ul>

          <p className="text-md font-normal text-black text-center">
            We believe your team is key to your company’s reach—and our bulk
            Gold bundles make it simple to scale as you grow.
          </p>
        </div>

        <button
          onClick={() => setMerTab(false)}
          className="bg-red-400 w-10 h-10 flex justify-center items-center rounded-full text-white absolute top-3 right-3 cursor-pointer"
        >
          <i className="fa-solid fa-xmark text-2xl"></i>
        </button>
      </div>
    </div>
  );
}

export default MerchandiseTab;
