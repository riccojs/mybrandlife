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

  const totalItems = data?.data?.totalReport;
  const report = data?.data?.report;

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
        <td colSpan={7}>
          <p className="bg-amber-100 text-md font-normal p-3 rounded-md">
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
          <tr key={id}>
            <td>{comment}</td>
            <td>{reason}</td>
            <td>{formattedDate(create_at)}</td>

            <td>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowTab(true);
                    setSelectedId(id);
                  }}
                  className="border border-gray-300 min-w-8 w-8 h-8 flex justify-center items-center rounded-md cursor-pointer"
                >
                  <i className="fa-regular fa-eye"></i>
                </button>
                <button
                  onClick={() => {
                    setOpen(true);
                    setSelectedId(id);
                  }}
                  className="border border-gray-300 w-8 h-8 flex justify-center items-center rounded-md cursor-pointer"
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
                <p className="text-normal text-sm md:text-base">Report List</p>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col gap-5 mt-5">
          <div className="overflow-x-auto bg-white">
            <table className="my-table table-fixed w-full min-w-300">
              <thead>
                <tr className="border-y border-gray-300">
                  <th>Report Comment</th>
                  <th>Report Reason</th>
                  <th>Report Submited</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>{content}</tbody>
            </table>
          </div>
        </div>
        {totalItems > limit && (
          <Pagination
            handlePageChange={handlePageChange}
            page={page}
            totalItems={totalItems}
            itemsPerPage={limit}
          />
        )}
      </div>
      {showTab && (
        <SingleReport setShow={setShowTab} id={selectId} isShow={showTab} />
      )}
      {selectId && (
        <WarningPopup
          open={open}
          title="Do you want delete this report?"
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
