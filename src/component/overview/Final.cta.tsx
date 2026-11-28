import { Link } from "react-router";
import { useAuth } from "../../redux/hooks";
const FinalCTA = () => {
  const { user } = useAuth();
  const ctaTo = user ? "/onboard" : "/get-started";
  const ctaLabel = user ? "Continue my BPS setup" : "Start my BPS setup";
  return (
    <section className="relative overflow-hidden bg-[#161B2B] px-5 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-28">
      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-[#2A65E9]/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-[#E53F41]/10 blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 hidden w-125 -translate-x-1/2 -translate-y-1/2 opacity-[0.08] lg:block">
        <svg
          width="500"
          height="100"
          viewBox="0 0 500 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 50H120L145 15L180 85L215 25L245 50H500"
            stroke="#2A65E9"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="relative mx-auto max-w-225 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white/60">
          <span className="h-1.5 w-1.5 rounded-full bg-[#2A65E9]" />
          Brand Pulse Social
        </span>
        <h2 className="mx-auto mt-6 max-w-3xl text-3xl font-bold leading-tight tracking-[-0.03em] text-white sm:text-2xl lg:text-5xl">
          Ready to put your brand{" "}
          <span className="text-[#5E8CF0]">in motion?</span>
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/55 sm:text-lg sm:leading-8">
          Let Brand Pulse Social keep your content, promotions, and on-site
          experiences moving together.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to={ctaTo}
            className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-[#2A65E9] px-7 text-sm font-semibold text-white shadow-lg shadow-[#2A65E9]/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#3B72ED] hover:shadow-xl hover:shadow-[#2A65E9]/25 focus:outline-none focus:ring-2 focus:ring-[#2A65E9]/50 focus:ring-offset-2 focus:ring-offset-[#161B2B] sm:w-auto"
          >
            {ctaLabel}
            <svg
              className="ml-2"
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M5 12H19M13 6L19 12L13 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
        <p className="mt-5 text-xs text-white/30">
          Part of the MyBrandLife ecosystem
        </p>
      </div>
    </section>
  );
};

export default FinalCTA;
