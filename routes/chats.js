import { Router } from "express";
import MessageController from "../controllers/message.js";

export const createChatsRoute = ({ messageModel }) => {
  const router = Router();
  const messageController = new MessageController({ messageModel });

  router.get("/:userId/:receiverId", messageController.getChatHistory);
  router.get("/:userId", messageController.findConversationsByUserId);
  router.post("/:receiver", messageController.create);

  return router;
};
