function DashTabsLoader() {
  return (
    <section
      aria-label="Loading account summary"
      aria-busy="true"
      className="grid grid-cols-1 gap-2 md:gap-4 sm:grid-cols-2 xl:grid-cols-3"
    >
      {[1, 2, 3].map((item) => (
        <article
          key={item}
          className={`min-w-0 rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_2px_5px_rgba(15,23,42,0.04)] sm:p-6 ${
            item === 3 ? "sm:col-span-2 xl:col-span-1" : ""
          }`}
        >
          <div className="mb-2 flex items-start justify-between gap-4 md:mb-8">
            <div className="min-w-0 flex-1 space-y-3">
              <div className="h-3 w-24 animate-pulse rounded bg-slate-200" />
              <div className="h-5 w-36 max-w-full animate-pulse rounded bg-slate-200" />
            </div>
            <div className="h-12 w-12 shrink-0 animate-pulse rounded-xl bg-slate-100" />
          </div>
          <div className="mb-3 h-7 w-32 max-w-full animate-pulse rounded-md bg-slate-200 sm:h-8" />
          <div className="mt-1 flex items-start gap-2">
            <div className="mt-0.5 h-3 w-3 shrink-0 animate-pulse rounded-full bg-slate-200" />
            <div className="min-w-0 flex-1 space-y-2">
              <div className="h-3 w-full animate-pulse rounded bg-slate-100" />
              <div className="h-3 w-4/5 animate-pulse rounded bg-slate-100" />
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}

export default DashTabsLoader;
