import { useState, useMemo } from "react";
import { Line } from "react-chartjs-2";
import type { ChartOptions } from "chart.js";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import type { DefaultPulsetrackType } from "../../utils/pulsetrack.types";
import useLinkScanStats from "../../hook/useLineScanState";
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
);
const card =
  "bg-white border border-[#E2E8F0] rounded-[14px] shadow-[0_1px_2px_rgba(16,24,40,0.04)]";

function DashboardLinechart({ data }: { data: DefaultPulsetrackType }) {
  const [range, setRange] = useState(7);
  const { totalCurrent, percentageChange, isIncrease } = useLinkScanStats(
    data,
    range,
  );

  const chartData = useMemo(() => {
    const analytics = data?.analytics || [];
    const now = new Date();
    const daysArray: string[] = [];
    const scanCounts: number[] = [];

    for (let i = range - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(now.getDate() - i);

      const label = date.toLocaleDateString("en-US", { weekday: "short" });
      const dayString = date.toDateString();

      daysArray.push(label);

      const count = analytics.filter(
        (item) => new Date(item.occurredAt).toDateString() === dayString,
      ).length;

      scanCounts.push(count);
    }

    return {
      labels: daysArray,
      datasets: [
        {
          data: scanCounts,
          borderColor: "#84CC16",
          backgroundColor: "rgba(132,204,22,0.06)",
          borderWidth: 3,
          tension: 0.45,
          fill: true,
          pointRadius: 0,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "#84CC16",
          pointHoverBorderColor: "#ffffff",
          pointHoverBorderWidth: 2,
        },
      ],
    };
  }, [data, range]);

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#ffffff",
        titleColor: "#0f172a",
        bodyColor: "#0f172a",
        borderColor: "#E2E8F0",
        borderWidth: 1,
        padding: 10,
        displayColors: false,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: "#64748b",
          font: { size: 12, weight: 500 },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "#F1F5F9",
        },
        ticks: { display: false },
      },
    },
  };

  return (
    <div className={`${card} p-6 mb-8`}>
      <div className="flex flex-wrap gap-5 md:gap-0 justify-between items-start mb-6">
        <div>
          <h2 className="text-base font-semibold text-[#0F172A]">
            Pulse Analytics Overview
          </h2>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-3xl font-semibold text-[#0F172A]">
              {totalCurrent.toLocaleString()}
            </span>
            <span
              className={`text-sm font-medium ${isIncrease ? "text-[#16A34A]" : "text-[#DC2626]"}`}
            >
              {isIncrease ? "↑" : "↓"} {Math.abs(percentageChange).toFixed(1)}%
            </span>
          </div>
        </div>

        <div className="flex bg-[#F1F5F9] p-1 rounded-xl">
          {[7, 30, 90].map((days) => (
            <button
              key={days}
              onClick={() => setRange(days)}
              className={`px-4 py-1.5 text-sm rounded-lg ${
                range === days
                  ? "bg-white text-[#0F172A] shadow-sm"
                  : "text-[#64748B]"
              }`}
            >
              {days} Days
            </button>
          ))}
        </div>
      </div>

      <div className="h-100">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}

export default DashboardLinechart;
