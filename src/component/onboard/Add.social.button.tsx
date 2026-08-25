import { useEffect, useRef, useState } from "react";
import { LoaderCircle } from "lucide-react";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import toast from "react-hot-toast";
import { useParams } from "react-router";
import useBodyScroll from "../../hook/userBodyscroll";
import { useAuth } from "../../hook/useAuth";
import { useCreateSocialsMutation } from "../../redux/features/onboard/onboardApi";

interface SocialButton {
  id?: string;
  name: string;
  url?: string;
  templateId?: string;
  create_at?: string;
  update_at?: string;
}

interface TypesForm {
  isShowButton: boolean;
  setIsShowButton: React.Dispatch<React.SetStateAction<boolean>>;
  buttons?: SocialButton[] | string[] | Record<string, string>;
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
  "DRIBBBLE",
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

function AddSocialButton({
  isShowButton,
  setIsShowButton,
  buttons,
}: TypesForm) {
  useBodyScroll(isShowButton);
  const { user } = useAuth();
  const params = useParams();
  const id = params.id;
  const [showSocial, setShowSocial] = useState(false);
  const packedType = user?.package;
  const [search, setSearch] = useState("");
  const tabRef = useRef<HTMLDivElement>(null);
  const [createSocials, { isLoading }] = useCreateSocialsMutation();
  // Extract array of platform names already created in parent
  const existingPlatforms = Array.isArray(buttons)
    ? buttons.map((item) => (typeof item === "string" ? item : item?.name))
    : buttons && typeof buttons === "object"
      ? Object.keys(buttons)
      : [];

  // Initialize selected links from incoming props
  const [onboard, setOnboard] = useState<{
    socialLinks: Record<string, string>;
  }>({
    socialLinks: {},
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tabRef.current && !tabRef.current.contains(event.target as Node)) {
        setShowSocial(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedKeys = Object.keys(onboard.socialLinks || {});

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createSocials({ id, onboard })
      .unwrap()
      .then((res) => {
        toast.success(res.message);
        setIsShowButton(false);
      })
      .catch((error) => {
        const err = error as FetchBaseQueryError;
        const errorMessage = (err.data as { message: string }).message;
        toast.error(errorMessage);
      });
  };

  return (
    <div className="inset-0 bg-[#00000039] flex fixed left-0 justify-center items-center w-full min-h-screen z-50 overflow-auto">
      <div
        className={`relative flex flex-col w-11/12 overflow-hidden 2xl:w-4/12 xl:w-6/12 m-auto justify-center rounded-3xl shadow-sm bg-[#ffffff] border border-gray-300 ${
          isShowButton ? "zoom-animation" : ""
        }`}
      >
        <div className="p-8 custom-scroll max-h-[90vh] overflow-auto min-h-[50vh] flex flex-col h-full justify-between">
          <div>
            <div className="mb-5 flex items-start justify-between border-b border-gray-200 pb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Social Platforms
                </h2>
                <p className="text-sm text-gray-500">
                  Select a social platform and enter its URL or contact info.
                </p>
              </div>
            </div>
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
                      <p>
                        {selectedKeys.length > 0
                          ? `${selectedKeys.length} Selected`
                          : "Choose Platforms"}
                      </p>
                    </span>
                    {showSocial ? (
                      <i className="fa-solid fa-angle-up"></i>
                    ) : (
                      <i className="fa-solid fa-angle-down"></i>
                    )}
                  </div>

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
                        placeholder="Search your platform..."
                      />
                    </div>
                    <ul className="flex flex-col w-full max-h-52 h-auto z-50 custom-scroll overflow-y-scroll">
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
                          const isPackageDisabled =
                            !isAlways && packedType !== "gold";
                          const isAlreadyAdded =
                            existingPlatforms.includes(item);
                          const isDisabled =
                            isPackageDisabled || isAlreadyAdded;
                          const isSelected = selectedKeys.includes(item);

                          return (
                            <li
                              key={index}
                              className={`flex gap-2 p-3 hover:bg-gray-100 items-center border-b border-gray-200 ${
                                isSelected ? "bg-[#F3F3F3]" : "bg-white"
                              }`}
                            >
                              <input
                                type="checkbox"
                                id={item}
                                checked={isSelected || isAlreadyAdded}
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
                                {isAlreadyAdded && (
                                  <span className="ml-1 text-xs text-amber-600 font-normal">
                                    (Already added)
                                  </span>
                                )}
                                {!isAlreadyAdded && isPackageDisabled && (
                                  <span className="ml-1 text-xs text-red-500 font-normal">
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
          </div>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-5 my-5">
              {selectedKeys
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
                        placeholder={`Enter your ${name} address`}
                        className="bg-[#F3F3F3] border border-gray-300 focus:outline focus:outline-[#96c94b] focus:border py-3 px-3 w-full rounded-xl text-normal"
                      />
                    ) : name === "PHONE" || name === "WHATSAPP" ? (
                      <input
                        type="number"
                        value={onboard.socialLinks?.[name] || ""}
                        onChange={(e) => handleChange(e, name)}
                        required
                        placeholder={`Enter your ${name} number`}
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
            <div className="flex gap-3 items-center justify-end border-t border-gray-200 pt-5">
              <button
                type="button"
                onClick={() => setIsShowButton(false)}
                className="bg-slate-200 text-[#000000] flex justify-center items-center gap-1 w-fit border border-gray-200 px-10 py-3 rounded-2xl cursor-pointer"
              >
                Close
              </button>
              <button
                disabled={isLoading}
                type="submit"
                className="bg-[#BDF188] text-[#000000] flex justify-center items-center gap-1 w-fit border border-[#76c725] px-10 py-3 rounded-2xl cursor-pointer"
              >
                {isLoading ? <LoaderCircle className="animate-spin" /> : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddSocialButton;
