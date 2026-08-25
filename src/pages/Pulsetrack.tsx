import { Search, Pencil, Eye, Trash2 } from "lucide-react";
import { useState } from "react";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import toast from "react-hot-toast";
import { Link, useSearchParams } from "react-router";
import WarningPopup from "../component/Warning.popup";
import UpdateProject from "../component/pulsetrack/Update.project";
import SelectComponent from "../component/ui/Select.component";
import PulsetrackLoader from "../component/loader/Pulsetrack.loader";
import {
  useDeletePulsetrackMutation,
  useGetAllPulsetrackQuery,
} from "../redux/features/pulsetrack/pulsetrackApi";
import ViewProject from "../component/pulsetrack/View.project";
import Pagination from "../component/Pagination";
import type { PulsetrackType } from "../utils/pulsetrack.types";

const statusStyles: Record<string, string> = {
  ACTIVATE: "bg-emerald-100 text-emerald-700",
  INPROCESS: "bg-amber-100 text-amber-700",
  PENDING: "bg-gray-200 text-gray-600",
  SUSPEND: "bg-gray-300 text-gray-700",
  DEACTIVATE: "bg-gray-300 text-gray-700",
};

const avatarColors: string[] = [
  "bg-lime-100 text-lime-600",
  "bg-gray-200 text-gray-600",
  "bg-green-100 text-green-600",
  "bg-yellow-100 text-yellow-700",
  "bg-red-100 text-red-600",
];

const getColorFromName = (name: string) => {
  const charCode = name.charCodeAt(0);
  return avatarColors[charCode % avatarColors.length];
};

const Pulsetrack = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [openProject, setOpenProject] = useState(false);
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(false);
  const searchBy = searchParams.get("search") || "";
  const statusBy = searchParams.get("status") || "";
  const [deletePulsetrack, { isLoading: delLoad }] =
    useDeletePulsetrackMutation();
  const page = Number(searchParams.get("page")) || 1;
  const [selectId, setSelectedId] = useState<string>("");

  const limit = 10;
  const { data, isFetching, isLoading } = useGetAllPulsetrackQuery({
    page,
    limit,
    searchBy: searchBy,
    statusBy: statusBy,
    userId: "",
    orderId: "",
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

  const handleDelete = (id: string) => {
    setSelectedId(id);
    deletePulsetrack(id)
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

  const handleChange = (value: string) => {
    searchParams.set("status", value);
    searchParams.set("page", "1");
    setSearchParams(searchParams);
  };

  // decide what to render
  let content;
  if (isFetching || isLoading) {
    content = [...Array(10)].map((_, i) => <PulsetrackLoader key={i} />);
  }
  if (!isFetching && !isLoading && pulsetrack?.length === 0) {
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
  if (!isFetching && !isLoading && pulsetrack?.length > 0) {
    content = pulsetrack?.map((item: PulsetrackType) => {
      const { id, name, idPrefix, basePath, create_at, active } = item;
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
          <td className="px-6 py-5">
            <div className="flex items-center gap-4">
              <div
                className={`w-14 min-w-14 h-11 rounded-xl flex items-center justify-center font-semibold text-sm ${getColorFromName(name || "")}`}
              >
                {name?.slice(0, 3).toUpperCase()}
              </div>
              <Link
                to={`/pulsetrack/${id}`}
                className="font-medium text-gray-800 hover:underline"
              >
                {name}
              </Link>
            </div>
          </td>
          <td className="px-6 py-5 text-gray-600 text-sm">
            {formattedDate(create_at)}
          </td>
          <td className="px-6 py-5">
            <span
              className={`px-3 py-1 text-xs font-medium rounded-full ${statusStyles[active]}`}
            >
              {active}
            </span>
          </td>
          <td className="px-6 py-5 font-medium">{idPrefix}</td>
          <td className="px-6 py-5 font-medium">{basePath}</td>
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
              <Eye
                size={18}
                onClick={() => {
                  setOpenProject(true);
                  setSelectedId(id);
                }}
                className="cursor-pointer hover:text-gray-700"
              />
              <Trash2
                size={18}
                onClick={() => {
                  setOpen(true);
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
      <div className="flex md:flex-row flex-col justify-between items-start md:items-center">
        <div className="md:w-6/12 w-full">
          <h2 className="text-normal text-2xl md:text-3xl">Pulsetrack</h2>
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
                Pulsetrack List
              </p>
            </li>
          </ul>
        </div>
      </div>
      <div className="w-full mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex flex-wrap gap-3 md:gap-0 items-center justify-between p-6 border-b border-gray-200">
          <div className="relative w-96">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              onChange={(e) => {
                const value = e.target.value;
                searchParams.set("search", value);
                searchParams.set("page", "1");
                setSearchParams(searchParams);
              }}
              value={searchBy}
              placeholder="Search pulsetrack..."
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
            />
          </div>
          <div className="w-full md:w-52">
            <SelectComponent
              value={statusBy}
              color="white"
              handleChange={handleChange}
              datas={[
                { key: "PENDING", value: "PENDING" },
                { key: "ACTIVATE", value: "ACTIVATE" },
                { key: "DEACTIVATE", value: "DEACTIVATE" },
                { key: "SUSPEND", value: "SUSPEND" },
                { key: "INPROCESS", value: "INPROCESS" },
              ]}
              label="Select Status"
            />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full table-fixed border-collapse min-w-325">
              <thead className="text-xs uppercase text-gray-500 bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-4 w-96">Project Name</th>
                  <th className="text-left px-6 py-4">Date Created</th>
                  <th className="text-left px-6 py-4">Status</th>
                  <th className="text-left px-6 py-4">ID Prefix</th>
                  <th className="text-left px-6 py-4">Base Path</th>
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

      {show && (
        <UpdateProject
          isOpen={show}
          onClose={() => setShow(false)}
          id={selectId}
        />
      )}
      {openProject && selectId ? (
        <ViewProject
          isOpen={openProject}
          onClose={() => setOpenProject(false)}
          id={selectId}
        />
      ) : null}
      {selectId && (
        <WarningPopup
          open={open}
          title="Do you want delete pulsetrack project report?"
          description={`Deleting this pulsetrack project will permanently remove all associated data from the database. This action cannot be undone. Click "Delete" to continue or "Close" to cancel.`}
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

export default Pulsetrack;
