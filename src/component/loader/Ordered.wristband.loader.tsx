function OrderedWristbandLoader() {
  return (
    <tr className="animate-pulse">
      <td className="w-64">
        <div className="w-full flex gap-2 items-center">
          <div className="bg-slate-200 h-10 min-w-10 w-10 rounded-full px-4"></div>
          <div className="flex flex-col gap-1 w-full">
            <div className="bg-slate-200 w-full h-5 rounded-md px-4"></div>
            <div className="bg-slate-200 w-8/12 h-4 rounded-md px-4"></div>
          </div>
        </div>
      </td>
      <td className="w-96">
        <div className="flex flex-col gap-2 w-full">
          <div className="bg-slate-200 h-8 rounded-md px-4"></div>
          <div className="bg-slate-200 h-6 rounded-md px-4"></div>
        </div>
      </td>
      <td className="w-96">
        <div className="bg-slate-200 h-10 rounded-md px-4"></div>
      </td>
      <td className="w-44">
        <div className="bg-slate-200 h-10 rounded-md px-4"></div>
      </td>
      <td>
        <div className="bg-slate-200 h-10 rounded-md px-4"></div>
      </td>
      <td>
        <div className="bg-slate-200 h-10 rounded-md px-4"></div>
      </td>
      <td>
        <div className="flex gap-2 items-center w-full">
          <div className="bg-slate-200 w-10 min-w-10 h-10 rounded-md px-4"></div>
          <div className="bg-slate-200 w-10 min-w-10 h-10 rounded-md px-4"></div>
        </div>
      </td>
    </tr>
  );
}

export default OrderedWristbandLoader;
