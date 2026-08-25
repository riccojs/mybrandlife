import { useNavigate } from "react-router";
import { useEffect, useState, type SetStateAction } from "react";
import type { NotificationType } from "../../utils/notification.type";
import {
  useGetAllNotificationQuery,
  useSeenNotificationMutation,
} from "../../redux/features/notification/notificationApi";
import io from "socket.io-client";
import { Toaster, toast } from "sonner";
import NotificationSound from "../../assets/notification-sound.mp3";
import HeaderBoxLoader from "../loader/Header.box.loader";
const socket = io(import.meta.env.VITE_APP_API_URL);

interface Types {
  isNotify: boolean;
  setIsNotify: React.Dispatch<SetStateAction<boolean>>;
}

function HeaderNotification({ isNotify, setIsNotify }: Types) {
  const navigate = useNavigate();

  const { data, isLoading } = useGetAllNotificationQuery({
    page: 1,
    limit: 10,
    searchBy: "",
    seenBy: "",
    userId: "",
  });
  const [seenNotification] = useSeenNotificationMutation();
  const [notifications, setNotifications] = useState<NotificationType[]>([]);

  useEffect(() => {
    const audio = new Audio(NotificationSound);
    socket.on("newNotification", (newNotification: NotificationType) => {
      toast(`${newNotification?.title}`);
      setNotifications((prev: NotificationType[]) => [
        newNotification,
        ...prev,
      ]);
      audio.currentTime = 0;
      audio.play().catch(() => {});
    });
    return () => {
      socket.off("newNotification");
    };
  }, []);

  const apiNotifications = data?.data?.notification ?? [];

  const notificationsData = [...notifications, ...apiNotifications];

  const formattedDate = (value: string) => {
    const createDate = new Date(value);
    return createDate?.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleClick = (id: string, redirectUrl: string) => {
    navigate(redirectUrl);
    setIsNotify(false);
    const infoData = { seen: true };
    seenNotification({ id, infoData });
  };

  const handleViewAll = () => {
    navigate("/notification");
    setIsNotify(false);
  };

  // decide what to render
  let content;
  if (isLoading) {
    content = (
      <>
        <HeaderBoxLoader />
        <HeaderBoxLoader />
        <HeaderBoxLoader />
        <HeaderBoxLoader />
        <HeaderBoxLoader />
      </>
    );
  }
  if (notificationsData?.length === 0) {
    content = (
      <li>
        <p>Data not found!</p>
      </li>
    );
  }
  if (notificationsData?.length > 0) {
    content = notificationsData?.map((item: NotificationType) => {
      const { id, create_at, title, profile, seen, redirectUrl } = item || {};

      return (
        <li
          onClick={() => handleClick(id, redirectUrl)}
          key={id}
          className="flex gap-2 items-center cursor-pointer"
        >
          <div className="w-16">
            {profile ? (
              <img
                src={profile}
                alt=""
                className="w-16 h-16 min-w-16 rounded-full object-cover"
              />
            ) : (
              <p className="bg-[#2B7F75] w-16 h-16 min-w-16 flex justify-center items-center rounded-full">
                <i className="fa-regular fa-bell text-white text-2xl"></i>
              </p>
            )}
          </div>
          <div>
            <h2 className="text-normal text-md capitalize font-normal">
              {title}
            </h2>

            <div className="flex gap-3 items-center">
              <p className="text-sm text-gray-400 font-normal">
                {formattedDate(create_at)}
              </p>
              <span
                className={`${seen ? "bg-green-100 text-green-600 text-xs px-2 py-1 rounded-md font-medium" : "bg-red-100 text-red-600 text-xs px-2 py-1 rounded-md font-medium"}`}
              >
                {seen ? "Read" : "Unread"}
              </span>
            </div>
          </div>
        </li>
      );
    });
  }
  return (
    <>
      <div
        className={`absolute custom-scroll bg-white p-5 rounded-md shadow-sm border border-gray-100 md:w-96 w-[320px] top-10 -right-12.5 md:right-0 transition-all duration-200 ease-in-out transform origin-top-right ${
          isNotify
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-90 -translate-y-4 pointer-events-none"
        }`}
      >
        <h2 className="text-[#2B7F75] text-lg font-medium">
          Recent Notifications
        </h2>
        <ul className="flex flex-col gap-4 mt-5 overflow-y-auto max-h-[calc(60vh-150px)] pr-2 message-scrollbar">
          {content}
        </ul>
        <div className="mt-5 border-t border-gray-300 pt-3">
          <button
            onClick={handleViewAll}
            className="text-center text-sm w-full cursor-pointer"
          >
            View all
          </button>
        </div>
      </div>
      <Toaster position="bottom-left" richColors expand closeButton />
    </>
  );
}

export default HeaderNotification;
