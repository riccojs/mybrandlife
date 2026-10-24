import { Pencil, Eye, Trash2, StickyNotePlus } from "lucide-react";
import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import toast from "react-hot-toast";
import SpinAgreement from "../component/spin/Spin.agreement";
import SpinIcon from "../assets/menu-icons/spin.svg";
import CreateSpining from "../component/spin/Create.spining";
import ViewSpining from "../component/spin/View.spining";
import UpdateSpining from "../component/spin/Update.spining";
import { useAuth } from "../hook/useAuth";
import Pagination from "../component/Pagination";
import type { SpinType } from "../utils/spin.types";
import SelectComponent from "../component/ui/Select.component";
import {
  useDeleteSpiningMutation,
  useGetAllSpiningQuery,
} from "../redux/features/spin/spinApi";
import SpiningLoader from "../component/loader/Spining.loader";
import WarningPopup from "../component/popups/Warning.popup";
import SearchComponent from "../component/ui/Search.component";

const statusStyles: Record<string, string> = {
  PEOPLE: "bg-emerald-100 text-emerald-700",
  CLUBS: "bg-amber-100 text-amber-700",
  HOTELS: "bg-gray-100 text-gray-600",
  RESTAURANTS: "bg-yellow-100 text-yellow-700",
  OTHER: "bg-red-100 text-red-700",
};

interface UserType {
  package?: string;
  id: string;
  userTemplete: { enableSpin: boolean }[];
  membership: { status: string }[];
  domain: string;
}

const SpinList = () => {
  const [open, setOpen] = useState(false);
  const [spinStatus, setSpinStatus] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [view, setView] = useState(false);
  const [show, setShow] = useState(false);
  const [warning, setWarning] = useState(false);
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const [deleteSpin, { isLoading: delLoad }] = useDeleteSpiningMutation();
  const page = Number(searchParams.get("page")) || 1;
  const [selectId, setSelectedId] = useState<string>("");
  const { user } = useAuth() as { user: UserType | null };
  const userId = user?.id;
  const domainName = user?.domain;
  const existTemplate = user?.userTemplete;
  const enableSpin = user?.userTemplete[0]?.enableSpin;
  const limit = 14;
  const { data, isFetching, isLoading } = useGetAllSpiningQuery({
    page,
    limit,
    searchBy: search,
    statusBy: status,
    landerId: userId,
  });
  const handlePageChange = (value: number) => {
    searchParams.set("page", value.toString());
    setSearchParams(searchParams);
  };
  const group = data?.data?.spining || [];
  const currentPage = data?.data?.currentPage || [];
  const totalItem = data?.data?.totalSpining || 0;
  const start = (currentPage - 1) * limit + 1;
  const end = Math.min(currentPage * limit, totalItem);

  const handleDelete = (id: string) => {
    setSelectedId(id);
    deleteSpin(id)
      .unwrap()
      .then((res) => {
        toast.success(res.message);
        setSelectedId("");
        setWarning(false);
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
  if (!isFetching && !isLoading && group?.length === 0) {
    content = (
      <tr>
        <td colSpan={6} className="p-0!">
          <p className="bg-[#FEFBED] text-center text-[#643315] text-md font-normal py-5 rounded-md">
            Data not found!
          </p>
        </td>
      </tr>
    );
  }
  if (!isFetching && !isLoading && group?.length > 0) {
    content = group?.map((item: SpinType) => {
      const { id, groupType, title, url, create_at, isEnable } = item;
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
          <td className="text-gray-600 text-sm">{title}</td>
          <td className="text-gray-600 text-sm">{url?.slice(0, 50)}..</td>
          <td>
            <span
              className={`px-3 py-1 text-xs font-medium rounded-full ${statusStyles[groupType]}`}
            >
              {groupType}
            </span>
          </td>
          <td>
            <span
              className={`px-3 py-1 text-xs font-medium rounded-full ${isEnable ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
            >
              {isEnable ? "ACTIVE" : "DEACTIVATE"}
            </span>
          </td>
          <td>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShow(true);
                  setSelectedId(id);
                }}
                className="border border-[#E7EBF2] text-[#8C98AE] active:bg-[#E7EBF2] w-10 h-10 flex justify-center items-center rounded-lg cursor-pointer"
              >
                <Pencil size={20} />
              </button>

              <button
                onClick={() => {
                  setView(true);
                  setSelectedId(id);
                }}
                className="border border-[#E7EBF2] text-[#8C98AE] active:bg-[#E7EBF2] w-10 h-10 flex justify-center items-center rounded-lg cursor-pointer"
              >
                <Eye size={20} className="cursor-pointer hover:text-gray-700" />
              </button>
              <button
                onClick={() => {
                  setWarning(true);
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
    <section className="min-h-screen p-3 md:p-5">
      <div className="md:w-6/12 w-full">
        <h2 className="text-normal text-2xl md:text-3xl">SPIN</h2>
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
            <p className="text-normal text-sm md:text-base">{domainName}</p>
          </li>
          <li>
            <i className="fa-solid fa-angles-right text-xs"></i>
          </li>
          <li>
            <p className="text-normal text-sm md:text-base">SPIN List</p>
          </li>
        </ul>
      </div>
      <div className="w-full mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm mt-3">
        <div className="w-full 2xl:flex-row flex-col gap-5 flex justify-between items-center p-6">
          <div className="flex md:w-auto w-full sm:flex-row flex-col justify-between items-start gap-3 md:items-center">
            <div className="w-full md:w-96">
              <SearchComponent
                name="search"
                color="white"
                value={search}
                placeholder="Seach by title"
                required={false}
                autoComplete="text"
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
            <div className="w-full md:w-52">
              <SelectComponent
                value={status}
                label="All Groups"
                handleChange={(value: string) => {
                  if (value) {
                    searchParams.set("status", value);
                    searchParams.set("page", "1");
                  } else {
                    searchParams.delete("status");
                    searchParams.delete("page");
                  }
                  setSearchParams(searchParams);
                }}
                datas={[
                  { key: "PEOPLE", value: "PEOPLE" },
                  { key: "CLUBS", value: "CLUBS" },
                  { key: "HOTELS", value: "HOTELS" },
                  { key: "RESTAURANTS", value: "RESTAURANTS" },
                  { key: "OTHER", value: "OTHER" },
                ]}
                color="#F3F3F3"
              />
            </div>
          </div>
          <div className="flex w-full gap-3 items-center justify-center md:justify-end">
            {existTemplate && (
              <div>
                {enableSpin ? (
                  <button
                    onClick={() => setSpinStatus(true)}
                    className="bg-gray-300 min-w-12 w-12 h-12 p-3 cursor-pointer rounded-lg flex gap-2 items-center justify-center"
                  >
                    <img
                      src={SpinIcon}
                      alt={SpinIcon}
                      className="w-full h-full"
                    />
                  </button>
                ) : (
                  <button
                    onClick={() => setSpinStatus(true)}
                    className="bg-[#cbf38b] min-w-12 w-12 h-12 p-2 cursor-pointer rounded-lg flex gap-2 items-center justify-center"
                  >
                    <img
                      src={SpinIcon}
                      alt={SpinIcon}
                      className="w-full h-full"
                    />
                  </button>
                )}
              </div>
            )}
            <button
              onClick={() => setOpen(true)}
              className="flex cursor-pointer bg-gray-50 items-center min-w-12 w-12 h-12 p-3 rounded-lg border border-gray-200 hover:bg-gray-100 text-sm"
            >
              <StickyNotePlus />
            </button>
          </div>
        </div>
        <div className="bg-white rounded-xl ">
          <div className="overflow-x-auto bg-white">
            <table className="my-table table-fixed w-full min-w-350">
              <thead className="text-xs uppercase text-gray-500 bg-gray-50">
                <tr className="border-y border-gray-200">
                  <th>Create at</th>
                  <th>Title</th>
                  <th>URL</th>
                  <th>Group Type</th>
                  <th>Status</th>
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
      {open && <CreateSpining isOpen={open} onClose={() => setOpen(false)} />}
      {show && (
        <UpdateSpining
          isOpen={show}
          onClose={() => setShow(false)}
          id={selectId}
        />
      )}
      {view && selectId ? (
        <ViewSpining
          isOpen={view}
          onClose={() => setView(false)}
          id={selectId}
        />
      ) : null}

      {spinStatus && enableSpin && (
        <SpinAgreement
          setShow={setSpinStatus}
          isShow={spinStatus}
          body="Are you sure you want to disable the SPIN feature? You will stop receiving all upcoming SPIN request."
          status={false}
        />
      )}
      {spinStatus && !enableSpin && (
        <SpinAgreement
          setShow={setSpinStatus}
          isShow={spinStatus}
          body="Are you sure you want to enable the SPIN feature? You'll start receiving new SPIN requests from customers."
          status={true}
        />
      )}
      {selectId && (
        <WarningPopup
          open={warning}
          title="Do you want delete this SPIN?"
          description={`Deleting this SPIN will permanently remove all associated data from the database. This action cannot be undone. Click "Delete" to continue or "Close" to cancel.`}
          smButton="Delete"
          clButton="Close"
          onClose={() => setWarning(false)}
          onConfirm={() => handleDelete(selectId)}
          loading={delLoad}
        />
      )}
    </section>
  );
};

export default SpinList;
