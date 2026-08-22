interface Type {
  page: number;
  totalItems: number;
  itemsPerPage: number;
  handlePageChange: (newPage: number) => void;
}

function WristbandPagination({
  handlePageChange,
  page,
  totalItems,
  itemsPerPage,
}: Type) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="flex gap-2 flex-wrap mt-5">
      <button
        className="text-black text-base border border-gray-200 bg-white px-3 py-1 rounded-md cursor-pointer"
        onClick={() => handlePageChange(page - 1)}
        disabled={page === 1}
        type="button"
      >
        Prev
      </button>
      {[...Array(totalPages).keys()].map((index) => (
        <button
          key={index}
          type="button"
          className={`text-black text-base border border-gray-200 w-10 h-10 rounded-md  cursor-pointer ${
            page === index + 1 ? "bg-[#96c94b] font-bold" : "bg-white"
          }`}
          onClick={() => handlePageChange(index + 1)}
        >
          {index + 1}
        </button>
      ))}

      <button
        type="button"
        className="text-black text-base border border-gray-200 bg-white px-3 py-1 rounded-md cursor-pointer"
        onClick={() => handlePageChange(page + 1)}
        disabled={page === totalPages || page * itemsPerPage >= totalItems}
      >
        Next
      </button>
    </div>
  );
}

export default WristbandPagination;
