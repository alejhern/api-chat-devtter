# 💬 Devtter Chat API (Demo)

🚀 **Devtter Chat API** es una aplicación de chat en tiempo real construida con **Node.js**, **Express**, **Socket.IO** y **MySQL**.
Permite mensajería privada, envío de código y almacenamiento persistente de conversaciones.

## 🌐 Demo

### 💻 Frontend (modo desarrollo)

```bash
npm run ui
```

👉 Abre en tu navegador:

```text
http://localhost:8080
```

### ⚙️ Backend API

```bash
npm run start
```

## ✨ Características

- ⚡ Mensajería en tiempo real con Socket.IO
- 💬 Chats privados 1 a 1
- 💾 Persistencia de mensajes en MySQL
- 🧠 Recuperación de historial de chat
- 💻 Soporte para snippets de código (lenguaje + bloque)
- 🔄 Reconexión automática de sockets
- 🧩 Arquitectura híbrida REST + WebSocket

## 🧱 Stack Tecnológico

- Node.js
- Express.js
- Socket.IO
- MySQL
- Frontend en Vanilla JS

## 📡 API REST

### Obtener chats de un usuario

```http
GET /chats/:userId
```

### Obtener chat entre dos usuarios

```http
GET /chats/:userId1/:userId2
```

## ⚡ Eventos Socket.IO

### Unirse a un chat

```js
socket.emit("join_chat", receiver);
```

### Enviar mensaje

```js
socket.emit(
  "message",
  {
    content: "Hola!",
    code: {
      language: "javascript",
      content: "console.log('hello')",
    },
  },
  receiver
);
```

### Recibir mensaje

```js
socket.on("message", (data) => {
  console.log("Nuevo mensaje:", data);
});
```

## 🧠 Arquitectura del sistema

- Cada conversación se gestiona mediante rooms de Socket.IO
- Los mensajes se almacenan en MySQL
- Identificadores únicos (UUID) para usuarios y mensajes
- REST API para sincronización inicial
- WebSockets para comunicación en tiempo real

## 📦 Instalación

```bash
git clone https://github.com/alejherm/devtter-chat-api
cd devtter-chat-api
npm install
npm run dev
```

## 🔧 Scripts disponibles

```json
{
  "start": "node index.js",
  "dev": "nodemon index.js",
  "ui": "npx servor chat"
}
```

## 🌍 Variables de entorno

```env
PORT=3000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=chat_db
```

## 🚀 Roadmap

- 🔐 Autenticación con JWT
- 🟢 Estado online/offline de usuarios
- ✍️ Indicador de escritura (typing…)
- 👁️ Confirmaciones de lectura
- 👥 Chats grupales
- 📱 UI totalmente responsive

## 👨‍💻 Autor

Hecho con 💙 por Alejandro Hernández.

## ⭐ Contribución

Si te gusta este proyecto:

- ⭐ Dale una estrella en GitHub
- 🍴 Haz un fork
- 🐛 Reporta bugs o abre PRs