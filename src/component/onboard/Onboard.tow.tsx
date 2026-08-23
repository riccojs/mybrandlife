import { useState, type SetStateAction } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router";
import { CiImageOn } from "react-icons/ci";
import { CircleX } from "lucide-react";
import type { OnboardTypes } from "../../utils/user.types";
import { useAuth } from "../../hook/useAuth";

interface DataTypes {
  onboard: OnboardTypes;
  setOnboard: React.Dispatch<SetStateAction<OnboardTypes>>;
  headerImageRef: React.RefObject<HTMLInputElement | null>;
  logoImageRef: React.RefObject<HTMLInputElement | null>;
  bodyImageRef: React.RefObject<HTMLInputElement | null>;
  epkFileRef: React.RefObject<HTMLInputElement | null>;
}

interface UserType {
  package?: string;
}

function OneboardTow({
  setOnboard,
  headerImageRef,
  logoImageRef,
  bodyImageRef,
  epkFileRef,
  onboard,
}: DataTypes) {
  const { user } = useAuth() as { user: UserType | null };

  const [draggingField, setDraggingField] = useState<keyof OnboardTypes | null>(
    null,
  );

  const packedType = user?.package;
  let disableBox;
  if (packedType === "bronze" || packedType === "silver") {
    disableBox = true;
  }

  const validateAndSaveFile = (file: File, field: keyof OnboardTypes) => {
    const isImage = ["headerImage", "logoImage", "bodyImage"].includes(field);
    if (isImage) {
      if (!file.type.startsWith("image/")) {
        toast.error("Only image files are allowed.");
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image must be less than 2MB.");
        return;
      }
    }
    if (field === "epkFile") {
      const isZip =
        file.type === "application/zip" ||
        file.type === "application/x-zip-compressed" ||
        file.name.toLowerCase().endsWith(".zip");

      const isPdf =
        file.type === "application/pdf" ||
        file.name.toLowerCase().endsWith(".pdf");

      if (!isZip && !isPdf) {
        toast.error("Only ZIP or PDF files are allowed.");
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        toast.error("File must be less than 10MB.");
        return;
      }
    }
    setOnboard((prev) => ({
      ...prev,
      [field]: file,
    }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof OnboardTypes,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    validateAndSaveFile(file, field);
  };

  const handleDragOver = (
    e: React.DragEvent<HTMLLabelElement>,
    field: keyof OnboardTypes,
  ) => {
    e.preventDefault();
    setDraggingField(field);
  };

  const handleDragLeave = () => {
    setDraggingField(null);
  };

  const handleDrop = (
    e: React.DragEvent<HTMLLabelElement>,
    field: keyof OnboardTypes,
  ) => {
    e.preventDefault();
    setDraggingField(null);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    validateAndSaveFile(file, field);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col gap-5">
        <p className="text-2xl font-medium text-black mt-5">
          Step 2: Media & Files
        </p>
      </div>

      {!onboard?.logoImage && (
        <p className="mt-5 text-black text-sm bg-amber-100 p-3 border-l-3 border-amber-300 rounded-md">
          If you do not select your logo, the first letter of your lander will
          be your logo.
        </p>
      )}
      {disableBox && (
        <p className="mt-2 text-black text-sm bg-amber-100 p-3 border-l-3 border-amber-300 rounded-md">
          Banner, Background and Epk File feature: Available only for Gold
          package users.{" "}
          <Link to="/subscription" className="font-bold hover:underline">
            Want to update your membership?
          </Link>
        </p>
      )}
      <div className="flex flex-col gap-5 mt-5">
        <div className="flex flex-col gap-1 w-full">
          <label htmlFor="" className="text-lg font-medium text-black">
            Header Image <span className="text-xs">(Optional)</span>
          </label>
          <label
            htmlFor="headerImageUpload"
            onDragOver={(e) => handleDragOver(e, "headerImage")}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, "headerImage")}
            className={`relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed py-8 transition cursor-pointer
                      ${
                        draggingField === "headerImage"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300 bg-white"
                      }`}
          >
            <input
              id="headerImageUpload"
              type="file"
              hidden
              ref={headerImageRef}
              accept="image/*"
              onChange={(e) => handleFileChange(e, "headerImage")}
            />
            <CiImageOn size={60} color="#0084F9" />
            <h3 className="text-md font-medium">Drag & Drop your logo</h3>
            <p className="text-xs text-gray-500">PNG, JPG, JPEG • Max 2MB</p>
            <p className="text-gray-500 text-xs font-normal">
              Recommended header image size 1920PX x 400PX
            </p>
          </label>
          {onboard?.headerImage && (
            <div className="bg-[#F5F9FC] mt-2 text-sm border border-gray-100 flex gap-3 justify-between items-center p-2 rounded-xl">
              <p className="truncate">{onboard?.headerImage?.name}</p>
              <span
                onClick={() =>
                  setOnboard((prev) => ({
                    ...prev,
                    headerImage: null,
                  }))
                }
                className="w-8 h-8 min-w-8 cursor-pointer flex items-center justify-center rounded-full bg-red-100"
              >
                <CircleX className="text-red-600" size={15} />
              </span>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-1 w-full">
          <label htmlFor="" className="text-lg font-medium text-black">
            Logo or Portrait <span className="text-xs">(Optional)</span>
          </label>
          <label
            htmlFor="logoUpload"
            onDragOver={(e) => handleDragOver(e, "logoImage")}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, "logoImage")}
            className={`relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed py-8 transition cursor-pointer
                      ${
                        draggingField === "logoImage"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300 bg-white"
                      }`}
          >
            <input
              id="logoUpload"
              type="file"
              hidden
              ref={logoImageRef}
              accept="image/*"
              onChange={(e) => handleFileChange(e, "logoImage")}
            />
            <CiImageOn size={60} color="#0084F9" />
            <h3 className="text-md font-medium">Drag & Drop your logo</h3>
            <p className="text-xs text-gray-500">PNG, JPG, JPEG • Max 2MB</p>
            <p className="text-gray-500 text-xs font-normal">
              Recommended logo image size 300PX x 300PX
            </p>
          </label>
          {onboard?.logoImage && (
            <div className="bg-[#F5F9FC] mt-2 text-sm border border-gray-100 flex gap-3 justify-between items-center p-2 rounded-xl">
              <p className="truncate">{onboard?.logoImage?.name}</p>
              <span
                onClick={() =>
                  setOnboard((prev) => ({
                    ...prev,
                    logoImage: null,
                  }))
                }
                className="w-8 h-8 min-w-8 cursor-pointer flex items-center justify-center rounded-full bg-red-100"
              >
                <CircleX className="text-red-600" size={15} />
              </span>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-1 w-full">
          <label htmlFor="" className="text-lg font-medium text-black">
            Body Image <span className="text-xs">(Optional)</span>
          </label>
          <label
            htmlFor="bodyImageUpload"
            onDragOver={(e) => handleDragOver(e, "bodyImage")}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, "bodyImage")}
            className={`relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed py-8 transition cursor-pointer
                      ${
                        draggingField === "bodyImage"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300 bg-white"
                      }`}
          >
            <input
              id="bodyImageUpload"
              type="file"
              hidden
              ref={bodyImageRef}
              accept="image/*"
              onChange={(e) => handleFileChange(e, "bodyImage")}
            />
            <CiImageOn size={60} color="#0084F9" />
            <h3 className="text-md font-medium">Drag & Drop your logo</h3>
            <p className="text-xs text-gray-500">PNG, JPG, JPEG • Max 2MB</p>
            <p className="text-gray-500 text-xs font-normal">
              Recommended body image size 1920PX x 1080PX
            </p>
          </label>
          {onboard?.bodyImage && (
            <div className="bg-[#F5F9FC] mt-2 text-sm border border-gray-100 flex gap-3 justify-between items-center p-2 rounded-xl">
              <p className="truncate">{onboard?.bodyImage?.name}</p>
              <span
                onClick={() =>
                  setOnboard((prev) => ({
                    ...prev,
                    bodyImage: null,
                  }))
                }
                className="w-8 h-8 min-w-8 cursor-pointer flex items-center justify-center rounded-full bg-red-100"
              >
                <CircleX className="text-red-600" size={15} />
              </span>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-1 w-full">
          <label htmlFor="" className="text-lg font-medium text-black">
            EPK file upload{" "}
            <span className="text-sm text-gray-400 font-normal">
              (Optional ZIP or PDF){" "}
            </span>
            {disableBox && (
              <span className="text-xs font-normal text-red-500">
                (Gold Only)
              </span>
            )}
          </label>
          <p className="text-black bg-amber-100 border-l-2 border-amber-400 p-2 rounded-md text-sm">
            Look for EPiK in 2027 (Our EPK Builder)
          </p>
          <label
            htmlFor="epkFileUpload"
            onDragOver={(e) => handleDragOver(e, "epkFile")}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, "epkFile")}
            className={`relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed py-8 transition cursor-pointer
                      ${
                        draggingField === "epkFile"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300 bg-white"
                      }`}
          >
            <input
              id="epkFileUpload"
              type="file"
              hidden
              ref={epkFileRef}
              accept=".zip,.pdf,application/zip,application/pdf"
              onChange={(e) => handleFileChange(e, "epkFile")}
            />
            <CiImageOn size={60} color="#0084F9" />
            <h3 className="text-md font-medium">Drag & Drop your logo</h3>
            <p className="text-xs text-gray-500">PNG, JPG, JPEG • Max 2MB</p>
            <p className="text-gray-500 text-xs font-normal">
              Recommended body image size 1920PX x 1080PX
            </p>
          </label>
          {onboard?.epkFile && (
            <div className="bg-[#F5F9FC] mt-2 text-sm border border-gray-100 flex gap-3 justify-between items-center p-2 rounded-xl">
              <p className="truncate">{onboard?.epkFile?.name}</p>
              <span
                onClick={() =>
                  setOnboard((prev) => ({
                    ...prev,
                    epkFile: null,
                  }))
                }
                className="w-8 h-8 min-w-8 cursor-pointer flex items-center justify-center rounded-full bg-red-100"
              >
                <CircleX className="text-red-600" size={15} />
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OneboardTow;
