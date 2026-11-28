import { Link } from "react-router";
import { useAuth } from "../../redux/hooks";
function HeroSection() {
  const { user } = useAuth();
  const ctaTo = user ? "/onboard" : "/get-started";
  const ctaLabel = user ? "Continue my BPS setup" : "Start my BPS setup";
  return (
    <section>
      <div className="relative pt-14">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#2A65E9]/15 bg-[#2A65E9]/5 px-4 py-2">
            <span className="h-2 w-2 rounded-full bg-[#2A65E9]" />
            <span className="text-sm font-medium text-[#161B2B]/70">
              Brand Pulse Social
            </span>
            <span className="text-[#161B2B]/30">•</span>
            <span className="text-sm font-semibold text-[#2A65E9]">
              Part of MyBrandLife
            </span>
          </div>
          <h1 className="mx-auto max-w-4xl text-4xl font-bold leading-[1.05] tracking-[-0.035em] text-[#161B2B] sm:text-5xl md:text-6xl lg:text-[72px]">
            Your brand, <span className="text-[#2A65E9]">pulsing across</span>{" "}
            every channel.
          </h1>
          <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-[#161B2B]/60 sm:text-lg sm:leading-8">
            Brand Pulse Social plugs into MyBrandLife to help manage your posts,
            promotions, and on-site screens from one connected ecosystem.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to={ctaTo}
              className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-[#2A65E9] px-7 text-sm font-semibold text-white shadow-lg shadow-[#2A65E9]/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#2058D0] hover:shadow-xl hover:shadow-[#2A65E9]/25 focus:outline-none focus:ring-2 focus:ring-[#2A65E9]/40 focus:ring-offset-2 sm:w-auto"
            >
              {ctaLabel}
              <svg
                className="ml-2"
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
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
            <a
              href="#sample-rollout"
              className="inline-flex h-12 w-full items-center justify-center rounded-xl border border-[#161B2B]/10 bg-white px-7 text-sm font-semibold text-[#161B2B] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#2A65E9]/30 hover:bg-[#F5F5F5] focus:outline-none focus:ring-2 focus:ring-[#2A65E9]/30 focus:ring-offset-2 sm:w-auto"
            >
              See a sample rollout
            </a>
          </div>
          <p className="text-black/50 font-normal text-sm mt-3">
            Wireframe layout only — swap all copy with final messaging.
          </p>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
