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
  static async create(message) {
    const { sender, content, code, reciever } = message;
    try {
      const [result] = await pool.query(
        "INSERT INTO messages (sender, content, code, reciever) VALUES (UUID_TO_BIN(?), ?, ?, UUID_TO_BIN(?))",
        [sender, content, JSON.stringify(code), reciever],
      );
      return result.insertId;
    } catch (error) {
      console.error("Error creating message:", error);
      throw error;
    }
  }

  static async findByUserId(userId) {
    try {
      const [rows] = await pool.query(
        "SELECT id, BIN_TO_UUID(sender) AS sender, content, code, BIN_TO_UUID(reciever) AS reciever FROM messages WHERE sender = UUID_TO_BIN(?) OR reciever = UUID_TO_BIN(?) ORDER BY created_at DESC",
        [userId, userId],
      );
      return rows.map((row) => ({
        ...row,
        code: row.code ? JSON.parse(row.code) : null,
      }));
    } catch (error) {
      console.error("Error fetching messages:", error);
      throw error;
    }
  }

  static async chatHistory(userId1, userId2) {
    try {
      const [rows] = await pool.query(
        "SELECT BIN_TO_UUID(sender) AS sender, content, code, BIN_TO_UUID(reciever) AS reciever FROM messages WHERE (sender = UUID_TO_BIN(?) AND reciever = UUID_TO_BIN(?)) OR (sender = UUID_TO_BIN(?) AND reciever = UUID_TO_BIN(?)) ORDER BY created_at ASC",
        [userId1, userId2, userId2, userId1],
      );
      return rows;
    } catch (error) {
      console.error("Error fetching chat history:", error);
      throw error;
    }
  }
}
