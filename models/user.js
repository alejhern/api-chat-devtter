import { pool } from "./db/mysql/conection.js";

export class UserModel {
  // 🆕 CREAR USUARIO
  static async create(user) {
    const { id, userName, name, email, avatar } = user;

    try {
      const [result] = await pool.query(
        `
        INSERT INTO users (id, userName, name, email, avatar, last_logout, is_online)
        VALUES (?, ?, ?, ?, ?, NULL, TRUE)
        ON DUPLICATE KEY UPDATE
          userName = VALUES(userName),
          name = VALUES(name),
          email = VALUES(email),
          avatar = VALUES(avatar),
          last_logout = NULL,
          is_online = TRUE
        `,
        [id, userName, name, email, avatar],
      );

      return result;
    } catch (error) {
      console.error("Error creating/updating user:", error);
      throw error;
    }
  }

  // 🔍 OBTENER USUARIO POR ID
  static async findById(id) {
    try {
      const [rows] = await pool.query(
        `
        SELECT *
        FROM users
        WHERE id = ?
        `,
        [id],
      );

      return rows[0] || null;
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      throw error;
    }
  }

  static async findByIds(ids) {
    try {
      const [rows] = await pool.query(
        `
        SELECT id, userName, name, email, avatar
        FROM users
        WHERE id IN (?)
        `,
        [ids],
      );

      return rows;
    } catch (error) {
      console.error("Error fetching users by IDs:", error);
      throw error;
    }
  }

  // 🔍 OBTENER USUARIOS POR USENAME
  static async findByUserName(name) {
    try {
      const [rows] = await pool.query(
        `
        SELECT id, userName, name, email, avatar
        FROM users
        WHERE userName LIKE ?
        `,
        [`%${name}%`],
      );

      return rows;
    } catch (error) {
      console.error("Error fetching users by username:", error);
      throw error;
    }
  }

  // login
  static async login(userId) {
    try {
      const [result] = await pool.query(
        `
        UPDATE users
        SET last_logout = NULL, is_online = TRUE
        WHERE id = ?
        `,
        [userId],
      );

      return result;
    } catch (error) {
      console.error("Error logging in user:", error);
      throw error;
    }
  }

  // logout
  static async logout(userId) {
    try {
      const [result] = await pool.query(
        `
        UPDATE users
        SET last_logout = CURRENT_TIMESTAMP, is_online = FALSE
        WHERE id = ?
        `,
        [userId],
      );

      return result;
    } catch (error) {
      console.error("Error logging out user:", error);
      throw error;
    }
  }
}
