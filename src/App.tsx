import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router";
import ScrollToTop from "./component/Scroll.toTop";
import PrivateRoute from "./route/Private.route";
import Dashboard from "./pages/Dashboard";
import AuthRoute from "./route/Auth.route";
import Login from "./pages/Login";
import { Toaster } from "react-hot-toast";
import Setting from "./pages/Setting";
import Profile from "./pages/Profile";
import OrderedWristband from "./pages/Ordered.wristband";
import OrderedWristbandView from "./pages/Ordered.wristband.view";
import WistbandList from "./pages/Wristband.list";
import OnboardList from "./pages/Onboardlist";
import SIngleOnboard from "./pages/Single.onboard";
import Notification from "./pages/Notification";
import ContactVault from "./pages/Contact.vault";
import Activities from "./pages/Activities";
import SingleActivity from "./pages/Single.activity";
import Pulsetrack from "./pages/Pulsetrack";
import SinglePulsetrack from "./pages/Single.pulsetrack";
import ReportList from "./pages/Report.list";
import ContactList from "./pages/Contact.list";
import BrandShareList from "./pages/Brandshare.list";
import BrrandshareJoiners from "./component/brandshare/Brandshare.joiners";
import PartnerList from "./pages/Partner.list";
import DomainList from "./pages/Domain.list";
import SpinList from "./pages/Spin.list";
import EchoList from "./pages/Echo.list";
import BrandbookList from "./pages/Brandbook.list";
import UserList from "./pages/User.list";
import SIngleUser from "./pages/SIngle.user";
import UserProfile from "./component/user/User.profile";
import UserSecurity from "./component/user/User.security";
import UserMembership from "./component/user/User.membership";
import ErrorPage from "./pages/Error.page";
import OrderConfirmation from "./pages/Order.confirmation";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<AuthRoute />}>
          <Route path="/auth/login" element={<Login />} />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/setting" element={<Setting />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/ordered-wristband" element={<OrderedWristband />} />
          <Route
            path="/ordered-wristband/:id"
            element={<OrderedWristbandView />}
          />
          <Route path="/wristband" element={<WistbandList />} />
          <Route path="/onboard" element={<OnboardList />} />
          <Route path="/onboard/update/:id" element={<SIngleOnboard />} />
          <Route path="/notification" element={<Notification />} />
          <Route path="/vault_contact" element={<ContactVault />} />
          <Route path="/activity" element={<Activities />} />
          <Route path="/activity/:id" element={<SingleActivity />} />
          <Route path="/pulsetrack" element={<Pulsetrack />} />
          <Route path="/pulsetrack/:id" element={<SinglePulsetrack />} />
          <Route path="/report" element={<ReportList />} />
          <Route path="/contact" element={<ContactList />} />
          <Route path="/brandshare" element={<BrandShareList />} />
          <Route path="/brandshare/:code" element={<BrrandshareJoiners />} />
          <Route path="/partner" element={<PartnerList />} />
          <Route path="/domain_request" element={<DomainList />} />
          <Route path="/spin" element={<SpinList />} />
          <Route path="/echo" element={<EchoList />} />
          <Route path="/brandbook" element={<BrandbookList />} />
          <Route path="/user" element={<UserList />} />
          <Route
            path="/ordered-wristband/confirmation/:id"
            element={<OrderConfirmation />}
          />
          <Route path="/user/:id" element={<SIngleUser />}>
            <Route index element={<UserProfile />} />
            <Route path="security" element={<UserSecurity />} />
            <Route path="membership" element={<UserMembership />} />
          </Route>
          <Route path="*" element={<ErrorPage />} />
        </Route>
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
