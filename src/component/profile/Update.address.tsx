import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { LocationType } from "../../utils/user.types";
import { useAuth } from "../../hook/useAuth";
import { MapPinHouse, NotebookTabs } from "lucide-react";
import { useUpdateUserAddressMutation } from "../../redux/features/auth/authApi";
import useBodyScroll from "../../hook/userBodyscroll";
import LocationSelect from "./Location.select";

interface TypesForm {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  type: "PRIMARY" | "SHIPPING";
}

function UpdateAddress({ open, setOpen, type }: TypesForm) {
  useBodyScroll(open);
  const [updateUserAddress, { isLoading }] = useUpdateUserAddressMutation();
  const { user: userData } = useAuth() as {
    user: { id: string; address: LocationType[] } | null;
  };
  const [user, setUser] = useState<LocationType>({
    state: "",
    city: "",
    country: "",
    zip: "",
    streetOne: "",
    streetTow: "",
    type: type,
  });
  const findUserAddress = userData?.address?.find(
    (item: LocationType) => item.type === type,
  );

  useEffect(() => {
    if (findUserAddress) {
      setUser({
        state: findUserAddress?.state ?? "",
        city: findUserAddress?.city ?? "",
        country: findUserAddress?.country ?? "",
        zip: findUserAddress?.zip ?? "",
        streetOne: findUserAddress?.streetOne ?? "",
        streetTow: findUserAddress?.streetTow ?? "",
        type: findUserAddress?.type ?? "",
      });
    }
  }, [findUserAddress]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userID = userData ? userData?.id : "";
    updateUserAddress({ user, id: userID })
      .unwrap()
      .then((res) => {
        toast.success(res.message);
        setOpen(false);
      })
      .catch((error) => {
        const err = error as FetchBaseQueryError;
        const errorMessage = (err.data as { message: string }).message;
        toast.error(errorMessage);
      });
  };

  if (!open) return;

  return (
    <div className="inset-0 bg-[#00000039] flex fixed left-0 justify-center items-center w-full h-auto min-h-screen z-50 overflow-auto">
      <div
        className={`relative flex flex-col overflow-hidden w-11/12 2xl:w-3/12 xl:w-6/12 m-auto justify-center rounded-xl shadow-sm bg-[#ffffff] border border-gray-300 ${
          open ? "zoom-animation" : ""
        }`}
      >
        {" "}
        <div className="min-h-full">
          <div className="w-full bg-yellow-50 p-5 border-b-2 border-yellow-200">
            <div className="relative mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl border border-yellow-200 bg-linear-to-b from-yellow-100 to-yellow-50 shadow-lg">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-400 shadow-md">
                <MapPinHouse className="h-7 w-7 text-white" />
              </div>
              <div className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-white shadow">
                <NotebookTabs className="h-4 w-4 text-yellow-400" />
              </div>
            </div>
            <h2 className="text-black text-xl md:text-3xl font-bold text-center uppercase">
              Update Address
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="py-5 px-4 md:px-8">
            <div className="flex flex-col gap-2 mt-5">
              <h2>
                {type === "PRIMARY" ? "Primary Address" : "Shipping Address"}{" "}
                <span className="text-[#cf3832]">*</span>
              </h2>
              <LocationSelect
                type="SHIPPING"
                value={user}
                disabled={false}
                onChange={(data) =>
                  setUser((prev) => ({
                    ...prev,
                    ...data,
                  }))
                }
              />

              <input
                type="number"
                value={user?.zip}
                onChange={(e) =>
                  setUser((prev) => ({
                    ...prev,
                    zip: e.target.value,
                  }))
                }
                placeholder="Enter your Postal Code."
                name="zip"
                disabled={false}
                className="bg-[#F3F3F3] border border-gray-300 focus:outline focus:outline-[#96c94b] focus:border py-3 px-3 w-full rounded-xl text-normal text-black"
              />
              <input
                type="text"
                value={user?.streetOne}
                onChange={(e) => {
                  setUser((prev) => ({
                    ...prev,
                    streetOne: e.target.value,
                  }));
                }}
                placeholder="Enter your Street or PO Box."
                name="streetOne"
                disabled={false}
                className="bg-[#F3F3F3] border border-gray-300 focus:outline focus:outline-[#96c94b] focus:border py-3 px-3 w-full rounded-xl text-normal text-black"
              />
              <input
                type="text"
                value={user?.streetTow}
                onChange={(e) => {
                  setUser((prev) => ({
                    ...prev,
                    streetTow: e.target.value,
                  }));
                }}
                placeholder="Enter Suite, Unit, Apt, or Leave Blank."
                name="streetTow"
                disabled={false}
                className="bg-[#F3F3F3] border border-gray-300 focus:outline focus:outline-[#96c94b] focus:border py-3 px-3 w-full rounded-xl text-normal text-black"
              />
            </div>
            <div className="mt-10 flex gap-4">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex-1 cursor-pointer rounded-xl border border-slate-200 bg-slate-100 py-3.5 font-medium text-slate-700 transition hover:bg-slate-200"
              >
                close
              </button>

              <button
                disabled={isLoading}
                className="flex-1 cursor-pointer rounded-xl bg-yellow-500 py-3.5 font-semibold text-white shadow-lg shadow-yellow-500/30 transition hover:bg-yellow-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? (
                  <i className="fa-solid fa-circle-notch animate-spin text-xl"></i>
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateAddress;
