import "colors";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { createServer } from "http";
import logger from "morgan";

dotenv.config();

import { auth } from "./firebase/index.js";
import { MessageModel } from "./models/message.js";
import { UserModel } from "./models/user.js";
import { createChatsRoute } from "./routes/chats.js";
import { createUsersRoute } from "./routes/users.js";
import { initSocket } from "./socket/index.js";

const app = express();
const httpServer = createServer(app);

app.use(logger("dev"));
app.use(express.json());
app.use(cors());

//middleware autenticación firebase
app.use(async (req, res, next) => {
  if (req.path.startsWith("/users") && req.method === "GET") {
    return next();
  }
  if (req.path === "/users/batch" && req.method === "POST") {
    return next();
  }
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(401).json({ error: "No token" });

    const decoded = await auth.verifyIdToken(token);

    req.user = decoded.uid; // 👈 UID disponible en todo el backend
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
});

app.use("/users", createUsersRoute({ userModel: UserModel }));
app.use("/chats", createChatsRoute({ messageModel: MessageModel }));
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

initSocket({ httpServer, messageModel: MessageModel });

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`.green);
});
