function OnboardProfileLoader() {
  return (
    <div className="animate-pulse w-full grid grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
      <div className="flex flex-col gap-2">
        <div className="w-full h-8 rounded-lg bg-slate-200"></div>
        <div className="w-32 min-w-32 min-h-32 h-32 rounded-2xl bg-slate-200"></div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="w-full h-8 rounded-lg bg-slate-200"></div>
        <div className="w-32 min-w-32 min-h-32 h-32 rounded-2xl bg-slate-200"></div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="w-full h-8 rounded-lg bg-slate-200"></div>
        <div className="w-32 min-w-32 min-h-32 h-32 rounded-2xl bg-slate-200"></div>
      </div>
      <div className="flex flex-col gap-2 md:col-span-3">
        <div className="w-full md:w-4/12 h-8 rounded-lg bg-slate-200"></div>
        <div className="min-h-32 h-32 rounded-2xl bg-slate-200 col-span-3"></div>
      </div>
    </div>
  );
}

export default OnboardProfileLoader;
