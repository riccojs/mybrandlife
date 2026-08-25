import { useState } from "react";
import { Link, useParams } from "react-router";
import { RiDeleteBin5Line } from "react-icons/ri";
import toast from "react-hot-toast";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import {
  useDeleteCustomButtonMutation,
  useGetOneOnboardQuery,
} from "../../redux/features/onboard/onboardApi";
import WarningPopup from "../Warning.popup";
import EditCustomPlatform from "./Edit.custom.platform";
import ButtonSetLoadder from "../loader/ButtonSet.loader";
import AddCustomButton from "./Add.cutom.button";

interface TypesOfButton {
  id: string;
  name: string;
  url: string;
  templateId: string;
}

function SingleCustomButtons() {
  const params = useParams();
  const id = params.id;
  const [isShowButton, setIsShowButton] = useState<boolean>(false);
  const [addButton, setAddButton] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const { data, isError, isLoading, isFetching } = useGetOneOnboardQuery(id);
  const onboard = !isError && data?.onboard ? data.onboard : null;
  const { customPlatfrom } = onboard || {};
  const { package: packageType } = onboard?.user ?? {};
  const [selected, setSelected] = useState("");
  const [deleteCustomButton, { isLoading: delLoad }] =
    useDeleteCustomButtonMutation();

  const handleSubmit = (id: string) => {
    setSelected(id);
    deleteCustomButton(id)
      .unwrap()
      .then((res) => {
        toast.success(res.message);
        setOpen(false);
        setSelected("");
      })
      .catch((error) => {
        const err = error as FetchBaseQueryError;
        const errorMessage = (err.data as { message: string }).message;
        toast.error(errorMessage);
      });
  };

  // decide render to custom platfrom
  let content;
  if (isLoading || isFetching) {
    content = (
      <>
        <ButtonSetLoadder />
        <ButtonSetLoadder />
        <ButtonSetLoadder />
        <ButtonSetLoadder />
        <ButtonSetLoadder />
        <ButtonSetLoadder />
      </>
    );
  }
  if (!isLoading && !isFetching && customPlatfrom?.length === 0) {
    content = (
      <p className="bg-amber-100 text-black p-3 rounded-lg border-l-3 border-amber-400 w-full col-span-2">
        Custom link not found!
      </p>
    );
  }
  if (!isLoading && !isFetching && customPlatfrom?.length > 0) {
    content = customPlatfrom?.map((item: TypesOfButton) => {
      const { url, name, id } = item || {};
      return (
        <div key={id} className="flex flex-col gap-1">
          <p className="text-md text-medium">{name}</p>
          <div className="flex gap-2 items-center justify-between border border-gray-200 px-4 py-2 rounded-xl break-all">
            <p className="text-sm">{url}</p>
            <button
              onClick={() => {
                setSelected(id);
                setOpen(true);
              }}
              className="cursor-pointer bg-red-100 text-red-500 w-10 h-10 min-w-10 rounded-full flex justify-center items-center"
            >
              <RiDeleteBin5Line size={20} />
            </button>
          </div>
        </div>
      );
    });
  }

  return (
    <div className="jost border border-gray-300 p-5 md:p-10 rounded-lg bg-white">
      <div className="border-b border-gray-300 pb-5 flex justify-between w-full items-center">
        <div className="flex flex-col">
          <p className="text-xl text-medium">Onboard Custom Platform</p>
          <p className="text-gray-400 text-sm font-normal">
            View and update custom platform label and link
          </p>
        </div>
        <div className="flex gap-3 items-center">
          <button
            onClick={() => setAddButton(true)}
            className="border border-gray-300 w-10 h-10 flex justify-center items-center rounded-md shadow cursor-pointer"
          >
            <i className="fa-regular fa-plus"></i>
          </button>
          {customPlatfrom?.length > 0 && (
            <button
              onClick={() => setIsShowButton(true)}
              disabled={packageType !== "gold"}
              className="border border-gray-300 w-10 h-10 flex justify-center items-center rounded-md shadow cursor-pointer"
            >
              <i className="fa-regular fa-pen-to-square"></i>
            </button>
          )}
        </div>
      </div>
      {packageType === "gold" ? (
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-5">
          {content}
        </div>
      ) : (
        <div className="relative w-full h-72 rounded-lg overflow-hidden bg-white border border-gray-200 mt-5">
          <div className="absolute inset-0 blur-sm pointer-events-none opacity-90">
            <div className="w-full h-full bg-slate-200 flex items-center justify-center">
              <p className="text-gray-400">Custom Platform</p>
            </div>
          </div>
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
            <p className="text-sm font-semibold text-red-500 uppercase tracking-wide">
              Gold Package Only
            </p>
            <p className="mt-2 text-sm text-gray-700 max-w-md">
              Custom platform is available exclusively for Gold plan users.
              Upgrade your plan to unlock custom platform feature.
            </p>
            <Link
              to="/subscription"
              className="mt-4 rounded-md bg-yellow-400 px-5 py-2 text-sm font-semibold text-black hover:bg-yellow-500"
            >
              Upgrade to Gold
            </Link>
          </div>
        </div>
      )}
      {isShowButton && (
        <EditCustomPlatform
          isShowButton={isShowButton}
          setIsShowButton={setIsShowButton}
          buttons={customPlatfrom}
        />
      )}
      {addButton && (
        <AddCustomButton
          isShowButton={addButton}
          setIsShowButton={setAddButton}
          customPlatfrom={customPlatfrom}
        />
      )}
      {selected && (
        <WarningPopup
          open={open}
          title="Do you want delete this button?"
          description={`Deleting this button will permanently remove all associated data from the database. This action cannot be undone. Click "Delete" to continue or "Close" to cancel.`}
          smButton="Delete"
          clButton="Close"
          onClose={() => setOpen(false)}
          onConfirm={() => handleSubmit(selected)}
          loading={delLoad}
        />
      )}
    </div>
  );
}

export default SingleCustomButtons;
