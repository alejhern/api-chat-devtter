import dotenv from "dotenv";
import mysql from "mysql2/promise";

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export class MessageModel {
  // 📤 CREATE MESSAGE
  static async create(message) {
    const { sender, receiver, content, code } = message;

    try {
      const [result] = await pool.query(
        `
        INSERT INTO messages (sender, receiver, content, code)
        VALUES (?, ?, ?, ?)
        `,
        [sender, receiver, content, code ? JSON.stringify(code) : null],
      );

      return result;
    } catch (error) {
      console.error("Error creating message:", error);
      throw error;
    }
  }

  // 📥 HISTORIAL DE CHAT (1v1)
  static async chatHistory(userId1, userId2) {
    try {
      const [rows] = await pool.query(
        `
        SELECT BIN_TO_UUID(id) as id, sender, receiver, content, code, created_at
        FROM messages
        WHERE conversation_id = CONCAT(
          LEAST(?, ?),
          '-',
          GREATEST(?, ?)
        )
        ORDER BY created_at ASC
        `,
        [userId1, userId2, userId1, userId2],
      );

      return rows.map((row) => ({
        ...row,
        code: safeParse(row.code),
      }));
    } catch (error) {
      console.error("Error fetching chat history:", error);
      throw error;
    }
  }

  // 💬 LISTA DE CONVERSACIONES (último mensaje)
  static async findConversationsByUserId(userId) {
    try {
      const [rows] = await pool.query(
        `
        SELECT BIN_TO_UUID(id) as id, sender, receiver, content, code, created_at
        FROM messages
        WHERE id IN (
          SELECT MAX(id)
          FROM messages
          WHERE sender = ? OR receiver = ?
          GROUP BY conversation_id
        )
        ORDER BY created_at DESC
        `,
        [userId, userId],
      );

      return rows.map((row) => ({
        ...row,
        code: safeParse(row.code),
      }));
    } catch (error) {
      console.error("Error fetching conversations:", error);
      throw error;
    }
  }

  // 📜 TODOS LOS MENSAJES DEL USUARIO
  static async findByUserId(userId) {
    try {
      const [rows] = await pool.query(
        `
        SELECT BIN_TO_UUID(id) as id, sender, receiver, content, code, created_at
        FROM messages
        WHERE sender = ? OR receiver = ?
        ORDER BY created_at DESC
        `,
        [userId, userId],
      );

      return rows.map((row) => ({
        ...row,
        code: safeParse(row.code),
      }));
    } catch (error) {
      console.error("Error fetching messages:", error);
      throw error;
    }
  }
}

// 🛡️ PARSE JSON SEGURO
function safeParse(value) {
  try {
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}
