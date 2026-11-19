import useBodyScroll from "../../hook/userBodyscroll";

interface TypesForm {
  showTab: boolean;
  setShowTab: React.Dispatch<React.SetStateAction<boolean>>;
}

function MerchOnboardNote({ showTab, setShowTab }: TypesForm) {
  useBodyScroll(showTab);
  return (
    <div className="inset-0 bg-[#00000053] flex fixed left-0 justify-center items-center w-full min-h-screen z-50 ">
      <div
        className={`relative flex flex-col overflow-auto h-auto max-h-[96vh] w-11/12 md:w-8/12 2xl:w-4/12 m-auto p-4 rounded-2xl shadow-sm bg-[#ffffff] border border-gray-300 custom-scroll ${
          showTab ? "zoom-animation" : ""
        }`}
      >
        <div className="p-5 flex flex-col gap-3">
          <div>
            <h2 className="text-xl font-normal text-[#764B2E]">BrandGear</h2>
            <p className="text-sm mt-3 text-black/80">
              Turn Your Brand Into Products Your merch page is your own
              mini-store where fans can buy branded gear with your logo. We
              handle design setup, printing, shipping, and payments — you just
              share the link and get paid.
            </p>
            <p className="mt-5 text-md font-normal">What you get (by plan)</p>
            <ul className="list-disc pl-6 mt-2 text-sm">
              <li className="font-normal text-black">
                Spark - 2 Branded Items: 1 T-shirt + 1 sweatshirt with your logo
              </li>
              <li className="font-normal text-black">
                Pulse - 5 Branded Items: 1 T-shirt + 1 sweatshirt + 1 hat + 1 12
                oz glass + 1 item from our approved list
              </li>
              <li className="font-normal text-black">
                Power - 8 Branded Items: 1 T-shirt + 1 sweatshirt + 1 hat + 1 12
                oz glass + 4 items from our approved list
              </li>
            </ul>
          </div>
        </div>

        <button
          onClick={() => setShowTab(false)}
          className="bg-[#F3F3F3] border border-gray-300 absolute top-2 right-2 min-w-8 w-8 h-8 flex justify-center items-center rounded-full"
        >
          <i className="fa-solid fa-xmark text-md"></i>
        </button>
      </div>
    </div>
  );
}

export default MerchOnboardNote;
