import { Eye, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import toast from "react-hot-toast";
import WarningPopup from "../component/Warning.popup";
import Pagination from "../component/Pagination";
import SearchComponent from "../component/ui/Search.component";
import {
  useDeleteOnboardRequestMutation,
  useGetAllOnboardRequestsQuery,
} from "../redux/features/onboard/onboardApi";
import type { RequestType } from "../utils/spin.types";
import ViewRequest from "../component/onboard/View.request";
import ContactVaultLoader from "../component/loader/Contact.vault.loader";

const ContactVault = () => {
  const [searchParams, setSearchParams] = useSearchParams();
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
    templateId: "",
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

  const handleDelete = (id: string) => {
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
    content = [...Array(8)].map((_, i) => <ContactVaultLoader key={i} />);
  }
  if (!isFetching && !isLoading && requests?.length === 0) {
    content = (
      <tr>
        <td colSpan={7} className="p-0!">
          <p className="bg-[#FEFBED] text-center text-[#643315] text-md font-normal py-5 rounded-md">
            Data not found!
          </p>
        </td>
      </tr>
    );
  }
  if (!isFetching && !isLoading && requests?.length > 0) {
    content = requests?.map((item: RequestType) => {
      const { id, email, name, phone, note, create_at, templete } = item;
      const formattedDate = (value: string) => {
        const createDate = new Date(value);
        return createDate?.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
      };
      return (
        <tr key={id} className="hover:bg-gray-50">
          <td className="text-gray-600 text-sm">{formattedDate(create_at)}</td>
          <td className="text-gray-600 text-sm">{name}</td>
          <td className="text-gray-600 text-sm break-all">{email}</td>
          <td className="text-gray-600 text-sm">{phone}</td>
          <td className="text-gray-600 text-sm">{note}</td>
          <td className="text-gray-600 text-sm break-all">
            {templete?.user?.domain}/{templete?.user?.landerName}
          </td>
          <td>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setView(true);
                  setSelectedId(id);
                }}
                className="border border-[#E7EBF2] text-[#8C98AE] active:bg-[#E7EBF2] w-10 h-10 flex justify-center items-center rounded-lg cursor-pointer"
              >
                <Eye size={20} />
              </button>
              <button
                onClick={() => {
                  setOpen(true);
                  setSelectedId(id);
                }}
                className="border border-[#E7EBF2] text-[#8C98AE] active:bg-[#E7EBF2] w-10 h-10 flex justify-center items-center rounded-lg cursor-pointer"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </td>
        </tr>
      );
    });
  }

  return (
    <section className="p-5">
      <div className="flex md:flex-row flex-col justify-between items-start md:items-center">
        <div className="md:w-6/12 w-full">
          <h2 className="text-normal text-xl md:text-3xl">Contact Vault</h2>
          <ul className="flex gap-2 flex-wrap items-center py-2">
            <li>
              <Link to="/" className="text-normal text-sm md:text-base">
                Dashboard
              </Link>
            </li>
            <li>
              <i className="fa-solid fa-angles-right text-xs"></i>
            </li>
            <li>
              <p className="text-normal text-sm md:text-base">
                Contact Vault List
              </p>
            </li>
          </ul>
        </div>
      </div>
      <div className="w-full mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm mt-3">
        <div className="flex md:flex-row flex-col gap-3 md:gap-0 items-center w-full justify-between p-6">
          <div className="w-full md:w-96">
            <SearchComponent
              name="search"
              color="white"
              placeholder="Seach by name or email or note..."
              required={false}
              autoComplete="text"
              value={searchBy}
              handleChange={(e) => {
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
            />
          </div>
        </div>

        <div className="bg-white rounded-xl">
          <div className="xl:overflow-x-auto overflow-x-scroll custom-scroll bg-white">
            <table className="my-table table-fixed w-full min-w-350">
              <thead className="text-xs uppercase text-gray-500 bg-gray-50">
                <tr className="border-y border-gray-200">
                  <th>Submit at</th>
                  <th>Request Name</th>
                  <th>Request Email</th>
                  <th>Request Phone</th>
                  <th>Request Note</th>
                  <th>Request Page</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>{content}</tbody>
            </table>
          </div>
          <div className="flex flex-wrap md:gap-0 gap-3 items-center justify-between px-6 py-5 border-t border-gray-200">
            <p className="text-sm text-gray-400">
              Showing <span className="font-medium text-gray-500">{start}</span>{" "}
              to <span className="font-medium text-gray-500">{end}</span> of{" "}
              <span className="font-medium text-gray-700">{totalItem}</span>{" "}
              results
            </p>
            <Pagination
              handlePageChange={handlePageChange}
              page={page}
              totalItems={totalItem}
              itemsPerPage={limit}
            />
          </div>
        </div>
      </div>

      {view && selectId ? (
        <ViewRequest setShow={setView} isShow={view} id={selectId} />
      ) : null}
      {selectId && (
        <WarningPopup
          open={open}
          title="Do you want to delete this contact vault?"
          description={`Deleting this contact vault will permanently remove all associated data from the database. This action cannot be undone. Click "Delete" to continue or "Close" to cancel.`}
          smButton="Delete"
          clButton="Close"
          onClose={() => setOpen(false)}
          onConfirm={() => handleDelete(selectId)}
          loading={delLoad}
        />
      )}
    </section>
  );
};

export default ContactVault;
