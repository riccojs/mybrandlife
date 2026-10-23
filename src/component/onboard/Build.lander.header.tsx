interface ProfileStep {
  id: number;
  title: string;
  subtitle: string;
}

interface ProfileCompletionProps {
  currentStep?: number;
  progress: number;
}

const steps: ProfileStep[] = [
  {
    id: 1,
    title: "Bio & Links",
    subtitle: "In Progress",
  },
  {
    id: 2,
    title: "Media& Files",
    subtitle: "Logo & Brand",
  },
  {
    id: 3,
    title: "Platforms",
    subtitle: "Brand Platforms",
  },
  {
    id: 4,
    title: "Review",
    subtitle: "Review & Go Live",
  },
];

function BuildLanderHeader({
  currentStep = 1,
  progress,
}: ProfileCompletionProps) {
  const totalSteps = steps.length;

  return (
    <section className="w-full bg-white rounded-2xl shadow border-b border-gray-200 px-4 py-5 sm:px-6 lg:px-7 mt-1 md:mt-3">
      <div className="mx-auto w-full max-w-screen-2xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-xl font-medium tracking-tight text-[#151B2D] sm:text-2xl">
              Complete Your Profile
            </h1>
            <p className="mt-1 text-sm leading-5 text-[#78869D] sm:text-base">
              Configure your foundational creator identity and primary niche
              links.
            </p>
          </div>
          <div className="flex shrink-0 items-center justify-between gap-3 sm:justify-end sm:gap-4">
            <div className="text-left sm:text-right">
              <p className="text-xs font-medium uppercase tracking-wide text-[#687995]">
                Profile Completion
              </p>
              <p className="mt-1 text-sm font-semibold text-[#151B2D]">
                {progress}% completed
              </p>
            </div>

            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[#00B779] text-sm font-semibold text-[#008D61] sm:h-10 sm:w-10"
              aria-label={`${progress}% profile completion`}
            >
              {currentStep}/{totalSteps}
            </div>
          </div>
        </div>
        <div
          className="mt-4 h-2 w-full overflow-hidden rounded-full bg-[#EDF1F7]"
          role="progressbar"
          aria-label="Profile completion"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
        >
          <div
            className="h-full rounded-full bg-linear-to-r from-[#F04452] via-[#15B985] to-[#00976D] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <nav
          aria-label="Profile setup steps"
          className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4"
        >
          {steps.map((step) => {
            const isActive = step.id === currentStep;
            const isCompleted = step.id < currentStep;

            return (
              <button
                key={step.id}
                type="button"
                aria-current={isActive ? "step" : undefined}
                className={`flex min-w-0 items-center gap-3 rounded-lg border px-3 py-3 text-left transition-colors sm:px-3 sm:py-3 ${
                  isActive
                    ? "border-[#8CF2C0] bg-[#F1FCF6]"
                    : "border-transparent bg-[#F8FAFC] hover:border-gray-200 hover:bg-gray-50"
                }`}
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                    isActive
                      ? "bg-[#009B70] text-white"
                      : isCompleted
                        ? "bg-[#DDF7EA] text-[#00875F]"
                        : "bg-[#E2E8F0] text-[#475569]"
                  }`}
                >
                  {isCompleted ? (
                    <svg
                      viewBox="0 0 20 20"
                      fill="none"
                      className="h-4 w-4"
                      aria-hidden="true"
                    >
                      <path
                        d="m5 10 3 3 7-7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    step.id
                  )}
                </span>
                <span className="flex min-w-0 flex-col">
                  <span
                    className={`truncate text-sm font-medium ${
                      isActive ? "text-[#123D30]" : "text-[#334155]"
                    }`}
                  >
                    Step {step.id}: {step.title}
                  </span>
                  <span
                    className={`mt-0.5 truncate text-xs ${
                      isActive ? "text-[#00875F]" : "text-[#94A3B8]"
                    }`}
                  >
                    {step.subtitle}
                  </span>
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </section>
  );
}

export default BuildLanderHeader;
