import { Link } from "react-router";
import { LayoutDashboard, Rocket } from "lucide-react";
import { useAuth } from "../../hook/useAuth";

function CallOfAction() {
  const { user, isLoading } = useAuth() as {
    user: { landerName: string };
    isLoading: boolean | null;
  };
  const redirectUrl = import.meta.env.VITE_APP_REDIRECT_ROUTE;

  return (
    <section>
      <div className="container">
        <div className="flex flex-col items-center mt-5">
          <h2 className="text-black text-4xl font-bold text-center">
            Your Brand, Your Life, Your Way
          </h2>

          <p className="text-black text-md font-normal text-center my-5 w-10/12">
            At MyBrandLife, our mission is to empower individuals and businesses
            by providing tailored, industry-specific landing pages that enhance
            their online presence and engagement. We strive to simplify the
            digital experience, enabling our users to showcase their unique
            brands effectively and effortlessly.
          </p>
          <p className="text-black text-md font-normal text-center my-5 w-10/12">
            My Brand Life delivers tailored brand landers for every
            niche—empowering you to build a cohesive identity that connects with
            your audience. Whether you're a creative, coach, entrepreneur,
            entertainer, restaurant, or service provider, we make branding
            simple and impactful. With built-in tools like QR codes, NFC, and
            more, your brand connects seamlessly online and offline - unlocking
            endless ways to engage your world.
          </p>
          {isLoading ? (
            <div className="w-72 h-12 rounded-full bg-slate-200 animate-pulse"></div>
          ) : user ? (
            <a
              href={redirectUrl}
              target="_blank"
              className="flex active:scale-[0.98] items-center gap-2 px-10 py-4 rounded-full hover:bg-[#589c28] text-white text-md font-medium shadow-lg transition-all bg-[#65B32E] shadow-[#65B32E]/25"
            >
              <LayoutDashboard className="w-4 h-4 fill-current" />
              Dashboard
            </a>
          ) : (
            <>
              <div className="flex gap-3 items-center mb-5">
                <Link
                  to="/pricing"
                  className="flex active:scale-[0.98] items-center gap-2 px-10 py-4 rounded-full hover:bg-[#589c28] text-white text-md font-medium shadow-lg transition-all bg-[#65B32E] shadow-[#65B32E]/25"
                >
                  <Rocket className="w-5 h-5 fill-current" />
                  Register Your Brand
                </Link>
              </div>
              <p className="text-sm text-black font-normal">
                Already have an account?{" "}
                <Link
                  to="/auth/login"
                  className="text-[#bb2d28] font-medium hover:underline"
                >
                  Log In
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default CallOfAction;
