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
  landerName: string;
  package: string;
  userTemplete: [];
}

function Dashboard() {
  const { user, isLoading } = useAuth() as AuthType;

  const existTemplate = user && user?.userTemplete?.length > 0 ? true : false;

  return (
    <div>
      <div className="w-full p-5">
        {!existTemplate && user?.package === "gold" && (
          <div className="mb-5">
            <p className="text-black bg-amber-100 border-l-3 border-amber-400 p-3 rounded-lg text-lg">
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
