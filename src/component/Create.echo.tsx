import { useState, type SetStateAction } from "react";
import { useCreateEchoMutation } from "../redux/features/echo/echoApi";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import toast from "react-hot-toast";
import { useOnboard } from "../hook/useOnboard";
import useGetCity from "../hook/useGetCity";
import SelectComponent from "./Select.component";
import { track } from "@plausible-analytics/tracker";

interface DataTypes {
  isShow: boolean;
  setShow: React.Dispatch<SetStateAction<boolean>>;
}

const tipData = ["1", "3", "5", "10", "15", "20", "custom"];

function CreateEcho({ isShow, setShow }: DataTypes) {
  const { onboard } = useOnboard();
  const userId = onboard?.userId;
  const [showTip, setShowTip] = useState(false);
  const [selected, setSelected] = useState("");
  const [createEcho, { isLoading }] = useCreateEchoMutation();
  const [echo, setEcho] = useState({
    name: "",
    email: "",
    message: "",
    tip: "",
    shoutOut: "",
    city: "",
    userId: userId,
  });

  const { name, email, message, shoutOut, city, tip } = echo || {};

  const getAllCity = useGetCity();
  const getDatas = getAllCity?.map((item: { name: string }) => ({
    key: item.name,
    value: item.name,
  }));

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEcho({
      ...echo,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!echo.tip) {
      toast.error("Select a tip!");
      return;
    }
    track("ButtonClick", {
      props: {
        buttonName: "Create Echo Request",
        lander: onboard?.user?.landerName,
        currentDomain: window.location.hostname,
      },
    });
    createEcho(echo)
      .unwrap()
      .then((res) => {
        toast.success(res.message);
        window.location.href = res.pageUrl;
        setShow(false);
        setEcho({
          name: "",
          email: "",
          message: "",
          tip: "",
          shoutOut: "",
          city: "",
          userId: userId,
        });
      })
      .catch((error) => {
        const err = error as FetchBaseQueryError;
        const errorMessage = (err.data as { message: string }).message;
        toast.error(errorMessage);
      });
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center w-full min-h-screen z-50 overflow-auto bg-white/20 backdrop-blur-xs">
      <div
        className={`relative px-5 py-10 md:p-10 flex flex-col w-11/12 lg:w-8/12 xl:w-7/12 2xl:w-4/12 m-auto justify-center rounded-xl shadow-xl bg-[#fff] ${
          isShow ? "zoom-animation" : ""
        }`}
      >
        <div className="flex flex-col gap-5 rounded-2xl">
          <div>
            <h2 className="text-[#3D424B] font-medium text-xl md:text-3xl">
              Send Live Request
            </h2>
          </div>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-5 mt-2 md:mt-3"
          >
            <input
              type="text"
              value={name}
              onChange={handleChange}
              name="name"
              required
              className="bg-[#F3F3F3] border border-gray-300 focus:outline focus:outline-[#96c94b] focus:border p-3 w-full rounded-lg text-normal"
              placeholder="Enter your name"
            />
            <input
              type="email"
              name="email"
              onChange={handleChange}
              value={email}
              required
              className="bg-[#F3F3F3] border border-gray-300 focus:outline focus:outline-[#96c94b] focus:border p-3 w-full rounded-lg text-normal"
              placeholder="Enter your email"
            />
            <SelectComponent
              handleChange={(item) =>
                setEcho((prev) => ({ ...prev, city: item }))
              }
              datas={getDatas}
              value={city}
              label="Select City"
              color="#F3F3F3"
            />
            <textarea
              name="message"
              value={message}
              onChange={handleChange}
              required
              className="bg-[#F3F3F3] border border-gray-300 focus:outline focus:outline-[#96c94b] focus:border p-2 w-full rounded-md text-normal"
              placeholder="Enter your message"
            ></textarea>
            <textarea
              name="shoutOut"
              value={shoutOut}
              onChange={handleChange}
              required
              className="bg-[#F3F3F3] border border-gray-300 focus:outline focus:outline-[#96c94b] focus:border p-2 w-full rounded-md text-normal"
              placeholder="Enter your shoutOut"
            ></textarea>
            <div>
              <label htmlFor="" className="text-normal font-normal text-black">
                Select Your Tip
              </label>
              <div className="flex justify-evenly w-full items-center rounded-lg border border-gray-200">
                {tipData?.map((item, index) => (
                  <p
                    onClick={() => {
                      if (item === "custom") {
                        setShowTip(true);
                      } else {
                        setEcho((prev) => ({ ...prev, tip: item }));
                        setShowTip(false);
                      }
                      setSelected(item);
                    }}
                    className={`px-2 md:px-6 w-full py-2 text-sm md:text-md md:py-3 border-gray-200 cursor-pointer ${
                      index === tipData.length - 1 ? "border-r-0" : "border-r"
                    } ${item === selected ? "bg-[#F3F3F3]" : "bg-[#ffffff]"}`}
                  >
                    {item === "custom" ? item : `$${item}`}
                  </p>
                ))}
              </div>
              {showTip && (
                <input
                  type="number"
                  name="tip"
                  onChange={handleChange}
                  value={tip}
                  required
                  className="bg-[#F3F3F3] border mt-2 border-gray-300 focus:outline focus:outline-[#96c94b] focus:border p-2 w-full rounded-md text-normal"
                  placeholder="Enter your tip"
                />
              )}
            </div>
            <button
              type="submit"
              className="bg-[#cbf38b] px-6 py-3 cursor-pointer rounded-lg flex gap-2 items-center w-fit mt-3"
            >
              {isLoading ? (
                <i className="fa-solid fa-circle-notch animate-spin"></i>
              ) : (
                "Submit"
              )}
            </button>
          </form>
        </div>
        <button
          onClick={() => setShow(false)}
          className="text-red-500 text-2xl absolute top-1 right-1 cursor-pointer"
        >
          <i className="fa-solid fa-circle-xmark"></i>
        </button>
      </div>
    </div>
  );
}

export default CreateEcho;
