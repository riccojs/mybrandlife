import { Pencil, Eye, Trash2 } from "lucide-react";
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
  const searchBy = searchParams.get("search") || "";
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
    searchBy: searchBy,
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
        <td colSpan={6}>
          <p className="bg-amber-100 text-md font-normal p-3 rounded-md">
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
        <tr
          key={id}
          className="border-t border-gray-100 hover:bg-gray-50 transition"
        >
          <td className="px-6 py-5 text-gray-600 text-sm">
            {formattedDate(create_at)}
          </td>
          <td className="px-6 py-5 text-gray-600 text-sm">{title}</td>
          <td className="px-6 py-5 text-gray-600 text-sm">{url}</td>
          <td className="px-6 py-5">
            <span
              className={`px-3 py-1 text-xs font-medium rounded-full ${statusStyles[groupType]}`}
            >
              {groupType}
            </span>
          </td>
          <td className="px-6 py-5">
            <span
              className={`px-3 py-1 text-xs font-medium rounded-full ${isEnable ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
            >
              {isEnable ? "ACTIVE" : "DEACTIVATE"}
            </span>
          </td>
          <td className="px-6 py-5">
            <div className="flex gap-4 text-gray-500">
              <Pencil
                size={18}
                onClick={() => {
                  setShow(true);
                  setSelectedId(id);
                }}
                className="cursor-pointer hover:text-gray-700"
              />
              <button
                onClick={() => {
                  setView(true);
                  setSelectedId(id);
                }}
              >
                <Eye size={18} className="cursor-pointer hover:text-gray-700" />
              </button>
              <Trash2
                size={18}
                onClick={() => {
                  setWarning(true);
                  setSelectedId(id);
                }}
                className="cursor-pointer hover:text-red-500"
              />
            </div>
          </td>
        </tr>
      );
    });
  }

  return (
    <section className="bg-gray-50 min-h-screen p-5">
      <div className="md:w-6/12 w-full">
        <h2 className="text-normal text-2xl md:text-3xl">SPIN</h2>
        <ul className="flex gap-2 items-center py-2">
          <li>
            <Link to="/dashboard" className="text-normal text-sm md:text-base">
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
      <div className="w-full mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex md:flex-row flex-col gap-3 md:gap-0 items-center w-full justify-between p-6 border-b border-gray-200">
          <div className="w-64 md:w-64">
            <SelectComponent
              value={searchBy}
              label="All Groups"
              handleChange={(value: string) => {
                if (value) {
                  searchParams.set("search", value);
                  searchParams.set("page", "1");
                } else {
                  searchParams.delete("search");
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
          <div className="flex md:flex-row flex-col justify-end w-full gap-5 items-center">
            {existTemplate && (
              <div className="flex w-full sm:w-auto sm:flex-row flex-col gap-5 items-center">
                {enableSpin ? (
                  <button
                    onClick={() => setSpinStatus(true)}
                    className="bg-gray-300 w-full px-4 py-2 cursor-pointer rounded-xl flex gap-2 items-center justify-center"
                  >
                    Hide SPIN
                  </button>
                ) : (
                  <button
                    onClick={() => setSpinStatus(true)}
                    className="bg-[#cbf38b] w-full px-4 py-2 cursor-pointer rounded-xl flex gap-2 items-center justify-center"
                  >
                    Show SPIN
                  </button>
                )}
              </div>
            )}
            <button
              onClick={() => setOpen(true)}
              className="flex cursor-pointer items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-sm"
            >
              <img src={SpinIcon} alt="" className="w-5" />
              Create Link
            </button>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full table-fixed border-collapse min-w-325">
              <thead className="text-xs uppercase text-gray-500 bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-4">Create at</th>
                  <th className="text-left px-6 py-4">Name</th>
                  <th className="text-left px-6 py-4">URL</th>
                  <th className="text-left px-6 py-4">Group Type</th>
                  <th className="text-left px-6 py-4">Status</th>
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
