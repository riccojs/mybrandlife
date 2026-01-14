import { useState, type SetStateAction } from "react";
import {
  DesktopDatePicker,
  MobileDatePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useMediaQuery, useTheme } from "@mui/material";
import { useGetAllSlotQuery } from "../redux/features/event/eventApi";
import { useOnboard } from "../hook/useOnboard";
import { track } from "@plausible-analytics/tracker";

interface DataType {
  setEvent: React.Dispatch<SetStateAction<EventType>>;
}

interface EventType {
  date: Date | null;
  time: string;
  email: string;
  name: string;
  note: string;
  userId: string;
}

export default function SelectSlot({ setEvent }: DataType) {
  const { onboard } = useOnboard();
  const userId = onboard?.userId;
  const { data } = useGetAllSlotQuery(userId);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const Picker = isMobile ? MobileDatePicker : DesktopDatePicker;
  const slots = data?.slot || [];
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const availableDates = slots.map(
    (slot: { date: string }) => new Date(slot.date)
  );
  const selectedSlot = slots.find(
    (item: { date: string }) =>
      new Date(item.date).toLocaleDateString("en-CA") ===
      selectedDate?.toLocaleDateString("en-CA")
  );

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setEvent((prev) => ({
      ...prev,
      time: time,
      date: selectedDate,
    }));
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div className="flex flex-col gap-2 w-full">
        <label className="text-light text-xl font-normal">
          Select Date<span className="text-xl text-red-400">*</span>
        </label>
        <Picker
          value={selectedDate}
          onChange={setSelectedDate}
          slotProps={{
            textField: {
              variant: "outlined",
              className:
                "bg-[#F3F3F3] w-full rounded-xl border border-gray-300",
              sx: {
                "&.Mui-focused": {
                  borderColor: "#96c94b",
                  boxShadow: "0 0 0 2px #96c94b",
                },
                input: { padding: "12px" },
              },
            },
          }}
          shouldDisableDate={(date: Date) => {
            return !availableDates.some(
              (d: Date) => d.toDateString() === date.toDateString()
            );
          }}
        />
      </div>
      {selectedSlot && (
        <div className="flex flex-col gap-2 w-full">
          <label className="text-light text-xl font-normal">
            Select Time<span className="text-xl text-red-400">*</span>
          </label>
          <div className="flex flex-wrap gap-3 mt-2">
            {selectedSlot.times.map((time: string, index: number) => (
              <p
                key={index}
                onClick={() => {
                  track("ButtonClick", {
                    props: {
                      buttonName: "Select booking slot",
                      lander: onboard?.user?.landerName,
                      currentDomain: window.location.hostname,
                    },
                  });
                  handleTimeSelect(time);
                }}
                className={`p-2 min-w-20 text-md text-center rounded-md cursor-pointer ${
                  selectedTime === time
                    ? "bg-[#96c94b] text-black"
                    : "bg-[#F3F3F3]"
                }`}
              >
                {time}
              </p>
            ))}
          </div>
        </div>
      )}
    </LocalizationProvider>
  );
}
