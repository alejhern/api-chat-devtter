function getRoomId(user1, user2) {
  return [user1, user2].sort().join("_");
}

export function createChatSocket(io, socket, messageController) {
  console.log("A user connected");

  const user = socket.handshake.auth.userId;

  socket.join(user);

  socket.on("get_chats", async () => {
    try {
      const conversations =
        await messageController.findConversationsByUserId(user);

      socket.emit("chats_list", conversations);
    } catch (error) {
      console.error(error);
      socket.emit("error", "Error fetching conversations");
    }
  });

  socket.on("join_chat", (receiver) => {
    socket.join(getRoomId(user, receiver));
  });

  socket.on("leave_chat", (receiver) => {
    socket.leave(getRoomId(user, receiver));
  });

  socket.on("message", async (data, receiver, serverOffset) => {
    data.sender = user;
    data.receiver = receiver;

    try {
      await messageController.createMessage(data);

      const room = getRoomId(data.sender, data.receiver);

      io.to(room).emit("message", data, serverOffset);

      io.to(data.sender).emit("new_message_notification", {
        senderId: data.sender,
      });

      io.to(data.receiver).emit("new_message_notification", {
        senderId: data.sender,
      });
    } catch (error) {
      console.error("Error handling message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
}
