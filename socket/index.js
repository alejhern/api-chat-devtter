import { Server } from "socket.io";
import MessageController from "../controllers/message_socket.js";
import UserController from "../controllers/user_socket.js";
import { auth } from "../firebase/index.js";
import { createChatSocket } from "./handlers/chat.js";
import { createUserSocket } from "./handlers/user.js";

export function initSocket({ httpServer, messageModel, userModel }) {
  const messageController = new MessageController({ messageModel });
  const userController = new UserController({ userModel });

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
    createUserSocket(io, socket, userController);
    createChatSocket(io, socket, messageController);
  });

  return io;
}
