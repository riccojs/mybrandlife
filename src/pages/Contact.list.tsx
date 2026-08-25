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
  const totalItems = data?.data?.totalContact;

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
        <td colSpan={8}>
          <p className="bg-amber-100 text-md font-normal p-3 rounded-md">
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
        message: string;
        phone: string;
        subject: string;
      }) => {
        const {
          id,
          firstname,
          lastname,
          email,
          niche,
          message,
          phone,
          subject,
        } = item || {};
        return (
          <tr key={id}>
            <td>{firstname}</td>
            <td>{lastname}</td>
            <td>{email}</td>
            <td>{niche}</td>
            <td>{message?.slice(0, 50)}</td>
            <td>{phone}</td>
            <td>{subject}</td>

            <td>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setSelected(id);
                    setViewContact(true);
                  }}
                  className="border border-gray-300 min-w-8 w-8 h-8 flex justify-center items-center rounded-md cursor-pointer"
                >
                  <i className="fa-regular fa-eye"></i>
                </button>

                <button
                  onClick={() => {
                    setOpen(true);
                    setSelected(id);
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
            <h2 className="text-normal text-2xl md:text-3xl">Contact</h2>
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
                <p className="text-normal text-sm md:text-base">Contact List</p>
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
          </div>
          <div className="overflow-x-auto bg-white">
            <table className="my-table table-auto w-full min-w-300">
              <thead>
                <tr className="border-y border-gray-300">
                  <th className="min-w-44">First Name</th>
                  <th className="min-w-44">Last Name</th>
                  <th>Email</th>
                  <th>niche</th>
                  <th>message</th>
                  <th>phone</th>
                  <th>subject</th>
                  <th>Action</th>
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
            title="Do you want delete this contact request?"
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
