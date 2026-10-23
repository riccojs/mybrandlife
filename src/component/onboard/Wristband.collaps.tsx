import { useState, type SetStateAction } from "react";
import { ChevronDown, CircleAlert } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { OnboardTypes } from "../../utils/user.types";
import Wristbands from "./Wristbands";

interface DataTypes {
  onboard: OnboardTypes;
  setOnboard: React.Dispatch<SetStateAction<OnboardTypes>>;
}

function WristbandCollaps({ setOnboard, onboard }: DataTypes) {
  const [open, setOpen] = useState(true);
  const getTotal = () =>
    onboard?.wristbands?.reduce((total, item) => total + item.subTotal, 0) ?? 0;

  return (
    <div className="mt-0 md:mt-10">
      <div className="bg-[#FEFBED] text-[#764B2E] text-xs px-4 py-2 rounded-lg mt-3 border border-[#F9EAA5] flex gap-2 items-center">
        <CircleAlert color="#C5731E" size={25} />
        <p>
          <span className="font-medium">NOTE:</span> One BLACK wristband comes
          with the gold package; purchase more now by clicking Expand or later
          from your portal or at YourWorldLife.store. Shipping included.
        </p>
      </div>
      <button
        onClick={() => setOpen((prev) => !prev)}
        type="button"
        className="flex w-full mt-5 cursor-pointer items-center justify-between"
      >
        <h2 className="font-medium text-black text-sm md:text-md">
          Order Additional Wristband Colors
        </h2>
        <div className="border border-gray-200 rounded-lg flex justify-center items-center bg-gray-50 w-10 min-w-10 h-10 transition-transform duration-300">
          <ChevronDown
            className={`transition-transform duration-200 ${
              open ? "rotate-180" : "rotate-0"
            }`}
            size={20}
          />
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden mt-5"
          >
            <div className="flex w-full justify-end items-center my-3">
              <p className="bg-white shadow py-2 px-4 text-sm md:text-md rounded-lg border border-gray-200">
                <i className="fa-brands fa-opencart"></i> Total: $
                {getTotal()?.toFixed(2)}
              </p>
            </div>
            <Wristbands setOnboard={setOnboard} onboard={onboard} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default WristbandCollaps;
