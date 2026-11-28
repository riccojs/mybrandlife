import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router";
import { Toaster } from "react-hot-toast";
import ScrollToTop from "./component/Scroll.toTop";
import AuthBootstrap from "./redux/Auth.bootstrap";
import PublicRoute from "./route/Public.route";
import GuestRoute from "./route/Guest.route";
import PrivateRoute from "./route/Private.route";
import OverviewPage from "./page/Overview.page";
import PricingPage from "./page/Pricing.page";
import LoginPage from "./page/Login.page";
import ResetPage from "./page/Reset.page";
import ResetPasswordPage from "./page/Reset.password.page";
import PaymentVerifyPage from "./page/Payment.verify.page";
import OnboardPage from "./page/Onboard.Page";
import FeaturePage from "./page/Feature.page";
import HowItWorksPage from "./page/How.it.works.page";
import GetStartedPage from "./page/Get.started.page";
import TermsPage from "./page/Terms.page";
import PrivacyPage from "./page/Privacy.page";
import SupportPage from "./page/Support.page";
import NotFoundPage from "./page/Not.found.page";

function App() {
  return (
    <AuthBootstrap>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/" element={<OverviewPage />} />
            <Route path="/feature" element={<FeaturePage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/support" element={<SupportPage />} />
            {/* Handles signed-out sign up and signed-in "finish checkout" itself. */}
            <Route path="/get-started" element={<GetStartedPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
          <Route element={<PublicRoute contained={false} />}>
            <Route element={<GuestRoute />}>
              <Route path="/auth/sign-in" element={<LoginPage />} />
              <Route path="/auth/reset" element={<ResetPage />} />
              <Route path="/auth/reset/:token" element={<ResetPasswordPage />} />
            </Route>
            {/* Stripe Checkout success_url (backend BPS_SITE_URL/auth/verify). */}
            <Route path="/auth/verify" element={<PaymentVerifyPage />} />
          </Route>
          <Route element={<PrivateRoute />}>
            <Route path="/onboard" element={<OnboardPage />} />
          </Route>
        </Routes>
        <Toaster position="top-center" />
      </BrowserRouter>
    </AuthBootstrap>
  );
}

export default App;
