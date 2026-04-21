import { motion } from "framer-motion";
import type { SpinType } from "../utils/spin.type";
import { useEffect, useRef, useState } from "react";
import SlotMachine from "../assets/slot-machine.png";
import PlayMusic from "../assets/slot-machine.mp3";

interface Type {
  user: UserType;
  officialColor: string;
}

interface UserType {
  landerName: string;
  calendarId: string;
  stripeAccountId: string;
  id: string;
  package: string;
  spinings: SpinType[];
}

function Spining({ user, officialColor }: Type) {
  const [displayText, setDisplayText] = useState("RANDOM FUN?");
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedSpin, setSelectedSpin] = useState<SpinType | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const resetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const spinItems = user?.spinings?.filter((item) => item.isEnable) || [];

  const getRandomSpin = () => {
    if (!spinItems.length) return null;
    const index = Math.floor(Math.random() * spinItems.length);
    return spinItems[index];
  };

  useEffect(() => {
    audioRef.current = new Audio(PlayMusic);
    audioRef.current.loop = true;
  }, []);

  const handleRandomFun = () => {
    if (selectedSpin && !isSpinning) {
      window.open(selectedSpin.url, "_blank");
      return;
    }
    if (isSpinning || !spinItems.length) return;
    setIsSpinning(true);
    audioRef.current?.play();
    intervalRef.current = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * spinItems.length);
      setDisplayText(spinItems[randomIndex].title);
    }, 100);
    const finalSelected = getRandomSpin();
    setTimeout(() => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setSelectedSpin(finalSelected);
      setDisplayText(finalSelected?.title || "No Result");
      setIsSpinning(false);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      resetTimeoutRef.current = setTimeout(() => {
        setSelectedSpin(null);
        setDisplayText("RANDOM FUN?");
      }, 10000);
    }, 9000);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
    };
  }, []);

  return (
    <motion.a
      onClick={handleRandomFun}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex justify-center px-4 gap-2 items-center w-full h-8 md:h-12
                 rounded-lg cursor-pointer border border-white hover:shadow-[0_0_14px_rgba(255,255,255,0.90)] overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(to right, ${officialColor}, #fff)`,
      }}
    >
      <img src={SlotMachine} className="w-4" alt="" />
      <span className="text-sm md:text-md">{displayText}</span>
    </motion.a>
  );
}

export default Spining;
