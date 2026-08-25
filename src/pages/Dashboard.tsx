import DashboardChart from "../component/dashboard/Dashboard.chart";
import DashboardHeader from "../component/dashboard/Dashboard.header";
import DashboardMembers from "../component/dashboard/Dashboard.members";
import DashboardPulsechart from "../component/dashboard/Dashboard.pulsechart";
import DashboardTabs from "../component/dashboard/Dashboard.tabs";
import DashboardTemplates from "../component/dashboard/Dashboard.templates";
import DashHeaderLoader from "../component/loader/Dash.header.loader";
import DashTabsLoader from "../component/loader/Dash.tabs.loader";
import { useGetAllUserByAdminQuery } from "../redux/features/auth/authApi";

interface DataTypes {
  data: {
    users: UserDataType[];
    templates: TemplateType[];
  };
  isLoading: boolean;
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

function Dashboard() {
  const { data, isLoading } = useGetAllUserByAdminQuery() as DataTypes;

  return (
    <div className="p-5 h-full">
      <div className="w-ful flex flex-col gap-5">
        {isLoading ? <DashHeaderLoader /> : <DashboardHeader />}
        {isLoading ? (
          <DashTabsLoader />
        ) : (
          <DashboardTabs isLoading={isLoading} data={data} />
        )}
      </div>
      <div className="my-5">
        <DashboardChart data={data} />
      </div>
      <div className="flex lg:flex-row flex-col gap-5">
        <DashboardTemplates data={data} isLoading={isLoading} />
        <DashboardMembers data={data} isLoading={isLoading} />
      </div>
      <DashboardPulsechart />
    </div>
  );
}

export default Dashboard;
