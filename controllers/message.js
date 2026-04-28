import { validateMessage } from "../schemas/message.js";

export default class MessageController {
  constructor({ messageModel }) {
    this.messageModel = messageModel;
  }

  create = async (req, res) => {
    const { content, code } = req.body;
    const user = req.user;
    const { receiver } = req.params;
    const validatedMessage = validateMessage({
      sender: user,
      receiver,
      content,
      code,
    });

    if (!validatedMessage.success) {
      return res.status(400).json({ error: "Invalid message data" });
    }

    try {
      const result = await this.messageModel.create(validatedMessage.data);

      const data = {
        ...validatedMessage.data,
        id: result.insertId,
      };

      return res.status(201).json(data);
    } catch (error) {
      console.error("Error creating message:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };

  findConversationsByUserId = async (req, res) => {
    const { userId } = req.params;
    if (userId !== req.user) {
      return res.status(403).json({ error: "Forbidden" });
    }
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
    if (userId !== req.user) {
      return res.status(403).json({ error: "Forbidden" });
    }
    try {
      const messages = await this.messageModel.chatHistory(userId, receiverId);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching chat history:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
}
