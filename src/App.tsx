import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router";
import ScrollToTop from "./component/Scroll.toTop";
import { Toaster } from "react-hot-toast";
import Register from "./pages/Register";
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
import ErrorPage from "./pages/Error.page";
import MaintenanceRoute from "./route/Maintenance.route";
import { HelmetProvider } from "react-helmet-async";
import BusinessInfo from "./component/home/Business.info";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <MaintenanceRoute>
        <HelmetProvider>
          <Routes>
            <Route element={<PublicRoute />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/directory" element={<DirectoryPage />} />
              <Route path="/partner" element={<PartnersPage />} />
              <Route path="/about" element={<AboutUsPage />} />
              <Route
                path="/whats-coming-mbl-ecosystem"
                element={<BusinessInfo />}
              />
              <Route
                path="/terms-and-conditions"
                element={<TermsCondition />}
              />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/marketing" element={<MarketingPage />} />
              <Route path="/wistband/tracking" element={<WistbandTracking />} />
              <Route path="/auth/register" element={<Register />} />
              <Route path="/auth/verify" element={<VerifyOtp />} />
            </Route>
            <Route element={<GeneralRoute />}>
              <Route path="/follow-us" element={<FollowUs />} />
            </Route>
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </HelmetProvider>
      </MaintenanceRoute>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
