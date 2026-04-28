import "colors";
import cors from "cors";
import express from "express";
import { createServer } from "http";
import logger from "morgan";

import { auth } from "./firebase/index.js";
import { MessageModel } from "./models/message.js";
import { createChatsRoute } from "./routes/chats.js";
import { initSocket } from "./socket/index.js";

const app = express();
const httpServer = createServer(app);

app.use(logger("dev"));
app.use(express.json());
app.use(cors());

//middleware autenticación firebase
app.use(async (req, res, next) => {
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

app.use("/chats", createChatsRoute({ messageModel: MessageModel }));

initSocket({ httpServer, messageModel: MessageModel });

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`.green);
});
