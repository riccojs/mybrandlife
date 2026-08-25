function RecentUserLoader() {
  return (
    <li className="animate-pulse flex gap-2 items-center w-full">
      <div className="w-14 h14">
        <div className="bg-slate-200 h-14 w-14 rounded-full"></div>
      </div>
      <div className="w-full flex justify-between">
        <div className="flex flex-col gap-3">
          <div className="bg-slate-200 h-4 w-64 rounded-md"></div>
          <div className="bg-slate-200 h-4 w-32 rounded-md"></div>
        </div>
        <div className="flex flex-col gap-3">
          <div className="bg-slate-200 h-4 w-24 rounded-md"></div>
          <div className="bg-slate-200 h-4 w-24 rounded-md"></div>
        </div>
      </div>
    </li>
  );
}

export default RecentUserLoader;
