import { Link } from "react-router";
import { Rocket } from "lucide-react";

function CallOfAction() {
  const redirectUrl = import.meta.env.VITE_APP_REDIRECT_ROUTE;

  return (
    <section>
      <div className="container">
        <div className="flex flex-col items-center mt-5">
          <h2 className="text-black text-lg md:text-3xl xl:text-4xl font-bold text-center">
            Your Brand, Your Life, Your Way
          </h2>

          <p className="text-black text-sm md:text-base font-normal text-center my-2 md:my-5 w-full md:w-10/12">
            At My Brand Life, our mission is to make building and managing your
            digital presence simple, professional, and powerful. We create
            industry-specific brand landers that bring your socials, contact
            information, links, requests, bookings, and more together in one
            place—giving your audience a clear and easy way to connect with you.
          </p>
          <p className="text-black text-sm md:text-base font-normal text-center my-2 md:my-5 w-full md:w-10/12">
            Whether you're a creative, coach, entrepreneur, entertainer,
            restaurant, service provider, or growing brand, My Brand Life helps
            you create a cohesive identity that works across both the digital
            and physical world. With built-in tools like QR codes, NFC,
            engagement features, and more, your brand can connect seamlessly
            online and offline—making it easier for people to discover you,
            interact with you, and stay connected.
          </p>
          <div className="flex gap-3 items-center mb-5 md:mt-0 mt-2">
            <Link
              to="/pricing"
              className="flex active:scale-[0.98] items-center gap-2 px-8 py-3 rounded-full hover:bg-[#589c28] text-white text-xs md:text-sm font-medium shadow-lg transition-all bg-[#65B32E] shadow-[#65B32E]/25"
            >
              <Rocket className="w-3 md:w-4 h-3 md:h-4 fill-current" />
              Register Your Brand
            </Link>
          </div>
          <p className="text-sm text-black font-normal">
            Already have an account?{" "}
            <a
              href={redirectUrl}
              target="_blank"
              className="text-[#bb2d28] font-medium hover:underline"
            >
              Log In
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}

export default CallOfAction;
