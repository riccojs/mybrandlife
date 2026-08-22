function DashHeaderLoader() {
  return (
    <div className="animate-pulse flex justify-between bg-white p-8 rounded-md items-center w-full">
      <div className="w-full lg:w-6/12 flex flex-col gap-3">
        <p className="h-10 w-full bg-slate-200 rounded-lg"></p>
        <p className="h-8 w-6/12 bg-slate-200 rounded-lg"></p>
        <p className="h-8 w-full bg-slate-200 rounded-lg"></p>
        <p className="h-24 w-full bg-slate-200 rounded-lg"></p>
        <div className="flex gap-3 items-center">
          <p className="h-10 w-40 bg-slate-200 rounded-lg"></p>
          <p className="h-10 w-40 bg-slate-200 rounded-lg"></p>
        </div>
      </div>
      <div className="lg:block hidden">
        <div className="w-64 min-w-40 h-40 min-h-64 rounded-md bg-slate-200"></div>
      </div>
    </div>
  );
}

export default DashHeaderLoader;
