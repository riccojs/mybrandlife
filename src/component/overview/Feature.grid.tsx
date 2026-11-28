import { type ReactNode } from "react";

interface Feature {
  id: string;
  product: string;
  title: string;
  description: string;
  icon: ReactNode;
}

const features: Feature[] = [
  {
    id: "content-calendar",
    product: "Brand Pulse Social",
    title: "Content calendar & queue",
    description:
      "Plan, organize, and manage your upcoming social content from one place.",
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
          height="17"
          rx="3"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="M7 2.5V6M17 2.5V6M3 9H21"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M7.5 13H9M12 13H13.5M16.5 13H18M7.5 17H9M12 17H13.5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: "graphics-captions",
    product: "Brand Pulse Social",
    title: "Graphics & caption creation",
    description:
      "Create branded graphics and captions that keep your social presence consistent.",
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
    id: "landing-pages",
    product: "MyBrandLife",
    title: "Branded landing page setup",
    description:
      "Give each subscriber a polished branded landing page that connects their online presence.",
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
          y="3"
          width="18"
          height="18"
          rx="3"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path d="M3 8H21" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="6" cy="5.5" r="0.8" fill="currentColor" />
        <circle cx="9" cy="5.5" r="0.8" fill="currentColor" />
        <path
          d="M7 12H17M7 15H14"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: "analytics",
    product: "BrandTrack",
    title: "Click & tap analytics",
    description:
      "Track clicks and taps to understand how customers interact with your brand.",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4 19V10M10 19V5M16 19V13M22 19V3"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M2.5 21H23"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: "screen-playlists",
    product: "SignPulse",
    title: "Screen playlists",
    description:
      "Reuse your social assets across on-site digital signage and customer touchpoints.",
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
  {
    id: "support",
    product: "Support",
    title: "Onboarding & help desk",
    description:
      "Get help throughout setup and keep your Brand Pulse ecosystem running smoothly.",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
        <path
          d="M8.5 9.5C8.8 8.2 10 7.5 12 7.5C14 7.5 15.5 8.5 15.5 10C15.5 11.5 14.5 12.2 13 12.8C11.8 13.3 11.5 13.8 11.5 15"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <circle cx="11.5" cy="17.5" r="1" fill="currentColor" />
      </svg>
    ),
  },
];

interface FeatureCardProps {
  feature: Feature;
}

const FeatureCard = ({ feature }: FeatureCardProps) => {
  return (
    <article className="group relative overflow-hidden rounded-3xl border border-[#161B2B]/8 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#2A65E9]/20 hover:shadow-[0_20px_50px_rgba(22,27,43,0.09)] sm:p-7">
      <div className="pointer-events-none absolute -right-12 -top-12 h-24 w-24 rounded-full bg-[#2A65E9]/5 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative flex items-start justify-between gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#2A65E9]/8 text-[#2A65E9] transition-all duration-300 group-hover:bg-[#2A65E9] group-hover:text-white">
          {feature.icon}
        </div>
        <span className="rounded-full bg-[#F5F5F5] px-3 py-1.5 text-[11px] font-semibold text-[#161B2B]/50">
          {feature.product}
        </span>
      </div>
      <div className="relative mt-6">
        <h3 className="text-lg font-semibold tracking-tight text-[#161B2B] sm:text-xl">
          {feature.title}
        </h3>
        <p className="mt-3 text-sm leading-6 text-[#161B2B]/55">
          {feature.description}
        </p>
      </div>
    </article>
  );
};

const FeatureGrid = () => {
  return (
    <section id="features" className="pt-14">
      <div>
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center rounded-full border border-[#2A65E9]/15 bg-[#2A65E9]/5 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#2A65E9]">
            Features
          </span>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-[#161B2B] sm:text-4xl lg:text-5xl">
            What&apos;s actually inside
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-[#161B2B]/55">
            Everything you need to keep your brand presence connected,
            consistent, and active across every channel.
          </p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureGrid;
