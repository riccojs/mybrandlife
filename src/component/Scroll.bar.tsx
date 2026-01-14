import { useParams } from "react-router";
import { useGetAllEchoQuery } from "../redux/features/echo/echoApi";
import EchoLoader from "./Echo.loader";
import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io(import.meta.env.VITE_APP_API_URL);

interface EchoType {
  id: string;
  name: string;
  status: string;
  shoutOut: string;
  message: string;
  city: string;
  tip: number;
  create_at: string;
  user?: {
    landerName: string;
  };
}

function ScrollBar() {
  const params = useParams<{ name: string }>();
  const landerName = params.name;
  const { data, isLoading, isFetching } = useGetAllEchoQuery(landerName);
  const [echos, setEchos] = useState<EchoType[]>(data?.echo || []);

  useEffect(() => {
    if (data?.echo) {
      const sorted = [...data.echo].sort(
        (a, b) =>
          new Date(b.create_at).getTime() - new Date(a.create_at).getTime()
      );
      setEchos(sorted);
    }
  }, [data]);

  useEffect(() => {
    socket.on("newEcho", (newEcho: EchoType) => {
      if (newEcho.user?.landerName === landerName) {
        setEchos((prev: EchoType[]) => [newEcho, ...prev]);
      }
    });
    socket.on("CancelEcho", (cancelEcho: EchoType) => {
      setEchos((prev: EchoType[]) =>
        prev.filter((echo) => echo.id !== cancelEcho.id)
      );
    });
    socket.on("rejectEcho", (rejectEcho: EchoType) => {
      setEchos((prev: EchoType[]) =>
        prev.filter((echo) => echo.id !== rejectEcho.id)
      );
    });
    return () => {
      socket.off("newEcho");
    };
  }, [landerName]);

  // decide what to render
  let content;
  if (isLoading || isFetching) {
    content = Array.from({ length: 24 }).map((_, idx) => (
      <EchoLoader key={idx} />
    ));
  } else if (!echos?.length) {
    content = (
      <tr>
        <td colSpan={6} className="text-white text-center">
          Data Not Found
        </td>
      </tr>
    );
  } else {
    const sortedEchos = [...echos].sort((a, b) => {
      if (a.tip >= 20 && b.tip < 20) return -1;
      if (a.tip < 20 && b.tip >= 20) return 1;
      if (a.tip >= 10 && b.tip < 10) return -1;
      if (a.tip < 10 && b.tip >= 10) return 1;
      return new Date(b.create_at).getTime() - new Date(a.create_at).getTime();
    });
    const formattedDate = (value: string) => {
      const createDate = new Date(value);
      return createDate?.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    };
    content = sortedEchos.map((item) => {
      const { id, name, message, tip, status, create_at, shoutOut, city } =
        item;
      const tipColor =
        tip === 0 || (tip >= 1 && tip <= 5)
          ? "text-red-500"
          : tip >= 6 && tip <= 19
          ? "text-yellow-500"
          : "text-green-500";

      return (
        <tr key={id} className={tipColor}>
          <td>{name}</td>
          <td>{shoutOut}</td>
          <td>{message}</td>
          <td>{city}</td>
          <td>${tip}</td>
          <td>{status}</td>
          <td>{formattedDate(create_at)}</td>
        </tr>
      );
    });
  }

  return (
    <div className="w-full xl:w-9/12 2xl:w-10/12 h-full">
      <div className="h-full overflow-auto">
        <table className="my-table table-auto w-full min-w-[1200px] border-collapse">
          <thead className="sticky top-0 z-20 bg-black border-b border-gray-500">
            <tr className="text-white font-normal">
              <th>Name</th>
              <th>Shoutout</th>
              <th>Comment</th>
              <th>CIty</th>
              <th>Tip</th>
              <th>Status</th>
              <th>Request Send</th>
            </tr>
          </thead>
          <tbody>{content}</tbody>
        </table>
      </div>
    </div>
  );
}

export default ScrollBar;
