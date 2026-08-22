import React, { useEffect } from "react";
import confetti from "canvas-confetti";
import { useDispatch } from "react-redux";
import { addAffiliateCode } from "../../redux/features/onboard/onboardSlice";

interface TypesForm {
  showTab: boolean;
  setShowTab: React.Dispatch<React.SetStateAction<boolean>>;
  code: string;
}

function AffiliateThanks({ showTab, setShowTab, code }: TypesForm) {
  const dispatch = useDispatch();
  useEffect(() => {
    if (showTab) {
      confetti({
        particleCount: 200,
        spread: 90,
        origin: { y: 0.6 },
        colors: ["#ff0a54", "#ff477e", "#ff85a1", "#fbb1bd", "#f9bec7"],
      });
      const interval = setInterval(() => {
        confetti({
          particleCount: 100,
          spread: 60,
          origin: { y: 0.6 },
        });
      }, 500);
      setTimeout(() => clearInterval(interval), 1500);
    }
  }, [showTab]);

  if (!showTab) return null;

  return (
    <div className="inset-0 bg-[#00000053] flex fixed left-0 justify-center items-center w-full min-h-screen z-50">
      <div
        className={`relative flex flex-col w-11/12 md:w-8/12 2xl:w-4/12 m-auto justify-center p-4 rounded-lg shadow-xl bg-white border border-gray-300 ${
          showTab ? "zoom-animation" : ""
        }`}
      >
        <div className="p-10 flex flex-col gap-3 items-center justify-center">
          <i className="fa-regular fa-thumbs-up text-6xl text-green-500"></i>
          <h2 className="text-3xl font-bold text-black text-center">
            🎉 Congratulations! 🎉
          </h2>
          <p className="text-lg text-gray-600 text-center">
            Thank you from{" "}
            <span className="font-semibold text-green-600">{code}</span>
          </p>
        </div>

        <button
          onClick={() => {
            setShowTab(false);
            dispatch(addAffiliateCode(""));
          }}
          className="bg-red-400 w-10 h-10 flex justify-center items-center rounded-full text-white absolute top-3 right-3 cursor-pointer hover:bg-red-500 transition"
        >
          <i className="fa-solid fa-xmark text-2xl"></i>
        </button>
      </div>
    </div>
  );
}

export default AffiliateThanks;
