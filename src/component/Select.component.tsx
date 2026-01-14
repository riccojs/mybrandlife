import { track } from "@plausible-analytics/tracker";
import { useEffect, useRef, useState } from "react";
import { useOnboard } from "../hook/useOnboard";

interface TypeData {
  handleChange: (value: string) => void;
  datas: { key: string; value: string }[];
  value: string;
  label: string;
  color: string;
}

function SelectComponent({
  handleChange,
  datas,
  value,
  label,
  color,
}: TypeData) {
  const [active, setActive] = useState(false);
  const downRef = useRef<HTMLDivElement | null>(null);
  const { onboard } = useOnboard();
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (downRef.current && !downRef.current.contains(event.target as Node)) {
        setActive(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full" ref={downRef}>
      <div
        tabIndex={0}
        onClick={() => {
          setActive(!active);
          track("ButtonClick", {
            props: {
              buttonName: "Create Branbook Booking",
              lander: onboard?.user?.landerName,
              currentDomain: window.location.hostname,
            },
          });
        }}
        style={{ backgroundColor: `${color}` }}
        className="border border-gray-300 cursor-pointer focus-within:border-[#96c94b] focus-within:border flex gap-2 items-center justify-between p-3 w-full text-center rounded-lg text-normal"
      >
        <p>{value ? value : label}</p>
        {active ? (
          <i className="fa-solid fa-angle-up"></i>
        ) : (
          <i className="fa-solid fa-angle-down"></i>
        )}
      </div>
      <ul
        className={`bg-[#fff] flex flex-col gap-1 custom-scroll max-h-96 h-auto overflow-auto z-10 shadow-2xl rounded-xl p-2 absolute top-13 left-0 w-full transition-all duration-200 ease-in-out transform ${
          active
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-90 -translate-y-4 pointer-events-none"
        }`}
      >
        <li
          onClick={() => {
            handleChange("");
            setActive(false);
          }}
          className={`text-normal p-3 cursor-pointer hover:bg-[#F3F3F3] rounded-xl ${
            value === "" ? "bg-[#F3F3F3]" : ""
          }`}
        >
          {label}
        </li>
        {datas?.map((item, index) => {
          return (
            <li
              key={index}
              onClick={() => {
                handleChange(item.value);
                setActive(false);
              }}
              className={`text-normal p-3 cursor-pointer hover:bg-[#F3F3F3] rounded-xl ${
                value === item.value ? "bg-[#F3F3F3]" : ""
              }`}
            >
              {item.key}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default SelectComponent;
