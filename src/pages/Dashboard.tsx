import DashFeatures from "../component/dashboard/Dash.features";
import DashHead from "../component/dashboard/Dash.head";
import DashTabs from "../component/dashboard/Dash.tabs";
import DashHeaderLoader from "../component/loader/Dash.header.loader";
import DashTabsLoader from "../component/loader/Dash.tabs.loader";
import { useAuth } from "../hook/useAuth";

interface AuthType {
  user: ItemType | null;
  isLoading: boolean;
}

interface ItemType {
  midName: string;
  lastName: string;
  landerName: string;
  package: string;
  domain: string;
  userTemplete: [];
}

function Dashboard() {
  const { user, isLoading } = useAuth() as AuthType;

  const existTemplate = user && user?.userTemplete?.length > 0 ? true : false;

  return (
    <div>
      <div className="w-full p-2 md:p-5">
        {!existTemplate && user?.package === "gold" && (
          <div className="mb-5">
            <p className="bg-[#FEFBED] text-[#643315] text-sm font-normal border border-[#f6e599] p-2 rounded-lg mt-1">
              Build your brand to unlock analytics dashboard.
            </p>
          </div>
        )}
        {!existTemplate && user?.package === "silver" && (
          <div className="mb-5">
            <p className="bg-[#FEFBED] text-[#643315] text-sm font-normal border border-[#f6e599] p-3 rounded-lg mt-1">
              Build your brand to unlock analytics dashboard.
            </p>
          </div>
        )}
        {isLoading ? <DashHeaderLoader /> : <DashHead user={user} />}
        {isLoading ? <DashTabsLoader /> : <DashTabs />}
        {isLoading ? <DashTabsLoader /> : <DashFeatures />}
      </div>
    </div>
  );
}

export default Dashboard;
