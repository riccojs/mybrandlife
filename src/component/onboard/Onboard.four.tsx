import { useState, type SetStateAction } from "react";
import WristbandCollaps from "./Wristband.collaps";
import { motion, AnimatePresence } from "framer-motion";
import type { OnboardTypes } from "../../utils/user.types";

interface DataTypes {
  onboard: OnboardTypes;
  setOnboard: React.Dispatch<SetStateAction<OnboardTypes>>;
}

function OnboardFour({ onboard, setOnboard }: DataTypes) {
  const [open, setOpen] = useState(false);
  const {
    referalCode,
    bio,
    tagLine,
    offerings,
    socialLinks,
    headerImage,
    logoImage,
    bodyImage,
    epkFile,
    services,
    merchendiseUrl,
    vfrCreate,
    customPlatform,
  } = onboard || {};
  return (
    <div className="w-full">
      <div className="flex flex-col gap-1">
        <p className="text-2xl font-medium text-black mt-5">
          Step 4: Your selected values
        </p>
        <p className="text-xl font-normal text-black mt-2">
          Please check carefully before submission
        </p>
        <span
          onClick={() => setOpen(!open)}
          className="bg-[#96c94b] text-black px-5 py-2 rounded-lg w-fit cursor-pointer"
        >
          {open ? "Collaps" : "Review"}
        </span>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden mt-5"
          >
            <div className="rounded-md shadow overflow-hidden my-5">
              <table className="table-auto border-collapse w-full oboardTable">
                <thead>
                  <tr className="border border-gray-300">
                    <td className="text-left p-3 font-medium w-72">Key</td>
                    <td className="text-left p-3">Value</td>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border border-gray-300">
                    <td className="text-left p-3 font-medium">Header Image</td>
                    <td className="text-left p-3">
                      {headerImage?.name ? headerImage?.name : "not-available"}
                    </td>
                  </tr>
                  <tr className="border border-gray-300">
                    <td className="text-left p-3 font-medium">
                      Logo or Portrait
                    </td>
                    <td className="text-left p-3">
                      {logoImage?.name ? logoImage?.name : "not-available"}
                    </td>
                  </tr>

                  <tr className="border border-gray-300">
                    <td className="text-left p-3 font-medium">Body Image</td>
                    <td className="text-left p-3">
                      {bodyImage?.name ? bodyImage?.name : "not-available"}
                    </td>
                  </tr>
                  <tr className="border border-gray-300">
                    <td className="text-left p-3 font-medium">
                      EPK.zip File Upload
                    </td>
                    <td className="text-left p-3">
                      {epkFile?.name ? epkFile?.name : "not-available"}
                    </td>
                  </tr>
                  <tr className="border border-gray-300">
                    <td className="text-left p-3 font-medium">
                      Your affiliate code
                    </td>
                    <td className="text-left p-3">{referalCode}</td>
                  </tr>
                  <tr className="border border-gray-300">
                    <td className="text-left p-3 font-medium">Short Bio</td>
                    <td className="text-left p-3">{bio}</td>
                  </tr>
                  <tr className="border border-gray-300">
                    <td className="text-left p-3 font-medium">
                      Tag Line / Mission
                    </td>
                    <td className="text-left p-3">{tagLine}</td>
                  </tr>
                  <tr className="border border-gray-300">
                    <td className="text-left p-3 font-medium">Offerings</td>
                    <td className="text-left p-3">
                      {offerings ? offerings : "not-available"}
                    </td>
                  </tr>
                  <tr className="border border-gray-300">
                    <td className="text-left p-3 font-medium">
                      Business / Areas Services
                    </td>
                    <td className="text-left p-3">
                      <ul>
                        {services?.length > 0
                          ? services?.map((item, index) => (
                              <p className="" key={index}>
                                {item}
                              </p>
                            ))
                          : "not-available"}
                      </ul>
                    </td>
                  </tr>
                  <tr className="border border-gray-300">
                    <td className="text-left p-3 font-medium">
                      Custom Platform
                    </td>
                    <td className="text-left p-3">
                      <ul>
                        {customPlatform?.length > 0
                          ? customPlatform?.map((item, index) => (
                              <div key={index} className="flex gap-2">
                                <p>{item.name}:</p>
                                <p className="">{item.url}</p>
                              </div>
                            ))
                          : "not-available"}
                      </ul>
                    </td>
                  </tr>

                  <tr className="border border-gray-300">
                    <td className="text-left p-3 font-medium">
                      Merchandise URL
                    </td>
                    <td className="text-left p-3">
                      {merchendiseUrl ? merchendiseUrl : "not-available"}
                    </td>
                  </tr>
                  <tr className="border border-gray-300">
                    <td className="text-left p-3 font-medium">
                      VFC File Create
                    </td>
                    <td className="text-left p-3">
                      {vfrCreate ? vfrCreate : "not-available"}
                    </td>
                  </tr>
                  <tr className="border border-gray-300">
                    <td className="text-left p-3 font-medium">
                      Selected Wristbands
                    </td>
                    <td className="text-left p-3">
                      {onboard.wristbands?.length > 0
                        ? onboard.wristbands
                            ?.map(
                              (item) =>
                                `${item.title} - ${item.quantity} ($${item.subTotal})`,
                            )
                            .join(", ")
                        : "N/A"}
                    </td>
                  </tr>

                  {Object.entries(socialLinks).map(([key, value]) => (
                    <tr key={key} className="border border-gray-300">
                      <td className="text-left p-3 font-medium">
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </td>
                      <td className="text-left p-3">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <WristbandCollaps setOnboard={setOnboard} onboard={onboard} />
    </div>
  );
}

export default OnboardFour;
