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

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface DataTypes {
  data: {
    users: UserDataType[];
    templates: TemplateType[];
  };
}

interface UserDataType {
  id: string | null;
  email: string | null;
  create_at: string | null;
  landerName: string | null;
  planPrice: number | null;
  profile: string | null;
  userTemplete: TemplateType[];
  discountType: string;
}

interface TemplateType {
  id: string | null;
  logo: string | null;
  create_at: string | null;
  tagLine: string | null;
  offerings: string | null;
}

const DashChart = ({ data }: DataTypes) => {
  const now = new Date();
  const daysArray: string[] = [];

  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    daysArray.push(d.toISOString().split("T")[0]);
  }

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toISOString().split("T")[0];
  };

  const dailyStats = daysArray.map((dateStr) => {
    const getUserData = data?.users?.filter((item) => {
      if (item?.discountType) {
        return item.discountType !== "LIFETIME";
      }
      return;
    });
    const usersOnDate = getUserData?.filter(
      (u) => u.create_at && formatDate(u.create_at) === dateStr,
    );
    const templatesOnDate = data?.templates?.filter(
      (t) => t.create_at && formatDate(t.create_at) === dateStr,
    );

    const totalEarning = usersOnDate?.reduce(
      (sum, u) => sum + (u.planPrice ?? 0),
      0,
    );

    return {
      date: dateStr,
      totalOnboard: templatesOnDate?.length,
      totalEarning,
    };
  });

  const chartData: ChartData<"bar"> = {
    labels: dailyStats.map((d) =>
      new Date(d.date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
      }),
    ),
    datasets: [
      {
        label: "Total Onboarding",
        data: dailyStats.map((d) => d.totalOnboard),
        backgroundColor: "#1F3B73",
        borderRadius: 4,
      },
      {
        label: "Total Earning",
        data: dailyStats.map((d) => d.totalEarning),
        backgroundColor: "#00C897",
        borderRadius: 4,
      },
    ],
  };

  const chartOptions: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: "top" },
      tooltip: { enabled: true },
    },
    scales: {
      x: {
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        grid: { display: true },
      },
    },
  };

  return (
    <div className="w-full mx-auto p-6 bg-white border border-gray-200 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <p className="text-gray-500">Last 30 Days Overview</p>
      </div>
      <div className="h-[500px]">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default DashChart;
