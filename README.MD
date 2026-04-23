# 💬 Devtter Chat API

A real-time chat API built with **Node.js, Express, Socket.IO, and MySQL**, supporting private conversations, code messages, and persistent chat history.

## 🚀 Features

* ⚡ Real-time messaging using Socket.IO
* 💾 Persistent message storage with MySQL
* 🔐 Private one-to-one chats (user rooms)
* 🧠 Chat history retrieval between users
* 💻 Support for sending code snippets with messages
* 📡 REST API + WebSocket hybrid architecture
* 🔄 Connection recovery support (Socket.IO)

---

## 🏗️ Tech Stack

* Node.js
* Express.js
* Socket.IO
* MySQL
* JavaScript (ES Modules)

---

## 📡 API Endpoints

### Get conversations of a user

```
GET /chats/:userId
```

### Get chat history between two users

```
GET /chats/:userId1/:userId2
```

---

## ⚡ Real-time Events

### Send message

```js
socket.emit("message", {
  sender,
  reciever,
  content,
  code?: {
    language,
    code
  }
});
```

### Receive message

```js
socket.on("message", (data) => {
  // handle incoming message
});
```

### Join chat room

```js
socket.emit("join_chat", {
  user1,
  user2
});
```

---

## 🧠 Architecture

* Each chat is isolated using **Socket.IO rooms**
* Messages are validated before being stored in the database
* UUIDs are used to identify users and ensure data integrity
* Chat history is retrieved via REST API, real-time updates via WebSocket

---

## 📦 Installation

```bash
git clone https://github.com/alejherm/devtter-chat-api
cd devtter-chat-api
npm install
npm run start
```

---

## 🔧 Environment Variables

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=chat_db
```

---

## 📌 Future Improvements

* Authentication with JWT
* Online/offline user status
* Typing indicators
* Message read receipts
* Group chats

---

## 🧑‍💻 Author

Built by Alejandro Hernández

---

If you want, I can also:
🔥 write a *perfect GitHub README with badges + screenshots section*
🔥 or make it look like a **top open-source project (Discord/WhatsApp style)**
