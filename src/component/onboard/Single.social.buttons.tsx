import { useState } from "react";

import { RiDeleteBin5Line } from "react-icons/ri";
import { useParams } from "react-router";
import toast from "react-hot-toast";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import {
  useDeleteSocialButtonMutation,
  useGetOneOnboardQuery,
} from "../../redux/features/onboard/onboardApi";
import ButtonSetLoadder from "../loader/ButtonSet.loader";
import EditButton from "./Edit.button";
import AddSocialButton from "./Add.social.button";
import WarningPopup from "../Warning.popup";

interface TypesOfButton {
  id: string;
  name: string;
  url: string;
  templateId: string;
}

function SingleSocialButtons() {
  const params = useParams();
  const id = params.id;
  const [isShowButton, setIsShowButton] = useState<boolean>(false);
  const [addButton, setAddButton] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const { data, isError, isLoading, isFetching } = useGetOneOnboardQuery(id);
  const onboard = !isError && data?.onboard ? data.onboard : null;
  const { buttonSet } = onboard || {};
  const [selected, setSelected] = useState("");
  const [deleteSocialButton, { isLoading: delLoad }] =
    useDeleteSocialButtonMutation();

  const handleDelete = (id: string) => {
    setSelected(id);
    deleteSocialButton(id)
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

  // decide what to render
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
  if (!isLoading && !isFetching && buttonSet?.length === 0) {
    content = (
      <p className="bg-amber-100 text-black p-3 rounded-lg border-l-3 border-amber-400 w-full col-span-2">
        Social link not found!
      </p>
    );
  }
  if (!isLoading && !isFetching && buttonSet?.length > 0) {
    content = buttonSet?.map((item: TypesOfButton) => {
      const { url, name, id } = item || {};
      return (
        <div key={id} className="flex flex-col gap-1">
          <p className="text-md text-medium">{name}</p>
          <div className="flex gap-2 items-center justify-between border border-gray-300 px-4 py-2 rounded-md break-all">
            <p className="text-sm">{url}</p>
            <button
              onClick={() => {
                setOpen(true);
                setSelected(id);
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
          <p className="text-xl text-medium">Onboard Social Buttons</p>
          <p className="text-gray-400 text-sm font-normal">
            View and update social buttons
          </p>
        </div>
        <div className="flex gap-3 items-center">
          <button
            onClick={() => setAddButton(true)}
            className="border border-gray-300 w-10 h-10 flex justify-center items-center rounded-md shadow cursor-pointer"
          >
            <i className="fa-regular fa-plus"></i>
          </button>
          <button
            onClick={() => setIsShowButton(true)}
            className="border border-gray-300 w-10 h-10 flex justify-center items-center rounded-md shadow cursor-pointer"
          >
            <i className="fa-regular fa-pen-to-square"></i>
          </button>
        </div>
      </div>
      <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-5">
        {content}
      </div>
      {isShowButton && (
        <EditButton
          isShowButton={isShowButton}
          setIsShowButton={setIsShowButton}
          buttons={buttonSet}
        />
      )}
      {addButton && (
        <AddSocialButton
          isShowButton={addButton}
          setIsShowButton={setAddButton}
          buttons={buttonSet}
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
          onConfirm={() => handleDelete(selected)}
          loading={delLoad}
        />
      )}
    </div>
  );
}

export default SingleSocialButtons;
