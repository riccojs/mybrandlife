import { useEffect, type SetStateAction } from "react";
import ViewContactLoader from "../loader/View.contact.loader";
import useBodyScroll from "../../hook/userBodyscroll";
import {
  useGetOneContactQuery,
  useSeenContactMutation,
} from "../../redux/features/contact/contactApi";
import { X } from "lucide-react";

interface DataTypes {
  isShow: boolean;
  setShow: React.Dispatch<SetStateAction<boolean>>;
  id: string;
}

function ViewContact({ isShow, setShow, id }: DataTypes) {
  useBodyScroll(isShow);
  const { data, isLoading } = useGetOneContactQuery(id);
  const { firstname, email, message, subject, phone, niche, lastname, seen } =
    data?.contact || {};

  const [seenContact] = useSeenContactMutation();

  useEffect(() => {
    seenContact(id).unwrap();
  }, [id]);

  return (
    <div className="inset-0 bg-[#00000053] flex fixed left-0 justify-center items-center w-full min-h-screen z-50 overflow-auto">
      <div
        className={`relative flex flex-col w-11/12 md:w-8/12 lg:w-6/12 2xl:w-3/12 m-auto justify-center p-10 rounded-3xl shadow-sm bg-[#ffffff] border border-gray-300 ${
          isShow ? "zoom-animation" : ""
        }`}
      >
        {isLoading ? (
          <ViewContactLoader />
        ) : (
          <div className="flex flex-col gap-5 rounded-2xl">
            <h2 className="text-[#3D424B] font-medium text-2xl">
              Brandbook Booking
            </h2>
            <div className="w-full flex flex-col gap-5">
              <div>
                <h2 className="text-[#3D424B] font-medium text-lg">
                  First Name
                </h2>
                <p className="text-[#3D424B] font-normal text-md">
                  {firstname}
                </p>
              </div>
              <div>
                <h2 className="text-[#3D424B] font-medium text-lg">
                  Last Name
                </h2>
                <p className="text-[#3D424B] font-normal text-md">{lastname}</p>
              </div>
              <div>
                <h2 className="text-[#3D424B] font-medium text-lg">Email</h2>
                <p className="text-[#3D424B] font-normal text-md">{email}</p>
              </div>
              <div>
                <h2 className="text-[#3D424B] font-medium text-lg">Niche</h2>
                <p className="text-[#3D424B] font-normal text-md">{niche}</p>
              </div>
              <div>
                <h2 className="text-[#3D424B] font-medium text-lg">Subject</h2>
                <p className="text-[#3D424B] font-normal text-md">{subject}</p>
              </div>
              <div>
                <h2 className="text-[#3D424B] font-medium text-lg">Message</h2>
                <p className="text-[#3D424B] font-normal text-md">{message}</p>
              </div>
              <div>
                <h2 className="text-[#3D424B] font-medium text-lg">Status</h2>
                <p
                  className={`${seen ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"} px-4 py-1 rounded-lg text-sm w-fit`}
                >
                  {seen ? "SEEN" : "UNSEEN"}
                </p>
              </div>
              <div>
                <h2 className="text-[#3D424B] font-medium text-lg">Phone</h2>
                <p className="text-[#3D424B] font-normal text-md">{phone}</p>
              </div>
            </div>
          </div>
        )}
        <button
          onClick={() => setShow(false)}
          className="absolute top-2 right-2 border border-[#E7EBF2] text-[#8C98AE] bg-[#f0f3f8] hover:bg-[#E7EBF2] w-10 h-10 flex justify-center items-center rounded-full cursor-pointer"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
}

export default ViewContact;
