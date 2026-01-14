import { useState, type SetStateAction } from "react";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import toast from "react-hot-toast";
import { useOnboard } from "../hook/useOnboard";
import "react-day-picker/dist/style.css";
import SelectSlot from "./Select.slot";
import { useCreateEventMutation } from "../redux/features/event/eventApi";
import { track } from "@plausible-analytics/tracker";

interface DataTypes {
  isShow: boolean;
  setShow: React.Dispatch<SetStateAction<boolean>>;
}

interface EventType {
  date: Date | null;
  time: string;
  email: string;
  name: string;
  note: string;
  userId: string;
}

function CreateBrandbook({ isShow, setShow }: DataTypes) {
  const { onboard } = useOnboard();
  const userId = onboard?.userId;
  const [createEvent, { isLoading }] = useCreateEventMutation();

  const [event, setEvent] = useState<EventType>({
    name: "",
    email: "",
    note: "",
    date: null,
    time: "",
    userId: userId,
  });

  const { name, email, note } = event || {};

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEvent({
      ...event,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    track("ButtonClick", {
      props: {
        buttonName: "Create Branbook Booking",
        lander: onboard?.user?.landerName,
        currentDomain: window.location.hostname,
      },
    });
    if (!event.date || !event.time) {
      toast.error("Please select both date and time!");
      return;
    }

    createEvent(event)
      .unwrap()
      .then((res) => {
        toast.success(res.message);
        setShow(false);
        setEvent({
          name: "",
          email: "",
          note: "",
          time: "",
          date: null,
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
        className={`relative px-5 py-10 md:p-10 flex flex-col w-11/12 lg:w-8/12 xl:w-7/12 2xl:w-5/12 m-auto justify-center rounded-xl shadow-xl bg-[#fff] ${
          isShow ? "zoom-animation" : ""
        }`}
      >
        <div className="flex flex-col gap-5 rounded-2xl">
          <div>
            <h2 className="text-[#3D424B] font-medium text-xl md:text-3xl">
              Booking With Brandbook
            </h2>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex gap-5 md:flex-row flex-col items-center w-full">
              <div className="w-full">
                <label className="text-normal font-normal text-black">
                  Your Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={handleChange}
                  name="name"
                  required
                  className="bg-[#F3F3F3] border border-gray-300 focus:outline focus:outline-[#96c94b] focus:border py-3 px-3 w-full rounded-xl"
                  placeholder="Enter your name"
                />
              </div>
              <div className="w-full">
                <label className="text-normal font-normal text-black">
                  Your Email
                </label>
                <input
                  type="email"
                  name="email"
                  onChange={handleChange}
                  value={email}
                  required
                  className="bg-[#F3F3F3] border border-gray-300 focus:outline focus:outline-[#96c94b] focus:border py-3 px-3 w-full rounded-xl"
                  placeholder="Enter your email"
                />
              </div>
            </div>
            <div>
              <label className="text-normal font-normal text-black">
                Your Note
              </label>
              <textarea
                name="note"
                value={note}
                onChange={handleChange}
                required
                className="bg-[#F3F3F3] border border-gray-300 focus:outline focus:outline-[#96c94b] focus:border py-3 px-3 w-full rounded-xl"
                placeholder="Enter your note"
              ></textarea>
            </div>
            <SelectSlot setEvent={setEvent} />
            <button
              type="submit"
              className="bg-[#cbf38b] px-6 py-3 cursor-pointer rounded-lg flex gap-2 items-center w-fit mt-3"
            >
              {isLoading ? (
                <i className="fa-solid fa-circle-notch animate-spin"></i>
              ) : (
                "Book Now"
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

export default CreateBrandbook;
