import { FaSpinner } from "react-icons/fa6";
import { useGPS } from "../hook/useGps";
import { useScanGpsPulsetrackMutation } from "../redux/features/pulsetrack/pulsetrackApi";

interface TypesForm {
  isShowInfo: boolean;
  setIsShowInfo: React.Dispatch<React.SetStateAction<boolean>>;
  scanId: string;
}

function GpsPermission({ isShowInfo, setIsShowInfo, scanId }: TypesForm) {
  const [scanGpsPulsetrack, { isLoading }] = useScanGpsPulsetrackMutation();
  const { requestGPS } = useGPS();

  const handleSubmit = async () => {
    const data = await requestGPS();
    if (data.gpsConsent) {
      await scanGpsPulsetrack({ id: scanId, pulsetrack: data });
    }
    setIsShowInfo(false);
  };

  return (
    <div className="inset-0 bg-[#00000039] flex fixed left-0 justify-center items-center w-full min-h-screen z-50">
      <div
        className={`relative flex flex-col gap-3 w-11/12 2xl:w-3/12 xl:w-6/12 m-auto justify-center p-6 rounded-lg shadow-sm bg-white border border-gray-300 ${
          isShowInfo ? "zoom-animation" : ""
        }`}
      >
        <h2 className="text-lg font-semibold text-center">
          Allow GPS Location
        </h2>
        <p className="text-sm text-gray-600 text-center">
          Share your location? This helps give credit to the person or place you
          scanned from to be eligible for a bonus, and helps us understand where
          we are connecting with you.
        </p>
        <div className="flex md:flex-row flex-col gap-1 md:gap-3 items-center">
          <button
            onClick={() => setIsShowInfo(false)}
            className="bg-gray-300 text-black p-2 w-full rounded-lg"
          >
            Close
          </button>
          <button
            onClick={handleSubmit}
            className="bg-green-400 text-white p-2 w-full rounded-lg flex gap-2 items-center justify-center"
          >
            {isLoading && <FaSpinner className="animate-spin" />} Allow Location
          </button>
        </div>
      </div>
    </div>
  );
}

export default GpsPermission;
