import { useState } from "react";
import type { WristbandType } from "../utils/wristband.types";
import { useTogglePulsetrackMutation } from "../redux/features/pulsetrack/pulsetrackApi";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

function useAddWristbandCart() {
  const [show, setShow] = useState(false);
  const [cartTitle, setCartTitle] = useState<string>("");
  const [togglePulsetrack, { isLoading, isError }] =
    useTogglePulsetrackMutation();

  const handleAddToCart = async (
    id: string,
    project: WristbandType,
    quantity: number,
    userId: string,
    idPrefix: string,
    wristbandId: string,
  ) => {
    const projectData = {
      wristbandId: wristbandId,
      title: project?.title,
      price: project?.price,
      subTotal: Number((project?.price * quantity).toFixed(2)),
      quantity: quantity,
      idPrefix: idPrefix,
      banner: project?.banner,
      color: project?.color,
      userId: userId,
    };

    try {
      await togglePulsetrack({ id, projectData }).unwrap();
      setCartTitle(`${project.title} added to the cart`);
    } catch (error) {
      const err = error as FetchBaseQueryError;
      const errorMessage = (err.data as { message: string }).message;
      setCartTitle(errorMessage);
    }
    setShow(true);
    setTimeout(() => setShow(false), 3000);
  };
  return { show, setShow, cartTitle, handleAddToCart, isLoading, isError };
}

export default useAddWristbandCart;
