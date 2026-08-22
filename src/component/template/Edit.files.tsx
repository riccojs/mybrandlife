import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useParams } from "react-router";
import { CheckCircle, LoaderCircle } from "lucide-react";
import { CiImageOn } from "react-icons/ci";
import { useAuth } from "../../hook/useAuth";
import {
  useGetOneOnboardQuery,
  useUpdateImagesMutation,
} from "../../redux/features/onboard/onboardApi";
import useBodyScroll from "../../hook/userBodyscroll";

interface TypesForm {
  isShowFile: boolean;
  setIsShowFiles: React.Dispatch<React.SetStateAction<boolean>>;
}

interface OnboardTypes {
  logoImage?: File | string | null;
  headerImage?: File | string | null;
  bodyImage?: File | string | null;
  epkFile?: File | string | null;
}

interface UserType {
  package?: string;
}

function EditFiles({ isShowFile, setIsShowFiles }: TypesForm) {
  useBodyScroll(isShowFile);

  const params = useParams();
  const id = params.id;
  const { user } = useAuth() as { user: UserType | null };
  const { data } = useGetOneOnboardQuery(id);

  const packedType = user?.package;

  let disableBox;
  if (packedType === "bronze" || packedType === "silver") {
    disableBox = true;
  }
  const [draggingField, setDraggingField] = useState<keyof OnboardTypes | null>(
    null,
  );
  const headerImageRef = useRef<HTMLInputElement>(null);
  const logoImageRef = useRef<HTMLInputElement>(null);

  const bodyImageRef = useRef<HTMLInputElement>(null);
  const epkFileRef = useRef<HTMLInputElement>(null);
  const [updateImages, { isLoading }] = useUpdateImagesMutation();
  const [onboard, setOnboard] = useState<OnboardTypes>({
    logoImage: null,
    headerImage: null,
    bodyImage: null,
    epkFile: null,
  });
  const { logoImage, headerImage, bodyImage, epkFile } = onboard || {};

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("logoImage", logoImage ? logoImage : "");
    formData.append("headerImage", headerImage ? headerImage : "");
    formData.append("bodyImage", bodyImage ? bodyImage : "");
    formData.append("epkFile", epkFile ? epkFile : "");
    updateImages({ id, formData })
      .unwrap()
      .then((res) => {
        toast.success(res.message);
        setIsShowFiles(false);
      })
      .catch((error) => {
        const err = error as FetchBaseQueryError;
        const errorMessage = (err.data as { message: string }).message;
        toast.error(errorMessage);
      });
  };

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
      if (
        file.type !== "application/zip" &&
        !file.name.toLowerCase().endsWith(".zip")
      ) {
        toast.error("Only ZIP files are allowed.");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error("EPK file must be less than 10MB.");
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

  useEffect(() => {
    if (data?.onboard) {
      setOnboard({
        logoImage: data.onboard.logoImage ?? null,
        headerImage: data.onboard.headerImage ?? null,
        bodyImage: data.onboard.bodyImage ?? null,
        epkFile: data.onboard.epkFile ?? null,
      });
    }
  }, [data?.onboard]);

  return (
    <div className="inset-0 bg-[#00000039] flex fixed left-0 justify-center items-center w-full min-h-screen z-50 overflow-auto">
      <div
        className={`overflow-hidden flex flex-col w-11/12 2xl:w-4/12 xl:w-8/12 m-auto max-h-[95vh] justify-center rounded-3xl shadow-sm bg-[#ffffff] border border-gray-300 ${
          isShowFile ? "zoom-animation" : ""
        }`}
      >
        <div className="p-8 min-h-full overflow-y-auto custom-scroll">
          <div className="flex flex-col border-b border-gray-300 pb-5 mb-5">
            <h2 className="text-xl">Update All Files</h2>
            <p className="text-sm font-normal text-gray-400">
              Update your files settings here!
            </p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6 my-5">
              <div className="flex flex-col gap-1 w-full">
                <label htmlFor="" className="text-lg font-medium text-black">
                  Header Image
                </label>
                <label
                  htmlFor="headerImageUpload"
                  onDragOver={(e) => handleDragOver(e, "headerImage")}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, "headerImage")}
                  className={`relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed md:px-0 px-2 py-8 transition cursor-pointer
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
                  <p className="text-xs text-gray-500">
                    PNG, JPG, JPEG • Max 2MB
                  </p>
                  <p className="text-gray-500 text-xs font-normal text-center">
                    Recommended header image size 1920PX x 400PX
                  </p>
                </label>
                {onboard?.headerImage && (
                  <div className="bg-[#F5F9FC] mt-2 text-sm border border-gray-100 flex gap-3 justify-between items-center p-2 rounded-xl">
                    {typeof onboard.headerImage === "string"
                      ? onboard?.headerImage?.split("/").pop()
                      : onboard?.headerImage?.name}
                    <span className="w-8 h-8 min-w-8 flex items-center justify-center rounded-full bg-red-100">
                      <span className="w-8 h-8 min-w-8 flex items-center justify-center rounded-full bg-green-100">
                        <CheckCircle className="text-green-600" size={18} />
                      </span>
                    </span>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-1 w-full">
                <label htmlFor="" className="text-lg font-medium text-black">
                  Logo or Portrait
                </label>
                <label
                  htmlFor="logoUpload"
                  onDragOver={(e) => handleDragOver(e, "logoImage")}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, "logoImage")}
                  className={`relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-2 md:px-0 py-8 transition cursor-pointer
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
                  <p className="text-xs text-gray-500">
                    PNG, JPG, JPEG • Max 2MB
                  </p>
                  <p className="text-gray-500 text-xs font-normal text-center">
                    Recommended logo image size 300PX x 300PX
                  </p>
                </label>
                {onboard?.logoImage && (
                  <div className="bg-[#F5F9FC] mt-2 text-sm border border-gray-100 flex gap-3 justify-between items-center p-2 rounded-xl">
                    {typeof onboard.logoImage === "string"
                      ? onboard?.logoImage?.split("/").pop()
                      : onboard?.logoImage?.name}
                    <span className="w-8 h-8 min-w-8 flex items-center justify-center rounded-full bg-red-100">
                      <span className="w-8 h-8 min-w-8 flex items-center justify-center rounded-full bg-green-100">
                        <CheckCircle className="text-green-600" size={18} />
                      </span>
                    </span>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-1 w-full">
                <label htmlFor="" className="text-lg font-medium text-black">
                  Body Image
                </label>
                <label
                  htmlFor="bodyImageUpload"
                  onDragOver={(e) => handleDragOver(e, "bodyImage")}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, "bodyImage")}
                  className={`relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-2 md:px-0 py-8 transition cursor-pointer
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
                  <p className="text-xs text-gray-500">
                    PNG, JPG, JPEG • Max 2MB
                  </p>
                  <p className="text-gray-500 text-xs font-normal text-center">
                    Recommended body image size 1920PX x 1080PX
                  </p>
                </label>
                {onboard?.bodyImage && (
                  <div className="bg-[#F5F9FC] mt-2 text-sm border border-gray-100 flex gap-3 justify-between items-center p-2 rounded-xl">
                    {typeof onboard.bodyImage === "string"
                      ? onboard?.bodyImage?.split("/").pop()
                      : onboard?.bodyImage?.name}
                    <span className="w-8 h-8 min-w-8 flex items-center justify-center rounded-full bg-red-100">
                      <span className="w-8 h-8 min-w-8 flex items-center justify-center rounded-full bg-green-100">
                        <CheckCircle className="text-green-600" size={18} />
                      </span>
                    </span>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-1 w-full">
                <label htmlFor="" className="text-lg font-medium text-black">
                  EPK.zip File Upload{" "}
                  {disableBox && (
                    <span className="text-xs font-normal text-red-500">
                      (Gold Only)
                    </span>
                  )}
                </label>
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
                    accept=".zip,application/zip"
                    onChange={(e) => handleFileChange(e, "epkFile")}
                  />
                  <CiImageOn size={60} color="#0084F9" />
                  <h3 className="text-md font-medium">Drag & Drop your logo</h3>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, JPEG • Max 2MB
                  </p>
                </label>
                {onboard?.epkFile && (
                  <div className="bg-[#F5F9FC] mt-2 text-sm border border-gray-100 flex gap-3 justify-between items-center p-2 rounded-xl">
                    {typeof onboard.epkFile === "string"
                      ? onboard?.epkFile?.split("/").pop()
                      : onboard?.epkFile?.name}
                    <span className="w-8 h-8 min-w-8 flex items-center justify-center rounded-full bg-red-100">
                      <span className="w-8 h-8 min-w-8 flex items-center justify-center rounded-full bg-green-100">
                        <CheckCircle className="text-green-600" size={18} />
                      </span>
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-3 items-center">
              <button
                onClick={() => setIsShowFiles(false)}
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

export default EditFiles;
