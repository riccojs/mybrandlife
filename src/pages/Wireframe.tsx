import { Link, useSearchParams } from "react-router";
import { useOnboard } from "../hook/useOnboard";
import { useEffect, useRef, useState } from "react";
import SendInfo from "../component/Send.info";
import Spiner from "../component/Spiner";
import EchoRequest from "../component/Echo.request";
import BrandbookRequest from "../component/Brandbook.request";
import { track } from "@plausible-analytics/tracker";
import { useCheckEchoConnectionQuery } from "../redux/features/echo/echoApi";
import { usePlausible } from "../hook/usePlausible";
import { getSocialIcon } from "../utils/socialIcons";
import { motion } from "framer-motion";
import QRCode from "react-qr-code";
import { useScan } from "../hook/useScan";
import GpsPermission from "../component/Gps.permission";
import type { SpinType } from "../utils/spin.type";
import Spining from "../component/Spining";

interface OnboardType {
  id: string;
  tagLine: string;
  headerImage: string;
  logoImage: string;
  bodyImage: string;
  funnySaying: string;
  bio: string;
  vcfFile: string;
  offerings: string;
  privateDomain: string;
  enableEcho: boolean;
  enableSpin: boolean;
  merchendiseUrl: string;
  merchendiseStatus: boolean;
  buttonSet: ButtonsType[];
  services: ServiceType[];
  customPlatfrom: { name: string; url: string; id: string }[];
  user: UserType;
  layout: string;
  officialColor: string;
  enableEvent: boolean;
  brandshare: {
    logo: string;
    label: string;
    link: string;
    code: string;
  };
}

interface ButtonsType {
  id: string;
  name: string;
  url: string;
}
interface ServiceType {
  id: string;
  title: string;
}

interface UserType {
  landerName: string;
  calendarId: string;
  stripeAccountId: string;
  id: string;
  package: string;
  spinings: SpinType[];
  enableBrandshare: boolean;
}

function Wireframe() {
  const [isShowInfo, setIsShowInfo] = useState<boolean>(false);
  const [searchParams] = useSearchParams();
  const idPrefix = searchParams.get("idprefix") as string;
  const qrRef = useRef<HTMLDivElement | null>(null);

  const handleDownload = () => {
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;
    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    const blob = new Blob([svgStr], {
      type: "image/svg+xml;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      const pngUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = pngUrl;
      link.download = "qr-code.png";
      link.click();
    };
    img.src = url;
  };

  const { onboard, isLoading } = useOnboard() as {
    onboard: OnboardType;
    isLoading: boolean;
  };

  usePlausible(onboard?.user?.landerName);

  const {
    tagLine,
    logoImage,
    headerImage,
    bodyImage,
    buttonSet,
    services,
    bio,
    user,
    funnySaying,
    vcfFile,
    offerings,
    merchendiseUrl,
    id,
    enableEcho,
    layout,
    officialColor,
    enableEvent,
    merchendiseStatus,
    customPlatfrom,
    enableSpin,
    brandshare,
    privateDomain,
  } = onboard || {};

  const {
    landerName,
    calendarId,
    id: userId,
    package: packageName,
    enableBrandshare,
  } = user || {};

  const { data } = useCheckEchoConnectionQuery(userId);
  const { isShow, setIsShow, scanId } = useScan(idPrefix, userId);

  const formatHref = (value: string) => {
    if (!value) return "#";
    const trimmed = value.trim();
    if (trimmed.includes("@") && !trimmed.startsWith("http")) {
      return `mailto:${trimmed}`;
    }
    if (/^[+0-9\s-]+$/.test(trimmed)) {
      return `tel:${trimmed.replace(/\s/g, "")}`;
    }
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      return trimmed;
    }
    return `https://${trimmed}`;
  };

  useEffect(() => {
    if (!isLoading && !onboard) {
      window.location.href = "https://mybrandlife.me";
    }
  }, [onboard, isLoading]);

  const qrBase = privateDomain
    ? privateDomain
    : `https://${window.location.hostname}`;

  return isLoading ? (
    <Spiner />
  ) : (
    <section>
      <div>
        <div
          className="py-5"
          style={
            headerImage
              ? {
                  backgroundImage: `url(${headerImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center center",
                  backgroundRepeat: "no-repeat",
                  backgroundColor: "black",
                }
              : { backgroundColor: "black" }
          }
        >
          <div
            className={`z-20 relative flex container m-auto 
                    ${
                      layout === "CENTER"
                        ? "flex-col justify-center items-center gap-5"
                        : layout === "RIGHT"
                          ? "flex-row-reverse justify-between items-center"
                          : "justify-between items-center"
                    }`}
          >
            <a href={`/${landerName}`}>
              {logoImage ? (
                <img
                  src={logoImage}
                  alt={logoImage}
                  onClick={() =>
                    track("ButtonClick", {
                      props: {
                        buttonName: "Logo Click",
                        lander: landerName,
                        currentDomain: window.location.hostname,
                      },
                    })
                  }
                  className="min-w-20 w-20 h-20 md:min-w-32 min-h-20 md:min-h-32 md:w-32 md:h-32 rounded-full object-cover"
                />
              ) : (
                <p className="text-white text-8xl font-medium uppercase flex justify-center items-center min-w-20 w-20 h-20 md:min-w-32 min-h-20 md:min-h-32 md:w-32 md:h-32 rounded-full bg-gray-800">
                  {landerName?.slice(0, 1)}
                </p>
              )}
            </a>
            {services?.length > 0 && (
              <div>
                <h2 className="text-white text-xl md:text-3xl font-medium text-right">
                  Service Offered
                </h2>
                <ul
                  className={`mt-1 flex flex-col  ${
                    layout === "CENTER"
                      ? "items-center"
                      : layout === "LEFT"
                        ? "items-end"
                        : layout === "RIGHT"
                          ? "items-start"
                          : ""
                  }`}
                >
                  {services?.map((item) => (
                    <li
                      key={item.id}
                      className="text-sm md:text-md font-normal text-white"
                    >
                      {item.title}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        <div className="w-full h-1 bg-slate-400 animate-pulse"></div>
        <div
          className="w-full py-10 min-h-[80vh] h-full"
          style={
            bodyImage
              ? {
                  backgroundImage: `url(${bodyImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center center",
                  backgroundRepeat: "no-repeat",
                }
              : { backgroundColor: "black" }
          }
        >
          <div className="w-11/12 md:w-7/12 lg:w-6/12 2xl:w-4/12 m-auto relative z-20">
            <div className="flex gap-2 md:gap-5 items-center ">
              <button
                onClick={() => {
                  setIsShowInfo(true);
                  track("ButtonClick", {
                    props: {
                      lander: landerName,
                      buttonName: "Info Submission",
                      currentDomain: window.location.hostname,
                    },
                  });
                }}
                className="flex justify-center px-4 gap-2 items-center w-full h-8 md:h-12 
                      rounded-lg hover:scale-105 duration-300 transition-all cursor-pointer 
                      border border-white hover:shadow-[0_0_14px_rgba(255,255,255,0.90)]"
                style={{
                  backgroundImage: `linear-gradient(to right, ${officialColor}, #fff)`,
                }}
              >
                <i className="fa-solid fa-upload text-xs md:text-xl"></i>
                <p className="text-xs md:text-base font-normal">
                  Submit your info
                </p>
              </button>
              {vcfFile && (
                <button
                  className="flex justify-center px-4 gap-2 items-center w-full h-8 md:h-12 
             rounded-lg hover:scale-105 duration-300 transition-all cursor-pointer 
             border border-white hover:shadow-[0_0_14px_rgba(255,255,255,0.90)]"
                  style={{
                    backgroundImage: `linear-gradient(to right, ${officialColor}, #fff)`,
                  }}
                  onClick={() =>
                    track("ButtonClick", {
                      props: {
                        buttonName: "Download Info",
                        lander: landerName,
                        currentDomain: window.location.hostname,
                      },
                    })
                  }
                >
                  <i className="fa-solid fa-download text-xs md:text-xl"></i>
                  <a
                    className="text-xs md:text-base font-normal"
                    download
                    target="_blank"
                    href={vcfFile}
                  >
                    Download My Info
                  </a>
                </button>
              )}
            </div>

            <div className="mt-4 mb-2 md:my-4">
              <h2 className="uppercase text-white text-xl md:text-3xl font-medium text-center">
                {tagLine}
              </h2>
              <p className="mt-2 text-md font-normal text-white text-center">
                {offerings}
              </p>
            </div>
            <div>
              <p className="text-white text-center text-sm md:text-lg font-normal">
                {funnySaying}
              </p>
            </div>
            <div className="my-3">
              {enableEvent && calendarId && (
                <BrandbookRequest
                  officialColor={officialColor}
                  landerName={landerName}
                />
              )}

              {merchendiseUrl && merchendiseStatus && (
                <button
                  className="flex justify-center px-4 gap-2 items-center w-full h-8 md:h-12 
             rounded-lg hover:scale-105 duration-300 transition-all cursor-pointer 
             border border-white hover:shadow-[0_0_14px_rgba(255,255,255,0.90)]"
                  style={{
                    backgroundImage: `linear-gradient(to right, ${officialColor}, #fff)`,
                  }}
                  onClick={() =>
                    track("ButtonClick", {
                      props: {
                        buttonName: "View Merchandise",
                        lander: landerName,
                        currentDomain: window.location.hostname,
                      },
                    })
                  }
                >
                  <i className="fa-solid fa-bag-shopping text-xl"></i>
                  <a
                    target="_blank"
                    className="capitalize"
                    href={merchendiseUrl}
                  >
                    {landerName} Merchandise
                  </a>
                </button>
              )}

              {packageName === "gold" && enableEcho && (
                <div className="flex gap-3 mt-3">
                  <button
                    className="flex justify-center px-4 gap-2 items-center w-full h-8 md:h-12 
             rounded-lg hover:scale-105 duration-300 transition-all cursor-pointer 
             border border-white hover:shadow-[0_0_14px_rgba(255,255,255,0.90)]"
                    style={{
                      backgroundImage: `linear-gradient(to right, ${officialColor}, #fff)`,
                    }}
                    onClick={() =>
                      track("ButtonClick", {
                        props: {
                          buttonName: "View Live Board",
                          lander: landerName,
                          currentDomain: window.location.hostname,
                        },
                      })
                    }
                  >
                    <i className="fa-regular fa-circle-play text-xl"></i>
                    <Link
                      to={`/${landerName}/request_tv`}
                      className="capitalize"
                    >
                      ECHO (Live Board)
                    </Link>
                  </button>
                  {enableEcho && data?.ready && data?.connected && (
                    <EchoRequest
                      officialColor={officialColor}
                      landerName={landerName}
                    />
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 md:gap-3 mt-2 md:mt-3">
                {buttonSet?.map((item) => {
                  const { id, name, url } = item;
                  const Icon = getSocialIcon(name, url);
                  const formattedHref = formatHref(url);
                  return (
                    <motion.a
                      key={id}
                      href={formattedHref}
                      target={
                        formattedHref.startsWith("http") ? "_blank" : undefined
                      }
                      rel="noopener noreferrer"
                      onClick={() =>
                        track("ButtonClick", {
                          props: {
                            buttonName: `View ${name}`,
                            lander: landerName,
                            currentDomain: window.location.hostname,
                          },
                        })
                      }
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex justify-center px-4 gap-2 items-center w-full h-8 md:h-12
                 rounded-lg cursor-pointer border border-white hover:shadow-[0_0_14px_rgba(255,255,255,0.90)]"
                      style={{
                        backgroundImage: `linear-gradient(to right, ${officialColor}, #fff)`,
                      }}
                    >
                      {Icon && <Icon className="text-lg md:text-2xl" />}
                      <span className="text-sm md:text-md">{name}</span>
                    </motion.a>
                  );
                })}
                {customPlatfrom?.map((item) => {
                  const { id, name, url } = item;

                  return (
                    <motion.a
                      key={id}
                      href={url}
                      target="_blank"
                      onClick={() =>
                        track("ButtonClick", {
                          props: {
                            buttonName: `View ${name}`,
                            lander: landerName,
                            currentDomain: window.location.hostname,
                          },
                        })
                      }
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex justify-center px-4 gap-2 items-center w-full h-8 md:h-12
                 rounded-lg cursor-pointer border border-white hover:shadow-[0_0_14px_rgba(255,255,255,0.90)]"
                      style={{
                        backgroundImage: `linear-gradient(to right, ${officialColor}, #fff)`,
                      }}
                    >
                      <i className="fa-solid fa-link"></i>
                      <span className="text-md">{name}</span>
                    </motion.a>
                  );
                })}
                {enableSpin && (
                  <Spining user={user} officialColor={officialColor} />
                )}
              </div>
            </div>
            <div className="mt-6">
              <h2 className="text-xl font-medium text-white text-center capitalize">
                About {landerName}
              </h2>
              <p className="text-gray-200 mt-3 text-md font-normal text-center w-full  m-auto">
                {bio}
              </p>
            </div>
          </div>
          {enableBrandshare && (
            <div className="flex flex-col justify-center items-center gap-2 mt-5">
              <a
                href={brandshare?.link}
                className="text-white text-sm hover:underline"
              >
                {brandshare?.label}
              </a>
              <a href={brandshare?.link} target="_blank">
                {brandshare?.logo ? (
                  <img
                    src={brandshare?.logo}
                    className="w-24 h-24 object-cover rounded-full"
                    alt=""
                  />
                ) : (
                  <p className="w-14 h-14 text-3xl min-w-14 bg-slate-200 flex justify-center items-center uppercase rounded-full">
                    {brandshare?.code?.slice(0, 1)}
                  </p>
                )}
              </a>
            </div>
          )}
        </div>
        <div className="w-full h-1 bg-slate-400 animate-pulse"></div>
        <div className="bg-black py-10">
          <div className="container">
            <p className="text-white text-xs md:text-md font-normal text-center capitalize">
              © 2025 {landerName} | All Rights Reserved.
            </p>
            <ul className="flex gap-5 justify-center items-center mt-3">
              <li>
                <a
                  onClick={() =>
                    track("ButtonClick", {
                      props: {
                        buttonName: "Check Terms & Conditions",
                        lander: landerName,
                        currentDomain: window.location.hostname,
                      },
                    })
                  }
                  href="https://mybrandlife.me/terms-condition"
                  target="_blank"
                  className="text-white text-sm font-normal underline"
                >
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a
                  onClick={() =>
                    track("ButtonClick", {
                      props: {
                        buttonName: "Check Privacy Policy",
                        lander: landerName,
                        currentDomain: window.location.hostname,
                      },
                    })
                  }
                  target="_blank"
                  href="https://mybrandlife.me/privacy-policy"
                  className="text-white text-sm font-normal underline"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
            <p className="text-white text-xs md:text-sm font-normal text-center block mt-5">
              Want to build your brand?{" "}
              <a
                href={`https://mybrandlife.me/pricing`}
                target="_blank"
                className="hover:text-blue-200 underline"
                onClick={() =>
                  track("ButtonClick", {
                    props: {
                      buttonName: "Select Plan",
                      lander: landerName,
                      currentDomain: window.location.hostname,
                    },
                  })
                }
              >
                Select your plan and Join Now
              </a>
            </p>
            {packageName === "gold" && (
              <div className="flex justify-center mt-5">
                <button className="flex items-center gap-3 py-3 rounded-lg justify-center text-white text-center bg-[#cf3832] px-6">
                  <a
                    href={`https://mybrandlife.me/pricing?affiliate=${landerName}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs md:text-md"
                    onClick={() =>
                      track("ButtonClick", {
                        props: {
                          buttonName: "Apply Discount Code",
                          lander: landerName,
                          currentDomain: window.location.hostname,
                        },
                      })
                    }
                  >
                    Apply Discount Code When Sing-Up
                  </a>
                  <i className="fa-solid fa-arrow-up-right-from-square"></i>
                </button>
              </div>
            )}
          </div>
          <div className="bg-amber-50 m-auto mt-5 overflow-hidden w-24 p-2 h-24 min-w-24 flex flex-col rounded-xl justify-center items-center">
            <div
              ref={qrRef}
              className="bg-amber-50 overflow-hidden w-24 p-2 h-24 min-w-24 flex flex-col gap-2 rounded-xl justify-center items-center"
            >
              <QRCode value={`${qrBase}/${landerName}`} />
            </div>

            <button
              onClick={() => {
                track("ButtonClick", {
                  props: {
                    buttonName: "Download QR Code",
                    lander: landerName,
                    currentDomain: window.location.hostname,
                  },
                });
                handleDownload();
              }}
              className="text-xs cursor-pointer"
            >
              Download
            </button>
          </div>
        </div>
      </div>
      {isShowInfo && (
        <SendInfo
          isShowInfo={isShowInfo}
          setIsShowInfo={setIsShowInfo}
          id={id}
        />
      )}
      {isShow && (
        <GpsPermission
          isShowInfo={isShow}
          setIsShowInfo={setIsShow}
          scanId={scanId}
        />
      )}
    </section>
  );
}

export default Wireframe;
