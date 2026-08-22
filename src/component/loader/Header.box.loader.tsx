function HeaderBoxLoader() {
  return (
    <li className="animate-pulse flex gap-2 items-center w-full">
      <div className="w-14 h14">
        <div className="bg-slate-200 h-14 w-14 rounded-full"></div>
      </div>
      <div className="w-full flex flex-col gap-1">
        <div className="bg-slate-200 h-4 w-full rounded-md"></div>
        <div className="bg-slate-200 h-4 w-32 md:w-52 rounded-md"></div>
      </div>
    </li>
  );
}

export default HeaderBoxLoader;
