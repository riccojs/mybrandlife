export default function OrderedwristbandViewLoader() {
  return (
    <div className="w-full p-5 space-y-6 animate-pulse">
      <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col md:flex-row justify-between gap-6">
        <div className="space-y-3">
          <div className="h-3 w-32 bg-slate-200 rounded"></div>
          <div className="h-8 w-52 bg-slate-200 rounded"></div>
          <div className="h-10 w-24 bg-slate-200 rounded-lg"></div>
        </div>
        <div className="flex items-center gap-5 flex-wrap">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className="w-4 h-4 rounded-full bg-slate-200"></div>
                <div className="w-14 h-3 mt-2 bg-slate-200 rounded"></div>
              </div>
              {i < 5 && <div className="w-12 h-[2px] bg-slate-200 mx-2"></div>}
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex justify-between gap-5">
            <div className="flex-1 space-y-4">
              <div className="h-8 w-60 bg-slate-200 rounded"></div>
              <div className="h-6 w-24 bg-slate-200 rounded"></div>
              <div className="h-4 w-40 bg-slate-200 rounded"></div>
              <div className="h-4 w-32 bg-slate-200 rounded"></div>
              <div className="h-4 w-48 bg-slate-200 rounded"></div>
              <div className="border border-slate-200 rounded-lg p-4 space-y-2">
                <div className="h-4 w-44 bg-slate-200 rounded"></div>
                <div className="h-3 w-24 bg-slate-200 rounded"></div>
              </div>
              <div className="h-10 w-32 bg-slate-200 rounded-xl"></div>
            </div>
            <div className="w-44 h-40 bg-slate-200 rounded-2xl"></div>
          </div>
          <div className="flex flex-col items-end mt-10 gap-3">
            <div className="h-3 w-20 bg-slate-200 rounded"></div>
            <div className="h-12 w-36 bg-slate-200 rounded"></div>
            <div className="h-8 w-28 bg-slate-200 rounded"></div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col items-center">
          <div className="h-3 w-32 bg-slate-200 rounded"></div>
          <div className="w-44 h-44 rounded-xl bg-slate-200 my-5"></div>
          <div className="space-y-2 w-full flex flex-col items-center">
            <div className="h-3 w-48 bg-slate-200 rounded"></div>
            <div className="h-3 w-40 bg-slate-200 rounded"></div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex justify-between mb-6">
            <div className="h-4 w-32 bg-slate-200 rounded"></div>
            <div className="w-6 h-6 bg-slate-200 rounded"></div>
          </div>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div className="flex justify-between" key={i}>
                <div className="h-3 w-28 bg-slate-200 rounded"></div>
                <div className="h-3 w-16 bg-slate-200 rounded"></div>
              </div>
            ))}
          </div>
          <div className="border border-slate-200 rounded-lg p-3 mt-6 space-y-2">
            <div className="h-3 w-20 bg-slate-200 rounded"></div>
            <div className="h-4 w-full bg-slate-200 rounded"></div>
          </div>
          <div className="mt-6 space-y-2">
            <div className="h-3 w-28 bg-slate-200 rounded"></div>
            <div className="h-10 w-full bg-slate-200 rounded"></div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-8">
        <div className="h-5 w-48 bg-slate-200 rounded mb-8"></div>
        <div className="space-y-5">
          {[...Array(6)].map((_, row) => (
            <div key={row} className="grid grid-cols-5 gap-6 items-center">
              <div className="h-4 bg-slate-200 rounded"></div>
              <div className="h-4 bg-slate-200 rounded"></div>
              <div className="h-4 bg-slate-200 rounded"></div>
              <div className="h-4 bg-slate-200 rounded"></div>
              <div className="h-6 w-24 bg-slate-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
