import { Server } from "socket.io";
import http from "http";
import response from "../utils/response.js";
const { SOCKET_IO_ERROR_MESSAGE } = response;
let io: Server | null = null;

export function init(server: http.Server): Server {
  if (io) return io;
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });
  io.on("connection", (socket) => {
    socket.on("disconnect", () => {});
  });
  return io;
}

export function getIo(): Server {
  if (!io) {
    throw new Error(SOCKET_IO_ERROR_MESSAGE);
  }
  return io;
}
