import { useSetting } from "../hook/useSetting";
import Spiner from "../component/Spiner";
import Maintenance from "../pages/Maintenance";
import { useAuth } from "../hook/useAuth";

function MaintenanceRoute({ children }: { children: React.ReactNode }) {
  const { isLoading } = useAuth();
  const { setting, isLoading: settingLoading } = useSetting();
  if (isLoading || settingLoading) return <Spiner />;
  if (setting?.maintenance) {
    return <Maintenance />;
  }
  return children;
}

export default MaintenanceRoute;
