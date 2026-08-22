import { Link } from "react-router";

function CoreValues() {
  return (
    <section className="my-10">
      <div className="container">
        <h2 className="text-black text-4xl md:text-5xl font-bold text-center">
          Our Core Values
        </h2>
        <p className="text-md text-black text-center font-normal w-10/12 m-auto py-2">
          Our core values power every step of your journey. With My Brand Life,
          you'll build a presence that's personal, impactful, and unforgettable.
          By uniting all your social platforms under one brand, we connect you
          directly to your customers through smart technology and meaningful
          connections. It's time to turn your unique story into a brand that
          shines.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mt-10">
          <Link to="/pricing" className="h-full">
            <div className="bg-[#e8ffc4] p-10 rounded-lg flex flex-col gap-3 relative hover-effect">
              <div className="absolute -top-2.5 left-8 w-10/12 h-5 bg-[#dcffa4] rounded-t-lg"></div>
              <p className="text-black bg-[#96c94b] text-sm px-4 py-1 rounded-md font-medium w-fit">
                1 - Unify Your Brand
              </p>
              <h2 className="text-black text-xl font-medium">
                Empower Your Brand
              </h2>
              <p className="text-black text-md font-normal">
                Bring all your platforms and tools together in one place. A
                single hub makes your brand clear, consistent, and easy to find.
              </p>
            </div>
          </Link>
          <Link to="/pricing" className="h-full">
            <div className="bg-[#e8ffc4] p-10 rounded-lg flex flex-col gap-3 relative hover-effect h-full">
              <div className="absolute -top-2.5 left-8 w-10/12 h-5 bg-[#dcffa4] rounded-t-lg"></div>
              <p className="text-black bg-[#96c94b] text-sm px-4 py-1 rounded-md font-medium w-fit">
                2 - Engage Your People
              </p>
              <h2 className="text-black text-xl font-medium">
                Connect With People
              </h2>
              <p className="text-black text-md font-normal">
                Stay connected with your audience through smart features that
                make it simple to talk, share, and build real relationships.
              </p>
            </div>
          </Link>
          <Link to="/pricing" className="h-full">
            <div className="bg-[#e8ffc4] p-10 rounded-lg flex flex-col gap-3 relative hover-effect h-full">
              <div className="absolute -top-2.5 left-8 w-10/12 h-5 bg-[#dcffa4] rounded-t-lg"></div>
              <p className="text-black bg-[#96c94b] text-sm px-4 py-1 rounded-md font-medium w-fit">
                3 - Expand Your Presence
              </p>
              <h2 className="text-black text-xl font-medium">
                Build Your Presence
              </h2>
              <p className="text-black text-md font-normal">
                Grow your reach with tools that keep you visible, memorable, and
                connected wherever your audience is.
              </p>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default CoreValues;
