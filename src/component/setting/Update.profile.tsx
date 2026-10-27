import { CheckCircle } from "lucide-react";
import React, { useState, type SetStateAction } from "react";
import toast from "react-hot-toast";
import { CiImageOn } from "react-icons/ci";
import type { UserSettingType } from "../../utils/user.types";

interface DataTypes {
  setUser: React.Dispatch<SetStateAction<UserSettingType>>;
  user: UserSettingType;
  logoRef: React.RefObject<HTMLInputElement | null>;
}

function UpdateProfile({ setUser, user, logoRef }: DataTypes) {
  const [isDragging, setIsDragging] = useState(false);

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
    <div className="flex flex-col gap-1">
      <label className="text-sm font-semibold text-slate-900">
        Dashboard Profile Picture
      </label>
      <label
        htmlFor="imageUpload"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative flex flex-col items-center justify-center gap-1 border-2 border-dashed rounded-xl py-3 cursor-pointer transition ${
          isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-white"
        }`}
      >
        <input
          id="imageUpload"
          type="file"
          accept="image/*"
          className="hidden"
          ref={logoRef}
          onChange={handleFileChange}
        />

        <CiImageOn color="#0084F9" size={20} />

        <h3 className="text-sm font-medium text-black">
          Drag & Drop your image
        </h3>

        <p className="text-gray-500 text-xs">PNG, JPG, JPEG • Max size 2 MB</p>
      </label>

      {user.profile && (
        <div className="bg-[#F5F9FC] flex justify-between items-center px-3 py-2 text-sm rounded-xl">
          <p className="truncate">
            {typeof user.profile === "string"
              ? user.profile.split("/").pop()
              : user.profile.name}
          </p>

          <span className="w-5 h-5 flex items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="text-green-600" size={10} />
          </span>
        </div>
      )}
    </div>
  );
}

export default UpdateProfile;
