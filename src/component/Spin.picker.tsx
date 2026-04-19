import { useEffect, useMemo, useRef, useState } from "react";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import type { Chart as ChartType } from "chart.js";
import SpinIcon from "../assets/spinner-arrow-.svg";
import SpinSound from "../assets/audio/play-sound.mp3";
import WinSound from "../assets/audio/win-sound.mp3";
import { useGetAllSpinGroupQuery } from "../redux/features/spin/spinApi";
import SelectComponent from "./Select.component";
import toast from "react-hot-toast";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

Chart.register(ChartDataLabels);

const COLORS = ["#8b35bc", "#b163da", "#4f46e5", "#ec4899", "#f59e0b"];

type SpinItem = {
  id?: string;
  name: string;
  url: string;
};

export default function SpinPicker({ id }: { id: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<ChartType<"pie"> | null>(null);
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [cooldown, setCooldown] = useState(false);
  const spinSound = useRef<HTMLAudioElement | null>(null);
  const winSound = useRef<HTMLAudioElement | null>(null);
  const COOLDOWN_TIME = 30 * 1000;
  const [select, setSelect] = useState("");
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState("Click Spin");
  const [url, setUrl] = useState("");

  const { data: getData } = useGetAllSpinGroupQuery({
    page: 1,
    limit: 10,
    searchBy: "",
    landerId: id,
  });

  const groups = useMemo(() => {
    return getData?.data?.group ?? [];
  }, [getData]);

  const wheelItems = useMemo<SpinItem[]>(() => {
    return groups
      .filter((g: { groupType: string }) => g.groupType === select)
      .flatMap((g: { spiningItems: [] }) => g.spiningItems || []);
  }, [groups, select]);

  useEffect(() => {
    spinSound.current = new Audio(SpinSound);
    winSound.current = new Audio(WinSound);
  }, []);

  useEffect(() => {
    if (!canvasRef.current || wheelItems.length === 0) return;
    chartRef.current?.destroy();
    chartRef.current = new Chart(canvasRef.current, {
      type: "pie",
      data: {
        labels: wheelItems.map((i: SpinItem) => i.name),
        datasets: [
          {
            backgroundColor: wheelItems.map(
              (_, i) => COLORS[i % COLORS.length],
            ),
            data: wheelItems.map(() => 1),
          },
        ],
      },
      options: {
        responsive: true,
        animation: { duration: 0 },
        rotation: 0,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false },
          datalabels: {
            color: "#fff",
            align: "end",
            font: { size: window.innerWidth < 500 ? 10 : 13 },
            offset: window.innerWidth < 500 ? 10 : 40,
            formatter: (_, ctx) => ctx.chart.data.labels?.[ctx.dataIndex],
          },
        },
      },
    });
    return () => chartRef.current?.destroy();
  }, [wheelItems]);

  const getWinner = (rotation: number) => {
    const slice = 360 / wheelItems.length;
    const normalized = (360 - (rotation % 360) + 90) % 360;
    const index = Math.floor(normalized / slice);
    return wheelItems[index];
  };

  const playWinSound = async () => {
    if (!winSound.current) return;
    winSound.current.pause();
    winSound.current.currentTime = 0;
    await winSound.current.play();
  };

  const playSpinSound = async () => {
    if (!spinSound.current) return;
    spinSound.current.pause();
    spinSound.current.currentTime = 0;
    await spinSound.current.play();
  };

  const stopSpinSound = () => {
    if (!spinSound.current) return;
    spinSound.current.pause();
    spinSound.current.currentTime = 0;
  };

  const spin = () => {
    const chart = chartRef.current;
    if (!chart || spinning || wheelItems.length === 0) return;
    const now = Date.now();
    const nextAllowed = now + COOLDOWN_TIME;
    localStorage.setItem("spinCooldown", nextAllowed.toString());
    setSpinning(true);
    setCooldown(true);
    setResult("Spinning...");
    setUrl("");
    playSpinSound();
    const extraSpins = 5 * 360;
    const randomStop = Math.floor(Math.random() * 360);
    const finalRotation = extraSpins + randomStop;
    chart.options.rotation = 0;
    chart.update();
    let current = 0;
    const interval = setInterval(() => {
      current += 20;
      chart.options.rotation = current % 360;
      chart.update();
      if (current >= finalRotation) {
        clearInterval(interval);
        stopSpinSound();
        const winner = getWinner(current);
        setResult(winner?.name);
        setUrl(winner?.url);
        setSpinning(false);
        playWinSound();
      }
    }, 16);
    setTimeLeft(30);
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCooldown(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const groupOptions = useMemo(
    () => [
      ...groups
        .filter((item: { isEnable: boolean }) => item.isEnable === true)
        .map((g: { groupType: string }) => ({
          key: g.groupType,
          value: g.groupType,
        })),
    ],
    [groups],
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Copied");
      setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      const err = error as FetchBaseQueryError;
      const errorMessage = (err.data as { message: string }).message;
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem("spinCooldown");
    if (!stored) return;
    const endTime = Number(stored);
    const update = () => {
      const remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining <= 0) {
        setCooldown(false);
        localStorage.removeItem("spinCooldown");
        clearInterval(timer);
      }
    };
    const timer = setInterval(update, 1000);
    setCooldown(true);
    update();
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full min-h-[50vh] flex justify-center">
      <div className="relative w-[90%] max-w-full md:max-w-[600px] h-full bg-white p-8 rounded-2xl">
        <h2 className="text-[#96c94b] uppercase text-5xl font-bold text-center mb-5">
          Spining Now
        </h2>
        <div className="w-full mb-4">
          <SelectComponent
            value={select}
            label="Select Group"
            handleChange={(value: string) => {
              setSelect(value);
              setResult("");
              setUrl("");
            }}
            datas={groupOptions}
            color="#F3F3F3"
          />{" "}
        </div>
        {select ? (
          wheelItems?.length > 0 ? (
            <div>
              <div className="relative flex justify-center items-center">
                <canvas ref={canvasRef} />
                <img
                  src={SpinIcon}
                  className="absolute w-6 md:w-14 top-[45%] -right-3 md:right-[-20px]"
                />
                <button
                  onClick={spin}
                  disabled={spinning || cooldown}
                  className={`absolute text-xl w-10 min-w-20 h-20 flex justify-center items-center rounded-full font-bold
                              ${spinning || cooldown ? "bg-gray-200 cursor-not-allowed" : "bg-[#cbf38b] cursor-pointer"}
                            `}
                >
                  {cooldown ? `${timeLeft}S` : "SPIN"}
                </button>
              </div>
              {result ? (
                <div className="w-fit flex bg-[#cbf38b] text-md text-center px-5 m-auto py-3 rounded-2xl gap-5 justify-center items-center mt-5">
                  <a href={url} target="_blank" rel="noreferrer">
                    {result}
                  </a>
                  <span
                    onClick={handleCopy}
                    className="cursor-pointer hover:text-black"
                  >
                    {copied ? (
                      <i className="fa-solid fa-copy"></i>
                    ) : (
                      !spinning && <i className="fa-regular fa-copy"></i>
                    )}
                  </span>
                </div>
              ) : null}
            </div>
          ) : (
            <p>Group Items Not Found</p>
          )
        ) : (
          <p>Please Select Group</p>
        )}
      </div>
    </div>
  );
}
