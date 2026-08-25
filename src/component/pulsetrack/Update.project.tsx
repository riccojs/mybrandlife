import { useEffect, useRef, useState } from "react";
import { MdOutlineClose } from "react-icons/md";
import toast from "react-hot-toast";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import {
  useFindPulsetrackMutation,
  useGetOnePulsetrackQuery,
  useUpdatePulsetrackMutation,
} from "../../redux/features/pulsetrack/pulsetrackApi";
import useBodyScroll from "../../hook/userBodyscroll";
import { ImSpinner6 } from "react-icons/im";

interface Type {
  isOpen: boolean;
  onClose: () => void;
  id: string;
}

function UpdateProject({ isOpen, onClose, id }: Type) {
  useBodyScroll(isOpen);
  const [response, setResponse] = useState("");
  const [checking, setChecking] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { data, isFetching, isLoading } = useGetOnePulsetrackQuery(id);
  const [writing, setWriting] = useState(false);
  const [project, setProject] = useState({
    landerId: data?.pulsetrack?.landerId || "",
    name: data?.pulsetrack?.name || "",
    idPrefix: data?.pulsetrack?.idPrefix || "",
  });
  const [updatePulsetrack, { isLoading: upLoad }] =
    useUpdatePulsetrackMutation();
  const [findPulsetrack] = useFindPulsetrackMutation();
  const { name, idPrefix } = project || {};

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

  //   decide what to render
  let content;
  if (isFetching || isLoading) {
    content = (
      <div className="flex items-center justify-center min-h-68">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-[#96c94b] border-solid"></div>
      </div>
    );
  }
  if (!isFetching && !isLoading && data?.pulsetrack) {
    content = (
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

        <div className="mt-8 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            type="button"
            className="rounded-lg cursor-pointer px-4 py-2 text-sm font-medium text-slate-600 transition bg-slate-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg cursor-pointer bg-[#8CC63F] px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#7AB535] focus:outline-none focus:ring-2 focus:ring-[#8CC63F]/40"
          >
            {upLoad ? (
              <ImSpinner6 className="animate-spin" />
            ) : (
              "Update Project"
            )}
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div
        className={`w-full max-w-xl bg-white rounded-2xl shadow-xl overflow-hidden ${
          isOpen ? "zoom-animation" : ""
        }`}
      >
        <div className="relative w-full max-w-full rounded-xl bg-white p-6 shadow-2xl sm:p-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">
              Update your project
            </h2>
            <button
              onClick={onClose}
              className="rounded-md p-1 text-slate-400 transition hover:text-slate-600"
              aria-label="Close modal"
            >
              <MdOutlineClose size={25} />
            </button>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Fill in the details below to update your project.
          </p>
          {content}
        </div>
      </div>
    </div>
  );
}

export default UpdateProject;
