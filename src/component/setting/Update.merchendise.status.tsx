import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { ArrowRight, CheckCircle } from "lucide-react";
import { CiImageOn } from "react-icons/ci";
import { useAuth } from "../../hook/useAuth";
import { useToggleMerchendiseStatusMutation } from "../../redux/features/onboard/onboardApi";
import WarningPopup from "../popups/Warning.popup";

interface UserType {
  merchendise: boolean;
  profile: File | null | string;
}

function UpdateMerchendiseStatus() {
  const logoRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [open, setOpen] = useState(false);
  const { user: userData } = useAuth() as {
    user: {
      userTemplete: { merchendiseStatus: boolean; merchendiseLogo: string }[];
      id: string;
    } | null;
  };
  const [user, setUser] = useState<UserType>({
    merchendise: false,
    profile: null,
  });
  const [toggleMerchendiseStatus, { isLoading }] =
    useToggleMerchendiseStatusMutation();

  useEffect(() => {
    if (userData) {
      setUser((prev) => ({
        ...prev,
        merchendise: userData?.userTemplete?.[0]?.merchendiseStatus,
        profile: userData?.userTemplete?.[0]?.merchendiseLogo,
      }));
    }
  }, [userData]);

  const { merchendise, profile } = user || {};

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("merchendise", merchendise ? "active" : "expired");
    if (profile && profile instanceof File) {
      formData.append("profile", profile);
    }
    toggleMerchendiseStatus({ id: userData?.id, formData })
      .unwrap()
      .then((res) => {
        toast.success(res.message);
        setOpen(false);
      })
      .catch((error) => {
        const err = error as FetchBaseQueryError;
        const errorMessage = (err.data as { message: string }).message;
        toast.error(errorMessage);
      });
  };

  const maxFileSize = 2 * 1024 * 1024;

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

    setUser((prev) => ({
      ...prev,
      profile: file,
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
    <div className="bg-white border border-gray-200 p-10 rounded-xl">
      <div className="flex flex-col gap-5 justify-start">
        <p className="text-gray-700 text-medium text-xl">
          Disable Your Merchandise URL from Your Lander
        </p>
        <p className="bg-amber-50 text-black p-3 rounded-lg text-md font-normal w-full sm:w-8/12 lg:w-6/12 border-l-4 border-amber-300">
          Disabling your merchandise URL will remove your products from public
          view on your lander. Visitors will no longer be able to browse,
          search, or purchase your merchandise. Make sure you understand the
          impact before proceeding.
        </p>
        <div className="flex gap-5 items-center">
          <p className="text-md text-black font-normal">
            Check to show or hide
          </p>

          <div className="flex justify-center items-center">
            <label className="switch">
              <input
                type="checkbox"
                onChange={(e) =>
                  setUser((prev) => ({
                    ...prev,
                    merchendise: e.target.checked,
                  }))
                }
                checked={user?.merchendise}
              />
              <span className="slider round"></span>
            </label>
          </div>
        </div>
        <div className="flex flex-col gap-1 md:w-6/12 w-full">
          <label className="text-md font-normal text-black">
            Merchandise Logo
          </label>
          <div className="flex flex-col gap-1 col-span-2">
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

            {user.profile && (
              <div className="bg-[#F5F9FC] flex justify-between items-center p-4 mt-5 rounded-md">
                <p className="truncate">
                  {typeof user.profile === "string"
                    ? user.profile.split("/").pop()
                    : user.profile.name}
                </p>

                <span className="w-12 h-12 flex items-center justify-center rounded-full bg-green-100">
                  <CheckCircle className="text-green-600" />
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
            <p>• For print products only (T-shirts, sweatshirts, hats, etc.)</p>
            <p className="text-red-500">
              • Do not upload blurry images, screenshots, or low-quality web
              graphics
            </p>
            <p className="text-red-500">• Embroidery files are not accepted</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setOpen(true);
          }}
          className="bg-[#BDF188] text-[#000000] flex justify-center items-center gap-1 w-fit border border-[#76c725] px-10 py-4 rounded-2xl cursor-pointer"
        >
          <p>Save</p>
          <ArrowRight />
        </button>
      </div>
      <WarningPopup
        open={open}
        title="Do you want update Merchandise Settings?"
        description="Disabling your merchandise URL will remove your products from public view on your lander. Visitors will no longer be able to browse, search, or purchase your merchandise. Make sure you understand the impact before proceeding."
        smButton="Update"
        clButton="Close"
        onClose={() => setOpen(false)}
        onConfirm={handleSubmit}
        loading={isLoading}
      />
    </div>
  );
}

export default UpdateMerchendiseStatus;
