function SingleNotificationLoader() {
  return (
    <div className="flex flex-col gap-5 w-full animate-pulse">
      <div className="w-7/12 h-10 bg-slate-200 rounded-md"></div>
      <div className="flex flex-col gap-2 w-full">
        <div className="w-full h-8 bg-slate-200 rounded-md"></div>
        <div className="w-full h-7 bg-slate-200 rounded-md"></div>
      </div>
      <div className="flex flex-col gap-2 w-full">
        <div className="w-full h-8 bg-slate-200 rounded-md"></div>
        <div className="w-full h-7 bg-slate-200 rounded-md"></div>
      </div>
      <div className="flex flex-col gap-2 w-full">
        <div className="w-full h-8 bg-slate-200 rounded-md"></div>
        <div className="w-full h-7 bg-slate-200 rounded-md"></div>
      </div>
    </div>
  );
}

export default SingleNotificationLoader;
