import { Server } from "socket.io";
import MessageController from "../controllers/message_socket.js";
import { createChatSocket } from "./handlers/chat.socket.js";

export function initSocket({ httpServer, messageModel }) {
  const messageController = new MessageController({ messageModel });

  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
    connectionStateRecovery: {
      maxDisconnectionDuration: 2 * 60 * 1000,
    },
  });

  io.on("connection", (socket) => {
    createChatSocket(io, socket, messageController);
  });

  return io;
}
