import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router";
import ScrollToTop from "./component/Scroll.toTop";
import WelcomePopup from "./component/popups/Welcome.popup";
import AuthRoute from "./route/Auth.route";
import Login from "./pages/Login";
import { Toaster } from "react-hot-toast";
import Register from "./pages/Register";
import Reset from "./pages/Reset";
import ResetPassword from "./pages/Reset.password";
import VerifyOtp from "./pages/Verify.otp";
import PublicRoute from "./route/Public.route";
import HomePage from "./pages/Home.page";
import Pricing from "./pages/Pricing";
import ContactPage from "./pages/Contact.page";
import FollowUs from "./pages/Follow.us";
import GeneralRoute from "./route/General.route";
import DirectoryPage from "./pages/Directory.page";
import PartnersPage from "./pages/Partner.page";
import AboutUsPage from "./pages/About.us.page";
import TermsCondition from "./pages/Terms.condition";
import PrivacyPolicy from "./pages/Privacy.policy";
import MarketingPage from "./pages/Marketing.page";
import WistbandTracking from "./pages/Wistband.tracking";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <WelcomePopup />
      <Routes>
        <Route element={<AuthRoute />}>
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/auth/reset" element={<Reset />} />
          <Route path="/auth/reset/:token" element={<ResetPassword />} />
          <Route path="/auth/verify" element={<VerifyOtp />} />
        </Route>
        <Route element={<PublicRoute />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/directory" element={<DirectoryPage />} />
          <Route path="/partner" element={<PartnersPage />} />
          <Route path="/about-us" element={<AboutUsPage />} />
          <Route path="/terms-condition" element={<TermsCondition />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/marketing" element={<MarketingPage />} />
          <Route path="/wistband/tracking" element={<WistbandTracking />} />
        </Route>
        <Route element={<GeneralRoute />}>
          <Route path="/follow-us" element={<FollowUs />} />
        </Route>
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
