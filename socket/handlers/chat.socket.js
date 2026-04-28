function getRoomId(user1, user2) {
  return [user1, user2].sort().join("_");
}

export function createChatSocket(io, socket, messageController) {
  console.log("A user connected");

  const user = socket.user;

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
    const messageData = {
      ...data,
      sender: user,
      receiver,
    };

    try {
      const result = await messageController.create(messageData);

      const room = getRoomId(result.sender, result.receiver);

      // mensaje en chat
      io.to(room).emit("message", result, serverOffset);

      // notificaciones
      io.to(result.sender).emit("new_message_notification", {
        senderId: result.sender,
      });

      io.to(result.receiver).emit("new_message_notification", {
        senderId: result.sender,
      });
    } catch (error) {
      console.error("Error handling message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
}
