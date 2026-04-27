import "colors";
import cors from "cors";
import express from "express";
import { createServer } from "http";
import logger from "morgan";
import { Server } from "socket.io";
import MessageController from "../controllers/message_socket.js";
import { MessageModel } from "../models/message.js";
import { createChatsRoute } from "../routes/chats.js";

const messageController = new MessageController({
  messageModel: MessageModel,
});

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000,
  },
});

app.use(logger("dev"));
app.use(express.json());
app.use(cors());

/* -------------------- ROUTES -------------------- */

app.use("/chats", createChatsRoute({ messageModel: MessageModel }));

/* -------------------- SOCKET -------------------- */

// 🔥 helper para rooms
function getRoomId(user1, user2) {
  return [user1, user2].sort().join("_");
}

io.on("connection", (socket) => {
  console.log("A user connected");
  const user = socket.handshake.auth.userId;
  socket.join(user); // Unirse a una sala individual para notificaciones

  // get chats
  socket.on("get_chats", async () => {
    try {
      const conversations =
        await messageController.findConversationsByUserId(user);
      socket.emit("chats_list", conversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      socket.emit("error", "Error fetching conversations");
    }
  });

  // 🔥 unirse a un chat
  socket.on("join_chat", (receiver) => {
    const room = getRoomId(user, receiver);
    socket.join(room);
  });

  socket.on("leave_chat", (receiver) => {
    const room = getRoomId(user, receiver);
    socket.leave(room);
  });

  socket.on("message", async (data, receiver, serverOffset) => {
    data.sender = socket.handshake.auth.userId;
    data.receiver = receiver;

    try {
      await messageController.createMessage(data);

      const room = getRoomId(data.sender, data.receiver);

      io.to(room).emit("message", data, serverOffset);

      // 👇 Usar data en lugar de message
      io.to(data.sender).emit("new_message_notification", {
        senderId: data.sender,
      });
      io.to(data.receiver).emit("new_message_notification", {
        senderId: data.sender,
      });
    } catch (error) {
      console.error("Error handling message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

/* -------------------- SERVER -------------------- */

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`.green);
});
