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
import CreateOnboard from "./pages/Create-onboard";
import UpdateOnboard from "./pages/Update.onboard";
import WristbandOrderConfirmation from "./pages/Wristband.order.confirmation";
import GoogleConnectsuccess from "./pages/Google.connectsuccess";
import StripeConnectsuccess from "./pages/Stripe.connectSuccess";
import TipPaymentSuccess from "./pages/Tip.paymenstsuccess";
import PrivateRoute from "./route/Private.route";
import Login from "./pages/Login";
import Reset from "./pages/Reset";
import ResetPassword from "./pages/Reset.password";
import AccessRoute from "./route/Access.route";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<AuthRoute />}>
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/reset" element={<Reset />} />
          <Route path="/auth/reset/:token" element={<ResetPassword />} />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/build-your-lander" element={<CreateOnboard />} />
          <Route path="/onboard/:id" element={<UpdateOnboard />} />
          <Route path="/onboard/update/:id" element={<SIngleOnboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/setting" element={<Setting />} />
          <Route path="/subscription" element={<Subscription />} />
          <Route path="/onboard" element={<OnboardingList />} />
          <Route element={<AccessRoute />}>
            <Route path="/brandbook/slot" element={<CreateSlot />} />
            <Route path="/echo" element={<Echos />} />
            <Route path="/brandbook" element={<Brandbook />} />
            <Route path="/brandtrack" element={<Brandtrack />} />
            <Route path="/spin" element={<SpinList />} />
            <Route path="/ordered-wristband" element={<OrderedWristband />} />
            <Route
              path="/ordered-wristband/:id"
              element={<OrderedWristbandView />}
            />
            <Route
              path="/ordered_wristband/confirmation/:id"
              element={<WristbandOrderConfirmation />}
            />
            <Route
              path="/google/connect/success"
              element={<GoogleConnectsuccess />}
            />
            <Route
              path="/stripe/connect/success"
              element={<StripeConnectsuccess />}
            />
            <Route
              path="/stripe/tip/payment/success"
              element={<TipPaymentSuccess />}
            />
            <Route path="/brandshare" element={<JoinUserList />} />
          </Route>

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
        </Route>
        <Route path="*" element={<ErrorPage />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
