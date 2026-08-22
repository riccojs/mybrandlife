import { useEffect, useRef } from "react";
import lottie from "lottie-web";
import animationData from "../assets/Full Lottie animation.json";

function LottieAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const animation = lottie.loadAnimation({
      container: containerRef.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData,
    });

    return () => {
      animation.destroy();
    };
  }, []);

  return (
    <div className="container py-5">
      <div ref={containerRef} className="w-full aspect-square" />
    </div>
  );
}

export default LottieAnimation;
