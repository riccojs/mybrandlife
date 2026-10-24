import { LayersPlus, Pencil, Eye, Trash2 } from "lucide-react";
import CreateProject from "./Create.project";
import { useState } from "react";
import ViewProject from "./View.project";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import toast from "react-hot-toast";
import UpdateProject from "./Update.project";
import { MdAddShoppingCart } from "react-icons/md";
import { Link, useSearchParams } from "react-router";
import {
  useDeletePulsetrackMutation,
  useGetAllPulsetrackQuery,
} from "../../redux/features/pulsetrack/pulsetrackApi";
import PulsetrackLoader from "../loader/Pulsetrack.loader";
import type { PulsetrackType } from "../../utils/pulsetrack.types";
import { useAuth } from "../../hook/useAuth";
import Pagination from "../Pagination";
import WarningPopup from "../popups/Warning.popup";
import SearchComponent from "../ui/Search.component";

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

const ProjectList = () => {
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [openProject, setOpenProject] = useState(false);
  const [show, setShow] = useState(false);
  const searchBy = searchParams.get("search") || "";
  const [deletePulsetrack, { isLoading: delLoad }] =
    useDeletePulsetrackMutation();
  const page = Number(searchParams.get("page")) || 1;
  const [selectId, setSelectedId] = useState<string>("");
  const { user } = useAuth();
  const userId = user?.id;
  const limit = 10;
  const { data, isFetching, isLoading } = useGetAllPulsetrackQuery({
    page,
    limit,
    searchBy: searchBy,
    statusBy: "INPROCESS",
    userId: userId,
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
        setDeleteOpen(true);
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
    content = [...Array(8)].map((_, i) => <PulsetrackLoader key={i} />);
  }
  if (!isFetching && !isLoading && pulsetrack?.length === 0) {
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
        <tr key={id} className="hover:bg-gray-50">
          <td className="px-6 py-5">
            <div className="flex items-center gap-4">
              <div
                className={`w-11 min-w-11 h-11 rounded-xl flex items-center justify-center font-semibold text-xl ${getColorFromName(name || "")}`}
              >
                {name?.slice(0, 1).toUpperCase()}
              </div>
              <span className="font-medium text-gray-800">{name}</span>
            </div>
          </td>
          <td className="px-6 py-5 text-gray-600 text-sm">
            {formattedDate(create_at)}
          </td>
          <td className="px-6 py-5">
            <span
              className={`px-6 py-1 text-xs font-medium rounded-md ${statusStyles[active]}`}
            >
              {active}
            </span>
          </td>
          <td className="px-6 py-5 font-medium">{idPrefix}</td>
          <td className="px-6 py-5 font-medium">{basePath}</td>
          <td className="px-6 py-5">
            <div className="flex gap-3 text-gray-500">
              <Link
                to={active === "ACTIVATE" ? "" : `/pulsetrack/projects/${id}`}
                className={`border border-[#E7EBF2] text-[#8C98AE] active:bg-[#E7EBF2] w-10 h-10 flex justify-center items-center rounded-lg cursor-pointer ${
                  active === "ACTIVATE"
                    ? "cursor-not-allowed"
                    : "cursor-pointer"
                }`}
              >
                <MdAddShoppingCart size={20} />
              </Link>
              <button
                className="border border-[#E7EBF2] text-[#8C98AE] active:bg-[#E7EBF2] w-10 h-10 flex justify-center items-center rounded-lg cursor-pointer"
                onClick={() => {
                  setShow(true);
                  setSelectedId(id);
                }}
              >
                <Pencil size={20} />
              </button>

              <button
                onClick={() => {
                  setOpenProject(true);
                  setSelectedId(id);
                }}
                className="border border-[#E7EBF2] text-[#8C98AE] active:bg-[#E7EBF2] w-10 h-10 flex justify-center items-center rounded-lg cursor-pointer"
              >
                <Eye size={20} />
              </button>
              <button
                onClick={() => {
                  setSelectedId(id);
                  setDeleteOpen(true);
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
      <div className="w-full mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex gap-3 md:gap-0 items-center justify-between p-6">
          <div className="w-full md:w-96">
            <SearchComponent
              name="search"
              color="white"
              value={searchBy}
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
          <button
            onClick={() => setOpen(true)}
            className="border border-[#E7EBF2] text-[#8C98AE] active:bg-[#E7EBF2] min-w-10 w-10 h-10 flex justify-center items-center rounded-lg cursor-pointer"
          >
            <LayersPlus size={20} />
          </button>
        </div>
        <div className="bg-white rounded-xl ">
          <div className="overflow-x-auto bg-white">
            <table className="my-table table-fixed w-full min-w-350">
              <thead className="text-xs uppercase text-gray-500 bg-gray-50">
                <tr className="border-y border-gray-200">
                  <th className="text-left px-6 py-4 w-96">PulseTrack IDs</th>
                  <th className="text-left px-6 py-4">Date Created</th>
                  <th className="text-left px-6 py-4">Status</th>
                  <th className="text-left px-6 py-4">Track ID</th>
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

          <Pagination
            handlePageChange={handlePageChange}
            page={page}
            totalItems={totalItem}
            itemsPerPage={limit}
          />
        </div>
      </div>
      {open && <CreateProject isOpen={open} onClose={() => setOpen(false)} />}
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
      {selectId && deleteOpen && (
        <WarningPopup
          open={deleteOpen}
          title="Do you want to delete this project?"
          description={`Deleting this project will permanently remove it along with all associated data. This action cannot be undone. Click "Delete" to permanently delete the project, or click "Close" to cancel and return without making any changes.`}
          smButton="Delete"
          clButton="Close"
          onClose={() => setDeleteOpen(false)}
          onConfirm={() => handleDelete(selectId)}
          loading={delLoad}
        />
      )}
    </section>
  );
};

export default ProjectList;
