import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router";
import Wireframe from "./pages/Wireframe";
import ErrorPage from "./pages/Error.page";
import { Toaster } from "react-hot-toast";
import useFavicon from "./hook/useFavicon";
import PaymentSuccess from "./pages/Payment.success";
import RequestTv from "./pages/Request.tv";
import { useClarity } from "./hook/useClarity";
import RedirectRoute from "./Redirect.route";

function App() {
  useFavicon();
  useClarity(import.meta.env.VITE_APP_CLARITY_ID);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/error" element={<ErrorPage />} />
        <Route path="/:name" element={<Wireframe />} />
        <Route path="/payment/success/:name" element={<PaymentSuccess />} />
        <Route path="/:name/request_tv" element={<RequestTv />} />
        <Route path="/" element={<RedirectRoute />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
