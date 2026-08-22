import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import type { ChartOptions, ChartData } from "chart.js";
import { useSearchParams } from "react-router";
import PlausibleChartLoader from "../loader/Plausible.chart.loader";
import { useGetPlusibleDataQuery } from "../../redux/features/partner/partnerApi";
import SelectComponent from "../ui/Select.component";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface DashChartProps {
  lander: string;
}

const LanderAnalytics = ({ lander }: DashChartProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const period = searchParams.get("analytics_period") || "";
  const { data, isLoading } = useGetPlusibleDataQuery({
    landername: lander,
    period: period || "7d",
  });

  if (isLoading) return <PlausibleChartLoader />;

  const chartDataArray =
    data?.timeseries?.map(
      (item: {
        date: string;
        visitors: number;
        pageviews: number;
        events: number;
      }) => ({
        date: new Date(item.date).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
        }),
        visitors: item.visitors ?? 0,
        pageviews: item.pageviews ?? 0,
        buttonClicks: item.events ?? 0,
      }),
    ) || [];

  const chartData: ChartData<"bar"> = {
    labels: chartDataArray.map((d: { date: string }) => d.date),
    datasets: [
      {
        label: "Visitors",
        data: chartDataArray.map(
          (d: { date: string; visitors: number }) => d.visitors,
        ),
        backgroundColor: "#1F3B73",
        borderRadius: 4,
      },
      {
        label: "Pageviews",
        data: chartDataArray.map((d: { pageviews: number }) => d.pageviews),
        backgroundColor: "#00C897",
        borderRadius: 4,
      },
      {
        label: "Button Clicks",
        data: chartDataArray.map(
          (d: { buttonClicks: number }) => d.buttonClicks,
        ),
        backgroundColor: "#F59E0B",
        borderRadius: 4,
      },
    ],
  };

  const chartOptions: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true },
    },
  };

  return (
    <div className="w-full mx-auto p-6 bg-white border border-gray-200 rounded-lg">
      <div className="flex justify-between items-center w-full mb-5">
        <p className="text-gray-500 mb-4">
          Last {period === "" ? "7d" : period} Visitors, Page Views and Button
          Clicks Overview
        </p>
        <div className="w-40 min-w-40">
          <SelectComponent
            value={period}
            label="Period"
            handleChange={(value: string) => {
              if (value) {
                searchParams.set("analytics_period", value);
              } else {
                searchParams.delete("analytics_period");
              }
              setSearchParams(searchParams);
            }}
            datas={[
              { key: "7 Days", value: "7d" },
              { key: "30 Days", value: "30d" },
            ]}
            color="#F3F3F3"
          />
        </div>
      </div>
      <div className="h-125">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default LanderAnalytics;
