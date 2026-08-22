import { useEffect } from "react";

interface TypesForm {
  showTab: boolean;
  setShowTab: React.Dispatch<React.SetStateAction<boolean>>;
}

function BrandShareNote({ showTab, setShowTab }: TypesForm) {
  const salesData = [
    {
      id: "1",
      amount: "10 - 49",
      percent: "1%",
    },
    {
      id: "2",
      amount: "50 - 99",
      percent: "5%",
    },
    {
      id: "3",
      amount: "100 - 199",
      percent: "10%",
    },
    {
      id: "4",
      amount: "200+",
      percent: "20%",
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
            <h2 className="text-2xl font-medium text-black">
              My Brand Life – BrandShare Affiliate Program Terms
            </h2>
            <p className="text-base italic">
              Earn more as you grow. BrandShare rewards you for bringing new
              users into the My Brand Life ecosystem.
            </p>
          </div>
          <div>
            <div>
              <h2 className="text-lg font-bold text-black">
                1. Overview & Eligibility
              </h2>
              <p className="text-base">
                As a BrandShare affiliate, you can earn free services and
                cash-back rewards by referring new paying Gold subscribers. The
                affiliate program applies only to yearly subscriptions paid in
                full.
              </p>
              <p className="text-base py-2">
                Your affiliate code is valid for new yearly subscriptions only
                and does not apply to renewals, upgrades, or monthly plans. You
                must maintain an active, paid subscription in good standing for
                the entire quarter to qualify for rewards.
              </p>
              <p className="text-base">
                On qualifying yearly purchases, your referrals receive 14 months
                of service for the price of 10 months.
              </p>
            </div>
            <div className="mt-3">
              <h2 className="text-lg font-bold text-black">2. Free Services</h2>
              <p className="text-base">
                After 20 qualifying new yearly referrals, you will receive one
                free renewal of your own yearly subscription. Referral tracking
                applies only to new yearly subscriptions and does not include
                renewals of those referrals.
              </p>
            </div>
            <div className="mt-3">
              <h2 className="text-lg font-bold text-black">
                3. Cash-Back Structure
              </h2>
              <p className="text-base">
                Cash-back rewards are based on the number of qualifying new
                yearly referrals per calendar quarter:
              </p>
            </div>

            <table className="table my-table">
              <thead>
                <tr>
                  <th>Referrals (Per Quarter)</th>
                  <th>Cash-Back Rate*</th>
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

            <p className="text-base my-3">
              * Cash-back rates are applied to eligible subscription revenue
              actually received, excluding taxes, refunds, chargebacks, and
              processing/merchant fees.
            </p>
            <p className="text-base">
              Affiliate payouts are issued in the fourth month following each
              quarter, after adjustments for refunds and chargebacks.
            </p>
            <div className="mt-3">
              <h2 className="text-lg font-bold text-black">
                4. Payments & Taxes
              </h2>
              <ul className="list-disc pl-6 mt-2">
                <li className="text-base font-normal text-black">
                  Payments will be issued to the payment method associated with
                  your account.
                </li>
                <li className="text-base font-normal text-black">
                  You are responsible for ensuring your payment details are
                  accurate and up to date.
                </li>
                <li className="text-base font-normal text-black">
                  We may adjust or withhold payouts in cases of refunds,
                  chargebacks, suspected fraud, or non-compliance with these
                  terms.
                </li>
                <li className="text-base font-normal text-black">
                  Where required by law (for U.S. affiliates meeting applicable
                  thresholds), IRS Form 1099 will be issued.
                </li>
              </ul>
            </div>
            <div className="mt-3">
              <h2 className="text-lg font-bold text-black">5. Legal Notes</h2>
              <ul className="list-disc pl-6 mt-2">
                <li className="text-base font-normal text-black">
                  Participation in the BrandShare program does not create an
                  employment, agency, or partnership relationship with My Brand
                  Life.
                </li>
                <li className="text-base font-normal text-black">
                  My Brand Life reserves the right to modify, suspend, or
                  terminate the affiliate program and/or these terms at any
                  time, generally with prospective effect.
                </li>
                <li className="text-base font-normal text-black">
                  Additional rules, updates, or clarifications may be posted in
                  your dashboard or on our website and are incorporated by
                  reference.
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

export default BrandShareNote;
