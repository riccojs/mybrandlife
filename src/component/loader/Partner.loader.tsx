function PartnerLoader() {
  return (
    <tr className="animate-pulse">
      <td>
        <div className="w-full flex gap-2 items-center">
          <div className="bg-slate-200 h-10 min-w-10 w-10 rounded-full px-4"></div>
          <div className="flex flex-col gap-1 w-full">
            <div className="bg-slate-200 w-full h-5 rounded-md px-4"></div>
            <div className="bg-slate-200 w-8/12 h-4 rounded-md px-4"></div>
          </div>
        </div>
      </td>
      <td className="w-96">
        <div className="bg-slate-200 h-10 rounded-md px-4"></div>
      </td>
      <td className="w-96">
        <div className="bg-slate-200 h-10 rounded-md px-4"></div>
      </td>
      <td>
        <div className="bg-slate-200 h-10 rounded-md px-4"></div>
      </td>
      <td>
        <div className="bg-slate-200 h-10 rounded-md px-4"></div>
      </td>
      <td>
        <div className="flex w-full gap-2 items-center justify-start">
          <div className="bg-slate-200 h-10 min-w-10 w-10 rounded-md"></div>
          <div className="bg-slate-200 h-10 min-w-10 w-10 rounded-md"></div>
        </div>
      </td>
    </tr>
  );
}

export default PartnerLoader;
