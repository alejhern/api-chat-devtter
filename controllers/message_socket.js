import { validateMessage } from "../schemas/message.js";

export default class MessageControllerSocket {
  constructor({ messageModel }) {
    this.messageModel = messageModel;
  }

  create = async ({ sender, content, code, receiver }) => {
    const result = validateMessage({
      sender,
      content,
      code,
      receiver,
    });

    if (!result.success) {
      console.error("Invalid message data:", result.error.format());
      throw new Error("Invalid message data");
    }

    const create = await this.messageModel.create(result.data);

    const message = {
      ...result.data,
      id: create.insertId,
    };

    return message;
  };

  findConversationsByUserId = async (userId) => {
    const conversations =
      await this.messageModel.findConversationsByUserId(userId);
    return conversations;
  };

  getChatHistory = async (userId1, userId2) => {
    const messages = await this.messageModel.chatHistory(userId1, userId2);
    return messages;
  };
}
