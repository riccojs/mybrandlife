import React, { useState } from "react";
import { useUpdateEchoMutation } from "../../redux/features/echo/echoApi";
import type { EchoType } from "../../utils/echo.types";
import toast from "react-hot-toast";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import SelectComponent from "../ui/Select.component";
import { LoaderCircle } from "lucide-react";

interface TypeForm {
  data: {
    echo: EchoType;
  };
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  id: string;
}

function EchoForm({ data, setShow, id }: TypeForm) {
  const [echo, setEcho] = useState({
    name: data?.echo?.name || "",
    email: data?.echo?.email || "",
    message: data?.echo?.message || "",
    tip: data?.echo?.tip || "",
    city: data?.echo?.city || "",
    shoutOut: data?.echo?.shoutOut || "",
    status: data?.echo?.status || "",
  });

  const [updateEcho, { isLoading }] = useUpdateEchoMutation();

  const { name, email, message, tip, city, shoutOut, status } = echo || {};

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setEcho({
      ...echo,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateEcho({ id, echo })
      .unwrap()
      .then((res) => {
        toast.success(res.message);
        setShow(false);
      })
      .catch((error) => {
        const err = error as FetchBaseQueryError;
        const errorMessage = (err.data as { message: string }).message;
        toast.error(errorMessage);
      });
  };
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-2 md:mt-3">
      <input
        type="text"
        value={name}
        onChange={handleChange}
        name="name"
        required
        className="bg-[#F3F3F3] border border-gray-300 focus:outline focus:outline-[#96c94b] focus:border p-3 w-full rounded-lg text-normal"
        placeholder="Enter name"
      />
      <input
        type="email"
        name="email"
        onChange={handleChange}
        value={email}
        required
        className="bg-[#F3F3F3] border border-gray-300 focus:outline focus:outline-[#96c94b] focus:border p-3 w-full rounded-lg text-normal"
        placeholder="Enter email"
      />
      <input
        type="number"
        name="tip"
        onChange={handleChange}
        value={tip}
        required
        className="bg-[#F3F3F3] border border-gray-300 focus:outline focus:outline-[#96c94b] focus:border p-3 w-full rounded-lg text-normal"
        placeholder="Enter tip"
      />
      <SelectComponent
        value={status}
        label="Select status"
        handleChange={(item) => setEcho((prev) => ({ ...prev, status: item }))}
        datas={[
          { key: "PENDING", value: "PENDING" },
          { key: "CONFIRMED", value: "CONFIRMED" },
          { key: "CANCELED", value: "CANCELED" },
          { key: "REJECTED", value: "REJECTED" },
        ]}
        color="#F3F3F3"
      />

      <input
        type="text"
        name="city"
        onChange={handleChange}
        value={city}
        required
        className="bg-[#F3F3F3] border border-gray-300 focus:outline focus:outline-[#96c94b] focus:border p-3 w-full rounded-lg text-normal"
        placeholder="Enter city"
      />
      <textarea
        name="message"
        value={message}
        onChange={handleChange}
        required
        className="bg-[#F3F3F3] border border-gray-300 focus:outline focus:outline-[#96c94b] focus:border p-2 w-full rounded-md text-normal"
        placeholder="Enter message"
      ></textarea>
      <textarea
        name="shoutOut"
        value={shoutOut}
        onChange={handleChange}
        className="bg-[#F3F3F3] border border-gray-300 focus:outline focus:outline-[#96c94b] focus:border p-2 w-full rounded-md text-normal"
        placeholder="Enter shoutOut"
      ></textarea>
      <div className="flex gap-3 items-center">
        <button
          onClick={() => setShow(false)}
          disabled={isLoading}
          className="bg-slate-200 text-[#000000] flex justify-center items-center gap-1 w-fit border border-gray-200 px-10 h-12 rounded-lg cursor-pointer"
        >
          Close
        </button>
        <button
          disabled={isLoading}
          type="submit"
          className={`${isLoading ? "bg-[#77a630] cursor-not-allowed" : "bg-[#96c94b] cursor-pointer"}  text-[#000000] flex justify-center items-center gap-1 min-w-32 w-32 h-12 rounded-lg`}
        >
          {isLoading ? <LoaderCircle className="animate-spin" /> : "Save"}
        </button>
      </div>
    </form>
  );
}

export default EchoForm;
