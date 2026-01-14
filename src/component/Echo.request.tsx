import { useState } from "react";
import CreateEcho from "./Create.echo";
import { track } from "@plausible-analytics/tracker";

function EchoRequest({
  officialColor,
  landerName,
}: {
  officialColor: string;
  landerName: string;
}) {
  const [showEcho, setShowEcho] = useState(false);

  return (
    <>
      <button
        onClick={() => {
          track("ButtonClick", {
            props: {
              buttonName: "Open Echo Request",
              lander: landerName,
            },
          });
          setShowEcho(true);
        }}
        className="flex justify-center px-4 gap-1 md:gap-2 items-center w-full h-8 md:h-12 
             rounded-lg hover:scale-105 duration-300 transition-all cursor-pointer 
             border border-white hover:shadow-[0_0_14px_rgba(255,255,255,0.90)]"
        style={{
          backgroundImage: `linear-gradient(to right, ${officialColor}, #fff)`,
        }}
      >
        <i className="fa-solid fa-link text-xs md:text-md"></i>
        <p className="text-xs md:text-base">Echo Request</p>
      </button>
      {showEcho && <CreateEcho isShow={showEcho} setShow={setShowEcho} />}
    </>
  );
}

export default EchoRequest;
