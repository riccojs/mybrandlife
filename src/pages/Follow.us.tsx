import { Link, useNavigate } from "react-router";
import Logo from "../assets/MBL_Logo_CROP.png";
import SelectComponent from "../component/ui/Select.component";
import React, { useState } from "react";
import BgImage from "../assets/Body-Background.jpg";
import HeaderImage from "../assets/header-image.jpg";
import SendInfo from "../component/popups/Send.info";
import { getSocialIcon } from "../utils/socialIcons";
import { Helmet } from "react-helmet-async";

function FollowUs() {
  const [layout, setLayout] = useState("");
  const handleDomainSelect = (value: string) => {
    setLayout(value);
  };
  const [isShowInfo, setIsShowInfo] = useState<boolean>(false);

  const navigate = useNavigate();

  const allUrls = [
    { label: "FACEBOOK", url: "https://www.facebook.com/MyBrandLife" },
    { label: "LINKEDIN", url: "https://www.linkedin.com/company/mybrandlife/" },
    { label: "YOUTUBE", url: "https://www.youtube.com/@MyBrandLife" },
    { label: "EMAIL", url: "mailto:info@mybrandlife.me" },
    { label: "PHONE", url: "tel:(888)520-6120" },
    {
      label: "INSTAGRAM",
      url: "https://www.instagram.com/mybrandlife.me",
    },
    {
      label: "WHATSAPP",
      url: "https://wa.me/17155746890?text=Hello%20I%20need%20help",
    },
    { label: "TIKTOK", url: "https://www.tiktok.com/@mybrandlife.me" },
    { label: "SNAPCHAT", url: "https://www.snapchat.com/@mybrandlife" },
    { label: "X (Twitter)", url: "https://x.com/MyBrandLifeMe" },
  ];

  const handleDownloadVCF = () => {
    const link = document.createElement("a");
    link.href = "/MyLife.vcf";
    link.download = "MyLife.vcf";
    link.click();
  };

  return (
    <React.Fragment>
      <Helmet>
        <title>Follow My Brand Life</title>
        <meta name="description" content="Follow My Brand Life" />
      </Helmet>
      <section>
        <div>
          <div className="container flex justify-between md:gap-0 gap-2 items-center py-3">
            <div className="w-52">
              <SelectComponent
                value={layout}
                label="Select Layout"
                handleChange={handleDomainSelect}
                datas={[
                  { key: "Logo Left", value: "Logo Left" },
                  { key: "Logo Center", value: "Logo Center" },
                  { key: "Logo Right", value: "Logo Right" },
                ]}
                color="#F3F3F3"
              />
            </div>
            <button
              onClick={() => {
                window.close();
                navigate("/");
              }}
              className="bg-[#cbf38b] cursor-pointer px-5 py-2 rounded-lg text-black text-sm md:text-md font-normal"
            >
              Close
            </button>
          </div>
          <div
            className="bg-[#F2FAFF] py-5"
            style={{
              backgroundImage: `url(${HeaderImage})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center top",
            }}
          >
            <div
              className={`relative flex container m-auto 
                    ${
                      layout === "Logo Center"
                        ? "flex-col justify-center items-center gap-5"
                        : layout === "Logo Right"
                          ? "flex-row-reverse justify-between items-center"
                          : "justify-between items-center"
                    }`}
            >
              <Link to="/">
                <img
                  src={Logo}
                  alt=""
                  className="w-16 lg:w-24 xl:w-32 active:scale-102 duration-300 transition-all"
                />
              </Link>
              <div>
                <h2 className="text-white text-lg md:text-2xl xl:text-3xl font-medium text-right">
                  Services Offered
                </h2>
                <ul
                  className={`mt-1 gap-1 flex flex-col  ${
                    layout === "Logo Center"
                      ? "items-center"
                      : layout === "Logo Right"
                        ? "items-start"
                        : "items-end"
                  }`}
                >
                  <li className="text-xs md:text-md font-normal text-white">
                    Your Lander
                  </li>
                  <li className="text-xs md:text-md font-normal text-white">
                    BrandBook
                  </li>
                  <li className="text-xs md:text-md font-normal text-white">
                    Echo
                  </li>
                  <li className="text-xs md:text-md font-normal text-white">
                    PulseTrack
                  </li>
                  <li className="text-xs md:text-md font-normal text-white">
                    And much more!
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div
            className="bg-white w-full py-10"
            style={{
              backgroundImage: `url(${BgImage})`,
            }}
          >
            <div className="w-11/12 lg:w-7/12 xl:w-4/12 m-auto">
              <div className="flex gap-2 md:gap-3 items-center">
                <button
                  onClick={() => setIsShowInfo(true)}
                  className="bg-linear-to-r hover:scale-102 from-[#ecc246] text-xs md:text-base to-[#92cee8] flex justify-center gap-1 md:gap-2 items-center w-full h-10 md:h-12 rounded-lg active:scale-102 duration-300 transition-all cursor-pointer"
                >
                  <i className="fa-solid fa-upload text-xs md:text-2xl"></i>
                  <p>Submit your info</p>
                </button>
                <button
                  onClick={handleDownloadVCF}
                  className="bg-linear-to-r hover:scale-102 from-[#ecc246] text-xs md:text-base to-[#92cee8] flex justify-center gap-1 md:gap-2 items-center w-full h-10 md:h-12 rounded-lg active:scale-102 duration-300 transition-all cursor-pointer"
                >
                  <i className="fa-solid fa-download text-sm md:text-xl"></i>
                  <p>Download Our Info</p>
                </button>
              </div>
              <div className="my-5 md:my-10">
                <h2 className="text-white text-lg md:text-3xl font-medium text-center">
                  Connect with My Brand Life!
                </h2>
                <p className="text-md md:text-xl mt-2 font-normal text-white text-center">
                  Your Brand, Your Life, Your Way
                </p>
              </div>
              <div className="my-3 md:my-5">
                <div className="grid grid-cols-2 gap-2 md:gap-3 mt-2 md:mt-5">
                  {allUrls?.map(
                    (item: { label: string; url: string }, index) => {
                      const Icon = getSocialIcon(item?.label, item?.url);

                      return (
                        <a
                          key={index}
                          className="bg-linear-to-r hover:scale-102 text-sm md:text-base from-[#ecc246] to-[#92cee8] w-full h-10 md:h-12 rounded-lg active:scale-102 duration-300 transition-all cursor-pointer flex justify-center items-center gap-1"
                          href={`${item.url}`}
                          target="_blank"
                        >
                          {Icon && <Icon className="text-lg md:text-2xl" />}
                          <span> {item.label}</span>
                        </a>
                      );
                    },
                  )}
                </div>
              </div>
              <div className="my-0 mt-10">
                <h2 className="text-md md:text-xl font-medium text-white text-center">
                  About My Brand Life (MBL)
                </h2>
                <p className="text-white text-sm md:text-md font-normal text-center w-full mt-2">
                  Our mission is to empower individuals and businesses by
                  providing tailored, industry-specific landing pages that
                  enhance their online presence and engagement.
                </p>
              </div>
            </div>
          </div>
          <div className="bg-black py-10">
            <div className="container">
              <ul className="flex gap-5 justify-center items-center mt-3">
                <li>
                  <Link
                    to="/terms-condition"
                    className="text-white text-sm font-normal"
                  >
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacy-policy"
                    className="text-white text-sm font-normal"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
              <p className="text-white text-sm font-normal text-center block mt-5">
                Want to build your brand?{" "}
                <Link to="/pricing" className="hover:text-blue-200 underline">
                  Select your plan and Join Now
                </Link>
              </p>
              <p className="text-white/70 mt-5 text-xs font-normal text-center">
                ©{new Date().getFullYear()} MyBrandLife.me. All rights reserved.
                Portions of the text and imagery may be AI-generated.
              </p>
            </div>
          </div>
        </div>
        {isShowInfo && (
          <SendInfo isShowInfo={isShowInfo} setIsShowInfo={setIsShowInfo} />
        )}
      </section>
    </React.Fragment>
  );
}

export default FollowUs;
