function DashboardHeadLoader() {
  return (
    <section
      aria-label="Loading dashboard header"
      aria-busy="true"
      className="relative isolate overflow-hidden rounded-[28px] border border-gray-200 bg-white"
    >
      <div className="grid min-h-90 grid-cols-1 items-center gap-10 px-5 py-8 sm:px-10 sm:py-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8 lg:px-10 xl:px-12">
        <div className="relative z-10 max-w-2xl animate-pulse">
          <div className="mb-5 h-8 w-36 rounded-full bg-emerald-100" />
          <div className="h-10 w-3/4 rounded-lg bg-slate-200 sm:h-14 sm:w-4/5" />
          <div className="mt-4 h-7 w-2/3 rounded-lg bg-slate-200 sm:h-9" />
          <div className="mt-4 h-5 w-4/5 rounded-md bg-slate-200" />
          <div className="mt-4 space-y-3">
            <div className="h-3.5 w-full rounded bg-slate-100" />
            <div className="h-3.5 w-full rounded bg-slate-100" />
            <div className="h-3.5 w-[92%] rounded bg-slate-100" />
            <div className="h-3.5 w-[72%] rounded bg-slate-100" />
          </div>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <div className="h-12 w-full animate-pulse rounded-xl bg-[#d9efb9] sm:w-44" />
            <div className="h-12 w-full animate-pulse rounded-xl border border-slate-200 bg-slate-100 sm:w-32" />
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-130 lg:ml-auto lg:mr-0">
          <div className="relative overflow-hidden rounded-[22px] border border-slate-200 bg-slate-100 shadow-lg">
            <div className="aspect-[1.48/1] w-full animate-pulse bg-slate-200" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-slate-800/10 px-4 pb-4 pt-12 sm:px-5">
              <div className="h-7 w-24 animate-pulse rounded-lg bg-slate-300/80" />
              <div className="h-4 w-2/5 animate-pulse rounded bg-slate-300/80" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DashboardHeadLoader;
