import { useState, type SetStateAction } from "react";
import { ChevronDown } from "lucide-react";
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
    <div className="mt-10">
      <p className="bg-amber-50 text-sm p-3 rounded-lg border-l-3 border-amber-200">
        One BLACK wristband comes with the gold package; purchase more now by
        clicking Expand or later from your portal or at YourWorldLife.store.
        Shipping included.
      </p>
      <button
        onClick={() => setOpen((prev) => !prev)}
        type="button"
        className="flex w-full mt-5 cursor-pointer items-center justify-between text-xl font-normal text-black"
      >
        <h2 className="font-medium text-black text-md">
          Order Additional Wristband Colors
        </h2>
        <ChevronDown
          className={`h-5 w-5 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
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
              <p className="bg-white shadow py-2 px-4 text-md rounded-lg border border-gray-200">
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
