function PulsetrackProjectLoader() {
  return (
    <div className="bg-[#f6f8fb] animate-pulse">
      <div className="w-full">
        {/* Header */}
        <div className="flex p-5 bg-slate-100 justify-between items-start border-b border-gray-300">
          <div className="space-y-2">
            <div className="h-5 w-40 bg-gray-300 rounded"></div>
            <div className="h-4 w-28 bg-gray-200 rounded"></div>
          </div>

          <div className="h-8 w-20 bg-green-200 rounded-full"></div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-2">
          {/* Left */}
          <div className="p-8 space-y-6">
            <div className="h-5 w-40 bg-gray-300 rounded"></div>

            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-3 w-24 bg-gray-200 rounded"></div>
                <div className="h-4 w-40 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>

          {/* Right */}
          <div className="p-8 bg-slate-100 space-y-6">
            <div className="h-5 w-40 bg-gray-300 rounded"></div>

            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-3 w-24 bg-gray-200 rounded"></div>
                <div className="h-4 w-44 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-4 p-5 bg-slate-100 border-t border-gray-300">
          <div className="h-9 w-24 bg-gray-300 rounded-lg"></div>
          <div className="h-9 w-24 bg-green-300 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
}

export default PulsetrackProjectLoader;
