import { useState } from "react";
import CreateBrandbook from "./Create.brandbook";
import { track } from "@plausible-analytics/tracker";

function BrandbookRequest({
  officialColor,
  landerName,
}: {
  officialColor: string;
  landerName: string;
}) {
  const [isshow, setIsshow] = useState(false);
  return (
    <>
      <button
        onClick={() => {
          track("ButtonClick", {
            props: {
              buttonName: "View Merchandise",
              lander: landerName,
              currentDomain: window.location.hostname,
            },
          });
          setIsshow(true);
        }}
        className="flex justify-center px-4 gap-2 items-center w-full h-8 md:h-12 
             rounded-lg hover:scale-105 duration-300 transition-all cursor-pointer 
             border border-white hover:shadow-[0_0_14px_rgba(255,255,255,0.90)]"
        style={{
          backgroundImage: `linear-gradient(to right, ${officialColor}, #fff)`,
        }}
      >
        <i className="fa-regular fa-calendar-days text-xs md:text-md"></i>
        <p className="text-xs md:text-base">Brandbook</p>
      </button>
      {isshow && <CreateBrandbook isShow={isshow} setShow={setIsshow} />}
    </>
  );
}

export default BrandbookRequest;
