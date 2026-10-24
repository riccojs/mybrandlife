import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { RiDeleteBin5Line } from "react-icons/ri";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import toast from "react-hot-toast";
import EchoAgreement from "../component/echo/Echo.agreement";
import ConnectStripe from "../component/echo/Connect.stripe";
import ViewEcho from "../component/echo/View.echo";
import Pagination from "../component/Pagination";
import { useAuth } from "../hook/useAuth";
import SearchComponent from "../component/ui/Search.component";
import SelectComponent from "../component/ui/Select.component";
import {
  useDeleteEchoMutation,
  useGetAllEchoQuery,
} from "../redux/features/echo/echoApi";
import EchoLoader from "../component/loader/Echo.loader";
import UpdateEchoStatus from "../component/echo/Update.echo.status";
import WarningPopup from "../component/popups/Warning.popup";
import { Contact } from "lucide-react";
import IchoIcon from "../assets/menu-icons/echo.svg";

interface UserType {
  package?: string;
  id: string;
  userTemplete: { enableEcho: boolean }[];
  membership: { status: string }[];
  domain: string;
}

function Echos() {
  const { user } = useAuth() as { user: UserType | null };
  const templete = user?.userTemplete?.[0];
  const { enableEcho } = templete || {};
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const status = searchParams.get("status") || "";
  const search = searchParams.get("search") || "";
  const [isShow, setIsShow] = useState(false);
  const [viewEcho, setViewEcho] = useState(false);
  const [updateEcho, setUpdateEcho] = useState(false);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("");
  const [echoStatus, setEchoStatus] = useState("");

  const limit = 14;
  const [deleteEcho, { isLoading: delLoad }] = useDeleteEchoMutation();
  const { data, isLoading, isFetching } = useGetAllEchoQuery({
    page: page,
    limit: limit,
    searchBy: search,
    statusBy: status,
    userId: user?.id,
  });
  const echos = data?.data?.echo;
  const totalItems = data?.data?.totalEcho;
  const existTemplate = user && user?.userTemplete?.length > 0 ? true : false;
  const currentPage = data?.data?.currentPage || [];
  const start = (currentPage - 1) * limit + 1;
  const end = Math.min(currentPage * limit, totalItems);

  const handlePageChange = (newPage: number) => {
    searchParams.set("page", newPage.toString());
    setSearchParams(searchParams);
  };

  const handleChange = (value: string) => {
    if (value) {
      searchParams.set("status", value);
      searchParams.set("page", "1");
    } else {
      searchParams.delete("status");
      searchParams.delete("page");
    }
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

  useEffect(() => {
    if (user?.package !== "gold") {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  // decide what to render
  let content;
  if (isLoading || isFetching) {
    content = [...Array(8)].map((_, i) => <EchoLoader key={i} />);
  }
  if (!isLoading && !isFetching && echos?.length === 0) {
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
          <tr key={id} className="hover:bg-gray-50">
            <td>
              <div className="flex gap-2 items-center">
                <Contact color="#12544F" size={20} />
                <p className="text-md">{name}</p>
              </div>
            </td>
            <td>{email?.slice(0, 20)}...</td>
            <td>{shoutOut ? shoutOut : "-"}</td>
            <td>${tip}</td>
            <td>
              <p
                className={`w-fit px-6 py-1 rounded-md text-center font-medium text-xs capitalize ${
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
                  className="border border-[#E7EBF2] text-[#8C98AE] active:bg-[#E7EBF2] w-10 h-10 flex justify-center items-center rounded-lg cursor-pointer"
                >
                  <i className="fa-regular fa-eye"></i>
                </button>
                <button
                  onClick={() => {
                    setSelected(id);
                    setUpdateEcho(true);
                    setEchoStatus(status);
                  }}
                  className="border border-[#E7EBF2] text-[#8C98AE] active:bg-[#E7EBF2] w-10 h-10 flex justify-center items-center rounded-lg cursor-pointer"
                >
                  <i className="fa-regular fa-pen-to-square"></i>
                </button>
                <button
                  onClick={() => {
                    setOpen(true);
                    setSelected(id);
                  }}
                  className="border border-[#E7EBF2] text-[#8C98AE] active:bg-[#E7EBF2] w-10 h-10 flex justify-center items-center rounded-lg cursor-pointer"
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
        <div className="md:w-6/12 w-full">
          <h2 className="text-normal text-2xl md:text-3xl">ECHO</h2>
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
              <p className="text-normal text-sm md:text-base">{user?.domain}</p>
            </li>
            <li>
              <i className="fa-solid fa-angles-right text-xs"></i>
            </li>
            <li>
              <p className="text-normal text-sm md:text-base">ECHO List</p>
            </li>
          </ul>
        </div>
        {!existTemplate && (
          <div>
            <p className="bg-[#FFFCF0] w-full text-[#7C3E16] border-2 border-[#FCF2C6] p-5 text-sm font-normal rounded-2xl">
              Build your brand to unlock ECHO and start engaging your audience.
            </p>
          </div>
        )}
        <div className="w-full mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm mt-3">
          <div className="w-full 2xl:flex-row flex-col gap-5 flex justify-between items-center p-6">
            <div className="flex md:w-auto w-full sm:flex-row flex-col justify-between items-start gap-3 md:items-center">
              <div className="w-full md:w-96">
                <SearchComponent
                  name="search"
                  color="white"
                  value={search}
                  placeholder="Seach by name"
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
                  color="white"
                  handleChange={handleChange}
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
            {existTemplate && (
              <div className="flex w-full sm:w-auto gap-3 items-center justify-center md:justify-end">
                {enableEcho ? (
                  <button
                    onClick={() => setIsShow(true)}
                    className="bg-gray-300 min-w-12 w-12 h-12 p-3 cursor-pointer rounded-lg flex gap-2 items-center justify-center"
                  >
                    <img
                      src={IchoIcon}
                      alt={IchoIcon}
                      className="w-full h-full"
                    />
                  </button>
                ) : (
                  <button
                    onClick={() => setIsShow(true)}
                    className="bg-[#cbf38b] min-w-12 w-12 h-12 p-2 cursor-pointer rounded-lg flex gap-2 items-center justify-center"
                  >
                    <img
                      src={IchoIcon}
                      alt={IchoIcon}
                      className="w-full h-full"
                    />
                  </button>
                )}
                {user && <ConnectStripe id={user?.id} />}
              </div>
            )}
          </div>
          <div className="overflow-x-auto bg-white">
            <table className="my-table table-fixed w-full min-w-350">
              <thead className="text-xs uppercase text-gray-500 bg-gray-50">
                <tr className="border-y border-gray-200">
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
          <div className="flex flex-wrap md:gap-0 gap-3 items-center justify-between px-6 py-5 border-t border-gray-200">
            <p className="text-sm text-gray-400">
              Showing <span className="font-medium text-gray-500">{start}</span>{" "}
              to <span className="font-medium text-gray-500">{end}</span> of{" "}
              <span className="font-medium text-gray-700">{totalItems}</span>{" "}
              results
            </p>

            <Pagination
              handlePageChange={handlePageChange}
              page={page}
              totalItems={totalItems}
              itemsPerPage={limit}
            />
          </div>
        </div>

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
        {viewEcho && selected ? (
          <ViewEcho isShow={viewEcho} setShow={setViewEcho} id={selected} />
        ) : null}
        {updateEcho && selected ? (
          <UpdateEchoStatus
            isShow={updateEcho}
            setShow={setUpdateEcho}
            id={selected}
            status={echoStatus}
          />
        ) : null}
        {selected && (
          <WarningPopup
            open={open}
            title="Do you want to delete this ECHO request?"
            description={`Deleting this ECHO request will permanently remove all associated data from the database. This action cannot be undone. Click "Delete" to continue or "Close" to cancel.`}
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

export default Echos;
