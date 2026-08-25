import { Eye, Trash2 } from "lucide-react";
import { useState } from "react";
import { useParams, useSearchParams } from "react-router";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import toast from "react-hot-toast";
import Pagination from "../../component/Pagination";
import {
  useDeleteOnboardRequestMutation,
  useGetAllOnboardRequestsQuery,
} from "../../redux/features/onboard/onboardApi";
import SpiningLoader from "../loader/Spining.loader";
import type { RequestType } from "../../utils/spin.types";
import WarningPopup from "../Warning.popup";
import ViewRequest from "./View.request";

const RequestList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = useParams();
  const id = params?.id;
  const [view, setView] = useState(false);
  const [open, setOpen] = useState(false);
  const searchBy = searchParams.get("search") || "";
  const [deleteOnboardRequest, { isLoading: delLoad }] =
    useDeleteOnboardRequestMutation();
  const page = Number(searchParams.get("page")) || 1;
  const [selectId, setSelectedId] = useState<string>("");

  const limit = 14;
  const { data, isFetching, isLoading } = useGetAllOnboardRequestsQuery({
    page,
    limit,
    searchBy: searchBy,
    templateId: id,
  });
  const handlePageChange = (value: number) => {
    searchParams.set("page", value.toString());
    setSearchParams(searchParams);
  };
  const requests = data?.data?.requests || [];
  const currentPage = data?.data?.currentPage || [];
  const totalItem = data?.data?.totalRequests || 0;
  const start = (currentPage - 1) * limit + 1;
  const end = Math.min(currentPage * limit, totalItem);

  const handleSubmit = (id: string) => {
    setSelectedId(id);
    deleteOnboardRequest(id)
      .unwrap()
      .then((res) => {
        toast.success(res.message);
        setOpen(false);
        setSelectedId("");
      })
      .catch((error) => {
        const err = error as FetchBaseQueryError;
        const errorMessage = (err.data as { message: string }).message;
        toast.error(errorMessage);
      });
  };

  // decide what to render
  let content;
  if (isFetching || isLoading) {
    content = [...Array(8)].map((_, i) => <SpiningLoader key={i} />);
  }
  if (!isFetching && !isLoading && requests?.length === 0) {
    content = (
      <tr>
        <td colSpan={6}>
          <p className="bg-amber-100 text-md font-normal p-3 rounded-md">
            Data not found!
          </p>
        </td>
      </tr>
    );
  }
  if (!isFetching && !isLoading && requests?.length > 0) {
    content = requests?.map((item: RequestType) => {
      const { id, email, name, phone, note, create_at } = item;
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
          <td className="px-6 py-5 text-gray-600 text-sm">
            {formattedDate(create_at)}
          </td>
          <td className="px-6 py-5 text-gray-600 text-sm">{name}</td>
          <td className="px-6 py-5 text-gray-600 text-sm">{email}</td>
          <td className="px-6 py-5 text-gray-600 text-sm">{phone}</td>
          <td className="px-6 py-5 text-gray-600 text-sm">{note}</td>
          <td className="px-6 py-5">
            <div className="flex gap-4 text-gray-500">
              <button
                onClick={() => {
                  setView(true);
                  setSelectedId(id);
                }}
              >
                <Eye size={18} className="cursor-pointer hover:text-gray-700" />
              </button>
              <button
                onClick={() => {
                  setOpen(true);
                  setSelectedId(id);
                }}
              >
                <Trash2
                  size={18}
                  className="cursor-pointer hover:text-red-500"
                />
              </button>
            </div>
          </td>
        </tr>
      );
    });
  }

  return (
    <section className="p-5">
      <div className="w-full mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="p-5">
          <h2>Request List</h2>
        </div>
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full table-fixed border-collapse min-w-325">
              <thead className="text-xs uppercase text-gray-500 bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-4">Submit at</th>
                  <th className="text-left px-6 py-4">Request Name</th>
                  <th className="text-left px-6 py-4">Request Email</th>
                  <th className="text-left px-6 py-4">Request Phone</th>
                  <th className="text-left px-6 py-4">Request Note</th>
                  <th className="text-left px-6 py-4">Actions</th>
                </tr>
              </thead>

              <tbody>{content}</tbody>
            </table>
          </div>
        </div>
        <div className="flex flex-wrap md:gap-0 gap-3 items-center justify-between px-6 py-5 border-t border-gray-200">
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
        {view && selectId ? (
          <ViewRequest setShow={setView} isShow={view} id={selectId} />
        ) : null}
        {selectId && (
          <WarningPopup
            open={open}
            title="Do you want delete this request?"
            description={`Deleting this request will permanently remove all associated data from the database. This action cannot be undone. Click "Delete" to continue or "Close" to cancel.`}
            smButton="Delete"
            clButton="Close"
            onClose={() => setOpen(false)}
            onConfirm={() => handleSubmit(selectId)}
            loading={delLoad}
          />
        )}
      </div>
    </section>
  );
};

export default RequestList;
