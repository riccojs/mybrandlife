import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface UserType {
  user: {
    package?: string;
    landerName: string;
    id: string;
    domain: string;
    firstName: string;
    lastName: string;
  } | null;
}

function PersonalCollaps({ user }: UserType) {
  const [open, setOpen] = useState(true);
  return (
    <div className="mt-5">
      <button
        onClick={() => setOpen((prev) => !prev)}
        type="button"
        className="flex w-full cursor-pointer items-center justify-between text-xl font-normal text-black"
      >
        <span className="font-medium">Personal Public Data</span>
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
            className="overflow-hidden mt-2"
          >
            <div className="rounded-md overflow-hidden bg-gray-50">
              <table className="table-auto border-collapse w-full oboardTable">
                <tbody>
                  <tr className="border border-gray-300">
                    <td className="p-3 font-medium">Selected Domain</td>
                    <td className="p-3">{user?.domain}</td>
                  </tr>
                  <tr className="border border-gray-300">
                    <td className="p-3 font-medium">First Name</td>
                    <td className="p-3">{user?.firstName}</td>
                  </tr>
                  <tr className="border border-gray-300">
                    <td className="p-3 font-medium">Last Name</td>
                    <td className="p-3">{user?.lastName}</td>
                  </tr>
                  <tr className="border border-gray-300">
                    <td className="p-3 font-medium">Lander Name</td>
                    <td className="p-3">{user?.landerName}</td>
                  </tr>
                  <tr className="border border-gray-300">
                    <td className="p-3 font-medium">Publlic URL</td>
                    <td className="p-3">{`https://${user?.domain}/${user?.landerName}`}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default PersonalCollaps;
