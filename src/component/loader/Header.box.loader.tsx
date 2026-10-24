function HeaderBoxLoader() {
  return (
    <li className="animate-pulse flex gap-2 items-center w-full p-4">
      <div>
        <div className="bg-slate-200 h-12 w-12 rounded-md"></div>
      </div>
      <div className="w-full flex justify-between gap-5">
        <div className="w-10/12 flex flex-col gap-1">
          <div className="bg-slate-200 h-6 w-full rounded-md"></div>
          <div className="flex gap-3 items-center">
            <div className="bg-slate-200 h-4 w-32 rounded-md"></div>
            <div className="bg-slate-200 h-4 w-32 rounded-md"></div>
          </div>
        </div>
        <div className="w-2/12">
          <div className="bg-slate-200 h-5 w-full rounded-md"></div>
        </div>
      </div>
    </li>
  );
}

export default HeaderBoxLoader;
