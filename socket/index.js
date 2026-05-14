import { Server } from "socket.io";
import MessageController from "../controllers/message_socket.js";
import UserController from "../controllers/user_socket.js";
import { auth } from "../firebase/index.js";
import { createChatSocket } from "./handlers/chat.js";

export function initSocket({ httpServer, messageModel, userModel }) {
  const messageController = new MessageController({ messageModel });
  const userController = new UserController({ userModel });
  const userSockets = new Map();

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
    const userId = socket.user;

    const sockets = userSockets.get(userId) || new Set();
    sockets.add(socket.id);

    userSockets.set(userId, sockets);

    userController.login(userId).catch(console.error);

    createChatSocket(io, socket, messageController);

    socket.on("disconnect", async () => {
      const userId = socket.user;

      const sockets = userSockets.get(userId);

      if (!sockets) return;

      sockets.delete(socket.id);

      if (sockets.size === 0) {
        await userController.logout(userId);
        userSockets.delete(userId);
      }
    });
  });

  return io;
}
