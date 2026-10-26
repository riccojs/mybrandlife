import { Pencil, Eye, Trash2 } from "lucide-react";
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
import SearchComponent from "../component/ui/Search.component";

const statusStyles: Record<string, string> = {
  ACTIVATE: "bg-emerald-100 text-emerald-700",
  INPROCESS: "bg-amber-100 text-amber-700",
  PENDING: "bg-gray-200 text-gray-600",
  SUSPEND: "bg-gray-300 text-gray-700",
  DEACTIVATE: "bg-gray-300 text-gray-700",
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
      const { id, name, idPrefix, basePath, create_at, active, total } = item;
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
          <td>
            <div className="flex gap-2 items-center">
              <p className="capitalize w-10 min-w-10 h-10 mn-h-10 bg-gray-100 text-black text-xl font-medium rounded-full flex justify-center items-center">
                {name?.slice(0, 1)}
              </p>
              <span>
                <h2 className="text-md text-medium jost">{name}</h2>
                <p className="text-xs text-gray-400">
                  Join: {formattedDate(create_at)}
                </p>
              </span>
            </div>
          </td>
          <td className="font-medium text-gray-600 text-sm">${total}</td>
          <td>
            <span
              className={`px-3 py-1 text-xs font-medium rounded-full ${statusStyles[active]}`}
            >
              {active}
            </span>
          </td>
          <td>{idPrefix}</td>
          <td>{basePath}</td>
          <td className="px-6 py-5">
            <div className="flex gap-2 text-gray-500">
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
                  setOpenProject(true);
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
    <section className="min-h-screen p-5">
      <div className="flex md:flex-row flex-col justify-between items-start md:items-center">
        <div className="md:w-6/12 w-full">
          <h2 className="text-normal text-2xl md:text-3xl">Pulsetrack</h2>
          <ul className="flex gap-2 items-center py-2 flex-wrap">
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
                Pulsetrack List
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
              placeholder="Seach by ID prefix"
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
        <div className="bg-white rounded-xl">
          <div className="xl:overflow-x-auto overflow-x-scroll custom-scroll bg-white">
            <table className="my-table table-fixed w-full min-w-350">
              <thead className="text-xs uppercase text-gray-500 bg-gray-50">
                <tr className="border-y border-gray-200">
                  <th>Project Name</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>ID Prefix</th>
                  <th>Base Path</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>{content}</tbody>
            </table>
          </div>
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
          title="Do you want to delete this pulsetrack project?"
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
