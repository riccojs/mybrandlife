import { useRef, useState } from "react";
import toast from "react-hot-toast";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { CreateWristbandType } from "../../utils/wristband.types";
import useBodyScroll from "../../hook/userBodyscroll";
import { useCreateWristbandMutation } from "../../redux/features/wristband/wristbandApi";
import SelectComponent from "../ui/Select.component";
import { LoaderCircle } from "lucide-react";

interface TypesForm {
  showTab: boolean;
  setShowTab: React.Dispatch<React.SetStateAction<boolean>>;
}
function CreateWristband({ showTab, setShowTab }: TypesForm) {
  useBodyScroll(showTab);
  const [wristband, setWristband] = useState<CreateWristbandType>({
    title: "",
    description: "",
    price: "",
    color: "",
    stock: "",
    status: "",
    profile: null,
  });
  const [createWristband, { isLoading }] = useCreateWristbandMutation();
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
    createWristband(formData)
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
    <div className="fixed inset-0 flex justify-center items-center w-full min-h-screen z-50 overflow-auto bg-black/20 backdrop-blur-xs">
      <div
        className={`relative max-h-[95vh] custom-scroll overflow-y-auto h-auto p-5 md:p-10 w-11/12 lg:w-8/12 xl:w-7/12 2xl:w-4/12 m-auto rounded-3xl shadow-xl bg-white ${
          showTab ? "zoom-animation" : ""
        }`}
      >
        <h2 className="text-lg md:text-2xl font-medium text-black text-center mt-5 mb-2">
          Create Wristband
        </h2>
        <p className="text-sm md:text-md font-normal text-black text-center">
          Ensure all mandatory fields are filled in with the correct
          information. Upon completion, you may proceed to establish the
          referral system.
        </p>
        <form
          onSubmit={handleSubmit}
          className="w-full my-5 flex flex-col gap-5"
        >
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
              required
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
              {isLoading ? <LoaderCircle className="animate-spin" /> : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateWristband;
