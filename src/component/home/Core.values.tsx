import { SquareArrowOutUpRight } from "lucide-react";
import { Link } from "react-router";

function CoreValues() {
  return (
    <section className="my-5 md:my-10">
      <div className="container">
        <h2 className="text-black text-lg md:text-3xl xl:text-4xl font-bold text-center">
          Our Core Values
        </h2>
        <p className="text-sm md:text-base text-black text-center font-normal w-full md:w-10/12 m-auto py-2">
          Our core values power every step of your journey. With My Brand Life,
          you'll build a presence that's personal, impactful, and unforgettable.
          By uniting all your social platforms under one brand, we connect you
          directly to your customers through smart technology and meaningful
          connections. It's time to turn your unique story into a brand that
          shines.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mt-5 md:mt-10">
          <Link to="/pricing" className="h-full">
            <div className="bg-[#e8ffc4] p-5 md:p-10 rounded-lg flex flex-col gap-3 relative hover-effect">
              <div className="absolute -top-2.5 left-8 w-10/12 h-5 bg-[#dcffa4] rounded-t-lg"></div>
              <p className="text-black bg-[#96c94b] text-xs md:text-sm px-4 py-1 rounded-md font-medium w-fit">
                1 - Unify Your Brand
              </p>
              <h2 className="text-black text-md md:text-xl font-medium">
                Empower Your Brand
              </h2>
              <p className="text-black text-sm md:text-base font-normal">
                Bring your links, content, contact information, and brand tools
                together in one place.
              </p>
            </div>
          </Link>
          <Link to="/pricing" className="h-full">
            <div className="bg-[#e8ffc4] p-5 md:p-10 rounded-lg flex flex-col gap-3 relative hover-effect h-full">
              <div className="absolute -top-2.5 left-8 w-10/12 h-5 bg-[#dcffa4] rounded-t-lg"></div>
              <p className="text-black bg-[#96c94b] text-xs md:text-sm px-4 py-1 rounded-md font-medium w-fit">
                2 - Engage Your Audience
              </p>
              <h2 className="text-black text-md md:text-xl font-medium">
                Connect With People
              </h2>
              <p className="text-black text-sm md:text-base font-normal">
                Give people simple ways to connect, interact, request, book, and
                respond.
              </p>
            </div>
          </Link>
          <Link to="/pricing" className="h-full">
            <div className="bg-[#e8ffc4] p-5 md:p-10 rounded-lg flex flex-col gap-3 relative hover-effect h-full">
              <div className="absolute -top-2.5 left-8 w-10/12 h-5 bg-[#dcffa4] rounded-t-lg"></div>
              <p className="text-black bg-[#96c94b] text-xs md:text-sm px-4 py-1 rounded-md font-medium w-fit">
                3 - Expand Your Presence
              </p>
              <h2 className="text-black text-md md:text-xl font-medium">
                Build Your Presence
              </h2>
              <p className="text-black text-sm md:text-base font-normal">
                Use your My Brand Life page, QR codes, NFC, analytics, and
                connected tools to reach people wherever they are.
              </p>
            </div>
          </Link>
        </div>
        <Link
          to="/follow-us"
          className="flex w-fit active:scale-[0.98] m-auto mt-6 items-center gap-2 px-8 py-3 rounded-full hover:bg-[#589c28] text-white text-xs md:text-sm font-medium shadow-lg transition-all bg-[#65B32E] shadow-[#65B32E]/25"
        >
          <SquareArrowOutUpRight size={15} />
          See a My Brand Life Page in Action
        </Link>
      </div>
    </section>
  );
}

export default CoreValues;
