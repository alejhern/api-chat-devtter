import { validateMessage } from "../schemas/message.js";

export class MessageController {
  constructor({ messageModel }) {
    this.messageModel = messageModel;
  }

  createMessage = async ({ sender, content, code, receiver }) => {
    const validatedMessage = validateMessage({
      sender,
      content,
      code,
      receiver,
    });
    const message = await this.messageModel.create(validatedMessage);

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
