import { Router } from "express";
import UserController from "../controllers/user.js";

export const createUsersRoute = ({ userModel }) => {
  const router = Router();
  const userController = new UserController({ userModel });

  router.get("/search", userController.findByUserName);
  router.post("/batch", userController.findByIds);
  router.post("/logout", userController.logout);
  router.put("/", userController.create);
  router.get("/:userId", userController.findById);

  router.use((req, res) => {
    res.status(404).json({ error: "Not found" });
  });

  return router;
};
