interface EcosystemProduct {
  name: string;
  description: string;
  accent: "blue" | "red";
}

const ecosystemProducts: EcosystemProduct[] = [
  {
    name: "MyBrandLife",
    description: "Link-in-bio and NFC/QR landing page.",
    accent: "blue",
  },
  {
    name: "Brand Pulse Social",
    description: "Content calendar & posting engine.",
    accent: "blue",
  },
  {
    name: "SignPulse",
    description: "On-site screens & promo loops.",
    accent: "red",
  },
];

const benefits = [
  "Queue and approve posts for all your key platforms.",
  "Tie every post back to your MyBrandLife landing page.",
  "Feed the same creative into SignPulse screens on-site.",
];

const EcosystemProductCard = ({ product }: { product: EcosystemProduct }) => {
  const isRed = product.accent === "red";

  return (
    <div className="group relative flex flex-col rounded-2xl border border-[#161B2B]/10 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#2A65E9]/30 hover:shadow-[0_16px_40px_rgba(22,27,43,0.08)]">
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-xl ${
          isRed
            ? "bg-[#E53F41]/10 text-[#E53F41]"
            : "bg-[#2A65E9]/10 text-[#2A65E9]"
        }`}
      >
        {isRed ? (
          <svg
            width="21"
            height="21"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
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
              d="M10 9L15 12L10 15V9Z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg
            width="21"
            height="21"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M10 13.5L14 10.5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <path
              d="M8.5 16.5L7 18C5.34 19.66 2.66 19.66 1 18C-0.66 16.34 -0.66 13.66 1 12L4 9"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <path
              d="M15.5 7.5L17 6C18.66 4.34 21.34 4.34 23 6C24.66 7.66 24.66 10.34 23 12L20 15"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        )}
      </div>
      <div className="mt-3">
        <h3 className="text-lg font-bold text-[#161B2B]">{product.name}</h3>

        <p className="text-sm leading-6 text-[#161B2B]/55">
          {product.description}
        </p>
      </div>
    </div>
  );
};

const EcosystemCard = () => {
  return (
    <section id="ecosystem" className="relative overflow-hidden bg-white mt-14">
      <div>
        <div className="overflow-hidden rounded-[28px] border border-[#161B2B]/10 bg-[#F8F9FC]">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
            <div className="relative p-7 sm:p-10 lg:p-12">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#2A65E9]" />

                <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#161B2B]/50">
                  High-level view
                </span>
              </div>
              <h2 className="mt-5 max-w-xl text-3xl font-bold leading-[1.1] tracking-[-0.035em] text-[#161B2B] sm:text-4xl lg:text-[42px]">
                <span className="text-[#2A65E9]">+X% more reach,</span>{" "}
                <span className="text-[#161B2B]">+Y% more clicks</span>
              </h2>
              <p className="mt-5 max-w-lg text-sm leading-6 text-[#161B2B]/55 sm:text-base">
                Placeholder metric — this is where we show impact once we have
                real data.
              </p>
              <div className="mt-8 space-y-5">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#2A65E9] text-white">
                      <svg
                        width="11"
                        height="11"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M5 12L9.5 16L19 6"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <p className="text-sm font-medium leading-6 text-[#161B2B]/75 sm:text-[15px]">
                      {benefit}
                    </p>
                  </div>
                ))}
              </div>
              <div className="pointer-events-none absolute -bottom-24 -left-16 h-48 w-96 rotate-15 rounded-full border border-[#2A65E9]/10" />
            </div>
            <div className="border-t border-[#161B2B]/10 bg-white p-7 sm:p-10 lg:border-l lg:border-t-0 lg:p-10">
              <div className="flex flex-wrap gap-2 w-full">
                {["Posting", "Landing pages", "Signage", "Reporting"].map(
                  (item) => (
                    <span
                      key={item}
                      className="inline-flex items-center rounded-full border w-fit px-3 py-1.5 text-xs font-semibold transition-colors border-[#2A65E9]/25 bg-[#2A65E9]/5 text-[#2A65E9]"
                    >
                      {item}
                    </span>
                  ),
                )}
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {ecosystemProducts.map((product) => (
                  <EcosystemProductCard key={product.name} product={product} />
                ))}
              </div>
              <div className="mt-7 flex items-center justify-center gap-2">
                <span className="h-px flex-1 bg-[#161B2B]/10" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#161B2B]/35">
                  Connected ecosystem
                </span>
                <span className="h-px flex-1 bg-[#161B2B]/10" />
              </div>
              <p className="mx-auto mt-4 max-w-md text-center text-xs leading-5 text-[#161B2B]/40">
                One connected workflow for content, landing pages, analytics,
                and on-site digital experiences.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EcosystemCard;
