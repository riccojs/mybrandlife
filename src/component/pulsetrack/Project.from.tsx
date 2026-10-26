import { LoaderCircle } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import {
  useFindPulsetrackMutation,
  useUpdatePulsetrackMutation,
} from "../../redux/features/pulsetrack/pulsetrackApi";
import toast from "react-hot-toast";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { PulsetrackType } from "../../utils/pulsetrack.types";

interface TypeForm {
  data: {
    pulsetrack: PulsetrackType;
  };
  onClose: () => void;
  id: string;
}

function ProjectFrom({ data, onClose, id }: TypeForm) {
  const [project, setProject] = useState({
    landerId: data?.pulsetrack?.landerId || "",
    name: data?.pulsetrack?.name || "",
    idPrefix: data?.pulsetrack?.idPrefix || "",
  });
  const [response, setResponse] = useState("");
  const [checking, setChecking] = useState(false);
  const { name, idPrefix } = project || {};
  const [updatePulsetrack, { isLoading: upLoad }] =
    useUpdatePulsetrackMutation();
  const [findPulsetrack] = useFindPulsetrackMutation();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [writing, setWriting] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "idPrefix") {
      setWriting(true);
    }
    setProject({
      ...project,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (response === "Pulsetrack id invalid!") {
      toast.error("Fix the error!");
      return;
    }
    updatePulsetrack({ id, project })
      .unwrap()
      .then((res) => {
        toast.success(res.message);
        setProject((prev) => ({
          ...prev,
          name: "",
          idPrefix: "",
        }));
        setWriting(false);
      })
      .catch((error) => {
        const err = error as FetchBaseQueryError;
        const errorMessage = (err.data as { message: string }).message;
        toast.error(errorMessage);
      });
  };

  useEffect(() => {
    if (!writing) return;
    if (idPrefix.length === 0) return;
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(async () => {
      try {
        setChecking(true);
        const res = await findPulsetrack({ idPrefix }).unwrap();
        setResponse(res.message);
      } catch (error) {
        const err = error as FetchBaseQueryError;
        const errorMessage = (err.data as { message: string })?.message;
        setResponse(errorMessage);
      } finally {
        setChecking(false);
      }
    }, 300);
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [findPulsetrack, idPrefix, writing]);

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-5">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Project Name <span className="text-red-500 text-xl">*</span>
        </label>
        <input
          type="text"
          name="name"
          value={name}
          onChange={handleChange}
          required
          placeholder="e.g. Summer Marathon 2024"
          className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-[#8CC63F] focus:outline-none focus:ring-2 focus:ring-[#8CC63F]/30"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Project Id Prefix <span className="text-xs">(Optional)</span>
        </label>
        <input
          type="number"
          name="idPrefix"
          value={idPrefix}
          min={1000}
          max={999999999999}
          onFocus={() => setWriting(false)}
          required={idPrefix?.length > 0}
          onChange={handleChange}
          placeholder="e.g. 1001"
          className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-[#8CC63F] focus:outline-none focus:ring-2 focus:ring-[#8CC63F]/30"
        />

        <p className="text-sm font-normal mt-1">
          {checking && <span className="ml-2 text-gray-400">Checking…</span>}

          {!checking && response && (
            <span
              className={`mt-2 text-sm ${
                response === "Pulsetrack id is valid"
                  ? "text-green-600"
                  : "text-red-500"
              }`}
            >
              {response === "Pulsetrack id is valid" ? (
                <i className="fa-regular fa-circle-check"></i>
              ) : (
                <i className="fa-regular fa-circle-xmark"></i>
              )}{" "}
              {response}
            </span>
          )}
        </p>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <button
          onClick={onClose}
          disabled={upLoad}
          className="bg-slate-200 text-[#000000] flex justify-center items-center gap-1 w-fit border border-gray-200 px-10 h-12 rounded-lg cursor-pointer"
        >
          Close
        </button>
        <button
          disabled={upLoad}
          type="submit"
          className={`${upLoad ? "bg-[#77a630] cursor-not-allowed" : "bg-[#96c94b] cursor-pointer"}  text-[#000000] flex justify-center items-center gap-1 min-w-32 w-32 h-12 rounded-lg`}
        >
          {upLoad ? <LoaderCircle className="animate-spin" /> : "Save"}
        </button>
      </div>
    </form>
  );
}

export default ProjectFrom;
