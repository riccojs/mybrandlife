import toast from "react-hot-toast";
import type { OnboardTypes } from "../../utils/user.types";
import { useGetAllWristbandQuery } from "../../redux/features/wristband/wristbandApi";
import { useState } from "react";
import type { WristbandType } from "../../utils/wristband.types";
import WristbandPagination from "./Wristband.pagination";

interface Types {
  setOnboard: React.Dispatch<React.SetStateAction<OnboardTypes>>;
  onboard: OnboardTypes;
}

function Wristbands({ setOnboard, onboard }: Types) {
  const [page, setPage] = useState(1);
  const [quantity, setQuantity] = useState<Record<string, number>>({});
  const limit = 10;
  const handlePageChange = (value: number) => {
    setPage(value);
  };
  const { data, isLoading } = useGetAllWristbandQuery({
    page,
    limit,
    statusBy: "",
    searchBy: "",
  });

  const wristbands = data?.data?.wristband || [];
  const totalItems = data?.data?.totalWristband || [];

  const getMaxQuantity = (color: string) => {
    return color === "BLACK" ? 5 : 2;
  };

  const increaseQuantity = (item: WristbandType) => {
    const max = getMaxQuantity(item.color);

    setQuantity((prev) => {
      const current = prev[item.id] ?? 0;

      if (current >= max) {
        toast.error(`${item.color} max ${max} available!`);
        return prev;
      }

      return {
        ...prev,
        [item.id]: current + 1,
      };
    });
  };

  const decreaseQuantity = (id: string) => {
    setQuantity((prev) => {
      const current = prev[id] ?? 0;

      return {
        ...prev,
        [id]: Math.max(0, current - 1),
      };
    });
  };

  const addToCart = (item: WristbandType) => {
    const qty = quantity[item.id] ?? 0;
    const isInCart =
      onboard.wristbands?.some((w) => w.wristbandId === item.id) ?? false;
    if (!isInCart && qty === 0) {
      toast.error("Please select quantity.");
      return;
    }
    setOnboard((prev) => {
      let wristbands = [...(prev.wristbands ?? [])];
      if (qty === 0) {
        wristbands = wristbands.filter((w) => w.wristbandId !== item.id);
        return {
          ...prev,
          wristbands,
        };
      }
      const index = wristbands.findIndex((w) => w.wristbandId === item.id);
      const data = {
        wristbandId: item.id,
        title: item.title,
        description: item.description,
        banner: item.banner,
        color: item.color,
        price: item.price,
        quantity: qty,
        subTotal: Number((qty * item.price).toFixed(2)),
      };
      if (index >= 0) {
        wristbands[index] = data;
      } else {
        wristbands.push(data);
      }
      return {
        ...prev,
        wristbands,
      };
    });
    if (qty === 0) {
      toast.success(`${item.title} removed from cart.`);
    } else if (isInCart) {
      toast.success(`${item.title} updated.`);
    } else {
      toast.success(`${item.title} added to cart.`);
    }
  };

  // decide what to render
  let content;
  if (isLoading) {
    content = [...Array(8)].map((_, i) => (
      <div
        key={i}
        className="rounded-lg bg-white border border-gray-200 overflow-hidden animate-pulse"
      >
        <div className="w-full h-32 bg-gray-200" />

        <div className="p-5">
          <div className="h-5 w-3/4 bg-gray-200 rounded" />

          <div className="h-7 w-20 bg-gray-200 rounded mt-3" />

          <div className="h-4 w-28 bg-gray-200 rounded mt-3" />

          <div className="flex gap-2 mt-5">
            <div className="flex gap-2 items-center">
              <div className="w-6 h-6 rounded-full bg-gray-200" />
              <div className="w-8 h-6 rounded bg-gray-200" />
              <div className="w-6 h-6 rounded-full bg-gray-200" />
            </div>

            <div className="flex-1 h-10 rounded-lg bg-gray-200" />
          </div>
        </div>
      </div>
    ));
  }
  if (!isLoading && wristbands?.length > 0) {
    content = wristbands.map((item: WristbandType) => {
      const { id, title, color, price, banner } = item;
      return (
        <div key={id} className="rounded-lg bg-white border border-gray-200">
          <img src={banner} alt="" className="w-full h-32 object-cover" />
          <div className="bg-white p-5 flex flex-col">
            <h2 className="text-md font-normal text-black">{title}</h2>
            <h3 className="text-2xl font-medium text-green-600">${price}</h3>
            <h4 className="text-sm font-normal text-gray-400 uppercase">
              COLOR: {color}
            </h4>
            <div className="flex gap-2 mt-2">
              <div className="flex gap-2 items-center">
                <span
                  onClick={() => increaseQuantity(item)}
                  className="w-6 text-lg h-6 min-w-6 rounded-full flex justify-center items-center bg-green-200 cursor-pointer"
                >
                  +
                </span>
                <h3 className="text-bold text-xl">{quantity[item.id] ?? 0}</h3>
                <span
                  onClick={() => decreaseQuantity(item.id)}
                  className="w-6 text-lg h-6 min-w-6 rounded-full flex justify-center items-center bg-green-200 cursor-pointer"
                >
                  -
                </span>
              </div>
              <span
                onClick={() => addToCart(item)}
                className="rounded-lg w-full py-2 bg-green-300 text-sm text-center cursor-pointer"
              >
                {onboard.wristbands?.some((w) => w.wristbandId === item.id)
                  ? "Update"
                  : "Add"}
              </span>
            </div>
          </div>
        </div>
      );
    });
  }

  return (
    <div className="my-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {content}
      </div>

      {totalItems > limit && (
        <WristbandPagination
          handlePageChange={handlePageChange}
          page={page}
          totalItems={totalItems}
          itemsPerPage={limit}
        />
      )}
    </div>
  );
}

export default Wristbands;
