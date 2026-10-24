import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Bell,
  Check,
  CircleHelp,
  Settings,
  Sparkles,
  UserRoundX,
  X,
} from "lucide-react";
import type { NotificationType } from "../../utils/notification.type";
import io from "socket.io-client";
import NotificationSound from "../../assets/notification-sound.mp3";
import toast from "react-hot-toast";
import {
  useGetAllNotificationQuery,
  useSeenNotificationMutation,
} from "../../redux/features/notification/notificationApi";
import HeaderBoxLoader from "../loader/Header.box.loader";
import { useNavigate } from "react-router";

const socket = io(import.meta.env.VITE_APP_API_URL);

export default function HeaderNotification() {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const navigate = useNavigate();
  const notifyRef = useRef<HTMLDivElement | null>(null);
  const { data, isLoading } = useGetAllNotificationQuery({
    page: 1,
    limit: 10,
    searchBy: "",
    seenBy: "",
    userId: "",
  });

  const [seenNotification] = useSeenNotificationMutation();

  const handleClick = (id: string, redirectUrl: string) => {
    navigate(redirectUrl);
    setIsOpen(false);
    const infoData = { seen: true };
    seenNotification({ id, infoData });
  };

  const handleViewAll = () => {
    navigate("/notification");
    setIsOpen(false);
  };

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
  const visibleNotifications =
    filter === "unread"
      ? notificationsData.filter((item) => !item.seen)
      : notificationsData;
  const unreadCount = notificationsData.filter((item) => !item.seen).length;

  const formattedDate = (value: string) => {
    const createDate = new Date(value);
    return createDate?.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notifyRef.current &&
        !notifyRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
  if (!isLoading && visibleNotifications?.length === 0) {
    content = (
      <div className="px-5 py-10 text-center">
        <Bell className="mx-auto mb-3 h-8 w-8 text-slate-300" />
        <p className="text-sm font-semibold text-slate-700">All caught up!</p>
        <p className="mt-1 text-xs text-slate-400">
          You have no unread notifications.
        </p>
      </div>
    );
  }

  if (!isLoading && visibleNotifications?.length > 0) {
    content = visibleNotifications?.map((item: NotificationType) => {
      const { title, seen, create_at, profile, id, type, redirectUrl } =
        item || {};

      return (
        <button
          type="button"
          key={id}
          onClick={() => handleClick(id, redirectUrl)}
          className={`group cursor-pointer relative flex w-full items-start gap-3.5 p-4 text-left transition-colors duration-150 sm:px-5 ${
            !seen
              ? "border-l-4 border-l-emerald-600 bg-linear-to-r from-emerald-50/60 via-emerald-50/30 to-white hover:bg-emerald-50/50"
              : "hover:bg-slate-50/80"
          }`}
        >
          <div className="relative mt-0.5 shrink-0">
            {profile ? (
              <img
                src={profile}
                alt=""
                className="h-10 w-10 rounded-xl object-cover shadow-sm ring-2 ring-slate-100"
              />
            ) : (
              <div
                className={`flex uppercase h-10 w-10 items-center justify-center rounded-xl text-white shadow-sm transition-colors ${
                  seen
                    ? "bg-emerald-700/90 shadow-emerald-700/20 group-hover:bg-emerald-700"
                    : "bg-emerald-700 shadow-md shadow-emerald-700/25 group-hover:scale-105"
                }`}
              >
                {title?.slice(0, 1)}
              </div>
            )}

            <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-white ring-2 ring-white">
              <Check className="h-2.5 w-2.5 stroke-3" />
            </span>

            {profile && (
              <span
                className={`absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-white ring-2 ring-white ${
                  seen ? "bg-slate-700" : "bg-emerald-600"
                }`}
              >
                <UserRoundX className="h-2.5 w-2.5" />
              </span>
            )}

            {!seen && (
              <span className="mbl-pulse-indicator absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full bg-rose-500 ring-2 ring-white" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <p
                className={`mbl-line-clamp-2 text-sm leading-snug transition-colors ${
                  seen
                    ? "font-semibold text-slate-800 group-hover:text-emerald-800"
                    : "font-bold text-slate-900 group-hover:text-emerald-900"
                }`}
              >
                {title}
              </p>
              <span
                className={`inline-flex shrink-0 items-center rounded-md border px-2 py-0.5 text-[11px] ${
                  seen
                    ? "border-slate-200/60 bg-slate-100 font-semibold text-slate-600"
                    : "gap-1 border-rose-200/80 bg-rose-50 px-2.5 font-bold text-rose-700 shadow-sm"
                }`}
              >
                {!seen && (
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                )}
                {seen ? "Read" : "Unread"}
              </span>
            </div>

            <div className="mt-1.5 flex items-center gap-2 text-xs font-medium">
              <Sparkles className="h-3.5 w-3.5 text-emerald-700" />
              <time
                className={seen ? "text-slate-400" : "text-slate-500"}
                dateTime={create_at}
              >
                {formattedDate(create_at)}
              </time>
              <span className="text-slate-300">•</span>
              <span
                className={
                  type === "MODAL"
                    ? "font-medium text-amber-600"
                    : !seen
                      ? "font-semibold text-emerald-700"
                      : "text-slate-400"
                }
              >
                {type === "MODAL" ? "MODAL" : "ROUTE"}
              </span>
            </div>
          </div>
        </button>
      );
    });
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        aria-label="Documentation"
        onClick={() => {
          navigate("/ordered-wristband");
        }}
        title="Documentation"
        className="hidden h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 sm:inline-flex"
      >
        <CircleHelp className="h-5 w-5" />
      </button>

      <div className="relative" ref={notifyRef}>
        <button
          type="button"
          id="notification-bell-btn"
          aria-label="Toggle notifications"
          aria-expanded={isOpen}
          aria-haspopup="true"
          onClick={() => setIsOpen((open) => !open)}
          className={`relative flex h-9 w-9 bg-slate-100 items-center cursor-pointer justify-center rounded-xl transition-all duration-200 ${
            isOpen
              ? "bg-emerald-50 text-emerald-700 shadow-sm ring-2 ring-emerald-500/30"
              : "text-slate-500 hover:bg-slate-200"
          }`}
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
              {unreadCount}
            </span>
          )}
        </button>

        <div
          className={`absolute -right-14 md:-right-10 top-[calc(100%+14px)] z-50 w-[min(440px,calc(100vw-2rem))] transition-all duration-200 ease-in-out transform origin-top-right ${
            isOpen
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-90 -translate-y-4 pointer-events-none"
          }`}
        >
          <div className="mbl-popover-arrow absolute -top-2 right-16 h-4 w-4 rotate-45 border-l border-t border-slate-200/90 bg-white sm:right-12" />

          <section
            id="notifications-popover"
            aria-label="Recent notifications"
            className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_20px_45px_-12px_rgba(15,23,42,0.18),0_0_0_1px_rgba(15,23,42,0.06)] backdrop-blur-xl"
          >
            <div className="border-b border-slate-100 bg-linear-to-b from-slate-50/70 to-white p-4 sm:p-5">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="text-md md:text-lg font-bold tracking-tight text-emerald-900">
                    Recent Notifications
                  </h2>
                  <span className="inline-flex items-center justify-center rounded-full border border-emerald-200/60 bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                    {notificationsData.length} Total
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    title="Notification Settings"
                    onClick={() => {
                      navigate("/notification");
                    }}
                    aria-label="Notification Settings"
                    className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                  >
                    <Settings className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    title="Close notifications"
                    aria-label="Close notifications"
                    className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 pt-1">
                <div className="inline-flex rounded-lg bg-slate-100 p-0.5 text-xs font-medium text-slate-600">
                  <button
                    type="button"
                    onClick={() => setFilter("all")}
                    className={`rounded-md px-2.5 py-1 transition-all ${
                      filter === "all"
                        ? "bg-white font-semibold text-slate-900 shadow-sm"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    All ({notificationsData.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilter("unread")}
                    className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 transition-colors ${
                      filter === "unread"
                        ? "bg-white font-semibold text-slate-900 shadow-sm"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    <span>Unread</span>
                    {unreadCount > 0 && (
                      <>
                        <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                        <span>({unreadCount})</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="mbl-custom-scrollbar max-h-120 divide-y divide-slate-100/90 overflow-y-auto">
              {content}
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/90 p-3.5 sm:px-5">
              <button
                type="button"
                onClick={handleViewAll}
                className="group cursor-pointer inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200/90 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm transition-all duration-200 hover:bg-emerald-50/60 hover:text-emerald-800"
              >
                <span>View all notifications</span>
                <ArrowRight className="h-4 w-4 text-slate-400 transition-all group-hover:translate-x-0.5 group-hover:text-emerald-700" />
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
