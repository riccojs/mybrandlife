import React, { useRef, useState } from "react";
import type { CreateWristbandType } from "../../utils/wristband.types";
import { useUpdateWristbandMutation } from "../../redux/features/wristband/wristbandApi";
import toast from "react-hot-toast";
import SelectComponent from "../ui/Select.component";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { LoaderCircle } from "lucide-react";

interface TypeForm {
  data: {
    wristband: WristbandType;
  };
  setShowTab: React.Dispatch<React.SetStateAction<boolean>>;
}

interface WristbandType {
  title: string;
  id: string;
  description: string;
  price: string;
  color: string;
  stock: string;
  status: string;
  profile: File | null;
}

function WristbandForm({ data, setShowTab }: TypeForm) {
  const [updateWristband, { isLoading }] = useUpdateWristbandMutation();
  const [wristband, setWristband] = useState<CreateWristbandType>({
    title: data?.wristband?.title || "",
    description: data?.wristband?.description || "",
    price: data?.wristband?.price || "",
    color: data?.wristband?.color || "",
    stock: data?.wristband?.stock || "",
    status: data?.wristband?.status || "",
    profile: null,
  });
  const { title, description, price, color, stock, status, profile } =
    wristband;

  const logoRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setWristband({
      ...wristband,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status?.length === 0) {
      toast.error("Please select status");
      return;
    }
    if (color?.length === 0) {
      toast.error("Please select color");
      return;
    }

    const formData = new FormData();
    formData.append("title", title ? title : "");
    formData.append("description", description ? description : "");
    formData.append("price", price ? price : "");
    formData.append("stock", stock ? stock : "");
    formData.append("status", status ? status : "");
    formData.append("color", color ? color : "");
    if (profile && profile instanceof File) {
      formData.append("profile", profile);
    }
    updateWristband({ id: data?.wristband?.id, formData })
      .unwrap()
      .then((res) => {
        toast.success(res.message);
        setShowTab(false);
        if (logoRef.current) logoRef.current.value = "";
      })
      .catch((error) => {
        const err = error as FetchBaseQueryError;
        const errorMessage = (err.data as { message: string }).message;
        toast.error(errorMessage);
      });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!files || files.length === 0) return;
    const file = files[0] || null;
    setWristband((prevState) => ({
      ...prevState,
      profile: file,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="w-full my-5 flex flex-col gap-5">
      <div className="flex flex-col gap-1 w-full">
        <label htmlFor="" className="text-md font-normal text-black">
          Title
        </label>
        <input
          type="text"
          name="title"
          value={title}
          onChange={handleChange}
          required
          className="border border-gray-300 px-4 py-2 rounded-lg w-full focus:outline-1 focus:outline-[#96c94b]"
          placeholder="Enter title"
        />
      </div>
      <div className="flex flex-col gap-1 w-full">
        <label htmlFor="" className="text-md font-normal text-black">
          Description
        </label>
        <textarea
          name="description"
          value={description}
          onChange={handleChange}
          required
          className="border border-gray-300 px-4 py-2 rounded-lg w-full focus:outline-1 focus:outline-[#96c94b]"
          placeholder="Enter description"
        ></textarea>
      </div>
      <div className="w-full flex-col md:flex-row flex gap-5">
        <div className="flex flex-col gap-1 w-full">
          <label htmlFor="" className="text-md font-normal text-black">
            Select Colot
          </label>
          <SelectComponent
            value={color}
            label="Select color"
            handleChange={(value: string) =>
              setWristband((prev) => ({ ...prev, color: value }))
            }
            datas={[
              { key: "BLACK", value: "BLACK" },
              { key: "BLUE", value: "BLUE" },
              { key: "BROWN", value: "BROWN" },
              { key: "CLEAR", value: "CLEAR" },
              { key: "GOLD", value: "GOLD" },
              { key: "GRAY", value: "GRAY" },
              { key: "GREEN", value: "GREEN" },
              { key: "NAVY", value: "NAVY" },
              { key: "NEON_GREEN", value: "NEON_GREEN" },
              { key: "NEON_PINK", value: "NEON_PINK" },
              { key: "ORANGE", value: "ORANGE" },
              { key: "PINK", value: "PINK" },
              { key: "PURPLE", value: "PURPLE" },
              { key: "RED", value: "RED" },
              { key: "SILVER", value: "SILVER" },
              { key: "TAN", value: "TAN" },
              { key: "TEAL", value: "TEAL" },
              { key: "WHITE", value: "WHITE" },
              { key: "YELLOW", value: "YELLOW" },
            ]}
            color="#F3F3F3"
          />
        </div>
        <div className="flex flex-col gap-1 w-full">
          <label htmlFor="" className="text-md font-normal text-black">
            Select Status
          </label>
          <SelectComponent
            value={status}
            label="Select status"
            handleChange={(value: string) =>
              setWristband((prev) => ({ ...prev, status: value }))
            }
            datas={[
              { key: "PENDING", value: "PENDING" },
              { key: "DRAFT", value: "DRAFT" },
              { key: "INSTOCK", value: "INSTOCK" },
              { key: "OUTOFSTOCK", value: "OUTOFSTOCK" },
            ]}
            color="#F3F3F3"
          />
        </div>
      </div>
      <div className="flex flex-col gap-1 w-full">
        <label htmlFor="" className="text-md font-normal text-black">
          Price
        </label>
        <input
          type="number"
          name="price"
          value={price}
          onChange={handleChange}
          required
          className="border border-gray-300 px-4 py-2 rounded-lg w-full focus:outline-1 focus:outline-[#96c94b]"
          placeholder="Enter price"
        />
      </div>
      <div className="flex flex-col gap-1 w-full">
        <label htmlFor="" className="text-md font-normal text-black">
          Stock
        </label>
        <input
          type="number"
          name="stock"
          value={stock}
          onChange={handleChange}
          required
          className="border border-gray-300 px-4 py-2 rounded-lg w-full focus:outline-1 focus:outline-[#96c94b]"
          placeholder="Enter stock"
        />
      </div>
      <div className="flex flex-col gap-1 w-full">
        <label htmlFor="" className="text-md font-normal text-black">
          Banner
        </label>
        <input
          name="profile"
          ref={logoRef}
          accept="image/jpeg,image/jpg,image/png,image/svg+xml"
          onChange={handleFileChange}
          type="file"
          id="image"
          className="border border-gray-300 px-4 py-2 rounded-lg w-full focus:outline-1 focus:outline-[#96c94b]"
        />
      </div>
      <div className="flex gap-3 items-center">
        <button
          onClick={() => setShowTab(false)}
          disabled={isLoading}
          className="bg-slate-200 text-[#000000] flex justify-center items-center gap-1 w-fit border border-gray-200 px-10 h-12 rounded-lg cursor-pointer"
        >
          Close
        </button>
        <button
          disabled={isLoading}
          type="submit"
          className={`${isLoading ? "bg-[#77a630] cursor-not-allowed" : "bg-[#96c94b] cursor-pointer"}  text-[#000000] flex justify-center items-center gap-1 min-w-32 w-32 h-12 rounded-lg`}
        >
          {isLoading ? <LoaderCircle className="animate-spin" /> : "Save"}
        </button>
      </div>
    </form>
  );
}

export default WristbandForm;
