import { useAuth } from "../../hook/useAuth";
import { useExportPulsetrackMutation } from "../../redux/features/pulsetrack/pulsetrackApi";
import ExportCard from "./Export.card";
import ExportTable from "./Export.table";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import toast from "react-hot-toast";

const ExportData = () => {
  const { user } = useAuth() as {
    user: { id: string; pulsetrackDatas: [] } | null;
  };
  const userId = user?.id;
  const [exportPulsetrack, { isLoading }] = useExportPulsetrackMutation();

  const handleDownload = async (type: string, days: number) => {
    const pulsetrack = { type: type, days: days };
    try {
      const blob = await exportPulsetrack({ id: userId, pulsetrack }).unwrap();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `pulsetrack_last_${days}_days.${type}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      const err = error as FetchBaseQueryError;
      toast.error(
        (err.data as { message?: string })?.message ??
          "Failed to export PulseTrack.",
      );
    }
  };

  const existPulsetrack = user?.pulsetrackDatas;

  return (
    <div className="min-h-screen bg-[#F7F9FC] px-6 py-8 md:px-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[26px] font-semibold text-[#1F2937]">
          Export PulseTrack Analytics
        </h1>
        <p className="text-[#6B7280] mt-1 text-[14px]">
          Select an export option to download your wristband performance and
          engagement data.
        </p>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ExportCard
          title="Last 7 Days"
          subtitle="Quick export of recent activity"
          handleDownload={handleDownload}
          duration={7}
          isLoading={isLoading}
          disable={existPulsetrack?.length === 0}
        />
        <ExportCard
          title="Last 30 Days"
          subtitle="Comprehensive monthly summary"
          handleDownload={handleDownload}
          duration={30}
          isLoading={isLoading}
          disable={existPulsetrack?.length === 0}
        />
      </div>
      <ExportTable />
    </div>
  );
};

export default ExportData;
