export default function SingleActivitiesLoader() {
  return (
    <div className="min-h-screen p-6 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="w-full">
          <div className="h-8 w-48 bg-gray-200 rounded" />

          <ul className="flex gap-2 items-center py-2 mt-2">
            <li className="h-4 w-24 bg-gray-200 rounded" />
            <li className="h-4 w-4 bg-gray-200 rounded" />
            <li className="h-4 w-28 bg-gray-200 rounded" />
          </ul>
        </div>

        <div className="h-10 w-28 bg-gray-200 rounded-lg" />
      </div>

      {/* Main Grid */}
      <div className="col-span-8 space-y-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Profile Card */}
          <div className="col-span-12 lg:col-span-4 rounded-xl bg-white border border-gray-200 p-8 space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-24 h-24 rounded-full bg-gray-200" />

              <div className="h-6 w-40 bg-gray-200 rounded" />
              <div className="h-4 w-32 bg-gray-200 rounded" />
              <div className="h-4 w-48 bg-gray-200 rounded" />

              <div className="h-12 w-full bg-gray-200 rounded-lg mt-6" />
            </div>
          </div>

          {/* Info Card */}
          <div className="col-span-12 lg:col-span-8 rounded-xl border border-gray-200 bg-white p-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="h-3 w-20 bg-gray-200 rounded" />
                  <div className="h-5 w-full bg-gray-200 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-6">
          <div className="h-10 w-48 bg-gray-200 rounded" />

          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="h-4 w-28 bg-gray-200 rounded" />
              <div className="h-12 w-full bg-gray-200 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
