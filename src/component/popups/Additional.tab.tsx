interface TypesForm {
  addTab: boolean;
  setAddTab: React.Dispatch<React.SetStateAction<boolean>>;
}

function AdditionalTab({ addTab, setAddTab }: TypesForm) {
  return (
    <div className="inset-0 bg-[#00000053] flex fixed left-0 justify-center items-center w-full min-h-screen z-50 overflow-auto">
      <div
        className={`relative flex flex-col w-11/12 md:w-8/12 2xl:w-4/12 m-auto justify-center p-4 rounded-lg shadow-sm bg-[#ffffff] border border-gray-300 ${
          addTab ? "zoom-animation" : ""
        }`}
      >
        <div className="p-10 flex flex-col gap-3 items-center justify-center">
          <h2 className="text-2xl font-medium text-black">
            Additional Gold Accounts
          </h2>
          <p className="text-md font-normal text-black text-center">
            Once you’re set up with your initial 5 Gold accounts, you can easily
            add more in sets of 5 at the cost of $1599.60:
          </p>
          <ul className="list-disc px-5 py-3">
            <li className="text-md font-normal text-black">
              Purchase additional Gold-package bundles (each bundle = 5
              accounts).
            </li>
            <li className="text-md font-normal text-black">
              Assign each new user their own affiliate/BUS signup code.
            </li>
            <li className="text-md font-normal text-black">
              All new accounts link back to your business profile automatically.
            </li>
            <li className="text-md font-normal text-black">
              Suitable for large teams—bartenders, waitstaff, DJs, cooks, and
              more.
            </li>
            <li className="text-md font-normal text-black">
              Your staff’s personalized lander pages each include a link to your
              main business page.
            </li>
          </ul>

          <p className="text-md font-normal text-black text-center">
            We believe your team is key to your company’s reach—and our bulk
            Gold bundles make it simple to scale as you grow.
          </p>
        </div>

        <button
          onClick={() => setAddTab(false)}
          className="bg-red-400 w-10 h-10 flex justify-center items-center rounded-full text-white absolute top-3 right-3 cursor-pointer"
        >
          <i className="fa-solid fa-xmark text-2xl"></i>
        </button>
      </div>
    </div>
  );
}

export default AdditionalTab;
