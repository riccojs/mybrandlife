import { useEffect } from "react";
import { init, track } from "@plausible-analytics/tracker";

let isPlausibleInitialized = false;
export function usePlausible(landerName: string) {
  useEffect(() => {
    if (!isPlausibleInitialized) {
      init({
        domain: "mybrandlife.me",
        bindToWindow: true,
        customProperties: { lander: landerName },
        captureOnLocalhost: true,
      });
      isPlausibleInitialized = true;
    }
    track("Pageview", { props: { lander: landerName } });
  }, [landerName]);
}
