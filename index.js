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

app.use("/chats", createChatsRoute({ messageModel: MessageModel }));

initSocket({ httpServer, messageModel: MessageModel });

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`.green);
});
