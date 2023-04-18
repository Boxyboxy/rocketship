const express = require("express");
const authMiddleware = require("../middleware/auth");
const usersController = require("../controllers/usersController");

const usersRouter = express.Router();

usersRouter.get("/", usersController.getAllUsers);
usersRouter.get("/:id", usersController.getUserById);
usersRouter.patch("/:id", authMiddleware, usersController.updateUserById);
usersRouter.post("", usersController.createUser);
usersRouter.delete("/:id", usersController.deleteUser);
module.exports = usersRouter;
