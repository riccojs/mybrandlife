import DashboardTsbs from "./Dashboard.tsbs";
import DashboardLinechart from "./Dashboard.linechart";
import DashboardBarchat from "./Dashboard.barchat";
import { useAuth } from "../../hook/useAuth";
import { useGetDefaultPulsetrackQuery } from "../../redux/features/pulsetrack/pulsetrackApi";

function PulsetrackDashboard() {
  const { user } = useAuth();
  const userId = user?.id;
  const { data, isLoading, isFetching } = useGetDefaultPulsetrackQuery(userId);

  return (
    <div className="p-5 bg-[#F7F9FC]">
      <DashboardTsbs
        data={data}
        isFetching={isFetching}
        isLoading={isLoading}
      />
      <DashboardLinechart data={data} />
      <DashboardBarchat data={data} />
    </div>
  );
}

export default PulsetrackDashboard;
