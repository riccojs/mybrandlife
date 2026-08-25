export default function WristbandConfirmationLoader() {
  return (
    <div className="min-h-screen bg-[#f8f9fa] p-5 flex items-center justify-center animate-pulse">
      <div className="w-full max-w-5xl flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-slate-200 mb-5" />
        <div className="text-center mb-8 w-full">
          <div className="h-8 w-72 bg-slate-200 rounded mx-auto" />
          <div className="h-4 w-96 max-w-full bg-slate-200 rounded mx-auto mt-4" />
          <div className="h-3 w-60 bg-slate-200 rounded mx-auto mt-2" />
        </div>
        <div className="w-full bg-white rounded-xl border border-slate-100 shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center relative">
            <div className="absolute left-10 right-10 top-4 h-1 bg-slate-200" />

            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="relative z-10 flex flex-col items-center"
              >
                <div className="w-8 h-8 rounded-full bg-slate-200" />
                <div className="w-16 h-3 rounded bg-slate-200 mt-3" />
              </div>
            ))}
          </div>
        </div>
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white rounded-xl border border-slate-100 shadow-sm p-6">
            <div className="h-6 w-40 rounded bg-slate-200 mb-6" />
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="flex justify-between items-center py-4 border-b border-slate-100 last:border-b-0"
              >
                <div className="flex gap-4">
                  <div className="w-14 h-14 rounded-md bg-slate-200" />

                  <div className="space-y-2">
                    <div className="h-4 w-40 rounded bg-slate-200" />
                    <div className="h-3 w-24 rounded bg-slate-200" />
                    <div className="h-3 w-16 rounded bg-slate-200" />
                  </div>
                </div>

                <div className="h-5 w-16 rounded bg-slate-200" />
              </div>
            ))}

            <div className="border-t border-slate-100 mt-6 pt-6 space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex justify-between">
                  <div className="h-3 w-24 rounded bg-slate-200" />
                  <div className="h-3 w-16 rounded bg-slate-200" />
                </div>
              ))}

              <div className="flex justify-between pt-3 border-t border-slate-100">
                <div className="h-5 w-20 rounded bg-slate-200" />
                <div className="h-6 w-24 rounded bg-slate-200" />
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
              <div className="h-3 w-20 rounded bg-slate-200" />
              <div className="h-6 w-32 rounded bg-slate-200 mt-3" />
              <div className="h-3 w-24 rounded bg-slate-200 mt-2" />

              <div className="mt-5 border-t pt-4 border-slate-100">
                <div className="h-6 w-40 rounded bg-slate-200" />
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
              <div className="h-3 w-32 rounded bg-slate-200 mb-5" />

              <div className="space-y-3">
                <div className="h-4 w-40 rounded bg-slate-200" />
                <div className="h-3 w-52 rounded bg-slate-200" />
                <div className="h-3 w-36 rounded bg-slate-200" />
                <div className="h-3 w-28 rounded bg-slate-200" />
              </div>
              <div className="w-full h-24 rounded-lg bg-slate-200 mt-5" />
            </div>

            <div className="bg-blue-50 rounded-xl p-5">
              <div className="h-3 w-24 rounded bg-slate-200" />
              <div className="space-y-2 mt-4">
                <div className="h-3 w-full rounded bg-slate-200" />
                <div className="h-3 w-5/6 rounded bg-slate-200" />
              </div>
              <div className="h-4 w-28 rounded bg-slate-200 mt-5" />
            </div>
          </div>
        </div>
        <div className="w-full max-w-2xl flex flex-col sm:flex-row gap-3 mt-8">
          <div className="h-11 flex-1 rounded-lg bg-slate-200" />
          <div className="h-11 flex-1 rounded-lg bg-slate-200" />
        </div>
      </div>
    </div>
  );
}
