import { PiShoppingCart } from "react-icons/pi";
import { useEffect, useState } from "react";
import { MdAddShoppingCart } from "react-icons/md";
import ShowCart from "./Show.cart";
import { FaSpinner } from "react-icons/fa6";
import { Link, useNavigate, useParams } from "react-router";
import CartModal from "./Cart.modal";
import { ImSpinner10 } from "react-icons/im";
import { useGetAllWristbandQuery } from "../../redux/features/wristband/wristbandApi";
import type { WristbandType } from "../../utils/wristband.types";
import WristbandStoreLoader from "../loader/Wristband.store.loader";
import Pagination from "../Pagination";
import useAddWristbandCart from "../../hook/useAddWristbandCart";
import { useAuth } from "../../hook/useAuth";
import { useGetOnePulsetrackQuery } from "../../redux/features/pulsetrack/pulsetrackApi";

export default function WristbandStore() {
  const params = useParams();
  const pulsetrackId = params.id as string;
  const navigate = useNavigate();
  const limit = 12;
  const { user } = useAuth();
  const [opencart, setOpencart] = useState(false);
  const userId = user?.id as string;
  const [quantities, setQuantities] = useState<{ [id: string]: number }>({});
  const {
    data: cartData,
    isLoading: cartLoad,
    isFetching: cartFetch,
  } = useGetOnePulsetrackQuery(pulsetrackId);

  const [page, setPage] = useState(1);
  const {
    show,
    setShow,
    cartTitle,
    handleAddToCart,
    isLoading: createLoad,
    isError,
  } = useAddWristbandCart();
  const { data, isFetching, isLoading } = useGetAllWristbandQuery({
    page,
    limit,
    statusBy: "",
    searchBy: "",
  });
  const handlePageChange = (value: number) => {
    setPage(value);
  };
  const [selectId, setSelectedId] = useState("");
  const wristbands = data?.data?.wristband || [];
  const currentPage = data?.data?.currentPage || [];
  const totalItems = data?.data?.totalWristband || 0;
  const start = (currentPage - 1) * limit + 1;
  const end = Math.min(currentPage * limit, totalItems);
  const total = cartData?.pulsetrack?.total || 0;
  const status = cartData?.pulsetrack?.active || 0;
  const idPrefix = cartData?.pulsetrack?.idPrefix || 0;

  useEffect(() => {
    if (status === "ACTIVATE") {
      navigate("/pulsetrack/projects");
    }
  }, [status, navigate]);

  // decide what to render
  let content;
  if (isFetching || isLoading) {
    content = [...Array(12)].map((_, i) => <WristbandStoreLoader key={i} />);
  }
  if (!isFetching && !isLoading && wristbands?.length === 0) {
    content = (
      <p className="bg-amber-50 text-md font-normal p-2 rounded-lg">
        Data not found!
      </p>
    );
  }
  if (!isFetching && !isLoading && wristbands?.length > 0) {
    content = wristbands.map((item: WristbandType) => {
      const { id, title, price, stock, description, color, banner } =
        item || {};
      const quantity = quantities[id] || 1;

      return (
        <div
          key={id}
          className="bg-white rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden"
        >
          <div className="relative">
            {title && (
              <span
                className={`absolute top-3 left-3 text-xs font-semibold px-3 py-1 rounded-full bg-green-400`}
              >
                {color}
              </span>
            )}
            <img
              src={banner}
              alt={title}
              className="w-full h-40 object-cover bg-gray-100"
            />
          </div>
          <div className="p-5 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">{title}</h3>
              <span className="font-semibold">${price}</span>
            </div>
            <span className="text-gray-400 text-sm font-normal">
              {description}
            </span>
            <div className="flex gap-2 items-center">
              <p>Color:</p>
              <p
                style={{ backgroundColor: `${color?.toLowerCase()}` }}
                className="w-5 min-w-5 h-5 rounded-full border border-gray-300"
              ></p>
            </div>
            <div className="flex gap-2 items-center">
              <div className="border border-gray-300 p-2 rounded-lg flex gap-2 items-center w-fit">
                <button
                  onClick={() =>
                    setQuantities((prev) => ({
                      ...prev,
                      [id]: Math.max(1, (prev[id] || 1) - 1),
                    }))
                  }
                  disabled={stock === 0}
                  className={`w-5 h-5 flex justify-center items-center text-white rounded-md cursor-pointer ${stock === 0 ? "bg-lime-600" : "bg-lime-500"}`}
                >
                  <i className="fa-solid fa-minus text-xs"></i>
                </button>
                <p className="text-md font-medium text-black">{quantity}</p>
                <button
                  onClick={() =>
                    setQuantities((prev) => ({
                      ...prev,
                      [id]: (prev[id] || 1) + 1,
                    }))
                  }
                  disabled={stock === 0}
                  className={`w-5 h-5 flex justify-center items-center text-white rounded-sm cursor-pointer ${stock === 0 ? "bg-lime-600" : "bg-lime-500"}`}
                >
                  <i className="fa-solid fa-plus text-xs"></i>
                </button>
              </div>
              <button
                onClick={() => {
                  handleAddToCart(
                    pulsetrackId,
                    item,
                    quantity,
                    userId,
                    idPrefix,
                    id,
                  );
                  setSelectedId(id);
                }}
                className="w-full cursor-pointer flex items-center justify-center gap-2 bg-lime-500 hover:bg-lime-600 transition text-white font-medium py-2.5 rounded-xl"
              >
                {createLoad && selectId === id ? (
                  <FaSpinner size={20} className="animate-spin" />
                ) : (
                  <MdAddShoppingCart size={20} />
                )}{" "}
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      );
    });
  }
  return (
    <div className="min-h-screen bg-[#f5f7f6] text-gray-800 p-6">
      <div className="bg-linear-to-r from-[#0f2027] via-[#203a43] to-[#2c5364] rounded-2xl p-10 text-white mb-10 shadow-lg">
        <span className="bg-lime-500 text-xs font-semibold px-3 py-1 rounded-full">
          ORDER YOUR CHOICE
        </span>
        <h1 className="text-4xl font-bold mt-4 mb-3 capitalize">
          Select and Order
        </h1>
        <p className="text-gray-200 max-w-xl mb-6">
          Select your items, add them to your cart, and proceed to secure
          checkout.
        </p>
        <Link
          to="/pulsetrack/projects"
          className="bg-lime-500 hover:bg-lime-600 transition px-6 py-2 rounded-xl font-medium text-sm text-white"
        >
          Back to PulseTrack
        </Link>
      </div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Wristband Selection</h2>
        <button
          onClick={() => setOpencart(true)}
          className="flex cursor-pointer items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-xl text-md"
        >
          <PiShoppingCart size={20} /> Your Cart{" "}
          {cartLoad || cartFetch ? (
            <ImSpinner10 className="animate-spin" />
          ) : (
            <span className="text-sm">(${total})</span>
          )}
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {content}
      </div>
      <div className="flex flex-wrap md:gap-0 gap-3 items-center justify-between px-6 py-5 border-t border-gray-200">
        <p className="text-sm text-gray-500">
          Showing <span className="font-medium text-gray-700">{start}</span> to{" "}
          <span className="font-medium text-gray-700">{end}</span> of{" "}
          <span className="font-medium text-gray-700">{totalItems}</span>{" "}
          results
        </p>
        {totalItems > limit && (
          <Pagination
            handlePageChange={handlePageChange}
            page={page}
            totalItems={totalItems}
            itemsPerPage={limit}
          />
        )}
        {show && (
          <ShowCart title={cartTitle} setShow={setShow} isError={isError} />
        )}
        <CartModal isOpen={opencart} onClose={() => setOpencart(false)} />
      </div>
    </div>
  );
}
