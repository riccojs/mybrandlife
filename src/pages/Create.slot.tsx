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
import { ArrowLeft, EthernetPort } from "lucide-react";

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

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!slot.date || slot.times?.length === 0) {
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
        setSelectedDate(undefined);
      })
      .catch((error) => {
        const err = error as FetchBaseQueryError;
        const errorMessage = (err.data as { message: string }).message;
        toast.error(errorMessage);
      });
  };

  return (
    <section className="p-3 md:p-5">
      <div className="flex md:flex-row flex-col justify-between items-start md:items-center">
        <div className="md:w-6/12 w-full">
          <h2 className="text-normal text-xl md:text-3xl">BrandBook Slot</h2>
          <ul className="flex gap-1 md:gap-2 md:flex-nowrap flex-wrap items-center py-2">
            <li>
              <Link
                to="/brandbook"
                className="text-normal text-sm md:text-base hover:underline"
              >
                BrandBook
              </Link>
            </li>
            <li>
              <i className="fa-solid fa-angles-right text-xs"></i>
            </li>
            <li>
              <p className="text-normal text-sm md:text-base">
                Create Your Slot
              </p>
            </li>
          </ul>
        </div>
        <button className="bg-[#88C22F] text-white md:w-fit w-full justify-center flex gap-2 items-center px-6 py-2 md:py-3 rounded-lg text-normal text-md">
          <ArrowLeft size={20} />
          <Link to="/brandbook">Back</Link>
        </button>
      </div>
      <div className="flex lg:flex-row flex-col gap-3 md:gap-5 w-full mt-3 md:mt-0">
        <div className="bg-white w-full lg:w-6/12 p-5 md:p-10 rounded-3xl shadow border border-gray-200">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-5 md:gap-10"
          >
            <div className="flex flex-col gap-2">
              <label className="text-light text-lg font-normal">
                Select Date<span className="text-lg text-red-400">*</span>
              </label>
              <div className="w-full max-w-fit custom-scroll overflow-x-auto rounded-xl bg-[#F3F3F3] p-3 sm:p-5">
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
                  disabled={{ before: new Date() }}
                  modifiersClassNames={{
                    selected: "text-black bg-[#96c94b] rounded-full",
                    disabled: "text-gray-400",
                    today: "text-black",
                    hidden: "text-gray-500",
                  }}
                  modifiersStyles={{
                    caption: { color: "#ffdd00" },
                  }}
                  className="mx-auto"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-light text-md md:text-lg font-normal">
                Select Times
                <span className="text-md md:text-lg text-red-400">*</span>
              </label>
              <div className="flex flex-wrap gap-2 md:gap-3 mt-2">
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
                    className={`min-w-20 md:min-w-22 text-sm py-2 text-center rounded-md cursor-pointer
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
              className={`${isLoading ? "bg-[#7ba43c] cursor-not-allowed" : "bg-[#96c94b] cursor-pointer"} min-w-32 md:min-w-44 h-12 flex justify-center items-center w-fit rounded-lg text-sm md:text-base`}
            >
              {isLoading ? (
                <i className="fa-solid fa-circle-notch animate-spin"></i>
              ) : (
                "Create Slot"
              )}
            </button>
          </form>
        </div>
        <div className="bg-white h-fit w-full lg:w-6/12 rounded-3xl overflow-hidden shadow border border-gray-200">
          <div className="flex justify-between items-center p-5">
            <h2 className="text-lg md:text-2xl font-normal">Created Slots</h2>
            <p className="min-w-14 w-14 h-14 flex justify-center items-center rounded-full bg-amber-50">
              <EthernetPort />
            </p>
          </div>
          <Slots />
        </div>
      </div>
    </section>
  );
}

export default CreateSlot;
