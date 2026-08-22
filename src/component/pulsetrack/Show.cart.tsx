import type { SetStateAction } from "react";

function ShowCart({
  title,
  setShow,
  isError,
}: {
  title: string;
  setShow: React.Dispatch<SetStateAction<boolean>>;
  isError: boolean;
}) {
  return (
    <div
      className={`fixed w-64 md:w-125 bottom-5 right-5 p-5 rounded-lg shadow-lg ${isError ? "bg-red-400" : "bg-[#00AE7D]"}`}
    >
      <div className="flex justify-between items-start">
        <h2 className="text-white text-md font-normal">{title}</h2>
        <button
          onClick={() => setShow(false)}
          className="text-white text-xl w-10 flex justify-end cursor-pointer"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>
    </div>
  );
}

export default ShowCart;
