import { Link, useParams } from "react-router";
import ScrollBar from "../component/Scroll.bar";
import QRCode from "react-qr-code";
import { useOnboard } from "../hook/useOnboard";
import { useEffect, useRef, useState } from "react";
import { track } from "@plausible-analytics/tracker";

function RequestTv() {
  const params = useParams();
  const landerName = params.name ?? "";
  const [qrSize, setQrSize] = useState(150);
  const { onboard } = useOnboard();
  const qrRef = useRef<HTMLDivElement | null>(null);
  const { tagLine, logo, services, funnySaying, portrait } = onboard || {};

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

  useEffect(() => {
    const updateQrSize = () => {
      setQrSize(window.innerWidth < 768 ? 80 : 150);
    };

    updateQrSize();
    window.addEventListener("resize", updateQrSize);

    return () => window.removeEventListener("resize", updateQrSize);
  }, []);

  return (
    <section className="bg-black w-full h-screen">
      <div className="flex h-full sm:flex-row flex-col">
        <div className="w-full sm:w-3/12 2xl:w-2/12 h-screen border-r border-gray-500 sticky top-0 left-0 flex flex-col">
          <div
            className="flex justify-center items-center w-full p-5 md:p-10"
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
            <Link to={`/${landerName}`}>
              {logo ? (
                <img
                  src={logo}
                  alt=""
                  className="w-16 sm:w-32 h-16 sm:h-32 min-w-16 sm:min-w-32 min-h-16 sm:min-h-32 rounded-full object-cover"
                />
              ) : (
                <p className="text-white text-3xl sm:text-8xl font-medium uppercase flex justify-center items-center w-16 sm:w-32 h-16 sm:h-32 min-w-16 sm:min-w-32 min-h-16 sm:min-h-32 rounded-full bg-gray-800">
                  {landerName?.slice(0, 1)}
                </p>
              )}
            </Link>
          </div>

          <div className="flex flex-col gap-5 border-y border-gray-500 p-5 sm:p-10 flex-1 overflow-y-auto">
            <div className="flex flex-col gap-2">
              <p className="text-amber-200 text-md sm:text-xl">Tagline</p>
              <p className="text-white text-sm sm:text-md">
                {tagLine ? tagLine : "N/A"}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-amber-200 text-md sm:text-xl">Funny Saying</p>
              <p className="text-white text-sm sm:text-md">
                {funnySaying ? funnySaying : "N/A"}
              </p>
            </div>

            <div>
              <h2 className="text-amber-200 text-md sm:text-xl">
                Service Offered
              </h2>
              <ul className="mt-1 flex flex-col">
                {services?.map((item: { id: string; title: string }) => (
                  <li
                    key={item.id}
                    className="text-sm sm:text-md font-normal text-white"
                  >
                    {item.title}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="bg-amber-50 p-5 w-full flex flex-col justify-center items-center">
            <div ref={qrRef}>
              <QRCode
                value={`https://${window.location.hostname}/${landerName}`}
                size={qrSize}
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
              className="text-sm sm:text-xl mt-3 cursor-pointer"
            >
              Download
            </button>
          </div>
        </div>
        <ScrollBar />
      </div>
    </section>
  );
}

export default RequestTv;
