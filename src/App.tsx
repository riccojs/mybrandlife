import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router";
import { Toaster } from "react-hot-toast";
import ScrollToTop from "./component/Scroll.toTop";
import AuthRoute from "./route/Auth.route";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Setting from "./pages/Setting";
import Subscription from "./pages/Subscription";
import Brandtrack from "./pages/Brandtrack";
import Pulsetrack from "./pages/Pulsetrack";
import ProjectList from "./component/pulsetrack/Project.list";
import WristbandStore from "./component/pulsetrack/Wristband.store";
import WristbandList from "./component/pulsetrack/Wristband.list";
import OrderList from "./component/pulsetrack/Order.list";
import OrderSummery from "./component/pulsetrack/Order.summery";
import ExportData from "./component/pulsetrack/Export.data";
import PulsetrackDashboard from "./component/pulsetrack/Pulsetrack.dashboard";
import JoinUserList from "./pages/Join.user.list";
import OnboardingList from "./pages/Onboarding-list";
import SIngleOnboard from "./pages/Single.onboard";
import Brandbook from "./pages/Brandbook";
import CreateSlot from "./pages/Create.slot";
import Echos from "./pages/Echos";
import SpinList from "./pages/Spin-list";
import OrderedWristband from "./pages/Ordered.wristband";
import OrderedWristbandView from "./pages/Ordered.wristband.view";
import ErrorPage from "./pages/Error.page";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<AuthRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/setting" element={<Setting />} />
          <Route path="/subscription" element={<Subscription />} />
          <Route path="/brandtrack" element={<Brandtrack />} />
          <Route path="/brandshare" element={<JoinUserList />} />
          <Route path="/onboard" element={<OnboardingList />} />
          <Route path="/onboard/update/:id" element={<SIngleOnboard />} />
          <Route path="/brandbook" element={<Brandbook />} />
          <Route path="/brandbook/slot" element={<CreateSlot />} />
          <Route path="/echo" element={<Echos />} />
          <Route path="/spin" element={<SpinList />} />
          <Route path="/ordered-wristband" element={<OrderedWristband />} />
          <Route
            path="/ordered-wristband/:id"
            element={<OrderedWristbandView />}
          />

          <Route path="/pulsetrack" element={<Pulsetrack />}>
            <Route index element={<PulsetrackDashboard />} />
            <Route path="projects" element={<ProjectList />} />
            <Route path="projects/:id" element={<WristbandStore />} />
            <Route path="projects/wristband/:id" element={<WristbandList />} />
            <Route path="orders" element={<OrderList />} />
            <Route path="orders/success/:id" element={<OrderSummery />} />
            <Route path="export" element={<ExportData />} />
            <Route path="setting" element={<Dashboard />} />
          </Route>
          <Route path="*" element={<ErrorPage />} />
        </Route>
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
