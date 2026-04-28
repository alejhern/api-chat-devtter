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

  io.use(async (socket, next) => {
    try {
      const user = socket.handshake.auth.user;
      if (!user) {
        return next(new Error("Unauthorized"));
      }
      socket.user = user;
      next();
    } catch (error) {
      console.error("Socket authentication error:", error);
      next(new Error("Internal server error"));
    }
  });

  io.on("connection", (socket) => {
    createChatSocket(io, socket, messageController);
  });

  return io;
}
