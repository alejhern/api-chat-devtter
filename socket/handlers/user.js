const userSockets = new Map();

export function createUserSocket(io, socket, userController) {
  const userId = socket.user;

  const sockets = userSockets.get(userId) || new Set();

  sockets.add(socket.id);

  userSockets.set(userId, sockets);

  // LOGIN SOLO PRIMER SOCKET
  if (sockets.size === 1) {
    userController.login(userId).catch(console.error);

    socket.broadcast.emit("user_status_changed", {
      userId,
      online: true,
    });
  }

  socket.on("user:get_status", (targetUserId, callback) => {
    callback(userSockets.has(targetUserId));
  });

  socket.on("disconnect", async () => {
    const sockets = userSockets.get(userId);

    if (!sockets) return;

    sockets.delete(socket.id);

    // LOGOUT SOLO SI NO QUEDAN SOCKETS
    if (sockets.size === 0) {
      userSockets.delete(userId);

      await userController.logout(userId);

      socket.broadcast.emit("user_status_changed", {
        userId,
        online: false,
      });
    }
  });
}
