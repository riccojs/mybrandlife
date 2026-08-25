function WristbandLoader() {
  return (
    <tr className="animate-pulse">
      <td>
        <div className="flex gap-2 items-center">
          <div className="bg-slate-200 h-16 w-16 min-w-16 rounded-md px-4"></div>
          <div className="flex flex-col gap-2 w-full">
            <div className="bg-slate-200 h-8 rounded-md px-4"></div>
            <div className="bg-slate-200 h-6 rounded-md px-4"></div>
          </div>
        </div>
      </td>
      <td className="px-2">
        <div className="bg-slate-200 h-10 rounded-md px-4"></div>
      </td>
      <td className="px-2">
        <div className="bg-slate-200 h-10 rounded-md px-4"></div>
      </td>
      <td className="px-2">
        <div className="bg-slate-200 h-10 rounded-md px-4"></div>
      </td>
      <td className="px-2">
        <div className="bg-slate-200 h-10 rounded-md px-4"></div>
      </td>
      <td className="px-2">
        <div className="bg-slate-200 h-10 rounded-md"></div>
      </td>
      <td>
        <div className="flex w-full gap-1 items-center justify-start">
          <div className="bg-slate-200 h-8 min-w-8 w-8 rounded-md"></div>
          <div className="bg-slate-200 h-8 min-w-8 w-8 rounded-md"></div>
          <div className="bg-slate-200 h-8 min-w-8 w-8 rounded-md"></div>
        </div>
      </td>
    </tr>
  );
}

export default WristbandLoader;
