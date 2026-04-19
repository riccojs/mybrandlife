import { useNavigate, useSearchParams } from "react-router";
import { useOnboard } from "../hook/useOnboard";
import { useEffect, useRef, useState } from "react";
import SendInfo from "../component/Send.info";
import Spiner from "../component/Spiner";
import { track } from "@plausible-analytics/tracker";
import { usePlausible } from "../hook/usePlausible";
import QRCode from "react-qr-code";
import { useScan } from "../hook/useScan";
import GpsPermission from "../component/Gps.permission";
import SpinPicker from "../component/Spin.picker";

interface OnboardType {
  id: string;
  tagLine: string;
  logo: string;
  portrait: string;
  background: string;
  funnySaying: string;
  bio: string;
  vcfFile: string;
  offerings: string;
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
}

function SpinPage() {
  const [isShowInfo, setIsShowInfo] = useState<boolean>(false);
  const [searchParams] = useSearchParams();
  const idPrefix = searchParams.get("idprefix") as string;
  const qrRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
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

  const { logo, portrait, background, services, user, id, layout, enableSpin } =
    onboard || {};

  const { landerName, id: userId, package: packageName } = user || {};

  const { isShow, setIsShow, scanId } = useScan(idPrefix, userId);

  useEffect(() => {
    if (!isLoading && !onboard) {
      window.location.href = "https://mybrandlife.me";
    }
  }, [onboard, isLoading]);

  useEffect(() => {
    if (enableSpin === false) {
      navigate(`/${landerName}`);
    }
  }, [enableSpin, landerName, navigate]);

  return isLoading ? (
    <Spiner />
  ) : (
    <section>
      <div>
        <div
          className="py-5"
          style={
            portrait
              ? {
                  backgroundImage: `url(${portrait})`,
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
              {logo ? (
                <img
                  src={logo}
                  alt={logo}
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
        <div className="w-full h-[1px] bg-slate-400 animate-pulse"></div>
        <div
          className="w-full py-10 h-full"
          style={
            background
              ? {
                  backgroundImage: `url(${background})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center center",
                  backgroundRepeat: "no-repeat",
                }
              : { backgroundColor: "black" }
          }
        >
          <SpinPicker id={user?.id} />
        </div>
        <div className="w-full h-[1px] bg-slate-400 animate-pulse"></div>
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
              <QRCode
                value={`https://${window.location.hostname}/${landerName}`}
              />
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

export default SpinPage;
