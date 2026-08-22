import { useState } from "react";
import { useSendPartnerEmailMutation } from "../redux/features/partner/partnerApi";
import toast from "react-hot-toast";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

function SendPartneremail({
  onClose,
  recipentMail,
  title,
}: {
  onClose: () => void;
  recipentMail: string[];
  title: string;
}) {
  const [partner, setPartner] = useState({
    firstname: "",
    lastname: "",
    phone: "",
    email: "",
    detail: "",
    recipent: recipentMail,
    title: title,
  });

  const [sendPartnerEmail, { isLoading }] = useSendPartnerEmailMutation();

  const { firstname, lastname, phone, email, detail } = partner || {};

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setPartner({
      ...partner,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendPartnerEmail(partner)
      .unwrap()
      .then((res) => {
        toast.success(res.message);
        onClose();
      })
      .catch((error) => {
        const err = error as FetchBaseQueryError;
        const errorMessage = (err.data as { message: string }).message;
        toast.error(errorMessage);
      });
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3 text-sm">
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-sm text-neutral-500 mb-1">
            First Name
          </label>
          <input
            name="firstname"
            value={firstname}
            onChange={handleChange}
            required
            type="text"
            placeholder="Enter first name"
            className="w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-2 text-sm text-black outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/50"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm text-neutral-500 mb-1">
            Last Name
          </label>
          <input
            type="text"
            name="lastname"
            value={lastname}
            required
            onChange={handleChange}
            placeholder="Enter last name"
            className="w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-2 text-sm text-black outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/50"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-neutral-500 mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={email}
          required
          onChange={handleChange}
          placeholder="Enter email"
          className="w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-2 text-sm text-black outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/50"
        />
      </div>

      <div>
        <label className="block text-sm text-neutral-500 mb-1">Phone</label>
        <input
          type="tel"
          name="phone"
          value={phone}
          required
          onChange={handleChange}
          placeholder="Enter phone no"
          className="w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-2 text-sm text-black outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/50"
        />
      </div>

      <div>
        <label className="block text-sm text-neutral-500 mb-1">Details</label>
        <textarea
          rows={3}
          name="detail"
          value={detail}
          required
          onChange={handleChange}
          placeholder="Enter detail"
          className="w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-2 text-sm text-black outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/50"
        />
      </div>

      <div className="mt-3 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-200 border border-gray-300 px-3 py-1 rounded-full cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-full flex gap-2 items-center cursor-pointer bg-yellow-400 px-3 py-1 text-sm font-semibold text-black hover:bg-yellow-300"
        >
          {isLoading ? (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6 animate-spin"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              </svg>
              <p>Loading...</p>
            </>
          ) : (
            <>
              <i className="fa-regular fa-paper-plane"></i>
              <p>Submit</p>
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export default SendPartneremail;
