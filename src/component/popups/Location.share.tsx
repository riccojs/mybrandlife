import { useState, type SetStateAction } from "react";
import toast from "react-hot-toast";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useRequestInfoLocationMutation } from "../../redux/features/onboard/onboardApi";
import { LoaderCircle } from "lucide-react";

interface OnboardType {
  name: string;
  email: string;
  phone: string;
  note: string;
}

interface DataTypes {
  setUser: React.Dispatch<SetStateAction<OnboardType>>;
  user: OnboardType;
  requestId: string;
  setIsShowInfo: React.Dispatch<React.SetStateAction<boolean>>;
}

function LocationShare({ user, setIsShowInfo, requestId }: DataTypes) {
  const { name, email, phone, note } = user || {};

  const [requestInfoLocation, { isLoading }] = useRequestInfoLocationMutation();
  const [locationLoad, setLocationLoad] = useState<boolean>(false);
  const handleLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }
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
      },
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
      <div className="flex gap-3 items-center">
        <button
          className="bg-[#E6E6E6] cursor-pointer px-5 py-3 rounded-lg text-xs md:text-sm w-full"
          onClick={() => {
            if (isLoading || locationLoad) {
              return;
            }
            setIsShowInfo(false);
          }}
          disabled={isLoading || locationLoad}
        >
          No Thanks
        </button>
        <button
          type="submit"
          disabled={isLoading || locationLoad}
          onClick={handleLocation}
          className={`flex justify-center items-center px-5 py-3 rounded-lg text-xs md:text-sm w-full ${isLoading ? "bg-[#4e8527] cursor-not-allowed" : "bg-[#65B32E] cursor-pointer"}`}
        >
          {locationLoad || locationLoad ? (
            <LoaderCircle size={20} className="animate-spin" />
          ) : (
            "Share & Submit"
          )}
        </button>
      </div>
    </div>
  );
}

export default LocationShare;
