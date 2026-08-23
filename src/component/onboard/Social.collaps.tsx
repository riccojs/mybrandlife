import { useState, type RefObject, type SetStateAction } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { OnboardTypes } from "../../utils/user.types";

interface UserType {
  user: {
    package?: string;
    landerName: string;
    id: string;
    domain: string;
    firstName: string;
    lastName: string;
  } | null;
  setShowSocial: React.Dispatch<SetStateAction<boolean>>;
  showSocial: boolean;
  setOnboard: React.Dispatch<SetStateAction<OnboardTypes>>;
  tabRef: RefObject<HTMLDivElement | null>;
  onboard: OnboardTypes;
}

const allUrls = [
  "FACEBOOK",
  "TWITTER",
  "LINKEDIN",
  "YOUTUBE",
  "TIKTOK",
  "INSTAGRAM",
  "SNAPCHAT",
  "REDDIT",
  "TUMBLR",
  "PINTEREST",
  "TELEGRAM",
  "EMAIL",
  "WECHAT",
  "PHONE",
  "WHATSAPP",
  "DISCORD",
  "TWITCH",
  "GITHUB",
  "SOUNDCLOUD",
  "VIMEO",
  "SPOTIFY",
  "CLUBHOUSE",
  "PERISCOPE",
  "DRIBBLE",
  "BEHANCE",
  "DAILYMOTION",
  "MIXCLOUD",
  "FLICKR",
  "ANCHOR",
  "PATREON",
  "NEXTDOOR",
];

const alwaysAvailable = [
  "FACEBOOK",
  "TWITTER",
  "LINKEDIN",
  "YOUTUBE",
  "TIKTOK",
  "INSTAGRAM",
];

function SocialCollaps({
  user,
  setShowSocial,
  setOnboard,
  showSocial,
  tabRef,
  onboard,
}: UserType) {
  const [open, setOpen] = useState(true);
  const packedType = user?.package;
  const urls = Object.keys(onboard.socialLinks || {});
  const [search, setSearch] = useState("");

  const toggleUrl = (platform: string) => {
    setOnboard((prev) => {
      const links = { ...(prev.socialLinks || {}) };
      if (platform in links) {
        delete links[platform];
      } else {
        links[platform] = "";
      }
      return {
        ...prev,
        socialLinks: links,
      };
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    name: string,
  ) => {
    const value = e.target.value;
    setOnboard((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [name]: value,
      },
    }));
  };

  const validateValue = (platform: string, value: string | undefined) => {
    if (!value || value.trim() === "") return false;
    if (platform === "EMAIL") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value);
    }
    if (platform === "PHONE" || platform === "WHATSAPP") {
      return /^[0-9]+$/.test(value);
    }
    const url = new URL(value);
    if (url) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <div className="mt-5">
      <button
        onClick={() => {
          const hasInvalid = urls.some((platform) => {
            const value = onboard.socialLinks?.[platform];
            return !validateValue(platform, value);
          });
          if (hasInvalid) {
            return;
          }
          setOpen((prev) => !prev);
        }}
        type="button"
        className="flex w-full cursor-pointer items-center justify-between text-xl font-normal text-black"
      >
        <span className="font-medium">Social Platforms</span>
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
            className="mt-2"
          >
            <div className="flex flex-col gap-5 mt-2">
              <div className="flex flex-col gap-1 w-full">
                <label className="text-md font-medium text-gray-400">
                  Choose Available Platforms:
                </label>
                <div className="relative w-full" ref={tabRef}>
                  <div
                    tabIndex={0}
                    onClick={() => setShowSocial(!showSocial)}
                    className="bg-[#F3F3F3] border border-gray-300 cursor-pointer focus-within:border-[#96c94b] focus-within:border py-3 flex gap-2 items-center justify-between px-3 w-full text-center rounded-xl text-normal"
                  >
                    <span className="flex gap-2 items-center">
                      <i className="fa-solid fa-share-nodes text-xl"></i>
                      <p>Choose Platforms</p>
                    </span>
                    {showSocial ? (
                      <i className="fa-solid fa-angle-up"></i>
                    ) : (
                      <i className="fa-solid fa-angle-down"></i>
                    )}
                  </div>
                  <p className="text-normal bg-amber-100 p-3 rounded-lg text-sm mt-2">
                    Please add your social media URLs and contact info now. You
                    can always update this on your dashboard later.
                  </p>
                  <div
                    className={`absolute bg-white rounded-md shadow-md border border-gray-100 w-full top-13 left-0 transition-all duration-200 ease-in-out transform z-50 ${
                      showSocial
                        ? "opacity-100 scale-100 translate-y-0"
                        : "opacity-0 scale-90 -translate-y-4 pointer-events-none"
                    }`}
                  >
                    <div className="p-2">
                      <input
                        type="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="p-3 border border-gray-300 text-sm font-normal w-full rounded-xl"
                        placeholder="Seach your platform..."
                      />
                    </div>
                    <ul className="flex flex-col w-full h-75 z-50 custom-scroll overflow-y-scroll">
                      {allUrls
                        .sort((a, b) =>
                          a.localeCompare(b, undefined, {
                            sensitivity: "base",
                          }),
                        )
                        .filter((item) => {
                          if (!search) return true;

                          return item
                            .toLowerCase()
                            .includes(search.toLowerCase());
                        })
                        .map((item, index) => {
                          const isAlways = alwaysAvailable.includes(item);
                          const isDisabled = !isAlways && packedType !== "gold";
                          return (
                            <li
                              key={index}
                              className={`flex gap-2 p-3 hover:bg-[#F3F3F3] items-center border-b border-gray-300 ${
                                urls.includes(item) ? "bg-[#F3F3F3]" : ""
                              }`}
                            >
                              <input
                                type="checkbox"
                                id={item}
                                checked={urls.includes(item)}
                                onChange={() => toggleUrl(item)}
                                disabled={isDisabled}
                              />
                              <label
                                htmlFor={item}
                                className={`text-md font-medium cursor-pointer ${
                                  isDisabled
                                    ? "text-gray-400 cursor-not-allowed"
                                    : "text-black"
                                }`}
                              >
                                {item}
                                {isDisabled && (
                                  <span className="text-xs text-red-500">
                                    (Gold only)
                                  </span>
                                )}
                              </label>
                            </li>
                          );
                        })}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-5 my-5">
              {urls
                .sort((a, b) =>
                  a.localeCompare(b, undefined, {
                    sensitivity: "base",
                  }),
                )
                .map((name, idx) => (
                  <div key={idx} className="flex flex-col gap-1 w-full">
                    <label className="text-lg font-medium text-black">
                      {name}:
                    </label>
                    {name === "EMAIL" ? (
                      <input
                        type="email"
                        value={onboard.socialLinks?.[name] || ""}
                        onChange={(e) => handleChange(e, name)}
                        required
                        placeholder={`Enter your ${name} link`}
                        className="bg-[#F3F3F3] border border-gray-300 focus:outline focus:outline-[#96c94b] focus:border py-3 px-3 w-full rounded-xl text-normal"
                      />
                    ) : name === "PHONE" || name === "WHATSAPP" ? (
                      <input
                        type="number"
                        value={onboard.socialLinks?.[name] || ""}
                        onChange={(e) => handleChange(e, name)}
                        required
                        placeholder={`Enter your ${name} link`}
                        className="bg-[#F3F3F3] border border-gray-300 focus:outline focus:outline-[#96c94b] focus:border py-3 px-3 w-full rounded-xl text-normal"
                      />
                    ) : (
                      <input
                        type="url"
                        value={onboard.socialLinks?.[name] || ""}
                        onChange={(e) => handleChange(e, name)}
                        required
                        placeholder={`Enter your ${name} link`}
                        className="bg-[#F3F3F3] border border-gray-300 focus:outline focus:outline-[#96c94b] focus:border py-3 px-3 w-full rounded-xl text-normal"
                      />
                    )}
                  </div>
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SocialCollaps;
