import { FaGoogle } from "react-icons/fa";
import { useAuth } from "../../hook/useAuth";

function ConnectGoogle() {
  const { user } = useAuth();

  const handleConnect = () => {
    const userId = user?.id;
    const url = `${import.meta.env.VITE_APP_API_URL}/api/brandbook/google?userId=${userId}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="relative inline-flex group">
      <button
        onClick={handleConnect}
        disabled={user?.calendarId ? true : false}
        className={`cursor-pointer min-w-12 w-12 h-12 p-3 py-3 rounded-lg flex gap-2 items-center justify-center ${
          user?.calendarId ? "bg-gray-200" : "bg-[#cbf38b]"
        }`}
      >
        <FaGoogle size={20} />
      </button>
      <div
        role="tooltip"
        className="absolute top-14 left-1/2 -translate-x-1/2 w-54 max-w-[calc(100vw-32px)] opacity-0 invisible -translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 ease-out"
      >
        <div className="relative bg-white border border-gray-200 rounded-lg p-3 text-sm leading-5 text-black shadow-lg text-center">
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-white border-l border-t border-gray-300 rotate-45" />
          <span className="relative z-10">Connect Google Calendar</span>
        </div>
      </div>
    </div>
  );
}

export default ConnectGoogle;
