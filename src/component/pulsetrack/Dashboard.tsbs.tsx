import { TbScanEye } from "react-icons/tb";
import { MdOutlineQrCodeScanner } from "react-icons/md";
import { TbEarScan } from "react-icons/tb";
import { PiScan } from "react-icons/pi";
import type {
  AnalyticsType,
  DefaultPulsetrackType,
} from "../../utils/pulsetrack.types";

function DashboardTsbs({
  data,
  isFetching,
  isLoading,
}: {
  data: DefaultPulsetrackType;
  isLoading: boolean;
  isFetching: boolean;
}) {
  const { analytics } = data || {};
  const today = new Date().toDateString();

  const todayScan = analytics?.filter(
    (item) => new Date(item.occurredAt).toDateString() === today,
  ).length;
  const todayUniqueScan = analytics?.filter(
    (item) =>
      new Date(item.occurredAt).toDateString() === today && item.isUnique,
  ).length;

  const getLastDaysScan = (analytics: AnalyticsType[], days: number) => {
    const now = Date.now();
    const pastDate = now - days * 24 * 60 * 60 * 1000;

    return analytics?.filter((item) => {
      const scanTime = new Date(item?.occurredAt).getTime();
      return scanTime >= pastDate;
    }).length;
  };

  const last7DaysTotalScan = getLastDaysScan(analytics, 7);
  const last30DaysTotalScan = getLastDaysScan(analytics, 30);

  // decide what to render
  let content;
  if (isFetching || isLoading) {
    content = (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8 animate-pulse">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="p-8 bg-white shadow rounded-xl flex justify-between items-center"
          >
            <div className="flex flex-col gap-3">
              <div className="h-3 w-32 bg-gray-200 rounded"></div>
              <div className="h-6 w-20 bg-gray-300 rounded"></div>
            </div>

            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
          </div>
        ))}
      </div>
    );
  }
  if (!isFetching && !isLoading) {
    content = (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <div className="p-8 bg-white shadow rounded-xl flex justify-between items-center">
          <div className="flex flex-col gap-1">
            <p className="text-sm text-[#64748B]">Today Total Scan</p>
            <h3 className="text-2xl font-semibold text-[#0F172A]">
              {todayScan}
            </h3>
          </div>
          <TbScanEye size={50} color="#4CAF50" />
        </div>
        <div className="p-8 bg-white shadow rounded-xl flex justify-between items-center">
          <div className="flex flex-col gap-1">
            <p className="text-sm text-[#64748B]">Today Unique Scan</p>
            <h3 className="text-2xl font-semibold text-[#0F172A]">
              {todayUniqueScan}
            </h3>
          </div>
          <MdOutlineQrCodeScanner size={50} color="#2196F3" />
        </div>
        <div className="p-8 bg-white shadow rounded-xl flex justify-between items-center">
          <div className="flex flex-col gap-1">
            <p className="text-sm text-[#64748B]">Last 7 Day's Total Scan</p>
            <h3 className="text-2xl font-semibold text-[#0F172A]">
              {last7DaysTotalScan}
            </h3>
          </div>
          <TbEarScan size={50} color="#FF9800" />
        </div>
        <div className="p-8 bg-white shadow rounded-xl flex justify-between items-center">
          <div className="flex flex-col gap-1">
            <p className="text-sm text-[#64748B]">Last 30 Day's Total Scan</p>
            <h3 className="text-2xl font-semibold text-[#0F172A]">
              {last30DaysTotalScan}
            </h3>
          </div>
          <PiScan size={50} color="#9C27B0" />
        </div>
      </div>
    );
  }

  return content;
}

export default DashboardTsbs;
