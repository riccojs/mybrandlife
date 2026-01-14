import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import store from "./redux/app/store.tsx";
import { PostHogProvider } from "posthog-js/react";
import posthog from "posthog-js";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <PostHogProvider client={posthog}>
        <App />
      </PostHogProvider>
    </Provider>
  </StrictMode>
);
