import { FaRegCircleCheck } from "react-icons/fa6";
import { BiArrowToLeft } from "react-icons/bi";
import { Link } from "react-router";
import confetti from "canvas-confetti";
import { useEffect } from "react";

function StripeConnectsuccess() {
  useEffect(() => {
    confetti({
      particleCount: 200,
      spread: 90,
      origin: { x: 0.6, y: 0.6 },
      colors: ["#ff0a54", "#ff477e", "#ff85a1", "#fbb1bd", "#f9bec7"],
    });
    const interval = setInterval(() => {
      confetti({
        particleCount: 100,
        spread: 60,
        origin: { y: 0.6 },
      });
    }, 500);
    setTimeout(() => clearInterval(interval), 1500);
  }, []);

  return (
    <section className="p-5 w-full h-[80vh] flex justify-center items-center">
      <div className="w-125 rounded-xl shadow bg-white p-10 h-96 flex flex-col gap-3 items-center justify-center">
        <FaRegCircleCheck size={50} color="#52C372" />
        <h2 className="text-normal text-[#4F525F] font-medium text-3xl">
          Connection Successful!
        </h2>
        <p className="text-normal text-[#4F525F] font-normal text-mg bg-amber-100 border-l-4 border-amber-400 p-3 rounded-lg">
          Your documents and details have been submitted successfully. Your
          Stripe connection is pending verification. Payments and payouts will
          become available once Stripe confirms your account.
        </p>
        <Link
          to="/echo"
          className="bg-[#cbf38b] w-fit text-normal px-6 py-2 rounded-md flex justify-center items-center gap-2"
        >
          <BiArrowToLeft />
          <p>Back</p>
        </Link>
      </div>
    </section>
  );
}

export default StripeConnectsuccess;
