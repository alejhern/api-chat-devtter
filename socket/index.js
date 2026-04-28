import { Server } from "socket.io";
import MessageController from "../controllers/message_socket.js";
import { auth } from "../firebase/index.js";
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
      const token = socket.handshake.auth.token;

      const user = await auth.verifyIdToken(token);
      socket.user = user.uid; // 👈 UID disponible en sockets

      next();
    } catch {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    createChatSocket(io, socket, messageController);
  });

  return io;
}
