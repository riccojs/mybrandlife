import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import toast from "react-hot-toast";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import {
  useDeleteReportMutation,
  useGetAllReportQuery,
} from "../redux/features/report/reportApi";
import ReportLoader from "../component/loader/Report.loader";
import Pagination from "../component/Pagination";
import SingleReport from "../component/setting/Single.report";
import WarningPopup from "../component/Warning.popup";

function ReportList() {
  const [page, setPage] = useState<number>(1);
  const [selectId, setSelectedId] = useState<string>("");
  const [showTab, setShowTab] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [deleteReport, { isLoading: delLoading }] = useDeleteReportMutation();
  const limit = 14;
  const { data, isLoading, isFetching } = useGetAllReportQuery({
    page,
    limit,
  });

  const totalItem = data?.data?.totalReport;
  const report = data?.data?.report;
  const currentPage = data?.data?.currentPage || [];
  const start = (currentPage - 1) * limit + 1;
  const end = Math.min(currentPage * limit, totalItem);

  const handlePageChange = () => {
    setPage(2);
  };

  const handleDelete = (id: string) => {
    setSelectedId(id);
    deleteReport(id)
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

  useEffect(() => {
    if (showTab) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showTab]);

  // decide what to render
  let content;
  if (isLoading) {
    content = [...Array(8)].map((_, i) => <ReportLoader key={i} />);
  }
  if (isFetching) {
    content = [...Array(8)].map((_, i) => <ReportLoader key={i} />);
  }
  if (!isLoading && !isFetching && report?.length === 0) {
    content = (
      <tr>
        <td colSpan={5} className="p-0!">
          <p className="bg-[#FEFBED] text-center text-[#643315] text-md font-normal py-5 rounded-md">
            Data not found!
          </p>
        </td>
      </tr>
    );
  }
  if (!isLoading && !isFetching && report?.length > 0) {
    content = report?.map(
      (item: {
        id: string;
        comment: string;
        reason: string;
        create_at: string;
      }) => {
        const { id, comment, reason, create_at } = item || {};
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
            <td className="text-sm text-gray-500">{id}</td>
            <td>{comment}</td>
            <td>{reason}</td>
            <td>{formattedDate(create_at)}</td>

            <td>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowTab(true);
                    setSelectedId(id);
                  }}
                  className="border border-[#E7EBF2] text-[#8C98AE] active:bg-[#E7EBF2] w-10 h-10 flex justify-center items-center rounded-lg cursor-pointer"
                >
                  <i className="fa-regular fa-eye"></i>
                </button>
                <button
                  onClick={() => {
                    setOpen(true);
                    setSelectedId(id);
                  }}
                  className="border border-[#E7EBF2] text-[#8C98AE] active:bg-[#E7EBF2] w-10 h-10 flex justify-center items-center rounded-lg cursor-pointer"
                >
                  <i className="fa-regular fa-trash-can"></i>
                </button>
              </div>
            </td>
          </tr>
        );
      },
    );
  }

  return (
    <React.Fragment>
      <div className="p-3 md:p-5 min-h-screen">
        <div className="flex md:flex-row flex-col justify-between items-start md:items-center">
          <div className="md:w-6/12 w-full">
            <h2 className="text-normal text-2xl md:text-3xl">Report</h2>
            <ul className="flex flex-wrap gap-2 items-center py-2">
              <li>
                <Link to="/" className="text-normal text-sm md:text-base">
                  Dashboard
                </Link>
              </li>
              <li>
                <i className="fa-solid fa-angles-right text-xs"></i>
              </li>
              <li>
                <p className="text-normal text-sm md:text-base">Report List</p>
              </li>
            </ul>
          </div>
        </div>
        <div className="w-full mx-auto bg-white rounded-2xl shadow-sm mt-3">
          <div className="w-full h-5" />
          <div className="xl:overflow-x-auto overflow-x-scroll custom-scroll bg-white">
            <table className="my-table table-fixed w-full min-w-350">
              <thead className="text-xs uppercase text-gray-500 bg-gray-50">
                <tr className="border-y border-gray-200">
                  <th>Report ID</th>
                  <th>Report Comment</th>
                  <th>Report Reason</th>
                  <th>Report Submited</th>
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
      {showTab && (
        <SingleReport setShow={setShowTab} id={selectId} isShow={showTab} />
      )}
      {selectId && (
        <WarningPopup
          open={open}
          title="Do you want to delete this report?"
          description={`Deleting this report will permanently remove all associated data from the database. This action cannot be undone. Click "Delete" to continue or "Close" to cancel.`}
          smButton="Delete"
          clButton="Close"
          onClose={() => setOpen(false)}
          onConfirm={() => handleDelete(selectId)}
          loading={delLoading}
        />
      )}
    </React.Fragment>
  );
}

export default ReportList;
