import React, { useState } from "react";
import { Link, useSearchParams } from "react-router";
import { RiDeleteBin5Line } from "react-icons/ri";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import toast from "react-hot-toast";
import {
  useDeleteContactMutation,
  useGetAllContactQuery,
} from "../redux/features/contact/contactApi";
import WarningPopup from "../component/Warning.popup";
import Pagination from "../component/Pagination";
import SelectComponent from "../component/ui/Select.component";
import SearchComponent from "../component/ui/Search.component";
import ViewContact from "../component/contact/View.contact";
import ContactLoader from "../component/loader/Contact.loader";

function ContactList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const [viewContact, setViewContact] = useState(false);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("");

  const limit = 14;
  const [deleteContact, { isLoading: delLoad }] = useDeleteContactMutation();
  const { data, isLoading } = useGetAllContactQuery({
    page: page,
    limit: limit,
    searchBy: search,
    statusBy: status,
  });
  const contacts = data?.data?.contact;
  const totalItem = data?.data?.totalContact;
  const currentPage = data?.data?.currentPage || [];
  const start = (currentPage - 1) * limit + 1;
  const end = Math.min(currentPage * limit, totalItem);

  const handlePageChange = (value: number) => {
    searchParams.set("page", value.toString());
    setSearchParams(searchParams);
  };

  const handleDelete = (id: string) => {
    setSelected(id);
    deleteContact(id)
      .unwrap()
      .then((res) => {
        toast.success(res.message);
        setOpen(false);
      })
      .catch((error) => {
        const err = error as FetchBaseQueryError;
        const errorMessage = (err.data as { message: string }).message;
        toast.error(errorMessage);
        setOpen(false);
      });
  };

  // decide what to render
  let content;
  if (isLoading) {
    content = [...Array(8)].map((_, i) => <ContactLoader key={i} />);
  }
  if (!isLoading && contacts?.length === 0) {
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
  if (!isLoading && contacts?.length > 0) {
    content = contacts?.map(
      (item: {
        id: string;
        firstname: string;
        lastname: string;
        niche: string;
        email: string;
        seen: boolean;
        phone: string;
        subject: string;
      }) => {
        const { id, firstname, lastname, email, niche, seen, phone } =
          item || {};
        return (
          <tr key={id} className="hover:bg-gray-50">
            <td>{firstname}</td>
            <td>{lastname}</td>
            <td className="text-sm break-all">{email}</td>
            <td className="text-sm break-all">{niche}</td>
            <td>
              <p
                className={`${seen ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"} px-4 py-1 rounded-lg text-sm w-fit`}
              >
                {seen ? "SEEN" : "UNSEEN"}
              </p>
            </td>
            <td>{phone}</td>
            <td>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setSelected(id);
                    setViewContact(true);
                  }}
                  className="border border-[#E7EBF2] text-[#8C98AE] active:bg-[#E7EBF2] w-10 h-10 flex justify-center items-center rounded-lg cursor-pointer"
                >
                  <i className="fa-regular fa-eye"></i>
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
        <div className="flex md:flex-row flex-col justify-between items-start md:items-center">
          <div className="md:w-6/12 w-full">
            <h2 className="text-normal text-2xl md:text-3xl">Contact</h2>
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
                <p className="text-normal text-sm md:text-base">Contact List</p>
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
                placeholder="Seach by firstname"
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
                  { key: "Pending", value: "Pending" },
                  { key: "Seen", value: "seen" },
                ]}
                label="Select Status"
              />
            </div>
          </div>
          <div className="xl:overflow-x-auto overflow-x-scroll custom-scroll bg-white">
            <table className="my-table table-fixed w-full min-w-350">
              <thead className="text-xs uppercase text-gray-500 bg-gray-50">
                <tr className="border-y border-gray-200">
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>niche</th>
                  <th>message</th>
                  <th>phone</th>
                  <th>Action</th>
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

        {viewContact && selected ? (
          <ViewContact
            isShow={viewContact}
            setShow={setViewContact}
            id={selected}
          />
        ) : null}
        {selected && (
          <WarningPopup
            open={open}
            title="Do you want to delete this contact request?"
            description={`Deleting this contact request will permanently remove all associated data from the database. This action cannot be undone. Click "Delete" to continue or "Close" to cancel.`}
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

export default ContactList;
