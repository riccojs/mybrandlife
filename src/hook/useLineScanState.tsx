import { useMemo } from "react";
import type { DefaultPulsetrackType } from "../utils/pulsetrack.types";

function useLinkScanStats(data: DefaultPulsetrackType, range: number) {
  const { totalCurrent, totalPrevious, percentageChange, isIncrease } =
    useMemo(() => {
      const analytics = data?.analytics || [];
      const now = new Date();
      let totalCurrent = 0;
      for (let i = 0; i < range; i++) {
        const date = new Date();
        date.setDate(now.getDate() - i);
        const dayString = date.toDateString();
        totalCurrent += analytics.filter(
          (item) => new Date(item.occurredAt).toDateString() === dayString,
        ).length;
      }
      let totalPrevious = 0;
      for (let i = range; i < 2 * range; i++) {
        const date = new Date();
        date.setDate(now.getDate() - i);
        const dayString = date.toDateString();
        totalPrevious += analytics.filter(
          (item) => new Date(item.occurredAt).toDateString() === dayString,
        ).length;
      }
      const percentageChange =
        totalPrevious === 0
          ? totalCurrent === 0
            ? 0
            : 100
          : ((totalCurrent - totalPrevious) / totalPrevious) * 100;
      const isIncrease = totalCurrent >= totalPrevious;
      return { totalCurrent, totalPrevious, percentageChange, isIncrease };
    }, [data, range]);
  return { totalCurrent, totalPrevious, percentageChange, isIncrease };
}

export default useLinkScanStats;
