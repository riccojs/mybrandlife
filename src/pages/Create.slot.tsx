import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import toast from "react-hot-toast";
import { Link } from "react-router";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import Slots from "../component/brandbook/Slots";
import timeData from "../utils/time.data";
import { useCreateSlotMutation } from "../redux/features/event/eventApi";
import { useAuth } from "../hook/useAuth";

interface SlotType {
  date: string;
  times: string[];
  userId: string;
}

function CreateSlot() {
  const { user } = useAuth() as { user: { id: string } | null };
  const userId = user ? user?.id : "";
  const [slot, setSlot] = useState<SlotType>({
    date: "",
    times: [],
    userId: userId,
  });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [createSlot, { isLoading }] = useCreateSlotMutation();

  const handleSelectTime = (time: string) => {
    setSlot((prev) => ({
      ...prev,
      times: prev.times.includes(time)
        ? prev.times.filter((t) => t !== time)
        : [...prev.times, time],
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!slot.date && slot.times?.length === 0) {
      toast.error("Select require feild");
      return;
    }
    createSlot(slot)
      .unwrap()
      .then((res) => {
        toast.success(res.message);
        setSlot({
          date: "",
          times: [],
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
    <section className="p-5">
      <div className="flex md:flex-row flex-col justify-between items-start md:items-center">
        <div className="md:w-6/12 w-full">
          <h2 className="text-normal text-2xl md:text-3xl">Brandbook Stol</h2>
          <ul className="flex gap-2 items-center py-2">
            <li>
              <Link
                to="/brandbook"
                className="text-normal text-sm md:text-base"
              >
                Brandbook
              </Link>
            </li>
            <li>
              <i className="fa-solid fa-angles-right text-xs"></i>
            </li>
            <li>
              <p className="text-normal text-sm md:text-base">
                Create Brandbook Slot
              </p>
            </li>
          </ul>
        </div>
        <Link
          to="/brandbook"
          className="bg-slate-200 text-[#000000] shadow flex justify-center items-center gap-1 w-fit border border-gray-300 px-10 py-3 rounded-2xl cursor-pointer"
        >
          Back
        </Link>
      </div>
      <div className="flex lg:flex-row flex-col gap-5 w-full">
        <div className="bg-white w-full lg:w-6/12 p-5 md:p-10 rounded-xl border border-gray-200">
          <form onSubmit={handleSubmit} className="flex flex-col gap-10">
            <div className="flex flex-col gap-2">
              <label className="text-light text-xl font-normal">
                Select Date<span className="text-xl text-red-400">*</span>
              </label>
              <div className="bg-[#F3F3F3] p-5 rounded-xl w-fit">
                <DayPicker
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    setSelectedDate(date || undefined);
                    if (date) {
                      const formatted = date.toLocaleDateString("en-CA");
                      setSlot((prev) => ({ ...prev, date: formatted }));
                    }
                  }}
                  modifiersClassNames={{
                    selected: "text-[#000] bg-[#96c94b] rounded-full",
                    disabled: "text-gray-400",
                    today: "text-[#000]",
                    hidden: "text-gray-500",
                    arrow: "text-red",
                  }}
                  disabled={{ before: new Date() }}
                  modifiersStyles={{
                    caption: { color: "#ffdd00" },
                  }}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-light text-xl font-normal">
                Select Times<span className="text-xl text-red-400">*</span>
              </label>
              <div className="flex flex-wrap gap-3 mt-2">
                {timeData?.map((item, index) => (
                  <p
                    key={index}
                    onClick={() => {
                      if (!slot.date) {
                        toast.error("Invalid date!");
                        return;
                      }
                      handleSelectTime(item);
                    }}
                    className={`px-4 min-w-28 text-md py-2 text-center rounded-md cursor-pointer
                    ${
                      slot.times.includes(item)
                        ? "bg-[#96c94b]"
                        : "bg-[#F3F3F3]"
                    }
                    `}
                  >
                    {item}
                  </p>
                ))}
              </div>
            </div>
            <button
              disabled={isLoading}
              className="bg-[#96c94b] cursor-pointer px-10 py-3 w-fit rounded-lg"
            >
              {isLoading ? (
                <i className="fa-solid fa-circle-notch animate-spin"></i>
              ) : (
                "Create Slot"
              )}
            </button>
          </form>
        </div>
        <div className="bg-white w-full lg:w-6/12 p-5 rounded-xl border border-gray-200">
          <h2 className="text-2xl font-normal">Created Slots</h2>
          <Slots />
        </div>
      </div>
    </section>
  );
}

export default CreateSlot;
