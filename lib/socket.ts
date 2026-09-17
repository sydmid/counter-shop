import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getSocketClient(): Socket {
  if (!socket) {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "http://localhost:3000";
    socket = io(wsUrl, {
      path: "/api/socket/io",
      addTrailingSlash: false,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
  }
  return socket;
}
