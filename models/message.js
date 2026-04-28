import mysql from "mysql2/promise";
import { randomUUID } from "node:crypto";

const pool = mysql.createPool({
  host: "localhost",
  user: "demo",
  password: "demo",
  database: "demos",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export class MessageModel {
  // 📤 CREATE MESSAGE
  static async create(message) {
    const { sender, receiver, content, code } = message;
    const id = randomUUID();

    try {
      const [result] = await pool.query(
        `
        INSERT INTO api_chat (id, sender, receiver, content, code)
        VALUES (UUID_TO_BIN (?), ?, ?, ?, ?)
        `,
        [id, sender, receiver, content, code ? JSON.stringify(code) : null],
      );

      result.insertId = id; // Agregar el ID generado al resultado

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
        FROM api_chat
        WHERE conversation_id = CONCAT(
          LEAST(?, ?),
          '-',
          GREATEST(?, ?)
        )
        ORDER BY created_at ASC
        `,
        [userId1, userId2, userId1, userId2],
      );

      return rows;
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
        FROM api_chat
        WHERE id IN (
          SELECT MAX(id)
          FROM api_chat
          WHERE sender = ? OR receiver = ?
          GROUP BY conversation_id
        )
        ORDER BY created_at DESC
        `,
        [userId, userId],
      );

      return rows;
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
        FROM api_chat
        WHERE sender = ? OR receiver = ?
        ORDER BY created_at DESC
        `,
        [userId, userId],
      );

      return rows;
    } catch (error) {
      console.error("Error fetching messages:", error);
      throw error;
    }
  }
}
