function ViewSpinLoader() {
  return (
    <div className="w-full bg-[#f6f8fb] animate-pulse">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 p-4 sm:p-5 bg-slate-100 border-b border-gray-300">
        <div className="space-y-3 w-full">
          <div className="h-6 bg-gray-200 rounded w-2/3 sm:w-1/3" />
          <div className="h-4 bg-gray-200 rounded w-40 max-w-full" />
        </div>
        <div className="h-6 w-24 rounded-full bg-gray-200" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="p-5 sm:p-8 min-w-0">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-5 h-5 rounded bg-gray-200 shrink-0" />
            <div className="h-6 w-48 max-w-full rounded bg-gray-200" />
          </div>
          <div className="space-y-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <div className="h-3 w-24 max-w-full rounded bg-gray-200" />
                <div
                  className={`h-4 rounded bg-gray-200 ${
                    index === 1 ? "w-full" : "w-2/3"
                  }`}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="p-5 sm:p-8 min-w-0 bg-slate-100">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-5 h-5 rounded bg-gray-200 shrink-0" />
            <div className="h-6 w-44 max-w-full rounded bg-gray-200" />
          </div>
          <div className="space-y-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <div className="h-3 w-28 max-w-full rounded bg-gray-200" />
                <div
                  className={`h-4 rounded bg-gray-200 ${
                    index === 1 ? "w-full" : "w-3/4"
                  }`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-end p-4 sm:p-5 bg-slate-100 border-t border-gray-300">
        <div className="h-10 w-24 rounded-lg bg-gray-200" />
      </div>
    </div>
  );
}

export default ViewSpinLoader;
