import { Copy, ArrowLeftIcon } from "lucide-react";
import { Link, useParams } from "react-router";
import toast from "react-hot-toast";
import type { ActivitiesType } from "../utils/activities.type";
import { useGetOneActivitiesQuery } from "../redux/features/activities/activitiesApi";
import SingleActivitiesLoader from "../component/loader/Single.activities.loader";

export default function SingleActivity() {
  const params = useParams();
  const activityId = params?.id;
  const { data, isFetching, isLoading } = useGetOneActivitiesQuery(activityId);

  const { userId, action, status, method, create_at, endpoint, id, update_at } =
    (data?.activities as ActivitiesType) || {};

  const formattedDate = (value: string) => {
    const createDate = new Date(value);
    return createDate?.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  // decide what to render
  let content;
  if (isFetching || isLoading) {
    content = <SingleActivitiesLoader />;
  }
  if (!isFetching && !isLoading && data) {
    content = (
      <div className="min-h-screen p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex md:flex-row flex-col justify-between items-start md:items-center">
            <div className="w-full">
              <h2 className="text-normal text-2xl md:text-3xl">Activity Log</h2>
              <ul className="flex gap-2 items-center py-2">
                <li>
                  <Link
                    to="/admin/dashboard"
                    className="text-normal text-sm md:text-base"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <i className="fa-solid fa-angles-right text-xs"></i>
                </li>
                <li>
                  <p className="text-normal text-sm md:text-base">
                    Log Details
                  </p>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex gap-3">
            <Link
              to="/activity"
              className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 hover:bg-gray-50"
            >
              <ArrowLeftIcon size={16} />
              back
            </Link>
          </div>
        </div>
        <div className="col-span-8 space-y-6">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-4 rounded-xl bg-white border border-gray-300 p-8">
              <div className="flex flex-col items-center">
                <p className="w-24 min-w-24 h-24 rounded-full flex justify-center items-center bg-slate-300 text-xl">
                  {method}
                </p>
                <h2 className="mt-5 text-xl font-semibold max-w-full break-all">
                  {action?.slice(0, 100)}...
                </h2>
                <p className="mt-2 text-gray-400">
                  Created At: {formattedDate(create_at)}
                </p>
                <p className="mt-2 text-xs text-gray-400">
                  End Point: {endpoint}
                </p>
                <button
                  className={`mt-8 w-full rounded-lg border py-3 font-medium ${status === "SUCCESS" ? "bg-green-100 text-green-500" : "bg-red-100 text-red-500"}`}
                >
                  {status}
                </button>
              </div>
            </div>
            <div className="col-span-12 lg:col-span-8 rounded-xl border border-gray-300 bg-white p-8">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-10">
                <div>
                  <p className="text-sm text-gray-400">LOG ID</p>
                  <h4 className="mt-2 font-semibold text-gray-700">
                    {id?.slice(0, 20)}...
                  </h4>
                </div>
                <div>
                  <p className="text-sm text-gray-400">USER ID</p>
                  <h4 className="mt-2 font-semibold text-gray-700">
                    {userId ? `${userId?.slice(0, 20)}...` : "N/A"}
                  </h4>
                </div>
                <div>
                  <p className="text-sm text-gray-400">METHOD</p>
                  <h4 className="mt-2 font-semibold text-gray-700">{method}</h4>
                </div>

                <div>
                  <p className="text-sm text-gray-400">STATUS</p>
                  <h4 className="mt-2 font-semibold text-gray-700">{status}</h4>
                </div>
                <div>
                  <p className="text-sm text-gray-400">CREATED AT</p>
                  <h4 className="mt-2 font-semibold text-gray-700">
                    {formattedDate(create_at)}
                  </h4>
                </div>
                <div>
                  <p className="text-sm text-gray-400">UPDATE AT</p>
                  <h4 className="mt-2 font-semibold text-gray-700">
                    {formattedDate(update_at)}
                  </h4>
                </div>
                <div>
                  <p className="text-sm text-gray-400">ENDPOINT</p>
                  <h4 className="mt-2 font-normal text-gray-700 text-sm max-w-full break-all">
                    {endpoint}
                  </h4>
                </div>
                <div>
                  <p className="text-sm text-gray-400">ACTION</p>
                  <h4 className="mt-2 text-gray-700 text-sm max-w-full break-all">
                    {action}
                  </h4>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-gray-300 bg-white p-6">
            <div className="flex gap-3 mb-8">
              <button className="rounded-lg bg-gray-100 px-5 py-3">
                REQUEST DETAILS
              </button>
            </div>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <h2 className="text-md text-gray-400">ENDPONT:</h2>
                <div className="bg-gray-100 px-6 py-3 rounded-lg flex w-full justify-between items-center">
                  <p>{endpoint}</p>
                  <Copy
                    onClick={() => handleCopy(endpoint)}
                    color="gray"
                    className="cursor-pointer"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <h2 className="text-md text-gray-400">LOG ID:</h2>
                <div className="bg-gray-100 px-6 py-3 rounded-lg flex w-full justify-between items-center">
                  <p>{id}</p>
                  <Copy
                    onClick={() => handleCopy(id)}
                    color="gray"
                    className="cursor-pointer"
                  />
                </div>
              </div>
              {userId && (
                <div className="flex flex-col gap-3">
                  <h2 className="text-md text-gray-400">USER ID:</h2>
                  <div className="bg-gray-100 px-6 py-3 rounded-lg flex w-full justify-between items-center">
                    <p>{userId}</p>
                    <Copy
                      onClick={() => handleCopy(userId)}
                      color="gray"
                      className="cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return content;
}
