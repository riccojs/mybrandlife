import posthog from "posthog-js";

posthog.init(import.meta.env.VITE_APP_PUBLIC_POSTHOG_KEY, {
  api_host: import.meta.env.VITE_APP_PUBLIC_POSTHOG_HOST,
  autocapture: true,
  capture_pageview: false,
  persistence: "localStorage",
});

export default posthog;
