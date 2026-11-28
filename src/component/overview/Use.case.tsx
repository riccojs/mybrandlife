import { Link } from "react-router";
import { useAuth } from "../../redux/hooks";
import { type ReactNode } from "react";

interface UseCaseItem {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
}

const useCases: UseCaseItem[] = [
  {
    id: "01",
    title: "Social content",
    description:
      "Create consistent branded posts for promotions, offers, events, and everyday updates.",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="3"
          y="3"
          width="18"
          height="18"
          rx="3"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <circle
          cx="8.5"
          cy="8.5"
          r="1.5"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path
          d="M4.5 17L9.5 12L13 15.5L15 13.5L19.5 18"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: "02",
    title: "Promotions & offers",
    description:
      "Turn your latest promotions into ready-to-publish social content without starting from scratch.",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M20 13.5L13.5 20L4 10.5V4H10.5L20 13.5Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <circle cx="8" cy="8" r="1.5" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    ),
  },
  {
    id: "03",
    title: "On-site screens",
    description:
      "Repurpose your social creative for SignPulse so your digital and physical brand experiences stay connected.",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="3"
          y="4"
          width="18"
          height="14"
          rx="2.5"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="M8 21H16M12 18V21"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

const PhoneMockup = () => {
  return (
    <div className="relative mx-auto w-70 sm:w-75">
      <div className="absolute left-1/2 top-1/2 h-[90%] w-[85%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#2A65E9]/15 blur-3xl" />
      <div className="relative rounded-[42px] border-[7px] border-[#161B2B] bg-[#161B2B] p-1.5 shadow-[0_30px_80px_rgba(22,27,43,0.25)]">
        <div className="absolute left-1/2 top-2 z-20 h-6 w-24 -translate-x-1/2 rounded-full bg-[#161B2B]" />
        <div className="overflow-hidden rounded-[34px] bg-white">
          <div className="flex h-10 items-end justify-between px-6 pb-1.5 text-[9px] font-semibold text-[#161B2B]">
            <span>9:41</span>
            <div className="flex items-center gap-1">
              <span>●●●</span>
              <span>▮</span>
            </div>
          </div>
          <div className="flex items-center justify-between border-b border-[#161B2B]/8 px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2A65E9]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M2.5 12H6L8.5 5L12 19L15.5 9L18 12H21.5"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#161B2B]">
                  Your Brand
                </p>
                <p className="text-[8px] text-[#161B2B]/40">@yourbrand</p>
              </div>
            </div>
            <span className="text-[9px] font-semibold text-[#2A65E9]">•</span>
          </div>
          <div className="relative aspect-square overflow-hidden bg-[#F5F5F5]">
            <div className="absolute inset-0 bg-[#2A65E9]" />
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10" />
            <div className="absolute -bottom-20 -left-12 h-52 w-52 rounded-full bg-[#E53F41]/80" />
            <div className="relative flex h-full flex-col justify-between p-6 text-white">
              <div>
                <span className="rounded-full bg-white/15 px-2.5 py-1 text-[8px] font-semibold uppercase tracking-wider">
                  This week only
                </span>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/65">
                  Your promotion
                </p>
                <h3 className="mt-1 text-3xl font-black leading-none tracking-tight">
                  20%
                  <br />
                  OFF
                </h3>
                <p className="mt-2 max-w-37.5 text-[9px] leading-4 text-white/75">
                  Share your latest offer with your audience.
                </p>
              </div>
            </div>
          </div>
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M20.8 8.5C20.8 13.5 12 19 12 19S3.2 13.5 3.2 8.5C3.2 5.7 5.2 4 7.7 4C9.3 4 10.8 4.8 12 6.1C13.2 4.8 14.7 4 16.3 4C18.8 4 20.8 5.7 20.8 8.5Z"
                    stroke="#161B2B"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M20 11.5C20 15.6 16.4 19 12 19C10.7 19 9.5 18.7 8.4 18.2L4 20L5.2 16.2C4.4 15 4 13.8 4 11.5C4 7.4 7.6 4 12 4C16.4 4 20 7.4 20 11.5Z"
                    stroke="#161B2B"
                    strokeWidth="1.7"
                    strokeLinejoin="round"
                  />
                </svg>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 16V4M12 4L7 9M12 4L17 9"
                    stroke="#161B2B"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5 13V19C5 20.1 5.9 21 7 21H17C18.1 21 19 20.1 19 19V13"
                    stroke="#161B2B"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                <path
                  d="M6 4C6 3.4 6.4 3 7 3H17C17.6 3 18 3.4 18 4V21L12 17L6 21V4Z"
                  stroke="#161B2B"
                  strokeWidth="1.7"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p className="mt-3 text-[9px] font-semibold text-[#161B2B]">
              248 likes
            </p>
            <p className="mt-1 text-[9px] leading-4 text-[#161B2B]/60">
              Your latest promotion is live. Don&apos;t miss this week&apos;s
              special offer.
            </p>
            <p className="mt-2 text-[8px] text-[#161B2B]/35">
              View all 18 comments
            </p>
          </div>
          <div className="flex items-center justify-around border-t border-[#161B2B]/8 py-3">
            <span className="h-1.5 w-1.5 rounded-full bg-[#161B2B]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#161B2B]/20" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#161B2B]/20" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#161B2B]/20" />
          </div>
        </div>
      </div>
      <div className="absolute -right-3 top-24 hidden rounded-2xl border border-[#161B2B]/8 bg-white px-4 py-3 shadow-[0_15px_40px_rgba(22,27,43,0.12)] sm:block">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#2A65E9]/10">
            <span className="h-2 w-2 rounded-full bg-[#2A65E9]" />
          </div>
          <div>
            <p className="text-[9px] font-bold text-[#161B2B]">Post approved</p>
            <p className="text-[8px] text-[#161B2B]/40">Ready to publish</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const UseCase = () => {
  const { user } = useAuth();
  const ctaTo = user ? "/onboard" : "/get-started";
  const ctaLabel = user ? "Continue my BPS setup" : "Start my BPS setup";
  return (
    <section id="how-it-works" className="my-14">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <span className="inline-flex items-center rounded-full border border-[#2A65E9]/15 bg-[#2A65E9]/5 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#2A65E9]">
              Use cases
            </span>
            <h2 className="mt-5 max-w-xl text-3xl font-bold tracking-tight text-[#161B2B] sm:text-4xl lg:text-5xl">
              From idea to{" "}
              <span className="text-[#2A65E9]">everyday visibility.</span>
            </h2>
            <p className="mt-5 max-w-lg text-base leading-7 text-[#161B2B]/55">
              Turn your brand&apos;s latest updates into consistent content that
              reaches customers online and in your physical spaces.
            </p>
            <div className="mt-9 space-y-4">
              {useCases.map((item) => (
                <div
                  key={item.id}
                  className="group flex gap-4 rounded-2xl border border-[#161B2B]/8 bg-slate-50 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#2A65E9]/20 hover:shadow-[0_12px_30px_rgba(22,27,43,0.07)]"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#2A65E9]/8 text-[#2A65E9] transition-colors duration-300 group-hover:bg-[#2A65E9] group-hover:text-white">
                    {item.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold tracking-[0.12em] text-[#2A65E9]/60">
                        {item.id}
                      </span>

                      <h3 className="text-base font-semibold text-[#161B2B]">
                        {item.title}
                      </h3>
                    </div>
                    <p className="mt-1.5 text-sm leading-6 text-[#161B2B]/50">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <Link
                to={ctaTo}
                className="inline-flex h-11 items-center justify-center rounded-xl bg-[#2A65E9] px-6 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#2058D0] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#2A65E9]/40 focus:ring-offset-2"
              >
                {ctaLabel}
                <svg
                  className="ml-2"
                  width="16"
                  height="16"
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
            </div>
          </div>
          <div className="flex justify-center lg:justify-end">
            <PhoneMockup />
          </div>
        </div>
      </div>
    </section>
  );
};

export default UseCase;
