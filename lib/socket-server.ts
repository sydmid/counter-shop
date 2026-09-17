import { Server as NetServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { NextApiResponse } from "next";

export type NextApiResponseServerIO = NextApiResponse & {
  socket: any & {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
};

export const initSocketServer = (server: NetServer) => {
  const io = new SocketIOServer(server, {
    path: "/api/socket/io",
    addTrailingSlash: false,
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    // Join trading room
    socket.on("join-room", (room: string) => {
      socket.join(room);
    });

    // Send chat message
    socket.on("send-message", (data: { room: string; user: string; text: string; time: string }) => {
      io.to(data.room).emit("new-message", data);
    });

    // Broadcast live trade events
    socket.on("trade-event", (event: any) => {
      io.emit("live-trade-activity", event);
    });
  });

  return io;
};
