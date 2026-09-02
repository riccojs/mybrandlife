import { useSetting } from "../hook/useSetting";
import Spiner from "../component/Spiner";
import Maintenance from "../pages/Maintenance";

function MaintenanceRoute({ children }: { children: React.ReactNode }) {
  const { setting, isLoading } = useSetting();
  if (isLoading) return <Spiner />;
  if (setting?.maintenance) {
    return <Maintenance />;
  }
  return children;
}

export default MaintenanceRoute;
