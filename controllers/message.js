import { validateMessage } from "../schemas/message.js";

export default class MessageController {
  constructor({ messageModel }) {
    this.messageModel = messageModel;
  }

  create = async (req, res) => {
    const { sender, content, code, receiver } = req.body;
    const validatedMessage = await validateMessage({
      sender,
      content,
      code,
      receiver,
    });
    if (!validatedMessage.success) {
      return res.status(400).json({ error: "Invalid message data" });
    }
    try {
      const message = await this.messageModel.create(validatedMessage);
      res.status(201).json(message);
    } catch (error) {
      console.error("Error creating message:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  findConversationsByUserId = async (req, res) => {
    const { userId } = req.params;
    try {
      const conversations =
        await this.messageModel.findConversationsByUserId(userId);
      res.json(conversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  getChatHistory = async (req, res) => {
    const { userId, receiverId } = req.params;
    try {
      const messages = await this.messageModel.chatHistory(userId, receiverId);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching chat history:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
}
