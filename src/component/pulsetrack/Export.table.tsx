import { useSearchParams } from "react-router";
import { useAuth } from "../../hook/useAuth";
import { useGetAllExportQuery } from "../../redux/features/pulsetrack/pulsetrackApi";
import Pagination from "../Pagination";

function ExportTable() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const userId = user?.id;
  const limit = 10;
  const page = Number(searchParams.get("page")) || 1;
  const { data, isFetching, isLoading } = useGetAllExportQuery({
    page,
    limit,
    userId: userId,
  });
  const exportData = data?.data?.exports || [];
  const totalItem = data?.data?.totalExports || 0;

  const handlePageChange = (value: number) => {
    setSearchParams({ page: value.toString() });
  };

  // decide what to rednder
  let content;
  if (isFetching || isLoading) {
    content = [...Array(8)].map((_, i) => <ExportLoader key={i} />);
  }
  if (!isFetching && !isLoading && exportData?.length === 0) {
    content = (
      <tr>
        <td colSpan={4}>
          <p className="bg-amber-100 text-md font-normal p-3 rounded-md">
            Data not found!
          </p>
        </td>
      </tr>
    );
  }
  if (!isFetching && !isLoading && exportData?.length > 0) {
    content = exportData?.map(
      (item: {
        id: string;
        name: string;
        status: string;
        action: string;
        create_at: string;
      }) => {
        const { id, name, status, action, create_at } = item || {};
        const formattedDate = (value: string) => {
          const createDate = new Date(value);
          return createDate?.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          });
        };
        return (
          <tr key={id} className="border-b border-[#E6E9EF] last:border-none">
            <td className="px-6 py-4 text-[#374151]">{name}</td>
            <td className="px-6 py-4 text-[#6B7280]">
              {formattedDate(create_at)}
            </td>
            <td className="px-6 py-4">
              <span
                className={`uppercase text-[12px] px-3 py-1 rounded-full ${status === "success" ? "bg-[#E8F5E9] text-[#4CAF50]" : "bg-[#f5e8e8] text-[#ff0000]"}`}
              >
                {status}
              </span>
            </td>
            <td className="px-6 py-4 text-right">
              <button className="text-[#8BC34A] uppercase font-medium">
                {action}
              </button>
            </td>
          </tr>
        );
      },
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-[18px] font-semibold text-[#1F2937] mb-4">
        Recent Export Activity
      </h2>

      <div className="bg-white border border-[#E6E9EF] rounded-xl overflow-x-auto">
        <table className="w-full table-fixed text-[14px] min-w-4xl">
          <thead className="text-[#6B7280] border-b border-[#E6E9EF]">
            <tr>
              <th className="text-left px-6 py-3 font-medium">File Name</th>
              <th className="text-left px-6 py-3 font-medium">
                Date Generated
              </th>
              <th className="text-left px-6 py-3 font-medium">Status</th>
              <th className="text-right px-6 py-3 font-medium">Action</th>
            </tr>
          </thead>

          <tbody>{content}</tbody>
        </table>
      </div>
      {totalItem > limit && (
        <Pagination
          handlePageChange={handlePageChange}
          page={page}
          totalItems={totalItem}
          itemsPerPage={limit}
        />
      )}
    </div>
  );
}

export default ExportTable;

function ExportLoader() {
  return (
    <tr className="animate-pulse">
      <td className="text-left px-6 py-4">
        <div className="bg-slate-200 h-8 rounded-md px-4"></div>
      </td>
      <td className="text-left px-6 py-4">
        <div className="bg-slate-200 h-8 rounded-md px-4"></div>
      </td>
      <td className="text-left px-6 py-4">
        <div className="bg-slate-200 h-8 rounded-md px-4"></div>
      </td>
      <td className="text-left px-6 py-4">
        <div className="bg-slate-200 h-8 rounded-md px-4"></div>
      </td>
    </tr>
  );
}
