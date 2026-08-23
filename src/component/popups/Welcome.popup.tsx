import { useState } from "react";
import { useCreateReportMutation } from "../../redux/features/report/reportApi";
import toast from "react-hot-toast";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import SelectComponent from "../ui/Select.component";
import useBodyScroll from "../../hook/userBodyscroll";

function WelcomePopup() {
  const [show, setShow] = useState(() => {
    return localStorage.getItem("welcome_popup_seen") !== "true";
  });
  const [showTab, setShowTab] = useState(false);
  const [createReport, { isLoading }] = useCreateReportMutation();
  const [report, setReport] = useState({
    comment: "",
    reason: "",
  });

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    createReport(report)
      .unwrap()
      .then((res) => {
        toast.success(res.message);
        localStorage.setItem("welcome_popup_seen", "true");
        setShow(false);
      })
      .catch((error) => {
        const err = error as FetchBaseQueryError;
        const errorMessage = (err.data as { message: string }).message;
        toast.error(errorMessage);
      });
  };

  const handleClose = () => {
    localStorage.setItem("welcome_popup_seen", "true");
    setShow(false);
  };

  useBodyScroll(show);

  if (!show) return null;
  return (
    <div className="inset-0 bg-[#00000053] flex fixed left-0 justify-center items-center w-full min-h-screen z-50 overflow-auto">
      <div className="relative flex flex-col gap-3 w-11/12 md:w-8/12 lg:w-6/12 2xl:w-3/12 m-auto justify-center p-10 rounded-lg shadow-sm bg-[#ffffff] border border-gray-300 zoom-animation">
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black cursor-pointer"
        >
          <i className="fa-regular fa-circle-xmark text-2xl text-red-400"></i>
        </button>
        <h2 className="text-black text-2xl font-medium text-center">
          Every Day Is a New Beginning 🌱
        </h2>
        <p className="text-gray-500 font-normal text-sm text-center">
          We've just planted the seed of something big. As My Brand Life
          continues to grow and get pruned into shape, you may spot a few rough
          edges. Your feedback helps us grow stronger. click below to share
          comments and bugs.
        </p>
        {!showTab && (
          <button
            onClick={() => setShowTab(true)}
            className="bg-[#cbf38b] cursor-pointer w-full active:scale-105 duration-200 py-2 rounded-md text-black text-md font-normal"
          >
            Submit feedback & bugs
          </button>
        )}
        {showTab && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="text"
              onChange={(e) =>
                setReport((prev) => ({ ...prev, comment: e.target.value }))
              }
              placeholder="Add your bugs or report"
              className="text-md outline-gray-300 font-normal text-md outline-1 focus:outline-[#96c94b] bg-gray-100 rounded-lg p-3"
            />
            <SelectComponent
              value={report.reason}
              label="Select reason"
              handleChange={(value) =>
                setReport((prev) => ({ ...prev, reason: value }))
              }
              datas={[{ key: "Geting Error", value: "Getting Error" }]}
              color="#F3F3F3"
            />
            <button
              type="submit"
              className="bg-[#cbf38b] cursor-pointer w-full active:scale-105 duration-200 py-2 rounded-md text-black text-md font-normal"
            >
              {isLoading ? (
                <i className="fa-solid fa-circle-notch animate-spin"></i>
              ) : (
                "Submit"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default WelcomePopup;
