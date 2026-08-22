import React, { useEffect, useRef, useState } from "react";
import BusinessInfo from "../component/home/Business.info";
import GoldAccTab from "../component/popups/Gold.acc.tab";
import AdditionalTab from "../component/popups/Additional.tab";
import MerchandiseTab from "../component/popups/Merchandise.tab";
import WhyPlatTab from "../component/popups/Why.plat.tab";
import { useNavigate, useSearchParams } from "react-router";
import { useDispatch } from "react-redux";
import {
  addAffiliateCode,
  selectedDomain,
  selectedPackage,
  selectFrequency,
  selectPlanKey,
  selectPlanOldPrice,
  selectPlanPrice,
} from "../redux/features/onboard/onboardSlice";
import { platinumFeatures } from "../utils/pricing.features";
import domainData from "../utils/domainData";
import PriceSelector from "../component/Price.selector";
import LottieAnimation from "../component/Lottie.animation";
import domainFeatures from "../utils/domain.features";
import { useAuth } from "../hook/useAuth";
import BPSLOGO from "../assets/BPS-Logo-Wide.png";
import { useGetOneUserByLandernameQuery } from "../redux/features/auth/authApi";
import PowerPdf from "../assets/files/Price_Features_Power.pdf";
import SperkPdf from "../assets/files/Price_Features_Spark.pdf";
import PulsePdf from "../assets/files/Price_Features_Pulse.pdf";
import BrandShareNote from "../component/popups/BrandShare.note";
import BrandFormNote from "../component/popups/BrandForm.note";
import BrandGearNote from "../component/popups/BrandGear.note";
import { motion } from "framer-motion";
import { domainCategories } from "../utils/domains";

function Pricing() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const code = searchParams.get("affiliate");
  const { isSuccess, isError } = useGetOneUserByLandernameQuery(code);
  const { user } = useAuth();
  const [showTab, setShowTab] = useState<boolean>(false);
  const [merchendiseTab, setMerchendiseTab] = useState<boolean>(false);
  const [conTab, setConTab] = useState<boolean>(false);
  const [goldTab, setGoldTab] = useState<boolean>(false);
  const [addTab, setAddTab] = useState<boolean>(false);
  const [merTab, setMerTab] = useState<boolean>(false);
  const [whyTab, setWhyTab] = useState<boolean>(false);
  const [priceShow, setPriceShow] = useState<boolean>(false);
  const [type, setType] = useState<string>("yearly");
  const pricingRef = useRef<HTMLDivElement | null>(null);
  const [domainSelect, setDomainSelect] = useState("");
  const [showMore, setShowMore] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setType("yearly");
    } else {
      setType("monthly");
    }
  };

  const handleChose = (
    pckg: string,
    freq: string,
    price: number,
    oldPrice: number,
    planKey: string,
  ) => {
    navigate("/auth/register");
    dispatch(selectedPackage(pckg));
    dispatch(selectFrequency(freq));
    dispatch(selectPlanPrice(price));
    dispatch(selectPlanOldPrice(oldPrice));
    dispatch(selectPlanKey(planKey));
  };

  const handleShowMore = (value: string) => {
    setShowMore(value);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pricingRef.current &&
        !pricingRef.current.contains(event.target as Node)
      ) {
        setPriceShow(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectedPackages = domainData[domainSelect]?.packages;

  const getPlanFeatures = (plan: "bronze" | "silver" | "gold") => {
    const pkg = selectedPackages?.[plan];
    if (!pkg) return { price: null, oldPrice: null };

    const freq = pkg.frequencies.find((f) => f.key === type);
    const key = freq?.planKey as keyof typeof domainFeatures | undefined;
    const features = key ? domainFeatures[key] : [];
    return {
      price: freq?.price ?? null,
      oldPrice: freq?.oldPrice ?? null,
      features,
      frequency: freq?.key ?? null,
      planKey: freq?.planKey,
    };
  };

  const bronzePlanFeatures = getPlanFeatures("bronze") ?? [];
  const bronzeFeatures = getPlanFeatures("bronze").features ?? [];
  const silverPlanFeatures = getPlanFeatures("silver");
  const silverFeatures = getPlanFeatures("silver").features ?? [];
  const GoldPlanFeatures = getPlanFeatures("gold");

  const handleDomainSelection = (domain: string) => {
    setDomainSelect(domain);
    dispatch(selectedDomain(domain));
  };

  useEffect(() => {
    if (isSuccess) {
      dispatch(addAffiliateCode(code));
    }
    if (isError) {
      dispatch(addAffiliateCode(""));
    }
  }, [code, isSuccess, isError, dispatch]);

  const handleOpenCompare = (file: string) => {
    window.open(file, "_blank", "noopener,noreferrer");
  };

  const getCols = () => {
    const hasSilver = !!silverPlanFeatures?.price;
    const hasBronze = !!bronzePlanFeatures?.price;

    if (hasSilver && hasBronze) return "xl:grid-cols-4";
    if (hasSilver) return "xl:grid-cols-3";
    if (hasBronze) return "xl:grid-cols-4";
    return "xl:grid-cols-2";
  };

  return (
    <React.Fragment>
      <section className="pt-10">
        <div className="container">
          <div>
            <h2 className="text-black text-3xl font-medium text-center">
              Choose your Domain Lander.
            </h2>
            <div className="w-full md:w-5/12 m-auto mb-10">
              <PriceSelector
                pricingRef={pricingRef}
                isShow={priceShow}
                setIsShow={setPriceShow}
                selectedDomain={domainSelect}
                handleSelectDomain={handleDomainSelection}
              />
            </div>
          </div>
          <div className="mb-5">
            {domainData[domainSelect]?.title && (
              <motion.h2
                key={`title-${domainSelect}`}
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.3,
                  duration: 0.4,
                  ease: "easeOut",
                }}
                className="w-full text-center text-2xl font-medium flex justify-center"
              >
                {domainData[domainSelect]?.title}
              </motion.h2>
            )}

            {domainData[domainSelect]?.subTitle && (
              <motion.h2
                key={`subtitle-${domainSelect}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  delay: 0.42,
                  duration: 0.2,
                  ease: "easeOut",
                }}
                className="w-full text-center text-xl font-normal flex justify-center"
              >
                {domainData[domainSelect]?.subTitle}
              </motion.h2>
            )}
          </div>
          {domainSelect && (
            <div>
              <h2 className="text-black text-xl font-medium uppercase text-center">
                Pricing Plans
              </h2>
              <p className="text-black text-2xl leading-11 font-medium text-center">
                Save 20% with annual billing (12 months for the price of 10)
              </p>
              <p className="text-sm text-black font-normal text-center">
                NOTE: BrandShare codes are only valid on yearly plans!
              </p>
              <div className="flex md:flex-row flex-col gap-5 justify-center items-center mt-5 mb-14">
                <div className="flex gap-5 items-center">
                  <p className="text-md text-black font-normal">Monthly</p>
                  <div className="flex justify-center items-center">
                    <label className="switch">
                      <input
                        type="checkbox"
                        onChange={handleChange}
                        checked={type === "yearly"}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                </div>
                <span className="flex gap-2">
                  <p className="text-md text-black font-normal">Yearly</p>
                  <p className="text-sm bg-[#96c94b] px-6 py-1 rounded-full font-normal">
                    Save 20%
                  </p>
                </span>
              </div>
            </div>
          )}

          {domainSelect ? (
            <div
              className={`grid grid-cols-1 md:grid-cols-2 ${getCols()} gap-10 md:gap-5`}
            >
              {bronzePlanFeatures?.price && (
                <div className="bg-[#FFF3E3] p-8 rounded-lg flex flex-col gap-2 items-center">
                  <h2 className="text-3xl font-medium text-black">Bronze</h2>
                  {bronzePlanFeatures.oldPrice ? (
                    <p className="text-gray-600 line-through text-sm font-medium">
                      ${bronzePlanFeatures.oldPrice}/monthly
                    </p>
                  ) : null}

                  {type === "yearly" ? (
                    <>
                      <p className="text-3xl font-medium text-black">
                        $
                        {bronzePlanFeatures.price
                          ? (
                              Math.floor(
                                (bronzePlanFeatures.price / 12) * 100,
                              ) / 100
                            ).toFixed(2)
                          : "--"}
                        <span className="text-sm!">/monthly</span>
                      </p>
                      <p className="text-sm font-normal text-black">
                        Monthly Paid Yearly
                      </p>
                    </>
                  ) : (
                    <p className="text-3xl font-medium text-black">
                      ${bronzePlanFeatures.price ?? "--"}
                      <span className="text-sm!">/{type}</span>
                    </p>
                  )}

                  <p className="text-md font-medium text-gray-600 uppercase">
                    {domainData[domainSelect]?.category}
                  </p>
                  {bronzePlanFeatures.price && (
                    <button
                      onClick={() =>
                        handleChose(
                          "bronze",
                          bronzePlanFeatures.frequency ?? "",
                          bronzePlanFeatures.price ?? 0,
                          bronzePlanFeatures.oldPrice ?? 0,
                          bronzePlanFeatures?.planKey ?? "",
                        )
                      }
                      disabled={user ? true : false}
                      className={`w-full text-black text-md font-normal px-5 py-2 rounded-lg transition-all duration-300 active:scale-105 cursor-pointer ${
                        user ? "bg-gray-300" : "bg-[#cbf38b]"
                      }`}
                    >
                      Choose Now
                    </button>
                  )}
                  <div className="mt-5 md:mt-10">
                    <h2 className="text-xl font-medium text-black">
                      What's included:
                    </h2>

                    {showMore === "bronze" && (
                      <ul className="flex flex-col gap-2 md:hidden mt-5 expand">
                        {bronzeFeatures?.length > 0 &&
                          bronzePlanFeatures?.features?.map((item, index) => (
                            <li key={index} className="flex gap-2 items-center">
                              <i className="fa-solid fa-check text-[#96c94b]"></i>
                              <p className="text-md font-normal text-black">
                                {item?.label}
                              </p>
                            </li>
                          ))}
                      </ul>
                    )}
                    <div className="md:hidden block">
                      {showMore === "bronze" ? (
                        <button
                          onClick={() => handleShowMore("")}
                          className="text-sm font-normal mt-5 cursor-pointer text-gray-500 flex justify-center items-center gap-2 w-full"
                        >
                          Show Less <i className="fa-solid fa-angle-up"></i>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleShowMore("bronze")}
                          className="text-sm font-normal cursor-pointer text-gray-500 flex justify-center items-center gap-2 w-full mt-2"
                        >
                          Show More <i className="fa-solid fa-angle-down"></i>
                        </button>
                      )}
                    </div>
                    <ul className="flex-col gap-2 mt-5 hidden md:flex">
                      {bronzeFeatures?.length > 0 &&
                        bronzePlanFeatures?.features?.map((item, index) => (
                          <li key={index} className="flex gap-2 items-center">
                            <i className="fa-solid fa-check text-[#96c94b]"></i>
                            <p className="text-md font-normal text-black">
                              {item?.label}
                            </p>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              )}

              {silverPlanFeatures?.price && (
                <div className="bg-[#FFF3E3] p-8 rounded-lg flex flex-col gap-2 items-center">
                  <h2 className="text-3xl font-medium text-black">Silver</h2>
                  {silverPlanFeatures.oldPrice ? (
                    <p className="text-gray-600 line-through text-sm font-medium">
                      ${silverPlanFeatures.oldPrice}/monthly
                    </p>
                  ) : null}

                  {type === "yearly" ? (
                    <>
                      <p className="text-3xl font-medium text-black">
                        $
                        {silverPlanFeatures.price
                          ? (
                              Math.floor(
                                (silverPlanFeatures.price / 12) * 100,
                              ) / 100
                            ).toFixed(2)
                          : "--"}
                        <span className="text-sm!">/monthly</span>
                      </p>
                      <p className="text-sm font-normal text-black">
                        Monthly Paid Yearly
                      </p>
                    </>
                  ) : (
                    <p className="text-3xl font-medium text-black">
                      ${silverPlanFeatures.price ?? "--"}
                      <span className="text-sm!">/{type}</span>
                    </p>
                  )}
                  <p className="text-md font-medium text-gray-600 uppercase">
                    {domainData[domainSelect]?.category}
                  </p>
                  {silverPlanFeatures.price && (
                    <button
                      onClick={() =>
                        handleChose(
                          "silver",
                          silverPlanFeatures?.frequency ?? "",
                          silverPlanFeatures.price ?? 0,
                          silverPlanFeatures.oldPrice ?? 0,
                          silverPlanFeatures?.planKey ?? "",
                        )
                      }
                      disabled={user ? true : false}
                      className={`w-full text-black text-md font-normal px-5 py-2 rounded-lg transition-all duration-300 active:scale-105 cursor-pointer ${
                        user ? "bg-gray-300" : "bg-[#cbf38b]"
                      }`}
                    >
                      Choose Now
                    </button>
                  )}

                  <div className="mt-5 md:mt-10">
                    <h2 className="text-xl font-medium text-black">
                      What's included:
                    </h2>
                    {showMore === "silver" && (
                      <ul className="flex flex-col gap-2 md:hidden mt-5 expand">
                        {silverFeatures?.length > 0 &&
                          silverPlanFeatures?.features?.map((item, index) => (
                            <li key={index} className="flex gap-2 items-center">
                              <i className="fa-solid fa-check text-[#96c94b]"></i>
                              <p className="text-md font-normal text-black">
                                {item?.label}
                              </p>
                            </li>
                          ))}
                      </ul>
                    )}
                    <div className="md:hidden block">
                      {showMore === "silver" ? (
                        <button
                          onClick={() => handleShowMore("")}
                          className="text-sm font-normal mt-5 cursor-pointer text-gray-500 flex justify-center items-center gap-2 w-full"
                        >
                          Show Less <i className="fa-solid fa-angle-up"></i>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleShowMore("silver")}
                          className="text-sm font-normal cursor-pointer text-gray-500 flex justify-center items-center gap-2 w-full mt-2"
                        >
                          Show More <i className="fa-solid fa-angle-down"></i>
                        </button>
                      )}
                    </div>
                    <ul className="flex-col gap-2 hidden md:flex mt-5">
                      {silverFeatures?.length > 0 &&
                        silverPlanFeatures?.features?.map((item, index) => (
                          <li key={index} className="flex gap-2 items-center">
                            <i className="fa-solid fa-check text-[#96c94b]"></i>
                            <p className="text-md font-normal text-black">
                              {item?.label}
                            </p>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              )}
              <div className="bg-[#FFF3E3] p-8 rounded-lg flex flex-col gap-2 items-center border-2 border-[#96c94b] relative">
                <p className="absolute -top-4 left-23.75 bg-[#96c94b] text-black px-4 py-1 rounded-full text-sm font-medium uppercase">
                  POPULAR
                </p>
                <h2 className="text-3xl font-medium text-black">Gold</h2>
                {GoldPlanFeatures.oldPrice ? (
                  <p className="text-gray-600 line-through text-sm font-medium">
                    ${GoldPlanFeatures.oldPrice}/monthly
                  </p>
                ) : null}

                {type === "yearly" ? (
                  <>
                    <p className="text-3xl font-medium text-black">
                      $
                      {GoldPlanFeatures.price
                        ? (
                            Math.floor((GoldPlanFeatures.price / 12) * 100) /
                            100
                          ).toFixed(2)
                        : "--"}
                      <span className="text-sm!">/monthly</span>
                    </p>
                    <p className="text-sm font-normal text-black">
                      Monthly Paid Yearly
                    </p>
                  </>
                ) : (
                  <p className="text-3xl font-medium text-black">
                    ${GoldPlanFeatures.price ?? "--"}
                    <span className="text-sm!">/{type}</span>
                  </p>
                )}
                <p className="text-md font-medium text-gray-600 uppercase">
                  {domainData[domainSelect]?.category}
                </p>
                {GoldPlanFeatures.price && (
                  <button
                    onClick={() =>
                      handleChose(
                        "gold",
                        GoldPlanFeatures?.frequency ?? "",
                        GoldPlanFeatures.price ?? 0,
                        GoldPlanFeatures.oldPrice ?? 0,
                        GoldPlanFeatures?.planKey ?? "",
                      )
                    }
                    disabled={user ? true : false}
                    className={`w-full text-black text-md font-normal px-5 py-2 rounded-lg transition-all duration-300 active:scale-105 cursor-pointer ${
                      user ? "bg-gray-300" : "bg-[#cbf38b]"
                    }`}
                  >
                    Choose Now
                  </button>
                )}

                <div className="mt-5 md:mt-10">
                  <h2 className="text-xl font-medium text-black">
                    What's included:
                  </h2>
                  {showMore === "gold" && (
                    <ul className="flex flex-col gap-2 md:hidden mt-5 expand">
                      {GoldPlanFeatures?.features?.map(
                        (item: { label: string; note?: string }, index) => (
                          <li key={index} className="flex gap-2 items-center">
                            <i className="fa-solid fa-check text-[#96c94b]"></i>
                            <p className="text-md font-normal text-black">
                              {item?.label}
                              {item?.note === "brandshare" ? (
                                <span
                                  className="text-[#cf3832] cursor-pointer"
                                  onClick={() => setShowTab(true)}
                                >
                                  (NOTE)
                                </span>
                              ) : item?.note === "brandform" ? (
                                <span
                                  className="text-[#cf3832] cursor-pointer"
                                  onClick={() => setMerchendiseTab(true)}
                                >
                                  (NOTE)
                                </span>
                              ) : item?.note === "brandgear" ? (
                                <span
                                  className="text-[#cf3832] cursor-pointer"
                                  onClick={() => setConTab(true)}
                                >
                                  (NOTE)
                                </span>
                              ) : null}
                            </p>
                          </li>
                        ),
                      )}
                    </ul>
                  )}
                  <div className="md:hidden block">
                    {showMore === "gold" ? (
                      <button
                        onClick={() => handleShowMore("")}
                        className="text-sm font-normal mt-5 cursor-pointer text-gray-500 flex justify-center items-center gap-2 w-full"
                      >
                        Show Less <i className="fa-solid fa-angle-up"></i>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleShowMore("gold")}
                        className="text-sm font-normal cursor-pointer text-gray-500 flex justify-center items-center gap-2 w-full mt-2"
                      >
                        Show More <i className="fa-solid fa-angle-down"></i>
                      </button>
                    )}
                  </div>
                  <ul className="hidden md:flex flex-col gap-2 mt-5">
                    {GoldPlanFeatures?.features?.map(
                      (item: { label: string; note?: string }, index) => (
                        <li key={index} className="flex gap-2 items-center">
                          <i className="fa-solid fa-check text-[#96c94b]"></i>
                          <p className="text-md font-normal text-black">
                            {item?.label}
                            {item?.note === "brandshare" ? (
                              <span
                                className="text-[#cf3832] cursor-pointer"
                                onClick={() => setShowTab(true)}
                              >
                                (NOTE)
                              </span>
                            ) : item?.note === "brandform" ? (
                              <span
                                className="text-[#cf3832] cursor-pointer"
                                onClick={() => setConTab(true)}
                              >
                                (NOTE)
                              </span>
                            ) : item?.note === "brandgear" ? (
                              <span
                                className="text-[#cf3832] cursor-pointer"
                                onClick={() => setMerchendiseTab(true)}
                              >
                                (NOTE)
                              </span>
                            ) : null}
                          </p>
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              </div>
              <div className="bg-[#FFF3E3] p-8 rounded-lg flex flex-col gap-2 items-center">
                <h2 className="text-3xl font-medium text-black flex items-center gap-2">
                  Platinum
                </h2>
                <p className="text-md font-normal text-center">
                  {
                    domainCategories.find(
                      (item) =>
                        item.category === domainData[domainSelect]?.category,
                    )?.heading
                  }
                </p>

                <button className="mt-5 w-full bg-gray-200 py-2 rounded-md border-gray-400 cursor-not-allowed">
                  Coming Soon
                </button>
                <img src={BPSLOGO} alt="" className="w-44 mt-3" />
                <p className="text-sm font-normal text-center mt-3">
                  We Handle Everything For You
                </p>
                <p className="text-md font-normal text-center">
                  Stop managing content, posting, and growth — our team handles
                  it.
                </p>

                <div className="mt-5 md:mt-10">
                  <h2 className="text-xl font-medium text-black">
                    What's included:
                  </h2>
                  {showMore === "platinum" && (
                    <ul className="flex flex-col gap-2 md:hidden mt-5 expand">
                      {platinumFeatures?.map((item, index) => (
                        <li key={index} className="flex gap-2 items-start">
                          <i className="fa-solid fa-check text-[#96c94b] mt-1"></i>
                          <p className="text-md font-normal text-black">
                            {item?.label}
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="md:hidden block">
                    {showMore === "platinum" ? (
                      <button
                        onClick={() => handleShowMore("")}
                        className="text-sm font-normal mt-5 cursor-pointer text-gray-500 flex justify-center items-center gap-2 w-full"
                      >
                        Show Less <i className="fa-solid fa-angle-up"></i>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleShowMore("platinum")}
                        className="text-sm font-normal cursor-pointer text-gray-500 flex justify-center items-center gap-2 w-full mt-2"
                      >
                        Show More <i className="fa-solid fa-angle-down"></i>
                      </button>
                    )}
                  </div>
                  <ul className="hidden md:flex flex-col gap-2 mt-5">
                    {platinumFeatures?.map((item, index) => (
                      <li key={index} className="flex gap-2 items-start">
                        <i className="fa-solid fa-check text-[#96c94b] mt-1"></i>
                        <p className="text-md font-normal text-black">
                          {item?.label}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <LottieAnimation />
          )}
        </div>
        <div className="flex justify-center items-center mt-5">
          {domainData[domainSelect]?.group && (
            <button
              onClick={() => {
                if (domainData[domainSelect]?.group === "POWER") {
                  handleOpenCompare(PowerPdf);
                } else if (domainData[domainSelect]?.group === "PULSE") {
                  handleOpenCompare(PulsePdf);
                } else if (domainData[domainSelect]?.group === "SPARK") {
                  handleOpenCompare(SperkPdf);
                }
              }}
              className="bg-[#96c94b] hover:shadow-2xl cursor-pointer text-black px-10 py-3 rounded-xl hover:scale-105 duration-200 ease-in-out"
            >
              Compare features
            </button>
          )}
        </div>
      </section>

      <BusinessInfo />

      {showTab && <BrandShareNote setShowTab={setShowTab} showTab={showTab} />}
      {merchendiseTab && (
        <BrandGearNote
          setShowTab={setMerchendiseTab}
          showTab={merchendiseTab}
        />
      )}
      {conTab && <BrandFormNote setShowTab={setConTab} showTab={conTab} />}
      {goldTab && <GoldAccTab setGoldTab={setGoldTab} goldTab={goldTab} />}
      {addTab && <AdditionalTab setAddTab={setAddTab} addTab={addTab} />}
      {merTab && <MerchandiseTab setMerTab={setMerTab} merTab={merTab} />}
      {whyTab && <WhyPlatTab setWhyTab={setWhyTab} whyTab={whyTab} />}
    </React.Fragment>
  );
}

export default Pricing;
