import { useState, type SetStateAction } from "react";
import toast from "react-hot-toast";
import { useRequestInfoLocationMutation } from "../redux/features/onboard/onboardApi";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { track } from "@plausible-analytics/tracker";
import { useOnboard } from "../hook/useOnboard";

interface OnboardType {
  name: string;
  email: string;
  phone: string;
  note: string;
  templateId: string;
}

interface DataTypes {
  setUser: React.Dispatch<SetStateAction<OnboardType>>;
  user: OnboardType;
  requestId: string;
  setIsShowInfo: React.Dispatch<React.SetStateAction<boolean>>;
}

function LocationShare({ user, setIsShowInfo, requestId }: DataTypes) {
  const { name, email, phone, note } = user || {};
  const { onboard } = useOnboard();
  const [requestInfoLocation, { isLoading }] = useRequestInfoLocationMutation();
  const [locationLoad, setLocationLoad] = useState<boolean>(false);
  const handleLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }
    track("ButtonClick", {
      props: {
        buttonName: "Create Location share",
        lander: onboard?.user?.landerName,
        currentDomain: window.location.hostname,
      },
    });
    setLocationLoad(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;

        requestInfoLocation({
          lat: latitude,
          lon: longitude,
          accu: accuracy,
          id: requestId,
        })
          .unwrap()
          .then((res) => {
            toast.success(res.message);
            setIsShowInfo(false);
            setLocationLoad(false);
          })
          .catch((error) => {
            const err = error as FetchBaseQueryError;
            const errorMessage = (err.data as { message: string }).message;
            toast.error(errorMessage);
            setLocationLoad(false);
          });
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          toast.error("Location permission denied.");
          setIsShowInfo(false);
          setLocationLoad(false);
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          toast.error("Location information is unavailable.");
          setLocationLoad(false);
        } else if (error.code === error.TIMEOUT) {
          toast.error("Location request timed out.");
          setLocationLoad(false);
        } else {
          toast.error("An unknown error occurred.");
          setLocationLoad(false);
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return (
    <div>
      <div className="flex flex-col gap-2 pb-5 mb-5">
        <h2 className="text-2xl font-bold text-center">
          Thanks for your submission!
        </h2>
      </div>
      <div className="rounded-md shadow overflow-hidden my-5">
        <table className="table-auto border-collapse w-full oboardTable">
          <thead>
            <tr className="border border-gray-300">
              <td className="text-left p-3 font-medium">Key</td>
              <td className="text-left p-3">Value</td>
            </tr>
          </thead>
          <tbody>
            <tr className="border border-gray-300">
              <td className="text-sm text-left p-3 font-bold">Name</td>
              <td className="text-sm text-left p-3">{name}</td>
            </tr>
            <tr className="border border-gray-300">
              <td className="text-sm text-left p-3 font-bold">Email</td>
              <td className="text-sm text-left p-3">{email}</td>
            </tr>
            <tr className="border border-gray-300">
              <td className="text-sm text-left p-3 font-bold">Phone</td>
              <td className="text-sm text-left p-3">{phone}</td>
            </tr>
            <tr className="border border-gray-300">
              <td className="text-sm text-left p-3 font-bold">Note</td>
              <td className="text-sm text-left p-3">{note}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-black text-md mb-3 font-medium">
        Where were we when we connected?
      </p>
      <button
        className="bg-linear-to-r from-[#E73B14] to-[#EF9C25] w-full text-black shadow-lg text-xs font-medium text-center py-3 rounded-md cursor-pointer hover:scale-102 duration-300 transition-all mb-2 flex justify-center gap-2"
        onClick={handleLocation}
      >
        {isLoading || locationLoad ? (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-4 h-4 animate-spin"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
            <p>Loading...</p>
          </>
        ) : (
          <>
            <p>SHARE & SUBMIT REQUEST</p>
          </>
        )}
      </button>

      <button
        className="bg-gradient-to-r from-[#e3e3e3] to-[#ddd8d8] w-full shadow-lg text-black text-xs font-bold text-center py-3 rounded-md cursor-pointer hover:scale-102 duration-300 transition-all"
        onClick={() => setIsShowInfo(false)}
      >
        NO THANKS
      </button>
    </div>
  );
}

export default LocationShare;
