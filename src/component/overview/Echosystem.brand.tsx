const ecosystemApps = [
  {
    name: "MyBrandLife",
    description: "Landing pages",
    active: false,
  },
  {
    name: "Brand Pulse Social",
    description: "Social engine",
    active: true,
  },
  {
    name: "SignPulse",
    description: "On-site signage",
    active: false,
  },
  {
    name: "BrandTrack",
    description: "Click & tap analytics",
    active: false,
  },
];

const EcosystemBand = () => {
  return (
    <section className="mt-14">
      <div>
        <div className="p-10 rounded-4xl bg-[#161B2B]">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="shrink-0">
              <p className="text-sm font-medium leading-6 text-white/60">
                Brand Pulse Social is one of your{" "}
                <span className="font-semibold text-white">
                  MyBrandLife apps
                </span>
                :
              </p>
            </div>
            <div className="flex flex-wrap min-w-0 gap-5">
              {ecosystemApps.map((app) => (
                <div
                  key={app.name}
                  className={`group flex shrink-0 items-center gap-3 rounded-full border px-4 py-2.5 transition-all duration-200 ${
                    app.active
                      ? "border-[#2A65E9] bg-[#2A65E9] shadow-[0_6px_20px_rgba(42,101,233,0.25)]"
                      : "border-white/10 bg-white/4 hover:border-white/20 hover:bg-white/8"
                  }`}
                >
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full ${
                      app.active ? "bg-white/15" : "bg-white/10"
                    }`}
                  >
                    {app.active ? (
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M2.5 12H6L8.5 5L12 19L15.5 9L18 12H21.5"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${
                          app.name === "SignPulse"
                            ? "bg-[#E53F41]"
                            : "bg-[#2A65E9]"
                        }`}
                      />
                    )}
                  </span>
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <span
                      className={`text-sm font-semibold ${
                        app.active ? "text-white" : "text-white/85"
                      }`}
                    >
                      {app.name}
                    </span>
                    <span
                      className={`hidden text-xs sm:inline ${
                        app.active ? "text-white/60" : "text-white/40"
                      }`}
                    >
                      {app.description}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EcosystemBand;
