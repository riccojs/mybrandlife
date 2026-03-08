import { useEffect, useCallback, useState } from "react";
import { useScanPulsetrackMutation } from "../redux/features/pulsetrack/pulsetrackApi";

interface NavigatorConnection {
  effectiveType?: string;
}

export function useScan(idPrefix?: string, userId?: string) {
  const [scanPulsetrack] = useScanPulsetrackMutation();
  const [isShow, setIsShow] = useState(false);
  const [scanId, setScanId] = useState("");
  const collectData = useCallback(async () => {
    if (!idPrefix || !userId) return;
    const deviceType = /mobile/i.test(navigator.userAgent)
      ? "mobile"
      : /tablet/i.test(navigator.userAgent)
        ? "tablet"
        : "desktop";
    const connection = (
      navigator as Navigator & { connection?: NavigatorConnection }
    ).connection;
    let ipAddress = "";
    let geoCity = "";
    let geoRegion = "";
    let geoCountry = "";
    try {
      const res = await fetch("https://api.ipify.org?format=json");
      const ipData = await res.json();
      const geoRes = await fetch(`https://ipapi.co/${ipData.ip}/json/`);
      const geo = await geoRes.json();
      ipAddress = geo.ip;
      geoCity = geo.city;
      geoRegion = geo.region;
      geoCountry = geo.country;
    } catch {
      console.warn("IP lookup failed");
    }
    const payload = {
      landerId: userId,
      browser: navigator.userAgent,
      os: navigator.platform,
      deviceType,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      devicePixelRatio: window.devicePixelRatio,
      language: navigator.language,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      connectionType: connection?.effectiveType || "unknown",
      ipAddress: ipAddress,
      geoCity: geoCity,
      geoRegion: geoRegion,
      geoCountry: geoCountry,
    };
    scanPulsetrack({ id: idPrefix, pulsetrack: payload })
      .unwrap()
      .then((res) => {
        setIsShow(true);
        setScanId(res?.pulsetrack?.id);
      });
    setTimeout(() => {
      window.history.replaceState({}, document.title, window.location.pathname);
    }, 1000);
  }, [idPrefix, userId, scanPulsetrack]);

  useEffect(() => {
    collectData();
  }, [collectData]);

  return { isShow, setIsShow, scanId };
}
