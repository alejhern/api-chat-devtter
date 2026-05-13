import { randomUUID } from "node:crypto";
import { pool } from "./db/mysql/conection.js";

export class MessageModel {
  // 📤 CREATE MESSAGE
  static async create(message) {
    const { sender, receiver, content, code } = message;
    const id = randomUUID();

    try {
      const [result] = await pool.query(
        `
        INSERT INTO messages (id, sender, receiver, content, code)
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
      SELECT 
        m1.id,
        m1.sender,
        m1.receiver,
        m1.content,
        m1.code,
        m1.created_at,

        u.id AS receiver_id,
        u.name,
        u.avatar

      FROM messages m1

      INNER JOIN (
        SELECT conversation_id, MAX(created_at) as last_date
        FROM messages
        WHERE sender = ? OR receiver = ?
        GROUP BY conversation_id
      ) m2
        ON m1.conversation_id = m2.conversation_id
        AND m1.created_at = m2.last_date

      INNER JOIN users u
        ON u.id = CASE 
          WHEN m1.sender = ? THEN m1.receiver
          ELSE m1.sender
        END

      WHERE m1.sender = ? OR m1.receiver = ?
      ORDER BY m1.created_at DESC
      `,
        [userId, userId, userId, userId, userId],
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
        FROM messages
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
