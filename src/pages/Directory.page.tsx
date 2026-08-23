import React, { useEffect, useRef, useState } from "react";
import { useGetAllUserByAdminQuery } from "../redux/features/auth/authApi";
import type { UserDataType } from "../utils/user.types";

export default function DirectoryPage() {
  const [query, setQuery] = useState("");
  const [showTable, setShowTable] = useState(false);
  const [showBox, setShowBox] = useState(true);
  const boxRef = useRef<HTMLDivElement | null>(null);
  const { data } = useGetAllUserByAdminQuery();
  const user = (data?.users as UserDataType[]) || [];

  const filtered = (() => {
    const q = query.trim().toLowerCase();
    if (!q || !Array.isArray(user)) return [];

    return user.filter((entry) => {
      if (!entry.enableDirectory) return false;
      return (
        entry?.firstName?.toLowerCase()?.includes(q) ||
        entry?.landerName?.toLowerCase()?.includes(q) ||
        entry?.nickName?.toLowerCase()?.includes(q) ||
        entry?.domain?.toLowerCase()?.includes(q)
      );
    });
  })();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setShowTable(true);
    }
  };

  const handleChange = (value: string) => {
    setQuery(value);
    setShowTable(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(event.target as Node)) {
        setShowBox(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <section className="flex-1 bg-[#ffffff] w-full h-auto min-h-screen text-black">
      <div className="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-14">
        <h1 className="text-2xl font-medium tracking-tight md:text-3xl">
          Brand Directory
        </h1>
        <p className="mt-2 text-sm text-neutral-400">
          Start typing a name or lander name to search. Results appear in the
          dropdown. Press <span className="font-semibold">Enter</span> to see
          all matches in the table below.
        </p>
        <div className="mt-6">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => {
                handleChange(e.target.value);
                setShowBox(true);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Search by first name or lander name…"
              className="w-full rounded-2xl border border-neutral-300 bg-gray-100 px-4 py-3 text-sm outline-none ring-0 placeholder:text-neutral-500 focus:border-yellow-200 focus:ring-2 focus:ring-yellow-400/40"
            />
            <span className="pointer-events-none text-3xl absolute inset-y-0 right-3 flex items-center text-neutral-500">
              ⌕
            </span>
            {showBox && filtered?.length > 0 ? (
              <div
                ref={boxRef}
                className="absolute z-10 mt-1 custom-scroll max-h-96 w-full overflow-auto rounded-2xl border border-gray-300 bg-white text-sm shadow-lg"
              >
                {user.length === 0 ? (
                  <div className="px-4 py-3 text-neutral-500">
                    No matches found.
                  </div>
                ) : (
                  filtered.slice(0, 12).map((entry) => (
                    <a
                      href={`https://${entry.domain}/${entry.landerName}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div
                        key={entry.id}
                        className="flex cursor-pointer items-center justify-between px-4 py-2 hover:bg-gray-100"
                      >
                        <div>
                          <p className="font-medium text-black capitalize">
                            {entry.firstName}
                          </p>
                          <p className="text-xs text-neutral-500">
                            {entry.landerName}
                          </p>
                        </div>

                        <button className="text-xs font-semibold text-[#cf3832]">
                          Connect ↗
                        </button>
                      </div>
                    </a>
                  ))
                )}
              </div>
            ) : null}
          </div>
          {query.trim() !== "" && (
            <p className="text-xs text-neutral-500 mt-5">
              {filtered.length} match
              {filtered.length === 1 ? "" : "es"} found. Press Enter to view in
              table.
            </p>
          )}
        </div>

        {/* Results table (shown after Enter) */}
        {showTable && query.trim() !== "" && (
          <div className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-gray-100">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-gray-300">
                <tr>
                  <th className="px-4 py-2 font-semibold">First Name</th>
                  <th className="px-4 py-2 font-semibold">Lander Name</th>
                  <th className="px-4 py-2 font-semibold">Connect</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((entry) => (
                  <tr key={entry.id} className="border-t border-gray-300">
                    <td className="px-4 py-2 align-middle text-black capitalize">
                      {entry.firstName}
                    </td>
                    <td className="px-4 py-2 align-middle text-black">
                      {entry.landerName}
                    </td>
                    <td className="px-4 py-2 align-middle">
                      <a
                        href={`https://${entry.domain}/${entry.landerName}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center rounded-full border border-[#cf3832] px-3 py-1 text-xs font-semibold text-[#cf3832] hover:bg-red-400/10"
                      >
                        Connect ↗
                      </a>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-4 py-4 text-center text-neutral-500"
                    >
                      No matching records.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
