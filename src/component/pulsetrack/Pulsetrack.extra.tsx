import { useParams } from "react-router";
import toast from "react-hot-toast";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useEffect, useState } from "react";
import type { WristbandType } from "../../utils/wristband.types";
import {
  useGetOnePulsetrackQuery,
  useTogglePulsetrackExtraMutation,
} from "../../redux/features/pulsetrack/pulsetrackApi";

function PulsetrackExtra({
  cartData,
  subTotal,
  total,
  cartLoad,
  cartFetch,
}: {
  cartData: WristbandType[];
  subTotal: number;
  total: number;
  cartLoad: boolean;
  cartFetch: boolean;
}) {
  const [togglePulsetrackExtra] = useTogglePulsetrackExtraMutation();
  const params = useParams();
  const [expediteProductionChecked, setExpediteProductionChecked] =
    useState(false);
  const [expediteShippingChecked, setExpediteShippingChecked] = useState(false);
  const id = params?.id;
  const production =
    cartData?.reduce((acc: number, item: WristbandType) => {
      return acc + item.quantity;
    }, 0) ?? 0;
  const { data } = useGetOnePulsetrackQuery(id);

  const expediteProduction = Number((production * 4.99).toFixed(2));
  const expediteShipping = 19.99;

  useEffect(() => {
    if (data?.pulsetrack) {
      setExpediteProductionChecked(data.pulsetrack.expediteProduction > 0);
      setExpediteShippingChecked(data.pulsetrack.expediteShipping > 0);
    }
  }, [data]);

  const handleChange = (pulsetrack: {
    expediteProduction: number;
    expediteShipping: number;
  }) => {
    togglePulsetrackExtra({ id, pulsetrack })
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

  return (
    <div>
      <div className="px-5 py-2 flex flex-col gap-2">
        <div className="flex gap-2 items-center">
          <input
            type="checkbox"
            checked={expediteProductionChecked}
            onChange={(e) => {
              const checked = e.target.checked;
              setExpediteProductionChecked(checked);

              const pulsetrack = {
                expediteProduction: checked ? expediteProduction : 0,
                expediteShipping: expediteShippingChecked
                  ? expediteShipping
                  : 0,
              };
              handleChange(pulsetrack);
            }}
            id="expediteProduction"
          />
          <label htmlFor="expediteProduction">
            Expedite Production +({expediteProduction})
          </label>
        </div>
        <div className="flex gap-2 items-center">
          <input
            type="checkbox"
            checked={expediteShippingChecked}
            onChange={(e) => {
              const checked = e.target.checked;
              setExpediteShippingChecked(checked);

              const pulsetrack = {
                expediteProduction: expediteProductionChecked
                  ? expediteProduction
                  : 0,
                expediteShipping: checked ? expediteShipping : 0,
              };
              handleChange(pulsetrack);
            }}
            id="expediteShipping"
          />
          <label htmlFor="expediteShipping">
            Expedite Shipping +({expediteShipping})
          </label>
        </div>
      </div>
      <div className="border-t border-gray-200 px-6 py-4">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            {cartLoad || cartFetch ? (
              <span className="w-16 h-5 bg-slate-300 rounded-md animate-pulse"></span>
            ) : (
              <span>${subTotal}</span>
            )}
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Expedite Production</span>

            {cartLoad || cartFetch ? (
              <span className="w-16 h-5 bg-slate-300 rounded-md animate-pulse"></span>
            ) : (
              <span className="font-medium text-lime-600">
                {data.pulsetrack.expediteProduction}
              </span>
            )}
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Expedite Shipping</span>

            {cartLoad || cartFetch ? (
              <span className="w-16 h-5 bg-slate-300 rounded-md animate-pulse"></span>
            ) : (
              <span className="font-medium text-lime-600">
                {data.pulsetrack.expediteShipping}
              </span>
            )}
          </div>
        </div>
        <div className="mt-3 flex justify-between text-base font-semibold text-gray-900">
          <span>Total</span>
          {cartLoad || cartFetch ? (
            <span className="w-16 h-5 bg-slate-300 rounded-md animate-pulse"></span>
          ) : (
            <span>${total}</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default PulsetrackExtra;
