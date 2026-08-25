export default function ViewdomainLoader() {
  return (
    <div className="flex flex-col gap-5 rounded-2xl w-full animate-pulse p-8">
      <div className="h-7 bg-slate-200 rounded-md w-1/3" />
      <div>
        <div>
          <div className="h-7 bg-slate-200 rounded-md w-1/6 mb-2" />
          <div className="flex gap-2 items-center">
            <div className="w-5 h-5 bg-slate-200 rounded-full shrink-0" />
            <div className="h-6 bg-slate-200 rounded-md w-1/2" />
          </div>
        </div>
        <div className="my-5">
          <div className="h-7 bg-slate-200 rounded-md w-1/6 mb-2" />
          <div className="flex gap-2 items-center">
            <div className="w-5 h-5 bg-slate-200 rounded-full shrink-0" />
            <div className="h-6 bg-slate-200 rounded-md w-2/5" />
          </div>
        </div>
        <div className="my-5">
          <div className="h-7 bg-slate-200 rounded-md w-1/5 mb-2" />
          <div className="flex gap-2 items-center">
            <div className="w-5 h-5 bg-slate-200 rounded-full shrink-0" />
            <div className="h-6 bg-slate-200 rounded-md w-1/4" />
          </div>
        </div>
      </div>
    </div>
  );
}
