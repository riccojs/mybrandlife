import React, { useState } from "react";
import { Link, useSearchParams } from "react-router";
import { RiDeleteBin5Line } from "react-icons/ri";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import toast from "react-hot-toast";
import WarningPopup from "../component/Warning.popup";
import Pagination from "../component/Pagination";
import SelectComponent from "../component/ui/Select.component";
import SearchComponent from "../component/ui/Search.component";
import {
  useDeleteEchoMutation,
  useGetAllEchoQuery,
} from "../redux/features/echo/echoApi";
import { useAuth } from "../hook/useAuth";
import EchoLoader from "../component/loader/Echo.loader";
import UpdateEcho from "../component/echo/Update.echo";
import ViewEcho from "../component/echo/View.echo";
import EchoAgreement from "../component/echo/Echo.agreement";

interface UserType {
  package?: string;
  id: string;
  userTemplete: { enableEcho: boolean }[];
  membership: { status: string }[];
}

function EchoList() {
  const { user } = useAuth() as { user: UserType | null };
  const templete = user?.userTemplete?.[0];
  const { enableEcho } = templete || {};
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const view = searchParams.get("view") || "";
  const [isShow, setIsShow] = useState(false);
  const [viewEcho, setViewEcho] = useState(false);
  const [updateEcho, setUpdateEcho] = useState(false);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("");
  const limit = 14;
  const [deleteEcho, { isLoading: delLoad }] = useDeleteEchoMutation();

  const { data, isLoading, isFetching } = useGetAllEchoQuery({
    page: page,
    limit: limit,
    searchBy: search,
    statusBy: status,
    userId: "",
  });

  const echos = data?.data?.echo;
  const totalItems = data?.data?.totalEcho;
  const echoId = view ? view : selected;

  const handlePageChange = (value: number) => {
    searchParams.set("page", value.toString());
    setSearchParams(searchParams);
  };

  const handleDelete = (id: string) => {
    setSelected(id);
    deleteEcho(id)
      .unwrap()
      .then((res) => {
        toast.success(res.message);
        setOpen(false);
        setSelected("");
      })
      .catch((error) => {
        const err = error as FetchBaseQueryError;
        const errorMessage = (err.data as { message: string }).message;
        toast.error(errorMessage);
      });
  };

  // decide what to render
  let content;
  if (isLoading || isFetching) {
    content = [...Array(8)].map((_, i) => <EchoLoader key={i} />);
  }
  if (!isLoading && !isFetching && echos?.length === 0) {
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
  if (!isLoading && !isFetching && echos?.length > 0) {
    content = echos?.map(
      (item: {
        id: string;
        name: string;
        email: string;
        message: string;
        tip: string;
        status: string;
        shoutOut: string;
        city: string;
      }) => {
        const { id, name, email, tip, status, shoutOut } = item || {};

        return (
          <tr key={id}>
            <td>{name}</td>
            <td>{email}</td>
            <td>{shoutOut}</td>
            <td>${tip}</td>
            <td>
              <p
                className={`w-fit px-3 py-1 rounded-md text-center font-medium text-sm capitalize ${
                  status === "PENDING" ||
                  status === "REJECTED" ||
                  status === "CANCELED"
                    ? "bg-red-100 text-red-500"
                    : "bg-green-100 text-green-500"
                }`}
              >
                {status}
              </p>
            </td>
            <td>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setSelected(id);
                    setViewEcho(true);
                  }}
                  className="border border-gray-300 min-w-8 w-8 h-8 flex justify-center items-center rounded-md cursor-pointer"
                >
                  <i className="fa-regular fa-eye"></i>
                </button>
                <button
                  onClick={() => {
                    setSelected(id);
                    setUpdateEcho(true);
                  }}
                  className="border border-gray-300 min-w-8 w-8 h-8 flex justify-center items-center rounded-md cursor-pointer"
                >
                  <i className="fa-regular fa-pen-to-square"></i>
                </button>
                <button
                  onClick={() => {
                    setSelected(id);
                    setOpen(true);
                  }}
                  className="border border-gray-300 min-w-8 w-8 h-8 flex justify-center items-center rounded-md cursor-pointer"
                >
                  <RiDeleteBin5Line size={20} />
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
            <h2 className="text-normal text-2xl md:text-3xl">ECHO</h2>
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
                <p className="text-normal text-sm md:text-base">ECHO List</p>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col gap-5 mt-5">
          <div className="w-full 2xl:flex-row flex-col gap-5 flex justify-between items-center">
            <div className="flex w-full md:flex-row flex-col justify-between items-start gap-3">
              <div className="w-full md:w-96">
                <SearchComponent
                  name="search"
                  color="white"
                  placeholder="Seach by name"
                  required={false}
                  autoComplete="text"
                  value={search}
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
                  color="white"
                  handleChange={(item: string) => {
                    if (item) {
                      searchParams.set("status", item);
                      searchParams.set("page", "1");
                    } else {
                      searchParams.delete("status");
                      searchParams.delete("page");
                    }
                    setSearchParams(searchParams);
                  }}
                  datas={[
                    { key: "Pending", value: "PENDING" },
                    { key: "Confirmed", value: "CONFIRMED" },
                    { key: "Rejected", value: "REJECTED" },
                    { key: "Canceled", value: "CANCELED" },
                    { key: "Expired", value: "EXPIRED" },
                  ]}
                  label="Select Status"
                />
              </div>
            </div>
          </div>
          <div className="overflow-x-auto bg-white">
            <table className="my-table table-auto w-full min-w-300">
              <thead>
                <tr className="border-y border-gray-300">
                  <th>Name</th>
                  <th>Email</th>
                  <th>Shoutout</th>
                  <th>Tip</th>
                  <th>Status</th>
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
        {isShow && enableEcho && (
          <EchoAgreement
            setShow={setIsShow}
            isShow={isShow}
            body="Are you sure you want to disable the echo feature? You will stop receiving all upcoming echo."
            status={false}
          />
        )}
        {isShow && !enableEcho && (
          <EchoAgreement
            setShow={setIsShow}
            isShow={isShow}
            body="Are you sure you want to enable the echo feature? You'll start receiving new echo requests from customers."
            status={true}
          />
        )}
        {(viewEcho && selected) || view ? (
          <ViewEcho isShow={viewEcho} setShow={setViewEcho} id={echoId} />
        ) : null}
        {updateEcho && selected ? (
          <UpdateEcho
            isShow={updateEcho}
            setShow={setUpdateEcho}
            id={selected}
          />
        ) : null}
        {selected && (
          <WarningPopup
            open={open}
            title="Do you want delete this ECHO Request?"
            description={`Deleting this ECHO Request will permanently remove all associated data from the database. This action cannot be undone. Click "Delete" to continue or "Close" to cancel.`}
            smButton="Delete"
            clButton="Close"
            onClose={() => setOpen(false)}
            onConfirm={() => handleDelete(selected)}
            loading={delLoad}
          />
        )}
      </div>
    </React.Fragment>
  );
}

export default EchoList;
