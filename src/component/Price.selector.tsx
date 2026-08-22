import React, { useState, type RefObject, type SetStateAction } from "react";
import domainData from "../utils/domainData";
import ReqestDomainTab from "./popups/Reqest.domain.tab";

interface DataTypes {
  pricingRef: RefObject<HTMLDivElement | null>;
  isShow: boolean;
  setIsShow: React.Dispatch<SetStateAction<boolean>>;
  selectedDomain: string | number;
  handleSelectDomain: (value: string) => void;
}

function PriceSelector({
  pricingRef,
  isShow,
  setIsShow,
  selectedDomain,
  handleSelectDomain,
}: DataTypes) {
  const [search, setSearch] = useState<string>("");
  const [reqTab, setReqTab] = useState<boolean>(false);
  const allDomains = Object.keys(domainData);

  return (
    <div className="mt-2 w-full flex flex-col gap-3">
      <div className="relative w-full " ref={pricingRef}>
        <div
          tabIndex={1}
          onClick={() => {
            setIsShow(!isShow);
          }}
          className="flex justify-between items-center bg-white focus:outline-1 focus:outline-[#96c94b] border border-gray-300 p-3 rounded-lg w-full text-md font-normal text-black cursor-pointer"
        >
          {selectedDomain ? (
            <p>{selectedDomain}.me</p>
          ) : (
            <p>Choose Your Domain</p>
          )}
          {isShow ? (
            <i className="fa-solid fa-angle-up"></i>
          ) : (
            <i className="fa-solid fa-angle-down"></i>
          )}
        </div>

        {/* Dropdown */}
        <div
          className={`w-full z-10 absolute top-14 left-0 bg-white shadow rounded-md transition-all duration-200 ease-in-out transform ${
            isShow
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-90 -translate-y-4 pointer-events-none"
          }`}
        >
          <div className="pt-2 px-2">
            <p className="text-xs font-normal text-black bg-amber-100 border-l-2 border-amber-400 p-2 rounded-md">
              Scroll to explore available domain options, or use the search box
              to find an exact match. Just give us your niche, brand,
              profession, or a short description of what your looking for and we
              will do what we can.
            </p>
          </div>
          <div className="p-2">
            <input
              type="text"
              placeholder="Search by niche, profession, or brand…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border text-sm font-normal text-black bg-gray-100 border-gray-300 px-3 py-2 rounded-md w-full focus:outline-0"
            />
          </div>
          <div className="p-2 flex flex-col border-b border-gray-300">
            <h2 className="text-md font-medium">
              Browse domains below or search for an exact match.
            </h2>
            <p className="text-xs font-normal">
              Don’t see what you need? Request it — we’ll take care of the rest.
            </p>
          </div>

          <div className="custom-scroll min-h-60 h-60 overflow-y-auto">
            <ul className="flex flex-col">
              <li className="border-b border-gray-300 p-2 flex justify-between items-center">
                <p className="text-lg font-normal text-green-600">Select One</p>
                <div className="flex gap-2 items-center">
                  <button
                    className="cursor-pointer text-sm py-1 px-4 border border-gray-300 rounded-lg"
                    onClick={() => {
                      handleSelectDomain("");
                      setSearch("");
                    }}
                  >
                    Reset
                  </button>
                  <button
                    className="cursor-pointer text-sm py-1 px-4 border border-gray-300 rounded-lg"
                    onClick={() => {
                      handleSelectDomain("");
                      setSearch("");
                      setIsShow(false);
                    }}
                  >
                    Close
                  </button>
                  <button
                    className="cursor-pointer text-sm py-1 px-4 border border-gray-300 rounded-lg"
                    onClick={() => setReqTab(true)}
                  >
                    Request A Domain
                  </button>
                </div>
              </li>

              {allDomains
                .filter((item) =>
                  item.toLowerCase().includes(search.toLowerCase()),
                )
                .map((item, index) => {
                  const hasPackage =
                    Object.keys(domainData[item].packages).length > 0;
                  return (
                    <li
                      key={index}
                      onClick={() => {
                        if (hasPackage) {
                          handleSelectDomain(item);
                          setIsShow(false);
                        }
                      }}
                      className={`text-sm font-normal border-b border-gray-300 p-2
                        ${
                          hasPackage
                            ? "text-black hover:bg-gray-50 cursor-pointer"
                            : "text-gray-400 bg-gray-100 cursor-not-allowed"
                        }`}
                    >
                      {item}.me
                      {!hasPackage && (
                        <span className="ml-2 text-xs text-red-500">
                          (No packages)
                        </span>
                      )}
                    </li>
                  );
                })}
            </ul>
          </div>
        </div>
      </div>
      {reqTab && <ReqestDomainTab reqTab={reqTab} setReqTab={setReqTab} />}
    </div>
  );
}

export default PriceSelector;
