import React, { useEffect } from "react";
import privacyContent from "../utils/privacyContent";
import { Helmet } from "react-helmet-async";

export default function PrivacyPolicy() {
  const handlePrint = () => {
    window.print();
  };

  useEffect(() => {
    document.title = "Privacy Policy — My Brand Life";
  }, []);
  return (
    <main className="min-h-screen bg-white">
      <Helmet>
        <title>Privacy Policy - My Brand Life</title>
        <meta name="description" content="Privacy Policy - My Brand Life" />
      </Helmet>

      <article className="container re py-10 print:py-0">
        <div className="relative">
          <div className="absolute top-0 right-0 print:hidden">
            <button
              onClick={handlePrint}
              title="Print this page"
              className="w-10 h-10 text-slate-500 active:bg-slate-100 active:scale-105 cursor-pointer flex justify-center items-center border border-gray-200 rounded-lg"
            >
              <i className="fa-solid fa-print text-xl"></i>
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-2 border-b border-gray-200 pb-5 mb-5">
          <h1 className="text-lg md:text-xl font-medium">
            My Brand Life - Privacy Policy
          </h1>
          <p className="text-sm md:text-base font-normal">
            <strong>Last Updated:</strong> October 30, 2026
          </p>
        </div>
        <div className="space-y-2.75">
          <p>
            My Brand Life LLC (“My Brand Life,” “MBL,” “we,” “our,” or “us”)
            respects your privacy and is committed to handling personal
            information responsibly.
          </p>

          <p>
            This Privacy Policy explains how we collect, use, disclose, store,
            and protect information when you use My Brand Life websites,
            applications, public lander pages, dashboards, forms, features,
            services, and associated My Brand Life domains.
          </p>

          <p>
            This policy applies to subscribers, account users, visitors to
            public My Brand Life pages, and individuals who submit information
            through a My Brand Life-powered form or feature.
          </p>

          <p>
            By using our services, you acknowledge the practices described in
            this Privacy Policy.
          </p>
        </div>
        <div className="mt-4.5">
          {privacyContent.map((section) => (
            <section key={section.title} className="mb-5">
              <div
                key={section.title}
                className="flex flex-col gap-2 border-b border-gray-200 mt-8 mb-5 pb-2"
              >
                <h2 className="text-lg md:text-xl font-medium">
                  {section.title}
                </h2>
              </div>

              <div>
                {section.content.map((block, index) => {
                  if (block.type === "subheading") {
                    return (
                      <h3
                        key={`${section.title}-subheading-${index}`}
                        className="mt-5 text-lg md:text-xl font-medium"
                      >
                        {block.text}
                      </h3>
                    );
                  }

                  if (block.type === "list") {
                    return (
                      <div className="flex flex-col gap-2">
                        <ul className="list-disc pl-10 flex flex-col gap-2 text-sm md:text-base">
                          {block.items.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    );
                  }

                  return (
                    <p
                      key={`${section.title}-paragraph-${index}`}
                      className={`my-2 text-sm md:text-base font-normal ${
                        block.bold
                          ? "font-bold leading-[1.35]"
                          : "leading-[1.35]"
                      }`}
                    >
                      {block.text.split("\n").map((line, lineIndex) => (
                        <React.Fragment key={lineIndex}>
                          {line}
                          {lineIndex < block.text.split("\n").length - 1 && (
                            <br />
                          )}
                        </React.Fragment>
                      ))}
                    </p>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </article>
    </main>
  );
}
