function PulsetrackCartLoader() {
  return (
    <div className="relative w-full rounded-2xl bg-white shadow-2xl animate-pulse">
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
        <div className="h-5 w-24 bg-gray-200 rounded"></div>
        <div className="h-5 w-5 bg-gray-200 rounded"></div>
      </div>
      <div className="space-y-4 px-5 py-5">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex gap-4 rounded-xl bg-gray-50 p-4">
            <div className="h-16 w-16 rounded-lg bg-gray-200"></div>
            <div className="flex-1 space-y-3">
              <div className="flex justify-between">
                <div className="space-y-2 w-3/4">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
                <div className="h-4 w-12 bg-gray-200 rounded"></div>
              </div>

              <div className="flex justify-between items-center">
                <div className="h-8 w-24 bg-gray-200 rounded-lg"></div>
                <div className="h-5 w-5 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-gray-200 px-6 py-4 space-y-3">
        <div className="flex justify-between">
          <div className="h-4 w-20 bg-gray-200 rounded"></div>
          <div className="h-4 w-16 bg-gray-200 rounded"></div>
        </div>
        <div className="flex justify-between">
          <div className="h-4 w-20 bg-gray-200 rounded"></div>
          <div className="h-4 w-16 bg-gray-200 rounded"></div>
        </div>
        <div className="flex justify-between mt-2">
          <div className="h-5 w-24 bg-gray-300 rounded"></div>
          <div className="h-5 w-20 bg-gray-300 rounded"></div>
        </div>
      </div>
      <div className="px-6 pb-6">
        <div className="mt-4 h-12 w-full bg-gray-300 rounded-xl"></div>
        <div className="mt-3 h-3 w-3/4 mx-auto bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}

export default PulsetrackCartLoader;
