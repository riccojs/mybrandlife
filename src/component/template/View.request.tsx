import { type SetStateAction } from "react";
import { useGetOneOnboardRequestsQuery } from "../../redux/features/onboard/onboardApi";
import type { RequestType } from "../../utils/spin.types";
import {
  FolderPen,
  GitPullRequest,
  MailCheck,
  MapPin,
  NotebookTabs,
  Phone,
  Pin,
  StickyNote,
} from "lucide-react";
import useBodyScroll from "../../hook/userBodyscroll";
import ViewRequestLoader from "../loader/View.request.loader";

interface DataTypes {
  isShow: boolean;
  setShow: React.Dispatch<SetStateAction<boolean>>;
  id: string;
}

function ViewRequest({ isShow, setShow, id }: DataTypes) {
  useBodyScroll(isShow);

  const { data, isLoading } = useGetOneOnboardRequestsQuery(id);
  const { create_at, name, email, note, phone, lat, lon, templete } =
    (data?.request as RequestType) || {};

  const { user } = templete || {};

  const formattedDate = (value: string) => {
    const createDate = new Date(value);
    return createDate?.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center w-full min-h-screen z-50 overflow-auto bg-white/20 backdrop-blur-xs">
      <div
        className={`relative p-10 flex flex-col w-11/12 lg:w-8/12 xl:w-7/12 2xl:w-3/12 m-auto justify-center bg-white rounded-2xl shadow-xl ${
          isShow ? "zoom-animation" : ""
        }`}
      >
        {isLoading ? (
          <ViewRequestLoader />
        ) : (
          <div className="flex flex-col gap-5 rounded-2xl">
            <h2 className="text-[#3D424B] font-medium text-xl">
              Request Details
            </h2>
            <div className="mt-2">
              <div className="flex flex-col gap-5">
                <div className="flex gap-2 items-center">
                  <span className="w-12 min-w-12 h-12 bg-green-100 text-green-600 rounded-full flex justify-center items-center">
                    <GitPullRequest />
                  </span>
                  <div>
                    <h2 className="text-[#3D424B] font-medium text-md">
                      Request Submited
                    </h2>
                    <p className="text-[#3D424B] font-normal text-sm">
                      {formattedDate(create_at)}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <span className="w-12 min-w-12 h-12 bg-yellow-100 text-yellow-600 rounded-full flex justify-center items-center">
                    <FolderPen />
                  </span>
                  <div>
                    <h2 className="text-[#3D424B] font-medium text-md">
                      Request Name
                    </h2>
                    <p className="text-[#3D424B] font-normal text-sm">{name}</p>
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <span className="w-12 min-w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex justify-center items-center">
                    <MailCheck />
                  </span>
                  <div>
                    <h2 className="text-[#3D424B] font-medium text-md">
                      Request Email
                    </h2>
                    <p className="text-[#3D424B] font-normal text-sm">
                      {email}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <span className="w-12 min-w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex justify-center items-center">
                    <Phone />
                  </span>
                  <div>
                    <h2 className="text-[#3D424B] font-medium text-md">
                      Request phone
                    </h2>
                    <p className="text-[#3D424B] font-normal text-sm">
                      {phone}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <span className="w-12 min-w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex justify-center items-center">
                    <NotebookTabs />
                  </span>
                  <div>
                    <h2 className="text-[#3D424B] font-medium text-md">
                      Request Note
                    </h2>
                    <p className="text-[#3D424B] font-normal text-sm">{note}</p>
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <span className="w-12 min-w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex justify-center items-center">
                    <StickyNote />
                  </span>
                  <div>
                    <h2 className="text-[#3D424B] font-medium text-md">
                      Request Page
                    </h2>
                    <p className="text-[#3D424B] font-normal text-sm">
                      {user?.domain}/${user?.landerName}
                    </p>
                  </div>
                </div>
                {lat && lon ? (
                  <div className="flex gap-2 items-center">
                    <span className="w-12 min-w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex justify-center items-center">
                      <Pin />
                    </span>
                    <div>
                      <h2 className="text-[#3D424B] font-medium text-md">
                        Request Map
                      </h2>

                      <button
                        onClick={() =>
                          window.open(
                            `https://www.google.com/maps?q=${lat},${lon}`,
                            "_blank",
                          )
                        }
                        className="flex gap-1 items-center cursor-pointer text-blue-400 hover:text-blue-500"
                      >
                        <MapPin size={18} />
                        <span className="text-sm font-normal ">
                          View On Map
                        </span>
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        )}
        <button
          onClick={() => setShow(false)}
          className="text-red-500 text-2xl absolute top-1 right-1 cursor-pointer"
        >
          <i className="fa-solid fa-circle-xmark"></i>
        </button>
      </div>
    </div>
  );
}

export default ViewRequest;
