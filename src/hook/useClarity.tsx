import { useEffect } from "react";
import Clarity from "@microsoft/clarity";

declare global {
  interface Window {
    clarityLoaded?: boolean;
  }
}

export function useClarity(projectId: string) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.clarityLoaded) return;
    Clarity.init(projectId);
    window.clarityLoaded = true;
  }, [projectId]);
}
