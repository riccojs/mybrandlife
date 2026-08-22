function WristbandStoreLoader() {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse">
      <div className="relative">
        <div className="w-full h-52 bg-gray-200"></div>
      </div>
      <div className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-5 w-3/4 bg-gray-200 rounded-md"></div>
          <div className="h-5 w-1/4 bg-gray-200 rounded-md"></div>
        </div>
        <div className="h-4 w-full bg-gray-200 rounded-md"></div>
        <div className="h-4 w-5/6 bg-gray-200 rounded-md"></div>
        <div className="h-10 bg-gray-300 rounded-xl mt-2"></div>
      </div>
    </div>
  );
}

export default WristbandStoreLoader;
