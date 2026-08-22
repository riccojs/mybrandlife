import { useEffect } from "react";

interface TypesForm {
  showTab: boolean;
  setShowTab: React.Dispatch<React.SetStateAction<boolean>>;
}

function BrandGearNote({ showTab, setShowTab }: TypesForm) {
  const salesData = [
    {
      id: "1",
      amount: "$0 - $999",
      percent: "50%",
    },
    {
      id: "2",
      amount: "$1000 - $3999",
      percent: "60%",
    },
    {
      id: "3",
      amount: "$4000 - $9999",
      percent: "75%",
    },
    {
      id: "4",
      amount: "$10,000 and above",
      percent: "90%",
    },
  ];

  const customDesigns = [
    {
      id: "1",
      item: "2 Items:",
      description: "1 T-shirt + 1 sweatshirt",
    },

    {
      id: "2",
      item: "5 Items:",
      description:
        "1 T-shirt + 1 sweatshirt + 1 hat + 1 (12 oz) glass + 1 item from our approved list",
    },

    {
      id: "3",
      item: "8 Items:",
      description:
        "1 T-shirt + 1 sweatshirt + 1 hat + 1 (12 oz) glass + 4 items from our approved list",
    },
  ];

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
        className={`relative flex flex-col overflow-auto h-[96vh] w-11/12 md:w-8/12 2xl:w-5/12 m-auto p-4 rounded-lg shadow-sm bg-[#ffffff] border border-gray-300 custom-scroll ${
          showTab ? "zoom-animation" : ""
        }`}
      >
        <div className="p-10 flex flex-col gap-3">
          <div>
            <div>
              <h2 className="text-2xl font-medium text-black mb-1">
                My Brand Life – BrandGear
              </h2>
              <p className="text-base italic">
                Turn your brand into revenue — BrandGear handles the products,
                sales, and payouts.
              </p>
            </div>
            <div className="mt-5">
              <h2 className="text-lg text-black">Revenue Share & Perks</h2>
              <p className="text-base italic">
                Hosted within your collection on YourWorldLife.store
              </p>
            </div>
            <div className="mt-5">
              <h2 className="text-lg text-black">
                Included Branded Items (Logo-Based)
              </h2>
              <p className="text-base italic">
                Your BrandGear collection includes default products featuring
                your logo on standard templates (no custom designs):
              </p>
              <table className="table my-table bg-gray-50 border border-gray-200 my-5">
                <tbody>
                  {customDesigns?.map((item) => (
                    <tr key={item?.id}>
                      <td>{item?.item}</td>
                      <td>{item?.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-base">
              Product types are selected from our current catalog and may change
              over time based on availability.
            </p>
          </div>
          <div>
            <h2 className="text-lg font-bold text-black">Revenue Sharing</h2>
            <p>
              Net Sales = total revenue received from your product sales minus
              refunds, chargebacks, discounts, taxes, shipping, marketplace
              fees, payment processing fees, and base production/fulfillment
              costs. Your share of Net Sales is based on total quarterly
              performance:{" "}
            </p>

            <table className="table my-table bg-gray-50 border border-gray-200 my-5">
              <thead>
                <tr>
                  <th>Quarterly Gross Sales (USD) </th>
                  <th>Your Share of NET</th>
                </tr>
              </thead>
              <tbody>
                {salesData?.map((item) => (
                  <tr key={item?.id}>
                    <td>{item?.amount}</td>
                    <td>{item?.percent}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p className="text-base">
              Payouts are calculated at the end of each calendar quarter
              Payments are issued in the following month
            </p>
          </div>
          <div>
            <h2 className="text-lg font-bold text-black">Payments & Taxes</h2>

            <ul className="list-disc pl-6 mt-2">
              <li className="text-base font-normal text-black">
                Payments are sent automatically to your registered payment
                method
              </li>
              <li className="text-base font-normal text-black">
                You are responsible for keeping your payment information
                accurate and up to date
              </li>
              <li className="text-base font-normal text-black">
                We may adjust or withhold payouts due to refunds, chargebacks,
                fraud, or compliance issues
              </li>
              <li className="text-base font-normal text-black">
                Where required by law (U.S. creators meeting applicable
                thresholds), Form 1099 will be issued
              </li>
              <li className="text-base font-normal text-black">
                You are responsible for reporting and paying any applicable
                taxes
              </li>
            </ul>
            <div className="mt-5">
              <h2 className="text-lg font-bold text-black">Legal Notes</h2>
              <ul className="list-disc pl-6 mt-2">
                <li className="text-base font-normal text-black">
                  Participation in BrandGear does not create an employment or
                  partnership relationship with My Brand Life.
                </li>
                <li className="text-base font-normal text-black">
                  Program terms, product offerings, and revenue share structures
                  may be updated periodically.
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

export default BrandGearNote;
