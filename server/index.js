import "colors";
import cors from "cors";
import express from "express";
import { createServer } from "http";
import logger from "morgan";
import { Server } from "socket.io";
import { MessageController } from "../controlers/message.js";
import { MessageModel } from "../models/message.js";

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

// ⚠️ IMPORTANTE: ruta más específica primero
app.get("/chats/:userId1/:userId2", async (req, res) => {
  const { userId1, userId2 } = req.params;
  try {
    const messages = await messageController.getChatHistory(userId1, userId2);
    res.json(messages);
  } catch (error) {
    console.error("Error fetching chat history:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/chats/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const conversations =
      await messageController.getConversationsByUserId(userId);
    res.json(conversations);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/* -------------------- SOCKET -------------------- */

// 🔥 helper para rooms
function getRoomId(user1, user2) {
  return [user1, user2].sort().join("_");
}

io.on("connection", (socket) => {
  console.log("A user connected");

  const user = socket.handshake.auth.userId;

  // 🔥 unirse a un chat
  socket.on("join_chat", ({ user1, user2 }) => {
    const room = getRoomId(user1, user2);
    socket.join(room);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });

  socket.on("message", async (data, serverOffset) => {
    try {
      data.sender = user;
      const reciever = socket.handshake.auth.reciever;
      data.reciever = reciever;

      // ✅ guardar mensaje
      await messageController.createMessage(data);
      data.created_at = new Date(); // Agregar fecha de creación al mensaje

      // 🔥 emitir SOLO a ese chat
      const room = getRoomId(data.sender, data.reciever);

      io.to(room).emit("message", data, serverOffset);
    } catch (error) {
      console.error("Error handling message:", error);
    }
  });
});

/* -------------------- SERVER -------------------- */

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`.green);
});
