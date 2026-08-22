function PartnerlistLoader() {
  return (
    <div className="flex gap-5 items-center bg-white border border-gray-200 rounded-2xl shadow animate-pulse p-5">
      <div className="w-24 min-w-24 h-24 min-h-24 rounded-full bg-slate-300"></div>
      <div className="flex flex-col gap-2 w-full">
        <div className="w-full rounded-lg bg-slate-300 h-8"></div>
        <div className="w-full rounded-lg bg-slate-300 h-16"></div>
        <div className="w-32 h-12 rounded-full bg-slate-300"></div>
      </div>
    </div>
  );
}

export default PartnerlistLoader;
