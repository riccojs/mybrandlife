function DomainLoader() {
  return (
    <tr className="animate-pulse">
      <td className="w-64">
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

export default DomainLoader;
