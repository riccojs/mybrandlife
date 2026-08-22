import { Search, Eye } from "lucide-react";
import { Link, useSearchParams } from "react-router";
import Pagination from "../Pagination";
import { useGetAllPulsetrackQuery } from "../../redux/features/pulsetrack/pulsetrackApi";
import type { PulsetrackType } from "../../utils/pulsetrack.types";
import { useAuth } from "../../hook/useAuth";
import OrderListLoader from "../loader/Order.list.loader";

const statusStyles: Record<string, string> = {
  ACTIVATE: "bg-emerald-100 text-emerald-700",
  INPROCESS: "bg-amber-100 text-amber-700",
  PENDING: "bg-gray-200 text-gray-600",
  SUSPEND: "bg-gray-300 text-gray-700",
  DEACTIVATE: "bg-gray-300 text-gray-700",
};

const OrderList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchBy = searchParams.get("search") || "";
  const page = Number(searchParams.get("page")) || 1;
  const limit = 10;
  const { user } = useAuth();
  const userId = user?.id;

  const { data, isFetching, isLoading } = useGetAllPulsetrackQuery({
    page,
    limit,
    searchBy: "",
    statusBy: "ACTIVATE",
    userId: userId,
    orderId: Number(searchBy) || "",
  });
  const handlePageChange = (value: number) => {
    searchParams.set("page", value.toString());
    setSearchParams(searchParams);
  };
  const pulsetrack = data?.data?.pulsetrack || [];
  const currentPage = data?.data?.currentPage || [];
  const totalItem = data?.data?.totalPulsetrack || 0;
  const start = (currentPage - 1) * limit + 1;
  const end = Math.min(currentPage * limit, totalItem);

  // decide what to render
  let content;
  if (isFetching || isLoading) {
    content = [...Array(8)].map((_, i) => <OrderListLoader key={i} />);
  }
  if (!isFetching && !isLoading && pulsetrack?.length === 0) {
    content = (
      <tr>
        <td colSpan={7}>
          <p className="bg-amber-100 text-md font-normal p-3 rounded-md">
            Data not found!
          </p>
        </td>
      </tr>
    );
  }
  if (!isFetching && !isLoading && pulsetrack?.length > 0) {
    content = pulsetrack?.map((item: PulsetrackType) => {
      const { id, create_at, active, sequence, wristbands, subTotal, total } =
        item;
      const formattedDate = (value: string) => {
        const createDate = new Date(value);
        return createDate?.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
      };
      return (
        <tr
          key={id}
          className="border-t border-gray-100 hover:bg-gray-50 transition"
        >
          <td className="px-6 py-5">#{sequence}</td>
          <td className="px-6 py-5 text-gray-600 text-sm">
            {formattedDate(create_at)}
          </td>
          <td className="px-6 py-5">{wristbands?.length}</td>
          <td className="px-6 py-5">${subTotal}</td>
          <td className="px-6 py-5">${total}</td>
          <td className="px-6 py-5">
            <span
              className={`px-3 py-1 text-xs font-medium rounded-full ${statusStyles[active]}`}
            >
              {active}
            </span>
          </td>
          <td className="px-6 py-5 font-medium">
            <Link
              to={`/pulsetrack/orders/success/${id}`}
              className="flex gap-2 items-center border border-gray-300 px-3 py-1 rounded-lg w-fit"
            >
              <Eye size={20} className="cursor-pointer hover:text-gray-700" />
              <span className="text-xs">View</span>
            </Link>
          </td>
        </tr>
      );
    });
  }
  return (
    <section className="bg-gray-50 min-h-screen p-5">
      <div className="w-full mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex flex-wrap gap-3 md:gap-0 items-center justify-between p-6 border-b border-gray-200">
          <div className="relative w-96">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="number"
              onChange={(e) => {
                const value = e.target.value;
                if (value) {
                  searchParams.set("search", value);
                  searchParams.set("page", "1");
                } else {
                  searchParams.delete("search");
                  searchParams.delete("page");
                }
                setSearchParams(searchParams);
              }}
              value={searchBy}
              placeholder="Search order by id..."
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full table-fixed border-collapse min-w-7xl">
            <thead className="text-xs uppercase text-gray-500 bg-gray-50">
              <tr>
                <th className="text-left px-6 py-4">Order ID</th>
                <th className="text-left px-6 py-4">Order On</th>
                <th className="text-left px-6 py-4">Total Wristband</th>
                <th className="text-left px-6 py-4">Sub Total</th>
                <th className="text-left px-6 py-4">Total</th>
                <th className="text-left px-6 py-4">Status</th>
                <th className="text-left px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>{content}</tbody>
          </table>
        </div>
        <div className="flex flex-wrap gap-3 md:gap-0 items-center justify-between px-6 py-5 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Showing <span className="font-medium text-gray-700">{start}</span>{" "}
            to <span className="font-medium text-gray-700">{end}</span> of{" "}
            <span className="font-medium text-gray-700">{totalItem}</span>{" "}
            results
          </p>
          {totalItem > limit && (
            <Pagination
              handlePageChange={handlePageChange}
              page={page}
              totalItems={totalItem}
              itemsPerPage={limit}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default OrderList;
