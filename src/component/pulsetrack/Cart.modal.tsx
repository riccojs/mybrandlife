import { TiMinus, TiPlus } from "react-icons/ti";
import { useParams } from "react-router";
import { MdAddShoppingCart } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { FaSpinner } from "react-icons/fa6";
import ShowCart from "./Show.cart";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { BiTrash } from "react-icons/bi";
import PulsetrackExtra from "./Pulsetrack.extra";
import { ImSpinner10 } from "react-icons/im";
import PulsetrackCartLoader from "../loader/Pulsetrack.cart.loader";
import type { WristbandType } from "../../utils/wristband.types";
import {
  useCreatePulsetrackPaymentMutation,
  useDeletePulsetrackCartItemMutation,
  useGetOnePulsetrackQuery,
  useGetPulsetrackCartQuery,
} from "../../redux/features/pulsetrack/pulsetrackApi";
import { useAuth } from "../../hook/useAuth";
import useAddWristbandCart from "../../hook/useAddWristbandCart";
import useBodyScroll from "../../hook/userBodyscroll";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartModal({ isOpen, onClose }: Props) {
  useBodyScroll(isOpen);
  const params = useParams();
  const pulsetrackId = params.id as string;
  const { data, isLoading, isFetching } =
    useGetPulsetrackCartQuery(pulsetrackId);
  const [step, setStep] = useState(1);
  const [info, setInfo] = useState({
    address: "",
    zip: "",
    city: "",
    state: "",
  });
  const [selectId, setSelectedId] = useState("");
  const cartData = useMemo(() => {
    return data?.wristband ?? [];
  }, [data]);

  const [deletePulsetrackCartItem, { isLoading: delLoad }] =
    useDeletePulsetrackCartItemMutation();
  const [quantities, setQuantities] = useState<{ [id: string]: number }>({});
  const [errors, setErrors] = useState({
    addressError: false,
    cityError: false,
    zipError: false,
    stateError: false,
  });
  const [createPulsetrackPayment, { isLoading: payLoad }] =
    useCreatePulsetrackPaymentMutation();
  const {
    data: pulsetrack,
    isLoading: cartLoad,
    isFetching: cartFetch,
  } = useGetOnePulsetrackQuery(pulsetrackId);
  const { subTotal, total } = pulsetrack?.pulsetrack || {};
  const { user } = useAuth();
  const userId = user?.id as string;
  const {
    show,
    setShow,
    cartTitle,
    handleAddToCart,
    isLoading: createLoad,
    isError,
  } = useAddWristbandCart();
  const idPrefix = pulsetrack?.pulsetrack?.idPrefix || 0;

  useEffect(() => {
    if (cartData?.length) {
      const initialQuantities: { [id: string]: number } = {};

      cartData.forEach((item: WristbandType) => {
        initialQuantities[item.id] = item.quantity;
      });

      setQuantities(initialQuantities);
    }
  }, [cartData]);

  const handleDelete = (id: string) => {
    setSelectedId(id);
    deletePulsetrackCartItem(id)
      .unwrap()
      .then((res) => {
        toast.success(res.message);
      })
      .catch((error) => {
        const err = error as FetchBaseQueryError;
        const errorMessage = (err.data as { message: string }).message;
        toast.error(errorMessage);
      });
  };

  const { city, zip, address, state } = info || {};

  const handlePaymentCreate = () => {
    const pulsetrack = {
      total: total,
      pulsetrackId: pulsetrackId,
      userId: userId,
      city: city,
      zip: zip,
      address: address,
      state: state,
    };
    const newErrors = {
      addressError: address.trim().length === 0,
      cityError: city.trim().length === 0,
      zipError: zip.trim().length === 0,
      stateError: state.trim().length === 0,
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((err) => err)) {
      return;
    }

    createPulsetrackPayment(pulsetrack)
      .unwrap()
      .then((res) => {
        toast.success(res.message);
        window.location.href = res.pageUrl;
      })
      .catch((error) => {
        const err = error as FetchBaseQueryError;
        const errorMessage = (err.data as { message: string }).message;
        toast.error(errorMessage);
      });
  };

  const { addressError, cityError, zipError, stateError } = errors || {};

  // decide what to render
  let content;
  if (isFetching || isLoading) {
    content = <PulsetrackCartLoader />;
  }
  if (!isFetching && !isLoading && cartData?.length === 0) {
    content = (
      <div className="w-full min-h-40 flex flex-col gap-5 items-center justify-center">
        <MdAddShoppingCart size={50} color="#9096A5" />
        <p>Opps, cart is empty!</p>
      </div>
    );
  }
  if (!isFetching && !isLoading && cartData?.length > 0) {
    content = (
      <div className="relative w-full rounded-2xl bg-white shadow-2xl">
        <div className="space-y-4 px-5 py-5">
          {cartData.map((item: WristbandType) => {
            const {
              title,
              price,
              subTotal,
              banner,
              color,
              id,
              stock,
              wristbandId,
            } = item || {};
            const quantity = quantities[id] || 1;
            return (
              <div key={id} className="flex gap-4 rounded-xl bg-gray-50 p-4">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-white">
                  <img
                    src={banner}
                    alt={title}
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{title}</p>

                      <div className="flex gap-2 items-center">
                        <p className="mt-0.5 text-sm text-gray-500">
                          Price: ${price}
                        </p>
                        <p>|</p>
                        <p className="mt-0.5 text-sm text-gray-500">
                          Color: {color}
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold text-gray-900">
                      ${subTotal.toFixed(2)}
                    </p>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center rounded-lg border border-gray-200">
                      <button
                        onClick={() => {
                          const newQty = quantity - 1;

                          setSelectedId(id);

                          setQuantities((prev) => ({
                            ...prev,
                            [id]: newQty,
                          }));

                          handleAddToCart(
                            pulsetrackId,
                            item,
                            newQty,
                            userId,
                            idPrefix,
                            wristbandId,
                          );
                        }}
                        disabled={stock === 0}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                      >
                        <TiMinus />
                      </button>
                      <span className="px-4 text-sm font-medium">
                        {createLoad && selectId === id ? (
                          <FaSpinner className="animate-spin" />
                        ) : (
                          quantity
                        )}
                      </span>
                      <button
                        onClick={() => {
                          if (quantity === 1) return;

                          const newQty = quantity + 1;

                          setSelectedId(id);

                          setQuantities((prev) => ({
                            ...prev,
                            [id]: newQty,
                          }));

                          handleAddToCart(
                            pulsetrackId,
                            item,
                            newQty,
                            userId,
                            idPrefix,
                            wristbandId,
                          );
                        }}
                        disabled={stock === 0}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                      >
                        <TiPlus />
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedId(id);
                        handleDelete(id);
                      }}
                      className="text-gray-400 hover:text-red-500"
                    >
                      {delLoad && selectId === id ? (
                        <FaSpinner className="animate-spin" size={20} />
                      ) : (
                        <BiTrash size={20} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div
        className={`w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden ${
          isOpen ? "zoom-animation" : ""
        }`}
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Your Cart</h2>
          <button
            onClick={onClose}
            className="text-gray-400 cursor-pointer hover:text-gray-600"
          >
            <IoClose />
          </button>
        </div>
        <div className="h-full max-h-[50vh] overflow-auto">
          {step === 1 && content}
          {step === 2 && (
            <form action="" className="p-5 flex flex-col gap-4">
              <h2 className="text-gray-500 text-sm font-medium uppercase">
                Shipping Address
              </h2>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  City <span className="text-red-500 text-sm">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  onChange={(e) => {
                    setInfo((prev) => ({
                      ...prev,
                      city: e.target.value,
                    }));
                    if (e.target.value.trim()?.length > 3) {
                      setErrors((prev) => ({
                        ...prev,
                        cityError: false,
                      }));
                    }
                  }}
                  placeholder="e.g. Los Angeles"
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400
                              focus:outline-none focus:ring-2 ${cityError ? "border-red-500 focus:ring-red-200" : info.city ? "border-green-500 focus:ring-green-200" : "border-slate-200 focus:ring-[#8CC63F]/30"}`}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  State <span className="text-red-500 text-sm">*</span>
                </label>
                <input
                  type="text"
                  name="state"
                  onChange={(e) => {
                    setInfo((prev) => ({
                      ...prev,
                      state: e.target.value,
                    }));
                    if (e.target.value.trim()?.length > 3) {
                      setErrors((prev) => ({
                        ...prev,
                        stateError: false,
                      }));
                    }
                  }}
                  placeholder="e.g. California"
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400
                              focus:outline-none focus:ring-2 ${stateError ? "border-red-500 focus:ring-red-200" : info.state ? "border-green-500 focus:ring-green-200" : "border-slate-200 focus:ring-[#8CC63F]/30"}`}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Zip <span className="text-red-500 text-sm">*</span>
                </label>
                <input
                  type="number"
                  name="zip"
                  onChange={(e) => {
                    setInfo((prev) => ({
                      ...prev,
                      zip: e.target.value,
                    }));
                    if (e.target.value.trim()?.length > 3) {
                      setErrors((prev) => ({
                        ...prev,
                        zipError: false,
                      }));
                    }
                  }}
                  placeholder="e.g. 10250"
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400
                              focus:outline-none focus:ring-2 ${zipError ? "border-red-500 focus:ring-red-200" : info.zip ? "border-green-500 focus:ring-green-200" : "border-slate-200 focus:ring-[#8CC63F]/30"}`}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Shipping address{" "}
                  <span className="text-red-500 text-sm">*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  onChange={(e) => {
                    setInfo((prev) => ({
                      ...prev,
                      address: e.target.value,
                    }));
                    if (e.target.value.trim()?.length > 3) {
                      setErrors((prev) => ({
                        ...prev,
                        addressError: false,
                      }));
                    }
                  }}
                  placeholder="e.g. Washington, usa"
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400
                              focus:outline-none focus:ring-2 ${addressError ? "border-red-500 focus:ring-red-200" : info.address ? "border-green-500 focus:ring-green-200" : "border-slate-200 focus:ring-[#8CC63F]/30"}`}
                />
              </div>
            </form>
          )}
        </div>
        {cartData?.length > 0 && (
          <PulsetrackExtra
            cartData={cartData}
            subTotal={subTotal}
            total={total}
            cartLoad={cartLoad}
            cartFetch={cartFetch}
          />
        )}

        {cartData?.length > 0 && (
          <div className="px-6 pb-6">
            {step === 1 ? (
              <button
                onClick={() => setStep(2)}
                className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-lime-500 px-4 py-3 font-semibold text-white hover:bg-lime-600"
              >
                Continue
              </button>
            ) : (
              <div className="flex gap-3 items-center">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-3 border cursor-pointer border-gray-300 rounded-xl text-black"
                >
                  Back
                </button>
                <button
                  onClick={handlePaymentCreate}
                  className="flex w-full items-center cursor-pointer justify-center gap-2 rounded-xl bg-lime-500 px-4 py-3 font-semibold text-white hover:bg-lime-600"
                >
                  {payLoad ? (
                    <ImSpinner10 className="animate-spin" />
                  ) : (
                    "STRIPE CHECKOUT"
                  )}
                </button>
              </div>
            )}

            <p className="mt-3 text-center text-xs text-gray-400">
              Secure checkout powered by Stripe. All taxes included.
            </p>
          </div>
        )}
      </div>
      {show && (
        <ShowCart title={cartTitle} setShow={setShow} isError={isError} />
      )}
    </div>
  );
}
