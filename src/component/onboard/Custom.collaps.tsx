import {
  useEffect,
  useRef,
  useState,
  type RefObject,
  type SetStateAction,
} from "react";
import { ChevronDown, CircleX } from "lucide-react";
import toast from "react-hot-toast";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { motion, AnimatePresence } from "framer-motion";
import AddCustomLink from "./Add.custom.link";
import { CiImageOn } from "react-icons/ci";
import type { OnboardTypes } from "../../utils/user.types";
import {
  useGetStripeConnectionQuery,
  useStripeConnectEchoMutation,
} from "../../redux/features/echo/echoApi";

interface UserType {
  user: {
    package?: string;
    landerName: string;
    id: string;
    domain: string;
    firstName: string;
    lastName: string;
  } | null;
  setOnboard: React.Dispatch<SetStateAction<OnboardTypes>>;
  onboard: OnboardTypes;
  setShowSocial: React.Dispatch<SetStateAction<boolean>>;
  setShowTab: React.Dispatch<SetStateAction<boolean>>;
  showSocial: boolean;
  tabRef: RefObject<HTMLDivElement | null>;
}

function CustomCollaps({
  user,
  setOnboard,
  onboard,
  setShowSocial,
  setShowTab,
  tabRef,
}: UserType) {
  const [open, setOpen] = useState(true);
  const [stripeConnectEcho, { isLoading }] = useStripeConnectEchoMutation();
  const { landerName, id } = user || {};
  const { data, isLoading: getLoad } = useGetStripeConnectionQuery(id);
  const logoRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const maxFileSize = 2 * 1024 * 1024;

  const handleConnect = () => {
    const echo = { id: user?.id };
    stripeConnectEcho(echo)
      .unwrap()
      .then((res) => {
        toast.success(res.message);
        window.open(res.url, "_blank", "noopener,noreferrer");
      })
      .catch((error) => {
        const err = error as FetchBaseQueryError;
        const errorMessage = (err.data as { message: string }).message;
        toast.error(errorMessage);
      });
  };

  const { merchendiseUrl, vfrCreate } = onboard || {};

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tabRef.current && !tabRef.current.contains(event.target as Node)) {
        setShowSocial(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setShowSocial, tabRef]);

  const processImages = (files: FileList | File[]) => {
    const file = Array.from(files)[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed.");
      return;
    }
    if (file.size > maxFileSize) {
      toast.error("Maximum file size is 2 MB.");
      return;
    }
    setOnboard((prev) => ({
      ...prev,
      merchendiselogo: file,
    }));
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files.length) {
      processImages(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      processImages(e.target.files);
    }
  };

  return (
    <div className="mt-5">
      <button
        onClick={() => setOpen((prev) => !prev)}
        type="button"
        className="flex w-full cursor-pointer items-center justify-between text-xl font-normal text-black"
      >
        <span className="font-medium">Custom Platforms</span>
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
            <div className="flex flex-col gap-1">
              <AddCustomLink onboard={onboard} setOnboard={setOnboard} />

              <div className="my-2">
                <div className="flex gap-2 w-full mb-2">
                  <input
                    onChange={(e) => {
                      setOnboard((prev) => ({
                        ...prev,
                        vfrCreate: e.target.checked ? "yes" : "no",
                      }));
                    }}
                    name="vfrCreate"
                    type="checkbox"
                    id="vfcFile"
                    checked={vfrCreate === "yes"}
                  />
                  <label
                    htmlFor="vfcFile"
                    className="text-md font-normal text-black cursor-pointer"
                  >
                    Do you want to build a VFC File?{" "}
                  </label>
                </div>
                <p className="bg-amber-100 text-sm text-black p-3 rounded-lg border-l-3 border-amber-400">
                  Allow customers to download your digital contact card from
                  your landing page. You can choose what information is included
                  in your VCF from your dashboard. Unchecking this will hide the
                  button from your page.
                </p>
              </div>
              <div>
                <div className="flex gap-2 w-full items-start">
                  <input
                    onChange={(e) => {
                      setOnboard((prev) => ({
                        ...prev,
                        merchendiseUrl: e.target.checked
                          ? `${
                              import.meta.env.VITE_APP_MERCHANDISE_URL
                            }/${landerName}`
                          : "",
                      }));
                    }}
                    disabled={user?.package !== "gold"}
                    name="vfrCreate"
                    type="checkbox"
                    id="merchendiseUrl"
                    checked={!!merchendiseUrl}
                    className="mt-1"
                  />
                  <label
                    htmlFor="merchendiseUrl"
                    className="text-md font-normal text-black cursor-pointer"
                  >
                    Do you want to create BrandGear URL? BrandGear is your
                    merchandise hosted on YourWorldLife.store.{" "}
                    {user?.package !== "gold" && (
                      <span className="text-xs text-red-500">(Gold only)</span>
                    )}
                  </label>
                </div>
                {merchendiseUrl && (
                  <p className="text-gray-400 text-sm font-normal">
                    Your Merchandise url: {merchendiseUrl}
                  </p>
                )}
              </div>
              <div>
                {merchendiseUrl && (
                  <p className="text-black text-sm bg-amber-100 p-3 border-l-3 border-amber-300 rounded-md">
                    Please set up a Stripe Express account, as it is required
                    for merchandise requests.{" "}
                    <span
                      className="text-red-400 cursor-pointer"
                      onClick={() => setShowTab(true)}
                    >
                      (Note)
                    </span>
                    {!data?.connected && !data?.ready && (
                      <span
                        onClick={getLoad ? () => {} : handleConnect}
                        className="font-bold hover:underline cursor-pointer ml-1"
                      >
                        {isLoading || getLoad ? (
                          <i className="fa-solid fa-circle-notch animate-spin"></i>
                        ) : (
                          "Connect Stripe"
                        )}
                      </span>
                    )}
                  </p>
                )}
              </div>
              {merchendiseUrl && (
                <div className="flex flex-col gap-1 w-full">
                  <label htmlFor="" className="text-md font-normal text-black">
                    Merchandise Logo
                  </label>
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="merLogoUpload"
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`relative flex flex-col items-center justify-center gap-1 border-2 border-dashed rounded-xl py-16 cursor-pointer transition ${
                        isDragging
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      <input
                        id="merLogoUpload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={logoRef}
                        onChange={handleFileChange}
                      />

                      <CiImageOn color="#0084F9" size={60} />

                      <h3 className="text-lg font-medium text-black">
                        Drag & Drop your image
                      </h3>

                      <p className="text-gray-500 text-sm">
                        PNG, JPG, JPEG • Max size 2 MB
                      </p>
                    </label>

                    {onboard?.merchendiselogo && (
                      <div className="bg-[#F5F9FC] mt-2 text-sm border border-gray-100 flex gap-3 justify-between items-center p-2 rounded-xl">
                        <p className="truncate">
                          {onboard?.merchendiselogo?.name}
                        </p>
                        <span
                          onClick={() =>
                            setOnboard((prev) => ({
                              ...prev,
                              merchendiselogo: null,
                            }))
                          }
                          className="w-8 h-8 min-w-8 cursor-pointer flex items-center justify-center rounded-full bg-red-100"
                        >
                          <CircleX className="text-red-600" size={15} />
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-gray-600 leading-5 mt-2 space-y-1">
                    <p>• Accepted formats: PNG, JPG, JPEG, SVG</p>
                    <p>• Preferred: Transparent PNG or SVG</p>
                    <p>• Maximum file size: 25MB</p>
                    <p>• Minimum width: 2000px</p>
                    <p>• Recommended width: 3000px+</p>
                    <p>• Best print size: 4500 × 4800px</p>
                    <p>• Resolution: 300 DPI preferred</p>
                    <p>• Color mode: RGB preferred</p>
                    <p>• Background: Transparent preferred</p>
                    <p>
                      • For print products only (T-shirts, sweatshirts, hats,
                      etc.)
                    </p>
                    <p className="text-red-500">
                      • Do not upload blurry images, screenshots, or low-quality
                      web graphics
                    </p>
                    <p className="text-red-500">
                      • Embroidery files are not accepted
                    </p>
                  </div>
                </div>
              )}

              <div></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CustomCollaps;
