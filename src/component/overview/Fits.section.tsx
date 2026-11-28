import React, { type ReactNode } from "react";

interface Pillar {
  number: string;
  title: string;
  description: string;
  icon: ReactNode;
}

const pillars: Pillar[] = [
  {
    number: "01",
    title: "Centralized brand story",
    description:
      "Unify promos and offers with your MyBrandLife pages, so your brand stays consistent everywhere.",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="3"
          y="4"
          width="18"
          height="16"
          rx="3"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path d="M3 9H21" stroke="currentColor" strokeWidth="1.8" />
        <path
          d="M7 13H11M7 16H9"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Done-for-you social presence",
    description:
      "BPS creates posts, graphics, and captions while you stay in control with simple client approval.",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="4"
          y="3"
          width="16"
          height="18"
          rx="3"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <circle
          cx="12"
          cy="9"
          r="2.5"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="M8 16C8.9 14.6 10.2 14 12 14C13.8 14 15.1 14.6 16 16"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Connected on-site touchpoints",
    description:
      "Reuse your social creative on SignPulse screens to connect your digital presence with physical spaces.",
    icon: (
      <svg
        width="24"
        height="24"
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
        <path
          d="M8 9H16M8 12H13"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

interface PillarCardProps {
  pillar: Pillar;
}

const PillarCard: React.FC<PillarCardProps> = ({ pillar }) => {
  return (
    <article className="group relative overflow-hidden rounded-3xl border border-[#161B2B]/8 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[#2A65E9]/20 hover:shadow-[0_20px_50px_rgba(22,27,43,0.10)] sm:p-8">
      <div className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full bg-[#2A65E9]/5 transition-transform duration-500 group-hover:scale-150" />
      <div className="relative flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2A65E9]/8 text-[#2A65E9] transition-colors duration-300 group-hover:bg-[#2A65E9] group-hover:text-white">
          {pillar.icon}
        </div>
        <span className="text-sm font-semibold tracking-[0.12em] text-[#161B2B]/25">
          {pillar.number}
        </span>
      </div>
      <div className="relative mt-8">
        <h3 className="max-w-70 text-xl font-semibold tracking-tight text-[#161B2B] sm:text-[22px]">
          {pillar.title}
        </h3>
        <p className="mt-4 text-sm leading-6 text-[#161B2B]/55 sm:text-[15px]">
          {pillar.description}
        </p>
      </div>
    </article>
  );
};

const FitsSection: React.FC = () => {
  return (
    <section id="overview" className="pt-14">
      <div>
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center rounded-full border border-[#2A65E9]/15 bg-[#2A65E9]/5 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#2A65E9]">
            Why BPS
          </span>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-[#161B2B] sm:text-4xl lg:text-5xl">
            How Brand Pulse fits into your world
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-[#161B2B]/55">
            Bring your brand story, social presence, and on-site experiences
            together in one connected ecosystem.
          </p>
        </div>
        <div className="mt-12 grid gap-5 md:mt-16 md:grid-cols-3">
          {pillars.map((pillar) => (
            <PillarCard key={pillar.number} pillar={pillar} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FitsSection;
