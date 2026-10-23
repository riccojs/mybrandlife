function LanderAnalyticsLoader() {
  return (
    <div className="w-full min-w-0 mx-auto p-4 sm:p-6 bg-white border border-gray-200 rounded-lg animate-pulse">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 w-full mb-5">
        <div className="space-y-2 min-w-0 flex-1">
          <div className="h-4 bg-gray-200 rounded w-full max-w-90" />
          <div className="h-4 bg-gray-200 rounded w-2/3 max-w-60 sm:hidden" />
        </div>
        <div className="w-full sm:w-40 sm:min-w-40 h-11 rounded-lg bg-gray-200" />
      </div>
      <div className="relative w-full h-64 sm:h-80 lg:h-125 min-w-0">
        <div className="absolute inset-0 flex flex-col justify-between pb-8 pl-8 sm:pl-12">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="w-full border-t border-dashed border-gray-200"
            />
          ))}
        </div>
        <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-3 w-5 sm:w-7 rounded bg-gray-200" />
          ))}
        </div>
        <div className="absolute left-9 sm:left-14 right-1 bottom-8 top-4 flex items-end justify-around gap-1 sm:gap-3">
          {[45, 68, 35, 82, 55, 72, 42, 90, 60, 38, 75, 50].map(
            (height, index) => (
              <div
                key={index}
                className="flex-1 max-w-10 rounded-t-sm bg-gray-200"
                style={{ height: `${height}%` }}
              />
            ),
          )}
        </div>
        <div className="absolute bottom-0 left-9 sm:left-14 right-1 flex justify-around gap-1">
          {Array.from({ length: 7 }).map((_, index) => (
            <div key={index} className="h-3 w-5 sm:w-8 rounded bg-gray-200" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default LanderAnalyticsLoader;
