import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import termsContent from "../utils/termsContent";

function TermsCondition() {
  const handlePrint = () => {
    window.print();
  };

  useEffect(() => {
    document.title = "Terms & Condition — My Brand Life";
  }, []);

  return (
    <React.Fragment>
      <Helmet>
        <title>Terms & Conditions - My Brand Life</title>
        <meta name="description" content="Privacy Policy - My Brand Life" />
      </Helmet>
      <section className="py-10 print:py-0">
        <div className="container flex flex-col gap-3 relative">
          <div className="absolute top-0 right-0 print:hidden">
            <button
              onClick={handlePrint}
              title="Print this page"
              className="w-10 h-10 text-slate-500 active:bg-slate-100 active:scale-105 cursor-pointer flex justify-center items-center border border-gray-200 rounded-lg"
            >
              <i className="fa-solid fa-print text-xl"></i>
            </button>
          </div>

          <div className="flex flex-col gap-2 border-b border-gray-200 pb-5">
            <h1 className="text-lg md:text-xl font-medium">
              My Brand Life - Terms &amp; Conditions
            </h1>
            <p className="text-sm md:text-base font-normal">
              <strong>Last Updated:</strong> October 30, 2026
            </p>
          </div>

          {termsContent.slice(2).map((item, index) => {
            if (item.type === "heading") {
              return (
                <div
                  key={index}
                  className="flex flex-col gap-2 border-b border-gray-100 pt-5 pb-2"
                >
                  <h2 className="text-lg md:text-xl font-medium">
                    {item.text}
                  </h2>
                </div>
              );
            }

            if (item.type === "bullet") {
              return (
                <div key={index} className="flex flex-col gap-2">
                  <ul className="list-disc pl-10 flex flex-col gap-2 text-sm md:text-base">
                    <li>{item.text}</li>
                  </ul>
                </div>
              );
            }

            return (
              <div key={index} className="flex flex-col gap-2">
                <p className="text-sm md:text-base font-normal">{item.text}</p>
              </div>
            );
          })}
        </div>
      </section>
    </React.Fragment>
  );
}

export default TermsCondition;
