import "colors";
import cors from "cors";
import express from "express";
import { createServer } from "http";
import logger from "morgan";

import { MessageModel } from "./models/message.js";
import { createChatsRoute } from "./routes/chats.js";
import { initSocket } from "./socket/index.js";

const app = express();
const httpServer = createServer(app);

app.use(logger("dev"));
app.use(express.json());
app.use(cors());

//middleware de autenticación (simulado)
app.use((req, res, next) => {
  const user = req.header("x-user-id");
  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  req.user = user;
  next();
});

app.use("/chats", createChatsRoute({ messageModel: MessageModel }));

initSocket({ httpServer, messageModel: MessageModel });

const PORT = 3000;

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`.green);
});
