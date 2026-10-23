function ButtonClicksLoader() {
  return (
    <section className="mt-5 w-full min-w-0 animate-pulse">
      <div className="bg-white p-4 sm:p-6 lg:p-10 rounded-xl border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 w-full mb-5 border-b border-gray-200 pb-5">
          <div className="h-5 w-full max-w-64 rounded bg-gray-200" />
          <div className="h-11 w-full sm:w-40 sm:min-w-40 rounded-lg bg-gray-200" />
        </div>
        <div className="space-y-2">
          <div className="h-8 sm:h-9 w-48 max-w-full rounded bg-gray-200" />
        </div>
        <div className="mt-10 flex flex-col gap-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-lg border border-gray-100 p-4"
            >
              <div className="flex-1 min-w-0 space-y-2">
                <div className="h-4 w-2/3 max-w-56 rounded bg-gray-200" />
                <div className="h-3 w-full max-w-80 rounded bg-gray-100" />
              </div>
              <div className="h-6 w-16 rounded bg-gray-200 shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ButtonClicksLoader;
