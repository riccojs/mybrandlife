import { useEffect } from "react";

let lockCount = 0;

const useBodyScroll = (isShow: boolean): void => {
  useEffect(() => {
    if (!isShow) return;
    lockCount++;
    document.body.style.overflow = "hidden";
    return () => {
      lockCount--;
      if (lockCount <= 0) {
        lockCount = 0;
        document.body.style.overflow = "";
      }
    };
  }, [isShow]);
};

export default useBodyScroll;
