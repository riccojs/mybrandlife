import React, { useState } from "react";
import { useUpdateEventMutation } from "../../redux/features/event/eventApi";
import toast from "react-hot-toast";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { DayPicker } from "react-day-picker";
import type { BrandbookType } from "../../utils/brandbook.types";
import SelectComponent from "../ui/Select.component";
import "react-day-picker/style.css";
import { LoaderCircle } from "lucide-react";

interface TypeForm {
  data: {
    event: BrandbookType;
  };
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  id: string;
}

function BrandbookForm({ data, setShow, id }: TypeForm) {
  const [brandbook, setBrandbook] = useState({
    name: data?.event?.name || "",
    email: data?.event?.email || "",
    date: data?.event?.date || "",
    time: data?.event?.time || "",
    note: data?.event.note || "",
    status: data?.event?.status || "",
  });

  const [updateEvent, { isLoading }] = useUpdateEventMutation();

  const { name, email, date, time, note, status } = brandbook || {};

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setBrandbook({
      ...brandbook,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateEvent({ id, brandbook })
      .unwrap()
      .then((res) => {
        toast.success(res.message);
        setShow(false);
      })
      .catch((error) => {
        const err = error as FetchBaseQueryError;
        const errorMessage = (err.data as { message: string }).message;
        toast.error(errorMessage);
      });
  };

  const formatTime = (timeString: string): string => {
    if (!timeString) return "";
    if (/^\d{2}:\d{2}$/.test(timeString)) return timeString;
    const match = timeString.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i);
    if (match) {
      const hours = parseInt(match[1], 10);
      const minutes = match[2];
      const meridian = match[3].toUpperCase();

      let h = hours;
      if (meridian === "PM" && h < 12) h += 12;
      if (meridian === "AM" && h === 12) h = 0;
      return `${h.toString().padStart(2, "0")}:${minutes}`;
    }
    return "";
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start mt-5">
        <div className="w-full flex flex-col gap-5">
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
          <input
            type="text"
            name="note"
            onChange={handleChange}
            value={note}
            required
            className="bg-[#F3F3F3] border border-gray-300 focus:outline focus:outline-[#96c94b] focus:border p-3 w-full rounded-lg text-normal"
            placeholder="Enter your email"
          />
          <SelectComponent
            value={status}
            label="Select status"
            handleChange={(item) =>
              setBrandbook((prev) => ({ ...prev, status: item }))
            }
            datas={[
              { key: "PENDING", value: "PENDING" },
              { key: "CONFIRMED", value: "CONFIRMED" },
              { key: "CANCELED", value: "CANCELED" },
              { key: "REJECTED", value: "REJECTED" },
            ]}
            color="#F3F3F3"
          />
          <input
            type="time"
            name="time"
            onChange={handleChange}
            value={time ? formatTime(time) : ""}
            required
            className="bg-[#F3F3F3] border border-gray-300 focus:outline focus:outline-[#96c94b] focus:border p-3 w-full rounded-lg text-normal"
            placeholder="Select time"
          />
        </div>
        <div className="min-w-64 w-full custom-scroll overflow-x-auto bg-[#F3F3F3] border border-gray-300 rounded-lg p-3">
          <DayPicker
            mode="single"
            selected={new Date(date)}
            onSelect={(date) => {
              if (date) {
                const formatted = date.toLocaleDateString("en-CA");
                setBrandbook((prev) => ({ ...prev, date: formatted }));
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

      <div className="flex gap-3 items-center mt-5">
        <button
          onClick={() => setShow(false)}
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

export default BrandbookForm;
