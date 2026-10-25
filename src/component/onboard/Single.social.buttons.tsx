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
import { FilePenLine, FilePlus } from "lucide-react";
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
  const [showAllButtons, setShowAllButtons] = useState(false);
  const onboard = !isError && data?.onboard ? data.onboard : null;
  const { buttonSet } = onboard || {};
  const [selected, setSelected] = useState("");
  const [deleteSocialButton, { isLoading: delLoad }] =
    useDeleteSocialButtonMutation();

  const visibleButtons = showAllButtons ? buttonSet : buttonSet?.slice(0, 6);

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
    content = [...Array(6)].map((_, i) => <ButtonSetLoadder key={i} />);
  }
  if (!isLoading && !isFetching && buttonSet?.length === 0) {
    content = (
      <p className="bg-[#FEFBED] text-center text-[#643315] text-md font-normal py-5 rounded-md col-span-2">
        Social link not found!
      </p>
    );
  }
  if (!isLoading && !isFetching && buttonSet?.length > 0) {
    content = visibleButtons?.map((item: TypesOfButton) => {
      const { url, name, id } = item || {};
      return (
        <div key={id} className="flex flex-col gap-1">
          <p className="text-sm uppercase font-medium text-[#687388]">{name}</p>
          <div className="flex gap-2 items-center justify-between border-2 border-[#E7EBF2] px-4 py-2 rounded-xl break-all">
            <p className="text-sm">{url?.slice(0, 22)}...</p>
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
    <div className="jost border border-gray-200 p-5 md:p-10 rounded-3xl shadow bg-white">
      <div className="border-b md:flex-row flex-col gap-3 md:gap-0 border-gray-200 pb-3 md:pb-8 flex justify-between w-full items-center">
        <div className="flex flex-col">
          <p className="text-lg md:text-xl text-[#121625] font-medium">
            Onboard Social Buttons
          </p>
          <p className="text-[#9FA9BB] text-xs md:text-sm font-normal">
            View and update social buttons
          </p>
        </div>
        <div className="flex gap-3 items-center">
          <button
            onClick={() => setAddButton(true)}
            className="border border-[#E7EBF2] active:bg-[#E7EBF2] w-10 h-10 flex justify-center items-center rounded-lg cursor-pointer"
          >
            <FilePlus color="#8C98AE" size={20} />
          </button>

          <button
            onClick={() => setIsShowButton(true)}
            className="border border-[#E7EBF2] active:bg-[#E7EBF2] w-10 h-10 flex justify-center items-center rounded-lg cursor-pointer"
          >
            <FilePenLine color="#8C98AE" size={20} />
          </button>
        </div>
      </div>
      <div className="mt-3 md:mt-8 grid grid-cols-1 lg:grid-cols-2 gap-5">
        {content}
      </div>
      {!isLoading && !isFetching && (buttonSet?.length ?? 0) > 6 && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => setShowAllButtons((prev) => !prev)}
            className="rounded-lg cursor-pointer border border-[#E7EBF2] px-5 py-2.5 text-sm font-medium text-[#687388] transition hover:bg-gray-50 hover:text-gray-900"
          >
            {showAllButtons
              ? "Show less"
              : `Show more (${buttonSet!.length - 6})`}
          </button>
        </div>
      )}
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
          title="Do you want to delete this social button?"
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
