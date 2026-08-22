import { useState, useMemo } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import type {
  AnalyticsType,
  DefaultPulsetrackType,
} from "../../utils/pulsetrack.types";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const card =
  "bg-white border border-[#E2E8F0] rounded-[14px] shadow-[0_1px_2px_rgba(16,24,40,0.04)]";

function DashboardBarchat({ data }: { data: DefaultPulsetrackType }) {
  const [range, setRange] = useState(7);
  const { labels, counts, totalScans, topId, topCount } = useMemo(() => {
    const analytics = data?.analytics || [];
    const now = new Date();
    const filtered = analytics.filter((a: AnalyticsType) => {
      const occurred = new Date(a.occurredAt);
      const diffDays = Math.floor(
        (now.getTime() - occurred.getTime()) / (1000 * 60 * 60 * 24),
      );
      return diffDays < range;
    });

    const countsMap: Record<number, number> = {};
    filtered.forEach((a: AnalyticsType) => {
      countsMap[a.idPrefix] = (countsMap[a.idPrefix] || 0) + 1;
    });
    const sorted = Object.entries(countsMap)
      .map(([idPrefix, count]) => ({ idPrefix, count }))
      .sort((a, b) => b.count - a.count);
    const top7 = sorted.slice(0, 7);
    const top = sorted[0] || { idPrefix: 0, count: 0 };
    return {
      labels: top7.map((t) => t.idPrefix.toString()),
      counts: top7.map((t) => t.count),
      totalScans: filtered.length,
      topId: top.idPrefix,
      topCount: top.count,
    };
  }, [data, range]);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Top Performance IDs",
        data: counts,
        backgroundColor: "rgba(132, 204, 22, 0.7)",
        borderColor: "#84CC16",
        borderWidth: 2,
        borderRadius: 6,
        barPercentage: 0.5,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
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
        ticks: { color: "#64748b", font: { size: 12, weight: 500 } },
      },
      y: {
        beginAtZero: true,
        grid: { color: "#F1F5F9", borderDash: [4, 4] },
        ticks: { display: true },
      },
    },
  };

  return (
    <div className={`${card} p-6 mb-8`}>
      <div className="flex flex-wrap gap-5 md:gap-0 justify-between items-start mb-6">
        <div>
          <h2 className="text-base font-semibold text-[#0F172A]">
            Top Pulse Analytics
          </h2>
          <div className="mt-2 flex flex-col gap-1">
            <span className="text-sm text-gray-500">Top Performer ID:</span>
            <span className="text-2xl font-semibold text-[#0F172A]">
              {topId} ({topCount.toLocaleString()} scans)
            </span>
            <span className="text-sm text-gray-400">
              Total scans in last {range} days: {totalScans.toLocaleString()}
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
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}

export default DashboardBarchat;
