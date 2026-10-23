interface Type {
  page: number;
  totalItems: number;
  itemsPerPage: number;
  handlePageChange: (newPage: number) => void;
}

import { ChevronLeft, ChevronRight } from "lucide-react";

function Pagination({
  handlePageChange,
  page,
  totalItems,
  itemsPerPage,
}: Type) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const MAX_VISIBLE = 7;
  const half = Math.floor(MAX_VISIBLE / 2);
  let start = Math.max(1, page - half);
  const end = Math.min(totalPages, start + MAX_VISIBLE - 1);
  if (end - start + 1 < MAX_VISIBLE) {
    start = Math.max(1, end - MAX_VISIBLE + 1);
  }
  const pages = [];
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (totalItems === 0) return;

  return (
    <div className="flex gap-1 md:gap-2 flex-wrap">
      <button
        className="border border-[#E7EBF2] text-[#8C98AE] active:bg-[#E7EBF2] w-8 md:w-10 h-8 md:h-10 flex justify-center items-center  rounded-md md:rounded-lg cursor-pointer"
        onClick={() => handlePageChange(page - 1)}
        disabled={page === 1}
      >
        <ChevronLeft />
      </button>
      {start > 1 && <span className="px-2">…</span>}
      {pages.map((index) => (
        <button
          key={index}
          className={`text-sm md:text-base border border-gray-100 w-8 md:w-10 h-8 md:h-10 rounded-md  cursor-pointer ${
            page === index ? "bg-[#96c94b] font-bold" : "bg-white text-black"
          }`}
          onClick={() => handlePageChange(index)}
        >
          {index}
        </button>
      ))}

      <button
        className="border border-[#E7EBF2] text-[#8C98AE] active:bg-[#E7EBF2] w-8 md:w-10 h-8 md:h-10 flex justify-center items-center  rounded-md md:rounded-lg cursor-pointer"
        onClick={() => handlePageChange(page + 1)}
        disabled={page === totalPages}
      >
        <ChevronRight />
      </button>
    </div>
  );
}

export default Pagination;
