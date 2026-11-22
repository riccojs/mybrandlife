import { AlertTriangle, MessageSquareWarning } from "lucide-react";
import Logo from "../../assets/canva-cercle-shape.png";
import useBodyScroll from "../../hook/userBodyscroll";
import { useNavigate } from "react-router";
import { useState } from "react";

export default function WelcomePopup() {
  const [open, setOpen] = useState(false);
  useBodyScroll(open);
  const navigate = useNavigate();

  const existPopup = localStorage.getItem("welcome_popup");

  const hanldeNavigate = () => {
    localStorage.setItem("welcome_popup", "active");
    navigate("/build-your-lander");
  };

  const handleClose = () => {
    setOpen(false);
    localStorage.setItem("welcome_popup", "active");
    navigate("/");
  };

  if (existPopup) return null;

  return (
    <div className="inset-0 bg-[#00000039] flex fixed left-0 justify-center items-center w-full h-auto min-h-screen z-50 overflow-auto">
      <div
        className={`relative flex flex-col w-11/12 2xl:w-3/12 xl:w-6/12 m-auto justify-center p-4 rounded-xl shadow-sm bg-[#ffffff] border border-gray-300 ${
          open ? "zoom-animation" : ""
        }`}
      >
        <img src={Logo} alt="" className="absolute top-0 right-0 opacity-15" />
        <div className="px-5 md:px-8 pt-10 pb-8 text-center">
          <div className="relative mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-3xl border border-yellow-200 bg-linear-to-b from-yellow-100 to-yellow-50 shadow-lg">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-400 shadow-md">
              <MessageSquareWarning className="h-7 w-7 text-white" />
            </div>
            <div className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-white shadow">
              <AlertTriangle className="h-4 w-4 text-yellow-400" />
            </div>
          </div>
          <h2 className="text-xl md:text-2xl font-medium leading-tight text-slate-900">
            Build Your Lander Now!
          </h2>
          <p className="mt-2 text-sm md:text-md leading-6 text-slate-500">
            Your page will not be live until you build your brand on the My
            Brand Life dashboard and your onboarding is complete. Click here to
            Onboard.
          </p>

          <div className="mt-10 flex gap-3 md:gap-4">
            <button
              onClick={handleClose}
              className="flex-1 cursor-pointer rounded-xl border border-slate-200 bg-slate-100 py-2 md:py-3.5 font-medium text-slate-700 transition active:bg-slate-200"
            >
              Close
            </button>

            <button
              onClick={hanldeNavigate}
              className="flex-1 cursor-pointer rounded-xl bg-yellow-500 py-2 md:py-3.5 font-semibold text-white shadow-lg shadow-yellow-500/30 transition hover:bg-yellow-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Onboard Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
