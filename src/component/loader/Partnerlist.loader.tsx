function PartnerlistLoader() {
  return (
    <div className="flex md:flex-row flex-col gap-5 items-center bg-white border border-gray-200 rounded-2xl shadow animate-pulse p-5">
      <div className="w-20 min-w-20 h-20 min-h-20 rounded-full bg-slate-300"></div>
      <div className="flex flex-col items-center md:items-start gap-2 w-full">
        <div className="w-8/12 rounded-lg bg-slate-300 h-8"></div>
        <div className="w-full rounded-lg bg-slate-300 h-24"></div>
        <div className="w-52 h-10 rounded-full bg-slate-300"></div>
      </div>
    </div>
  );
}

export default PartnerlistLoader;
