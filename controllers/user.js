import { validateUser } from "../schemas/user.js";

export default class UserController {
  constructor({ userModel }) {
    this.userModel = userModel;
  }

  create = async (req, res) => {
    const { userName, name, email, avatar } = req.body;
    const id = req.user;

    const validatedUser = validateUser({ id, userName, name, email, avatar });

    if (!validatedUser.success) {
      return res.status(400).json({ error: "Invalid user data" });
    }

    try {
      await this.userModel.create(validatedUser.data);

      return res.status(200).json({
        ok: true,
      });
    } catch (error) {
      console.error("Error creating user:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };

  findById = async (req, res) => {
    const { userId } = req.params;

    try {
      const user = await this.userModel.findById(userId);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.status(200).json({ message: "User found", user });
    } catch (error) {
      console.error("Error fetching user:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };

  findByIds = async (req, res) => {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: "ids must be a non-empty array" });
    }

    if (ids.length > 50) {
      return res.status(400).json({ error: "Too many ids (max 50)" });
    }

    try {
      const users = await this.userModel.findByIds(ids);
      return res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };

  findByUserName = async (req, res) => {
    const { q } = req.query;
    try {
      const users = await this.userModel.findByUserName(q);
      return res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };

  logout = async (req, res) => {
    const { id } = req.user;

    try {
      await this.userModel.logout(id);
      return res.json({ message: "User logged out successfully" });
    } catch (error) {
      console.error("Error logging out user:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };
}
